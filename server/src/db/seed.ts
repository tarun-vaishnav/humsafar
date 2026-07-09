import 'dotenv/config'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import prisma from './client.js'
import { hashPassword } from '../lib/auth.js'

/**
 * Create (or reset) an admin user. Run:
 *   npm run db:seed
 *
 * Reads ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD / ADMIN_SEED_NAME from env,
 * or prompts interactively. Passwords are never stored in plaintext.
 */
async function main() {
  let email = process.env.ADMIN_SEED_EMAIL
  let password = process.env.ADMIN_SEED_PASSWORD
  let name = process.env.ADMIN_SEED_NAME

  if (!email || !password) {
    const rl = readline.createInterface({ input: stdin, output: stdout })
    email = email || (await rl.question('Admin email: ')).trim()
    name = name || (await rl.question('Admin name: ')).trim()
    password = password || (await rl.question('Admin password (min 8 chars): ')).trim()
    rl.close()
  }

  if (!email || !password || password.length < 8) {
    console.error('❌ Email and a password of at least 8 characters are required.')
    process.exit(1)
  }

  const passwordHash = await hashPassword(password)
  const admin = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, name: name || 'Admin' },
    create: { email: email.toLowerCase(), passwordHash, name: name || 'Admin' },
  })

  console.log(`✅ Admin ready: ${admin.email} (${admin.name})`)
  await prisma.$disconnect()
  process.exit(0)
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  process.exit(1)
})
