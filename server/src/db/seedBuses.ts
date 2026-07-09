import 'dotenv/config'
import prisma from './client.js'
// Reuse the existing front-end mock data as the initial live inventory.
// Keyed as "FROM-TO", each value an array of bus objects.
import { busData } from '../../../src/data/busData.js'

/**
 * One-time seed of BusRecord from the bundled mock data. Idempotent:
 * clears existing records first so re-running yields a clean set.
 *
 *   npm run db:seed:buses
 */
async function main() {
  const rows: Array<{
    fromCode: string
    toCode: string
    operator: string
    busType: string
    departure: string
    arrival: string
    duration: string
    fare: number
    seats: number
    active: boolean
  }> = []

  for (const [route, buses] of Object.entries(busData as Record<string, any[]>)) {
    const [fromCode, toCode] = route.split('-')
    if (!fromCode || !toCode) continue
    for (const b of buses) {
      rows.push({
        fromCode,
        toCode,
        operator: String(b.operator),
        busType: String(b.type),
        departure: String(b.departure),
        arrival: String(b.arrival),
        duration: String(b.duration),
        fare: Number(b.fare) || 0,
        seats: Number(b.seats) || 0,
        active: true,
      })
    }
  }

  await prisma.busRecord.deleteMany({})
  await prisma.busRecord.createMany({ data: rows })

  console.log(`✅ Seeded ${rows.length} bus records across ${Object.keys(busData).length} routes.`)
  await prisma.$disconnect()
  process.exit(0)
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})
