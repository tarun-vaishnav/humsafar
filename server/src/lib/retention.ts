import type { FastifyBaseLogger } from 'fastify'
import prisma from '../db/client.js'

/**
 * Data-retention job — permanently deletes inquiries (and their cascaded
 * status history + activity logs) older than the retention window.
 *
 * Requirement: inquiry records older than 2 months must be removed. Cascade
 * deletes on StatusHistory/ActivityLog (see schema `onDelete: Cascade`) clean
 * up related rows automatically.
 */

const RETENTION_DAYS = 60 // ~2 months

export async function purgeOldInquiries(log?: FastifyBaseLogger): Promise<number> {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const { count } = await prisma.inquiry.deleteMany({
    where: { createdAt: { lt: cutoff } },
  })
  if (count > 0) log?.info(`[retention] purged ${count} inquiries older than ${RETENTION_DAYS} days`)
  return count
}

/**
 * Starts a recurring purge: once shortly after boot, then every `intervalHours`.
 * Returns a stop() to clear the timers on shutdown.
 */
export function startRetentionJob(log?: FastifyBaseLogger, intervalHours = 24): () => void {
  // Run shortly after boot so startup isn't blocked.
  const kickoff = setTimeout(() => {
    purgeOldInquiries(log).catch((e) => log?.error({ err: e }, '[retention] purge failed'))
  }, 10_000)

  const timer = setInterval(() => {
    purgeOldInquiries(log).catch((e) => log?.error({ err: e }, '[retention] purge failed'))
  }, intervalHours * 60 * 60 * 1000)

  // Don't keep the event loop alive solely for these timers.
  timer.unref?.()
  kickoff.unref?.()

  return () => {
    clearTimeout(kickoff)
    clearInterval(timer)
  }
}
