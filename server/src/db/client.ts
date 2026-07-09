import { PrismaClient } from '@prisma/client'
import { isProduction } from '../lib/env.js'

/**
 * Single shared Prisma client.
 *
 * SQL-injection safety: every query goes through Prisma's parameterized query
 * builder — we never interpolate user input into raw SQL strings.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProduction ? ['error'] : ['error', 'warn'],
  })

if (!isProduction) globalForPrisma.prisma = prisma

export default prisma
