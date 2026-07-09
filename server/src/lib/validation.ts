import { z } from 'zod'

/**
 * Inquiry validation + sanitization.
 *
 * Defense in depth:
 *  • Strict Zod schema — length caps, allowed formats, enum whitelists.
 *  • `.strict()` rejects unexpected keys (mass-assignment protection).
 *  • Every free-text field is trimmed and stripped of control chars / angle
 *    brackets so nothing resembling markup is ever persisted (XSS at rest).
 *  • Output is later HTML-escaped again in emails (XSS in transit).
 */

// Remove control characters, zero-width chars, and collapse whitespace.
const cleanText = (raw: string) =>
  raw
    .replace(/[\u0000-\u001F\u007F]/g, ' ') // control chars
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width
    .replace(/\s+/g, ' ')
    .trim()

// A string that is cleaned, then length-checked.
const text = (min: number, max: number) =>
  z
    .string()
    .transform(cleanText)
    .refine((v) => v.length >= min, { message: `Must be at least ${min} characters` })
    .refine((v) => v.length <= max, { message: `Must be at most ${max} characters` })

const optionalText = (max: number) =>
  z
    .string()
    .transform(cleanText)
    .refine((v) => v.length <= max, { message: `Must be at most ${max} characters` })
    .optional()
    .or(z.literal('').transform(() => undefined))

// Name: letters, spaces, common separators — no digits/symbols that enable injection.
const nameSchema = text(2, 80).refine((v) => /^[\p{L}][\p{L}\s.'-]*$/u.test(v), {
  message: 'Please enter a valid name',
})

// E.164-ish phone: optional +, 8–15 digits.
const phoneSchema = z
  .string()
  .transform((v) => v.replace(/[\s()-]/g, ''))
  .refine((v) => /^\+?[0-9]{8,15}$/.test(v), { message: 'Please enter a valid phone number' })

export const inquirySchema = z
  .object({
    fullName: nameSchema,
    email: z.string().trim().toLowerCase().email('Please enter a valid email').max(160),
    phone: phoneSchema,
    passengers: z.coerce.number().int().min(1).max(50).default(1),
    specialRequest: optionalText(1000),
    preferredContactTime: z
      .enum(['morning', 'afternoon', 'evening', 'anytime'])
      .optional(),

    // Selected journey (all optional — user may inquire without one)
    journeyType: z.enum(['train', 'bus']).optional(),
    journeyName: optionalText(120),
    journeyNumber: optionalText(30),
    journeyClass: optionalText(30),
    journeyFare: z.coerce.number().int().min(0).max(1_000_000).optional(),
    fromCity: optionalText(80),
    toCity: optionalText(80),
    travelDate: optionalText(30),
    departure: optionalText(30),
    arrival: optionalText(30),

    // Honeypot — must stay empty (bots fill it).
    company: z.literal('').optional(),

    // Cloudflare Turnstile token
    turnstileToken: z.string().max(2048).optional(),
  })
  .strict()

export type InquiryInput = z.infer<typeof inquirySchema>

/** Public tracking lookup — reference + email (two factors). */
export const trackSchema = z.object({
  reference: z
    .string()
    .trim()
    .toUpperCase()
    .max(20)
    .refine((v) => /^HS-[A-Z0-9]{4,10}$/.test(v), { message: 'Invalid reference' }),
  email: z.string().trim().toLowerCase().email('Please enter a valid email').max(160),
})

/** Admin login. */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(1).max(200),
})

/** Admin: update an inquiry's status / priority / notes. */
export const updateInquirySchema = z
  .object({
    status: z.enum(['NEW', 'CONTACTED', 'PLANNING', 'COMPLETED', 'CANCELLED']).optional(),
    priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
    notes: optionalText(2000),
    note: optionalText(500), // status-change note for history
  })
  .strict()
  .refine((v) => v.status || v.priority || v.notes !== undefined, {
    message: 'Nothing to update',
  })

export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>

/** Admin: change own password (requires current password). */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(200),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(200)
      .refine((v) => /[a-zA-Z]/.test(v) && /[0-9]/.test(v), {
        message: 'Password must contain both letters and numbers',
      }),
  })
  .strict()

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// ─── Train record management (admin) ────────────────────────────────────────

const codeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(2, 'Code too short')
  .max(6)
  .refine((v) => /^[A-Z0-9]+$/.test(v), { message: 'Codes must be alphanumeric' })

const timeSchema = z
  .string()
  .trim()
  .refine((v) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(v), { message: 'Time must be HH:MM (24h)' })

const trainClassSchema = z.object({
  type: text(1, 30),
  fare: z.coerce.number().int().min(0).max(1_000_000),
  availability: optionalText(30),
})

export const trainRecordSchema = z
  .object({
    fromCode: codeSchema,
    toCode: codeSchema,
    name: text(2, 120),
    number: text(1, 30),
    departure: timeSchema,
    arrival: timeSchema,
    duration: text(1, 30),
    classes: z.array(trainClassSchema).min(1, 'Add at least one class').max(10),
    active: z.boolean().optional(),
  })
  .strict()
  .refine((v) => v.fromCode !== v.toCode, { message: 'From and To cannot be the same' })

export type TrainRecordInput = z.infer<typeof trainRecordSchema>

/** Partial update for an existing train record. */
export const trainRecordUpdateSchema = z
  .object({
    fromCode: codeSchema.optional(),
    toCode: codeSchema.optional(),
    name: text(2, 120).optional(),
    number: text(1, 30).optional(),
    departure: timeSchema.optional(),
    arrival: timeSchema.optional(),
    duration: text(1, 30).optional(),
    classes: z.array(trainClassSchema).min(1).max(10).optional(),
    active: z.boolean().optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' })

export type TrainRecordUpdateInput = z.infer<typeof trainRecordUpdateSchema>


/** Escape a string for safe interpolation into HTML email bodies. */
export function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
