import type { FastifyInstance } from 'fastify'
import prisma from '../db/client.js'
import {
  loginSchema,
  updateInquirySchema,
  changePasswordSchema,
  trainRecordSchema,
  trainRecordUpdateSchema,
} from '../lib/validation.js'
import { sendStatusUpdate } from '../lib/email.js'

import {
  verifyPassword,
  hashPassword,
  signAdminToken,
  setAuthCookie,
  clearAuthCookie,
  requireAdmin,
} from '../lib/auth.js'


/**
 * Admin API. Mounted under an obscure, env-defined prefix by index.ts, e.g.
 *   /api/<ADMIN_PATH_SECRET>/...
 *
 * Every route except `login` is protected by the `requireAdmin` preHandler,
 * which returns a generic 404 (not 401) to avoid confirming the surface exists.
 */
export async function adminRoutes(app: FastifyInstance) {
  // ─── Login ────────────────────────────────────────────────────────────
  app.post('/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: 'invalid_credentials' })
    }
    const { email, password } = parsed.data

    const admin = await prisma.adminUser.findUnique({ where: { email } })
    // Always run a comparison to reduce timing side-channels.
    const ok = admin ? await verifyPassword(password, admin.passwordHash) : false
    if (!admin || !ok) {
      request.log.warn({ email, ip: request.ip }, 'Failed admin login')
      return reply.status(401).send({ success: false, error: 'invalid_credentials', message: 'Invalid email or password.' })
    }

    const token = signAdminToken({ sub: admin.id, email: admin.email, name: admin.name })
    setAuthCookie(reply, token)

    await prisma.activityLog.create({
      data: { adminId: admin.id, action: 'LOGIN', details: `IP ${request.ip}` },
    })

    return reply.send({ success: true, admin: { name: admin.name, email: admin.email } })
  })

  // ─── Session check ────────────────────────────────────────────────────
  app.get('/me', { preHandler: requireAdmin }, async (request) => ({
    success: true,
    admin: { name: request.admin!.name, email: request.admin!.email },
  }))

  // ─── Logout ───────────────────────────────────────────────────────────
  app.post('/logout', { preHandler: requireAdmin }, async (_request, reply) => {
    clearAuthCookie(reply)
    return reply.send({ success: true })
  })

  // ─── List inquiries (filter + paginate) ───────────────────────────────
  app.get('/inquiries', { preHandler: requireAdmin }, async (request) => {
    const q = request.query as Record<string, string | undefined>
    const page = Math.max(1, Number.parseInt(q.page ?? '1', 10) || 1)
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(q.pageSize ?? '20', 10) || 20))

    const where: Record<string, unknown> = { deleted: false }
    if (q.status && q.status !== 'ALL') where.status = q.status
    if (q.priority && q.priority !== 'ALL') where.priority = q.priority
    if (q.search) {
      const s = q.search.slice(0, 120)
      where.OR = [
        { fullName: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s } },
        { reference: { contains: s.toUpperCase() } },
      ]
    }

    const [total, items] = await Promise.all([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return { success: true, total, page, pageSize, items }
  })

  // ─── Single inquiry (full detail incl. audit metadata) ────────────────
  app.get('/inquiries/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const inquiry = await prisma.inquiry.findFirst({
      where: { id, deleted: false },
      include: {
        statusHistory: { orderBy: { createdAt: 'asc' } },
        activityLog: { orderBy: { createdAt: 'desc' }, include: { admin: { select: { name: true } } } },
      },
    })
    if (!inquiry) return reply.status(404).send({ success: false, error: 'not_found' })
    return { success: true, inquiry }
  })

  // ─── Update inquiry ───────────────────────────────────────────────────
  app.patch('/inquiries/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = updateInquirySchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return reply.status(400).send({ success: false, error: 'validation_failed', message: first?.message })
    }
    const { status, priority, notes, note } = parsed.data

    const existing = await prisma.inquiry.findFirst({ where: { id, deleted: false } })
    if (!existing) return reply.status(404).send({ success: false, error: 'not_found' })

    const data: Record<string, unknown> = {}
    if (status) data.status = status
    if (priority) data.priority = priority
    if (notes !== undefined) data.notes = notes

    // Record status change in history.
    if (status && status !== existing.status) {
      data.statusHistory = { create: { status, note: note ?? `Status changed to ${status}` } }
    }

    const updated = await prisma.inquiry.update({ where: { id }, data })

    await prisma.activityLog.create({
      data: {
        adminId: request.admin!.sub,
        inquiryId: id,
        action: 'UPDATE',
        details: JSON.stringify({ status, priority, notesChanged: notes !== undefined }),
      },
    })

    // Notify the customer on a status change (cancellation reason / booking
    // confirmation via WhatsApp). Fire-and-forget — never block the response.
    if (status && status !== existing.status) {
      sendStatusUpdate({ ...updated, status } as never, note ?? notes ?? undefined).catch((err) =>
        request.log.error(err, 'Status-update email failed'),
      )

    }

    return { success: true, inquiry: updated }

  })

  // ─── Soft delete ──────────────────────────────────────────────────────
  app.delete('/inquiries/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const existing = await prisma.inquiry.findFirst({ where: { id, deleted: false } })
    if (!existing) return reply.status(404).send({ success: false, error: 'not_found' })

    await prisma.inquiry.update({ where: { id }, data: { deleted: true } })
    await prisma.activityLog.create({
      data: { adminId: request.admin!.sub, inquiryId: id, action: 'DELETE' },
    })
    return { success: true }
  })

  // ─── Analytics dashboard ──────────────────────────────────────────────
  app.get('/analytics', { preHandler: requireAdmin }, async () => {
    const now = new Date()
    const dayMs = 24 * 60 * 60 * 1000
    const last30 = new Date(now.getTime() - 30 * dayMs)
    const last7 = new Date(now.getTime() - 7 * dayMs)

    const baseWhere = { deleted: false }

    const [total, last7Count, byStatus, byPriority, byType, recent, topRoutes] = await Promise.all([
      prisma.inquiry.count({ where: baseWhere }),
      prisma.inquiry.count({ where: { ...baseWhere, createdAt: { gte: last7 } } }),
      prisma.inquiry.groupBy({ by: ['status'], where: baseWhere, _count: true }),
      prisma.inquiry.groupBy({ by: ['priority'], where: baseWhere, _count: true }),
      prisma.inquiry.groupBy({ by: ['journeyType'], where: baseWhere, _count: true }),
      prisma.inquiry.findMany({
        where: { ...baseWhere, createdAt: { gte: last30 } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.inquiry.groupBy({
        by: ['fromCity', 'toCity'],
        where: { ...baseWhere, fromCity: { not: null }, toCity: { not: null } },
        _count: true,
        orderBy: { _count: { fromCity: 'desc' } },
        take: 8,
      }),
    ])

    // Build a 30-day daily timeseries.
    const daily: { date: string; count: number }[] = []
    const counts = new Map<string, number>()
    recent.forEach((r) => {
      const key = r.createdAt.toISOString().slice(0, 10)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    })
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(now.getTime() - i * dayMs).toISOString().slice(0, 10)
      daily.push({ date: d, count: counts.get(d) ?? 0 })
    }

    const completed = byStatus.find((s) => s.status === 'COMPLETED')?._count ?? 0
    const conversionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      success: true,
      analytics: {
        total,
        last7Count,
        conversionRate,
        byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
        byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count })),
        byType: byType.map((t) => ({ type: t.journeyType ?? 'unspecified', count: t._count })),
        topRoutes: topRoutes.map((r) => ({ from: r.fromCity, to: r.toCity, count: r._count })),
        daily,
      },
    }
  })

  // ─── Change own password ──────────────────────────────────────────────
  app.post('/account/password', { preHandler: requireAdmin }, async (request, reply) => {
    const parsed = changePasswordSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return reply.status(400).send({ success: false, error: 'validation_failed', message: first?.message })
    }
    const { currentPassword, newPassword } = parsed.data

    const admin = await prisma.adminUser.findUnique({ where: { id: request.admin!.sub } })
    if (!admin) return reply.status(404).send({ success: false, error: 'not_found' })

    const ok = await verifyPassword(currentPassword, admin.passwordHash)
    if (!ok) {
      request.log.warn({ adminId: admin.id, ip: request.ip }, 'Failed password change (bad current)')
      return reply.status(401).send({ success: false, error: 'invalid_credentials', message: 'Current password is incorrect.' })
    }

    const passwordHash = await hashPassword(newPassword)
    await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash } })
    await prisma.activityLog.create({
      data: { adminId: admin.id, action: 'PASSWORD_CHANGE', details: `IP ${request.ip}` },
    })

    // Force re-authentication with the new credentials.
    clearAuthCookie(reply)
    return reply.send({ success: true })
  })

  // ─── Train records: list ──────────────────────────────────────────────
  app.get('/trains', { preHandler: requireAdmin }, async (request) => {
    const q = request.query as Record<string, string | undefined>
    const where: Record<string, unknown> = {}
    if (q.from) where.fromCode = q.from.toUpperCase()
    if (q.to) where.toCode = q.to.toUpperCase()
    if (q.active === 'true') where.active = true
    if (q.active === 'false') where.active = false
    if (q.search) {
      const s = q.search.slice(0, 60)
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { number: { contains: s } },
      ]
    }

    const items = await prisma.trainRecord.findMany({
      where,
      orderBy: [{ fromCode: 'asc' }, { toCode: 'asc' }, { departure: 'asc' }],
      take: 500,
    })
    return { success: true, total: items.length, items }
  })

  // ─── Train records: create ────────────────────────────────────────────
  app.post('/trains', { preHandler: requireAdmin }, async (request, reply) => {
    const parsed = trainRecordSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return reply.status(400).send({ success: false, error: 'validation_failed', message: first?.message })
    }
    const { active, ...rest } = parsed.data
    const created = await prisma.trainRecord.create({
      data: { ...rest, active: active ?? true },
    })
    await prisma.activityLog.create({
      data: { adminId: request.admin!.sub, action: 'TRAIN_CREATE', details: `${created.number} ${created.fromCode}-${created.toCode}` },
    })
    return reply.status(201).send({ success: true, train: created })
  })

  // ─── Train records: update ────────────────────────────────────────────
  app.patch('/trains/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = trainRecordUpdateSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return reply.status(400).send({ success: false, error: 'validation_failed', message: first?.message })
    }
    const existing = await prisma.trainRecord.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ success: false, error: 'not_found' })

    const updated = await prisma.trainRecord.update({ where: { id }, data: parsed.data })
    await prisma.activityLog.create({
      data: { adminId: request.admin!.sub, action: 'TRAIN_UPDATE', details: `${updated.number}` },
    })
    return { success: true, train: updated }
  })

  // ─── Train records: delete (hard) ─────────────────────────────────────
  app.delete('/trains/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const existing = await prisma.trainRecord.findUnique({ where: { id } })
    if (!existing) return reply.status(404).send({ success: false, error: 'not_found' })

    await prisma.trainRecord.delete({ where: { id } })
    await prisma.activityLog.create({
      data: { adminId: request.admin!.sub, action: 'TRAIN_DELETE', details: `${existing.number} ${existing.fromCode}-${existing.toCode}` },
    })
    return { success: true }
  })
}


