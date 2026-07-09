import 'dotenv/config'
import prisma from './client.js'
// Reuse the existing front-end mock data as the initial live inventory.
// Keyed as "FROM-TO", each value an array of train objects.
import { trainData } from '../../../src/data/trainData.js'

/**
 * One-time seed of TrainRecord from the bundled mock data. Idempotent:
 * clears existing records first so re-running yields a clean set.
 *
 *   npm run db:seed:trains
 */
async function main() {
  const rows: Array<{
    fromCode: string
    toCode: string
    name: string
    number: string
    departure: string
    arrival: string
    duration: string
    classes: { type: string; fare: number; availability: string }[]
    active: boolean
  }> = []

  for (const [route, trains] of Object.entries(trainData as Record<string, any[]>)) {
    const [fromCode, toCode] = route.split('-')
    if (!fromCode || !toCode) continue
    for (const t of trains) {
      rows.push({
        fromCode,
        toCode,
        name: String(t.name),
        number: String(t.number),
        departure: String(t.departure),
        arrival: String(t.arrival),
        duration: String(t.duration),
        classes: (t.classes ?? []).map((c: any) => ({
          type: String(c.type),
          fare: Number(c.fare) || 0,
          availability: String(c.availability ?? 'Available'),
        })),
        active: true,
      })
    }
  }

  await prisma.trainRecord.deleteMany({})
  await prisma.trainRecord.createMany({ data: rows })

  console.log(`✅ Seeded ${rows.length} train records across ${Object.keys(trainData).length} routes.`)
  await prisma.$disconnect()
  process.exit(0)
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})
