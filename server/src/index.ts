import Fastify, { type FastifyError } from 'fastify'

import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import cookie from '@fastify/cookie'
import { inquiryRoutes, trackingRoutes } from './routes/inquiries.js'

import { adminRoutes } from './routes/admin.js'
import prisma from './db/client.js'
import { env, isProduction, allowedOrigins } from './lib/env.js'
import { startRetentionJob } from './lib/retention.js'


/**
 * HumSafar API — hardened Fastify server.
 *
 * Security features:
 *  • Helmet — secure headers incl. HSTS, X-Content-Type-Options, frameguard,
 *    and a strict Content-Security-Policy in production.
 *  • CORS — allow-list only; no wildcard in production.
 *  • Rate limiting — global + a strict per-route cap on inquiry submissions.
 *  • Body size limit — rejects oversized payloads (DoS mitigation).
 *  • HTTPS enforcement — redirects/blocks plaintext behind a proxy in prod.
 *  • Structured logging with redaction of sensitive headers.
 *  • Generic error handler — never leaks stack traces.
 */

async function main() {
  const app = Fastify({
    bodyLimit: env.MAX_BODY_BYTES,
    trustProxy: true, // behind Render/railway/nginx — get real client IP
    logger: {
      level: isProduction ? 'info' : 'debug',
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      transport: isProduction
        ? undefined
        : { target: 'pino-pretty', options: { colorize: true } },
    },
  })

  // ─── Secure headers (Helmet) ────────────────────────────────────────
  await app.register(helmet, {
    hsts: isProduction ? { maxAge: 15552000, includeSubDomains: true, preload: true } : false,
    crossOriginResourcePolicy: { policy: 'same-site' },
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            baseUri: ["'self'"],
            frameAncestors: ["'none'"],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", 'data:'],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", 'https://challenges.cloudflare.com'],
            upgradeInsecureRequests: [],
          },
        }
      : false,
  })

  // ─── HTTPS enforcement (prod, behind proxy) ─────────────────────────
  if (isProduction) {
    app.addHook('onRequest', async (req, reply) => {
      const proto = req.headers['x-forwarded-proto']
      if (proto && proto !== 'https') {
        return reply.code(426).send({ success: false, error: 'https_required' })
      }
    })
  }

  // ─── Cookies (signed session for admin) ─────────────────────────────
  await app.register(cookie, { secret: env.JWT_SECRET })

  // ─── CORS (allow-list) ──────────────────────────────────────────────
  await app.register(cors, {
    origin: isProduction ? allowedOrigins : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })

  // ─── Rate limiting ──────────────────────────────────────────────────
  // Global ceiling per IP.
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    ban: 3, // after repeatedly exceeding, temporarily ban
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: () => ({
      success: false,
      error: 'rate_limited',
      message: 'Too many requests. Please slow down and try again shortly.',
    }),
  })

  // ─── Health check ───────────────────────────────────────────────────
  app.get('/api/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: isProduction ? 'production' : 'development',
  }))

  // ─── Routes ─────────────────────────────────────────────────────────
  // Strict per-route limit for inquiry submissions: 5 per 15 min per IP.
  await app.register(async (scoped) => {
    await scoped.register(rateLimit, {
      max: 5,
      timeWindow: '15 minutes',
      keyGenerator: (req) => req.ip,
      errorResponseBuilder: () => ({
        success: false,
        error: 'rate_limited',
        message: 'You have sent several inquiries recently. Please try again in a little while.',
      }),
    })
    await scoped.register(inquiryRoutes)
  })

  // Public tracking lookup: a more forgiving cap (20 per 5 min per IP) so a
  // user who just submitted can immediately track without hitting the strict
  // submission limiter.
  await app.register(async (scoped) => {
    await scoped.register(rateLimit, {
      max: 20,
      timeWindow: '5 minutes',
      keyGenerator: (req) => req.ip,
      errorResponseBuilder: () => ({
        success: false,
        error: 'rate_limited',
        message: 'Too many tracking requests. Please try again in a little while.',
      }),
    })
    await scoped.register(trackingRoutes)
  })

  // ─── Admin API (obscure prefix + real auth) ─────────────────────────

  // Mounted at /api/<ADMIN_PATH_SECRET>. Login is rate-limited to slow
  // brute-force; everything else requires a valid session cookie.
  await app.register(
    async (scoped) => {
      // Generous ceiling for an *authenticated* dashboard session — a single
      // admin easily fires many reads (list, detail, analytics, trains) while
      // working. The strict brute-force cap is applied per-route on /login only
      // (see adminRoutes), so normal use never trips this global limit.
      await scoped.register(rateLimit, {
        max: 300,
        timeWindow: '5 minutes',
        keyGenerator: (req) => req.ip,
        errorResponseBuilder: () => ({
          success: false,
          error: 'rate_limited',
          message: 'Too many requests. Please slow down and try again shortly.',
        }),
      })
      await scoped.register(adminRoutes)
    },
    { prefix: `/api/${env.ADMIN_PATH_SECRET}` },
  )


  // ─── Error handler (generic, no leaks) ──────────────────────────────
  app.setErrorHandler((error: FastifyError, req, reply) => {

    req.log.error(error)
    const statusCode = error.statusCode && error.statusCode < 500 ? error.statusCode : 500
    reply.status(statusCode).send({
      success: false,
      error: statusCode === 500 ? 'server_error' : 'request_error',
      message: statusCode === 500 ? 'Internal server error' : error.message,
    })
  })

  app.setNotFoundHandler((_req, reply) => {
    reply.status(404).send({ success: false, error: 'not_found' })
  })

  // ─── Data retention: purge inquiries older than 2 months ────────────
  const stopRetention = startRetentionJob(app.log)

  // ─── Graceful shutdown ──────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received, shutting down...`)
    stopRetention()
    await app.close()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  // ─── Start ──────────────────────────────────────────────────────────
  try {
    await app.listen({ port: env.PORT, host: env.HOST })
    app.log.info(`🚀 HumSafar API running on ${env.HOST}:${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
