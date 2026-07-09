import 'dotenv/config'
import prisma from './client.js'

/**
 * Remove **test / demo data** while preserving everything the live site needs.
 *
 *   npm run db:clean
 *
 * Deletes:
 *   • Inquiry            — all test booking inquiries
 *   • StatusHistory      — cascades with Inquiry, but cleared explicitly too
 *   • ActivityLog        — admin/inquiry audit noise from testing
 *
 * Preserves:
 *   • AdminUser          — your login credentials
 *   • TrainRecord        — the live train inventory shown in search
 *
 * Safety: this is destructive. Set `CONFIRM_CLEAN=yes` in the environment (or
 * pass `--yes`) to actually run it — otherwise it aborts with a summary.
 */
async function main() {
  const confirmed =
    process.env.CONFIRM_CLEAN === 'yes' || process.argv.includes('--yes')

  const [inquiries, history, logs, admins, trains] = await Promise.all([
    prisma.inquiry.count(),
    prisma.statusHistory.count(),
    prisma.activityLog.count(),
    prisma.adminUser.count(),
    prisma.trainRecord.count(),
  ])

  console.log('Current data:')
  console.log(`  Inquiries ....... ${inquiries}   (will be DELETED)`)
  console.log(`  StatusHistory ... ${history}   (will be DELETED)`)
  console.log(`  ActivityLog ..... ${logs}   (will be DELETED)`)
  console.log(`  AdminUsers ...... ${admins}   (preserved)`)
  console.log(`  TrainRecords .... ${trains}   (preserved)`)

  if (!confirmed) {
    console.log('\n⚠️  Dry run. No data was deleted.')
    console.log('   Re-run with  --yes  (or CONFIRM_CLEAN=yes) to proceed.')
    await prisma.$disconnect()
    process.exit(0)
  }

  // Order matters: children before parents (also covered by cascade, but explicit
  // is clearer and independent of FK config).
  await prisma.activityLog.deleteMany({})
  await prisma.statusHistory.deleteMany({})
  const del = await prisma.inquiry.deleteMany({})

  console.log(`\n✅ Cleaned. Removed ${del.count} inquiries and all related history/logs.`)
  console.log(`   Preserved ${admins} admin user(s) and ${trains} train record(s).`)
  await prisma.$disconnect()
  process.exit(0)
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})
