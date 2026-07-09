import type { FastifyInstance } from 'fastify'
import prisma from '../db/client.js'
import { inquirySchema, trackSchema } from '../lib/validation.js'
import { verifyTurnstile } from '../lib/turnstile.js'
import { sendAdminNotification, sendCustomerConfirmation } from '../lib/email.js'
import { generateReference, lookupGeo } from '../lib/tracking.js'

/**
 * POST /api/inquiries — public inquiry submission.
 *
 * Security pipeline (in order):
 *   1. Per-route strict rate limit (configured in index.ts).
 *   2. Honeypot check — bots that fill the hidden `company` field are dropped.
 *   3. Strict Zod validation + sanitization (`.strict()` rejects extra keys).
 *   4. Cloudflare Turnstile verification (bot / captcha).
 *   5. Parameterized DB insert via Prisma (SQL-injection safe).
 *   6. Fire-and-forget transactional emails (never block/leak on failure).
 *
 * Responses are intentionally generic — we don't leak validation internals or
 * stack traces to the client.
 */
export async function inquiryRoutes(app: FastifyInstance) {
  app.post('/api/inquiries', async (request, reply) => {
    // 2. Honeypot — silently accept-looking, but do nothing.
    const rawBody = (request.body ?? {}) as Record<string, unknown>
    if (typeof rawBody.company === 'string' && rawBody.company.trim() !== '') {
      // Pretend success so bots don't learn they were caught.
      return reply.status(202).send({ success: true, reference: 'received' })
    }

    // 3. Validate + sanitize.
    const parsed = inquirySchema.safeParse(rawBody)
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      return reply.status(400).send({
        success: false,
        error: 'validation_failed',
        message: first ? `${first.path.join('.')}: ${first.message}` : 'Invalid input',
      })
    }
    const data = parsed.data

    // 4. Turnstile.
    const captcha = await verifyTurnstile(
      data.turnstileToken,
      request.ip,
    )
    if (!captcha.ok) {
      request.log.warn({ reason: captcha.reason, ip: request.ip }, 'Turnstile failed')
      return reply.status(403).send({
        success: false,
        error: 'captcha_failed',
        message: 'Verification failed. Please try again.',
      })
    }

    // 5. Persist (Prisma = parameterized, injection-safe). Strip non-model fields.
    const { turnstileToken: _t, company: _c, ...persist } = data

    // Abuse/audit metadata (admin-only). Coarse geo is best-effort.
    const ipAddress = request.ip
    const userAgent = request.headers['user-agent']?.slice(0, 512)
    const geo = await lookupGeo(ipAddress)
    const reference = generateReference()

    let created
    try {
      created = await prisma.inquiry.create({
        data: {
          ...persist,
          reference,
          ipAddress,
          userAgent,
          country: geo.country,
          city: geo.city,
          statusHistory: { create: { status: 'NEW', note: 'Inquiry submitted via website' } },
        },
      })
    } catch (err) {
      request.log.error(err, 'Failed to persist inquiry')
      return reply.status(500).send({
        success: false,
        error: 'server_error',
        message: 'Something went wrong. Please try again shortly.',
      })
    }

    // 6. Emails — don't block the response; log failures only.
    const emailPayload = { ...data, id: created.id, reference, createdAt: created.createdAt }
    Promise.allSettled([
      sendAdminNotification(emailPayload),
      sendCustomerConfirmation(emailPayload),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === 'rejected') request.log.error(r.reason, 'Email send failed')
      })
    })

    return reply.status(201).send({
      success: true,
      reference,
      message: 'Your inquiry has been received. Check your inbox for a confirmation.',
    })
  })
}

/**
 * Public inquiry tracking — registered separately from submission so it can
 * carry its own, more forgiving rate limit. A user who just submitted an
 * inquiry should be able to look it up immediately without tripping the
 * strict anti-spam cap on the create endpoint.
 *
 * POST /api/inquiries/track — reference + email (two-factor lookup).
 */
export async function trackingRoutes(app: FastifyInstance) {
  app.post('/api/inquiries/track', async (request, reply) => {

    const parsed = trackSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: 'validation_failed', message: 'Invalid reference or email' })
    }
    const { reference, email } = parsed.data

    const inquiry = await prisma.inquiry.findFirst({
      where: { reference, email, deleted: false },
      select: {
        reference: true,
        fullName: true,
        status: true,
        createdAt: true,
        journeyName: true,
        journeyType: true,
        fromCity: true,
        toCity: true,
        travelDate: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
          select: { status: true, note: true, createdAt: true },
        },
      },
    })

    // Generic response either way — don't reveal which factor was wrong.
    if (!inquiry) {
      return reply.status(404).send({
        success: false,
        error: 'not_found',
        message: 'No inquiry found for that reference and email.',
      })
    }

    return reply.send({ success: true, inquiry })
  })
}
