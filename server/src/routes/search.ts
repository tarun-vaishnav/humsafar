import type { FastifyInstance } from 'fastify'
import prisma from '../db/client.js'
import { searchQuerySchema } from '../lib/validation.js'

/**
 * Public journey search. Reads the admin-managed "live inventory"
 * (TrainRecord + BusRecord) straight from the database so anything the
 * operator adds/edits in the admin panel is instantly reflected on the site.
 *
 * Routes are keyed by city code (e.g. DEL → JAI). We also match the reverse
 * direction so a single stored record serves both ways.
 */

// Parse a human duration like "4h 30m" / "8h" / "45m" into minutes so the
// front-end can sort by journey length (mirrors the old static `durationMins`).
function durationToMins(duration: string): number {
  const h = /(\d+)\s*h/i.exec(duration)?.[1]
  const m = /(\d+)\s*m/i.exec(duration)?.[1]
  return (Number(h) || 0) * 60 + (Number(m) || 0)
}

export async function searchRoutes(app: FastifyInstance) {
  // ─── Search a specific route ──────────────────────────────────────────
  app.get('/search', async (request, reply) => {
    const parsed = searchQuerySchema.safeParse(request.query ?? {})
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: 'invalid_query', message: 'Provide valid from and to codes.' })
    }
    const { from, to } = parsed.data

    // Match either direction (from→to or to→from).
    const routeOr = [
      { fromCode: from, toCode: to },
      { fromCode: to, toCode: from },
    ]

    const [trainRows, busRows] = await Promise.all([
      prisma.trainRecord.findMany({
        where: { active: true, OR: routeOr },
        orderBy: { departure: 'asc' },
      }),
      prisma.busRecord.findMany({
        where: { active: true, OR: routeOr },
        orderBy: { departure: 'asc' },
      }),
    ])

    // Shape to match what the front-end expects (same as the old mock data).
    const trains = trainRows.map((t) => ({
      id: t.id,
      name: t.name,
      number: t.number,
      departure: t.departure,
      arrival: t.arrival,
      duration: t.duration,
      durationMins: durationToMins(t.duration),
      classes: Array.isArray(t.classes) ? t.classes : [],
    }))

    const buses = busRows.map((b) => ({
      id: b.id,
      operator: b.operator,
      type: b.busType,
      departure: b.departure,
      arrival: b.arrival,
      duration: b.duration,
      durationMins: durationToMins(b.duration),
      fare: b.fare,
      seats: b.seats,
    }))

    return { success: true, trains, buses }
  })

  // ─── Available routes (for empty-state suggestions) ───────────────────
  app.get('/search/routes', async () => {
    const [trainRoutes, busRoutes] = await Promise.all([
      prisma.trainRecord.findMany({
        where: { active: true },
        select: { fromCode: true, toCode: true },
        distinct: ['fromCode', 'toCode'],
      }),
      prisma.busRecord.findMany({
        where: { active: true },
        select: { fromCode: true, toCode: true },
        distinct: ['fromCode', 'toCode'],
      }),
    ])

    // De-duplicate across both transport types.
    const seen = new Set<string>()
    const routes: { from: string; to: string }[] = []
    for (const r of [...trainRoutes, ...busRoutes]) {
      const key = `${r.fromCode}-${r.toCode}`
      if (seen.has(key)) continue
      seen.add(key)
      routes.push({ from: r.fromCode, to: r.toCode })
    }

    return { success: true, routes }
  })
}

export default searchRoutes
