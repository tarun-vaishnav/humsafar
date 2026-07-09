import 'dotenv/config'
import { z } from 'zod'


/**
 * Validated, type-safe environment configuration.
 *
 * The server refuses to boot with a missing/invalid critical secret in
 * production — fail fast instead of running insecurely.
 */

const isProd = process.env.NODE_ENV === 'production'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  HOST: z.string().default('0.0.0.0'),

  // Database (Neon / Supabase Postgres)
  DATABASE_URL: z.string().url().startsWith('postgres'),

  // Allowed browser origins (comma separated)
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),

  // Email (Resend)
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().default('HumSafar <onboarding@resend.dev>'),
  ADMIN_EMAIL: z.string().email(),

  // Cloudflare Turnstile (bot protection)
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  // When true, the server hard-requires a valid Turnstile token.
  TURNSTILE_ENFORCE: z
    .enum(['true', 'false'])
    .default(isProd ? 'true' : 'false')
    .transform((v) => v === 'true'),

  // Admin auth
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars').default('dev-insecure-secret-change-me-please'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  // Obscure admin base path (defense-in-depth on top of real auth).
  ADMIN_PATH_SECRET: z.string().min(6).default('panel'),
  // Optional coarse geo lookup for abuse tracking (free, no key: ipapi.co)
  ENABLE_GEO_LOOKUP: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),

  // Abuse controls
  MAX_BODY_BYTES: z.coerce.number().int().positive().default(16 * 1024), // 16 KB
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment configuration:\n', JSON.stringify(parsed.error.format(), null, 2))

  process.exit(1)
}

export const env = parsed.data

/**
 * Production hard guards — refuse to boot with insecure defaults.
 *
 * These catch the classic "shipped to prod with the dev secret" mistake and
 * fail fast instead of running with a guessable JWT signing key or a public
 * admin path.
 */
if (env.NODE_ENV === 'production') {
  const problems: string[] = []

  const insecureSecrets = [
    'dev-insecure-secret-change-me-please',
    'dev-change-me-to-a-long-random-string-please-32chars',
  ]
  if (insecureSecrets.includes(env.JWT_SECRET) || env.JWT_SECRET.length < 32) {
    problems.push('JWT_SECRET must be a unique random string of at least 32 characters in production.')
  }
  if (['panel', 'panel-9f3c2a'].includes(env.ADMIN_PATH_SECRET)) {
    problems.push('ADMIN_PATH_SECRET must be changed from its default/example value in production.')
  }
  if (env.ALLOWED_ORIGINS.split(',').some((o) => o.includes('localhost'))) {
    problems.push('ALLOWED_ORIGINS must not contain localhost in production.')
  }
  if (!env.RESEND_API_KEY) {
    // Not fatal, but loudly warn — inquiries will store but no email is sent.
    // eslint-disable-next-line no-console
    console.warn('⚠️  RESEND_API_KEY is not set — confirmation/notification emails will be skipped.')
  }

  if (problems.length > 0) {
    // eslint-disable-next-line no-console
    console.error('❌ Insecure production configuration:\n  - ' + problems.join('\n  - '))
    process.exit(1)
  }
}

export const isProduction = env.NODE_ENV === 'production'

export const allowedOrigins = env.ALLOWED_ORIGINS.split(',')
  .map((o) => o.trim())
  .filter(Boolean)
