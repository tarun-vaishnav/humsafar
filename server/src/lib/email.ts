import { Resend } from 'resend'
import { env } from './env.js'
import { escapeHtml, type InquiryInput } from './validation.js'

/**
 * Transactional email via Resend.
 *
 * Email security:
 *  • All dynamic values are HTML-escaped (no HTML/script injection into inboxes).
 *  • The customer's address only ever appears in `reply_to` / body — never used
 *    to construct headers directly, preventing header-injection.
 *  • Uses a verified sender domain (SPF/DKIM/DMARC handled by Resend) so mail
 *    isn't spoofable and lands in the inbox.
 *  • Failures never block the API response to the user; they're logged.
 */

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

const BRAND = '#E8735A'
const INK = '#2A2722'

type Inquiry = InquiryInput & { id: string; reference?: string; createdAt?: Date }


function row(label: string, value?: string | number | null) {
  if (value === undefined || value === null || value === '') return ''
  return `<tr>
    <td style="padding:8px 0;color:#7A756B;font-size:13px;width:150px;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:${INK};font-size:14px;font-weight:600">${escapeHtml(value)}</td>
  </tr>`
}

function shell(title: string, inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#FAFAF8;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
        <div style="width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#E8735A,#C9A03A)"></div>
        <div style="font-size:20px;font-weight:700;color:${INK}">Hum<span style="color:${BRAND}">Safar</span></div>
      </div>
      <div style="background:#fff;border:1px solid rgba(42,39,34,0.08);border-radius:18px;padding:28px">
        <h1 style="margin:0 0 8px;font-size:20px;color:${INK}">${escapeHtml(title)}</h1>
        ${inner}
      </div>
      <p style="margin:20px 4px 0;color:#9A9488;font-size:12px;text-align:center">
        HumSafar · Rail &amp; Road · India<br/>This is an automated message — you can simply reply to it.
      </p>
    </div></body></html>`
}

function journeyBlock(i: Inquiry) {
  if (!i.journeyName && !i.fromCity && !i.toCity) return ''
  return `<table style="width:100%;border-collapse:collapse;margin-top:8px">
    ${row('Journey', i.journeyName)}
    ${row('Type', i.journeyType)}
    ${row('Number', i.journeyNumber)}
    ${row('Class', i.journeyClass)}
    ${row('Route', [i.fromCity, i.toCity].filter(Boolean).join(' → '))}
    ${row('Travel date', i.travelDate)}
    ${row('Departure', i.departure)}
    ${row('Arrival', i.arrival)}
    ${row('Indicative fare', i.journeyFare ? `₹${i.journeyFare}` : undefined)}
  </table>`
}

/** Notify the business owner of a new inquiry. */
export async function sendAdminNotification(i: Inquiry) {
  if (!resend) return { skipped: true }
  const inner = `
    <p style="margin:0 0 16px;color:#4A4740;font-size:14px">A new booking inquiry just arrived.</p>
    <table style="width:100%;border-collapse:collapse">
      ${row('Name', i.fullName)}
      ${row('Email', i.email)}
      ${row('Phone', i.phone)}
      ${row('Passengers', i.passengers)}
      ${row('Preferred time', i.preferredContactTime)}
      ${row('Special request', i.specialRequest)}
      ${row('Reference', i.reference ?? i.id)}
    </table>

    ${journeyBlock(i)}`

  return resend.emails.send({
    from: env.EMAIL_FROM,
    to: env.ADMIN_EMAIL,
    replyTo: i.email, // reply goes straight to the customer
    subject: `New inquiry · ${i.fullName}${i.journeyName ? ` · ${i.journeyName}` : ''}`,
    html: shell('New booking inquiry', inner),
  })
}

/** Confirmation to the customer. */
export async function sendCustomerConfirmation(i: Inquiry) {
  if (!resend) return { skipped: true }
  const inner = `
    <p style="margin:0 0 16px;color:#4A4740;font-size:14px">
      Hi ${escapeHtml(i.fullName)}, thanks for reaching out to HumSafar. We've received your
      inquiry and our team will verify availability and get back to you shortly.
    </p>
    <div style="background:#FFF5F0;border:1px solid rgba(232,115,90,0.2);border-radius:12px;padding:16px;margin:8px 0 4px">
      <div style="font-size:12px;color:#9E3828;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:6px">Your reference</div>
      <div style="font-size:15px;color:${INK};font-weight:700">${escapeHtml(i.reference ?? i.id)}</div>
    </div>
    ${journeyBlock(i)}
    <p style="margin:16px 0 0;color:#7A756B;font-size:13px">
      Keep this reference safe — you can use it with your email to
      <a href="#" style="color:${BRAND};font-weight:600">track your inquiry</a> anytime.
      Seats and fares are confirmed by our team against IRCTC and bus operators before any booking.
    </p>`

  return resend.emails.send({
    from: env.EMAIL_FROM,
    to: i.email,
    replyTo: env.ADMIN_EMAIL,
    subject: 'We received your inquiry — HumSafar',
    html: shell('Your inquiry is in!', inner),
  })
}

/**
 * Notify the customer that their inquiry status changed. Handles:
 *  • CANCELLED  → apology + a clear, selectable reason from the admin.
 *  • COMPLETED  → booking confirmed; ticket details shared via WhatsApp.
 *  • Other      → a generic progress update.
 */
export async function sendStatusUpdate(
  i: Inquiry & { status: string },
  reason?: string,
) {
  if (!resend) return { skipped: true }
  const ref = escapeHtml(i.reference ?? i.id)

  let title = 'Update on your inquiry'
  let subject = 'Update on your inquiry — HumSafar'
  let body = ''

  if (i.status === 'CANCELLED') {
    title = 'Your inquiry has been cancelled'
    subject = 'Your inquiry was cancelled — HumSafar'
    body = `
      <p style="margin:0 0 16px;color:#4A4740;font-size:14px">
        Hi ${escapeHtml(i.fullName)}, we're sorry — your inquiry
        <strong>${ref}</strong> has been cancelled.
      </p>
      ${reason ? `<div style="background:#FDECEC;border:1px solid rgba(190,60,60,0.25);border-radius:12px;padding:14px 16px;margin:4px 0 8px">
        <div style="font-size:12px;color:#9E3828;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:4px">Reason</div>
        <div style="font-size:14px;color:${INK}">${escapeHtml(reason)}</div>
      </div>` : ''}
      <p style="margin:12px 0 0;color:#7A756B;font-size:13px">
        If this was unexpected, just reply to this email and we'll help you re-plan your journey.
      </p>`
  } else if (i.status === 'COMPLETED') {
    title = 'Your booking is confirmed 🎉'
    subject = 'Booking confirmed — HumSafar'
    body = `
      <p style="margin:0 0 16px;color:#4A4740;font-size:14px">
        Great news, ${escapeHtml(i.fullName)}! Our agent has connected with you and
        <strong>confirmed your ticket</strong> for inquiry <strong>${ref}</strong>.
      </p>
      <div style="background:#EAF7EE;border:1px solid rgba(40,150,80,0.25);border-radius:12px;padding:16px;margin:4px 0 8px">
        <div style="font-size:14px;color:${INK};font-weight:600">📲 Ticket details on WhatsApp</div>
        <div style="font-size:13px;color:#4A4740;margin-top:4px">
          The complete ticket — PNR, seat/berth, and boarding details — will be shared with you
          on WhatsApp at the number you provided.
        </div>
      </div>`
  } else {
    body = `
      <p style="margin:0 0 16px;color:#4A4740;font-size:14px">
        Hi ${escapeHtml(i.fullName)}, there's an update on your inquiry <strong>${ref}</strong>:
        its status is now <strong>${escapeHtml(i.status)}</strong>.
      </p>
      ${reason ? `<p style="margin:0 0 8px;color:#4A4740;font-size:14px">${escapeHtml(reason)}</p>` : ''}
      <p style="margin:12px 0 0;color:#7A756B;font-size:13px">Our team will keep you posted at every step.</p>`
  }

  return resend.emails.send({
    from: env.EMAIL_FROM,
    to: i.email,
    replyTo: env.ADMIN_EMAIL,
    subject,
    html: shell(title, body),
  })
}


