import type { FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env, isProduction } from './env.js'

/**
 * Admin authentication helpers.
 *
 * Security model (real defense, not just obscurity):
 *  • Passwords are bcrypt-hashed (cost 12) — never stored in plaintext.
 *  • Sessions are stateless JWTs delivered in an httpOnly, SameSite=strict,
 *    Secure (in prod) cookie — inaccessible to page JS, mitigating XSS token
 *    theft and CSRF (SameSite=strict).
 *  • The admin surface additionally lives behind an obscure, env-defined path
 *    prefix and is never linked or indexed — obscurity as a bonus layer.
 */

export const COOKIE_NAME = 'hs_admin'

export interface AdminTokenPayload {
  sub: string // admin id
  email: string
  name: string
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload
  } catch {
    return null
  }
}

/**
 * Set the session cookie on a reply.
 *
 * Cross-site note: the SPA (Vercel) and API (Render) live on different
 * registrable domains, so the browser treats admin API calls as *cross-site*.
 * A `SameSite=Strict` cookie is never attached to cross-site requests, which
 * would silently break every authenticated call. In production we therefore
 * use `SameSite=None; Secure` so the cookie travels with credentialed fetches.
 * CSRF is still mitigated: the cookie is httpOnly, CORS is locked to an
 * allow-list, and all state-changing routes use JSON/PATCH/DELETE (non-simple
 * requests) which force a CORS preflight that untrusted origins fail.
 * Locally (same-site over http) we keep the stricter `Lax`.
 */
const cookieOptions = () =>
  ({
    httpOnly: true,
    secure: isProduction, // required by browsers when SameSite=None
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
  }) as const

export function setAuthCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(COOKIE_NAME, token, {
    ...cookieOptions(),
    maxAge: 60 * 60 * 8, // 8h
  })
}

/** Clear the session cookie. Attributes must match those used when setting. */
export function clearAuthCookie(reply: FastifyReply): void {
  reply.clearCookie(COOKIE_NAME, cookieOptions())
}


/**
 * Fastify preHandler that rejects unauthenticated requests. On success it
 * attaches the decoded admin to `request.admin`.
 */
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const token = request.cookies?.[COOKIE_NAME]
  const payload = token ? verifyAdminToken(token) : null
  if (!payload) {
    // Generic 404 — don't confirm the admin API exists to unauthorized callers.
    reply.status(404).send({ success: false, error: 'not_found' })
    return
  }
  request.admin = payload
}

declare module 'fastify' {
  interface FastifyRequest {
    admin?: AdminTokenPayload
  }
}
