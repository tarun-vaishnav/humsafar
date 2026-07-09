# HumSafar API

Secure inquiry backend for the HumSafar website. Built with **Fastify + Prisma + Postgres (Neon/Supabase) + Resend + Cloudflare Turnstile**.

When a visitor submits the inquiry form:

1. The request is validated, sanitized, rate-limited and captcha-checked.
2. The inquiry is stored in Postgres.
3. **You** (the owner) get an email notification.
4. **The customer** gets a confirmation email.

---

## 🔐 Security implemented

| Feature | How |
| --- | --- |
| **Validation** | Strict Zod schema — length caps, format checks, enum whitelists, `.strict()` rejects unknown keys. |
| **Sanitization** | Control/zero-width chars stripped, whitespace collapsed, values escaped again on output. |
| **Helmet** | Secure headers: HSTS, CSP, `X-Content-Type-Options`, frameguard, no `X-Powered-By`. |
| **Rate Limiting** | Global 100 req/min per IP **+** strict 5 inquiries / 15 min per IP, with ban on repeated abuse. |
| **CORS** | Strict origin allow-list in production (no wildcards). |
| **HTTPS** | HSTS + `upgrade-insecure-requests`; plaintext requests rejected behind proxy in prod. |
| **Turnstile** | Cloudflare Turnstile token verified server-side (with client IP). |
| **Logging** | Structured pino logs with sensitive headers redacted. |
| **Email Security** | All values HTML-escaped, no header injection, verified sender domain (SPF/DKIM/DMARC via Resend). |
| **SQL-Injection Safe** | Prisma parameterized queries only — no raw string SQL. |
| **XSS Safe** | Input sanitized at rest + escaped in email output. |
| **Extra** | Honeypot field, request body-size limit, generic error responses (no stack traces), env validation at boot, graceful shutdown. |

---

## 🚀 Setup

### 1. Install
```bash
cd server
npm install
```

### 2. Database — pick ONE free tier

**Neon** (recommended): create a project at <https://neon.tech>, copy the connection string.

**Supabase**: create a project at <https://supabase.com>, then Settings → Database → Connection string (URI).

### 3. Configure env
```bash
cp .env.example .env
```
Fill in:
- `DATABASE_URL` — your Neon/Supabase Postgres URL.
- `ADMIN_EMAIL` — **your** email (where inquiries land).
- `RESEND_API_KEY` + `EMAIL_FROM` — from <https://resend.com> (verify your domain).
- `TURNSTILE_SECRET_KEY` — from Cloudflare Turnstile (optional in dev).

### 4. Create tables & seed data
```bash
npm run db:generate     # generate Prisma client
npm run db:push         # push schema to your database
npm run db:seed         # create the first admin user (login credentials)
npm run db:seed:trains  # load the bundled train inventory into the DB
```
> `db:seed:trains` imports `src/data/trainData.js` (the front-end mock data) into
> the `TrainRecord` table so the admin **Train records** tab has content to manage.
> It is idempotent — re-running clears and reloads the set.

### 5. Run
```bash
npm run dev           # http://localhost:3001
```
Health check: <http://localhost:3001/api/health>

---

## 🗄️ Admin dashboard

A hidden dashboard lives at an **obscure, env-defined path** (never linked publicly):

- Frontend route: `VITE_ADMIN_PATH` (root `.env.local`) — e.g. `/a9f3c1b7-console`.
- Server API prefix: `ADMIN_PATH_SECRET` (server `.env`) — must match the frontend value.

Sign in with the credentials created by `npm run db:seed`. The dashboard has three tabs:

| Tab | What it does |
| --- | --- |
| **Inquiries** | Analytics (30-day chart, status/priority/type breakdowns, top routes), filterable inquiry table, and a detail drawer to update status/priority/notes. Status changes email the customer. |
| **Train records** | Full CRUD over the `TrainRecord` inventory — add/edit/delete trains, classes & fares, toggle visibility in search results. |
| **Account** | Change your admin password (signs you out afterwards). |


---

## 🌐 Frontend wiring

In the project root, copy `.env.example` → `.env.local` and set:
```
VITE_API_BASE_URL=http://localhost:3001
VITE_TURNSTILE_SITE_KEY=<your Turnstile SITE key>   # public, optional in dev
```

The inquiry form (`src/components/inquiry/InquiryFlow.jsx`) posts to `POST /api/inquiries`.

---

## 📧 Email providers

Uses **Resend** (free tier: 100 emails/day, 3k/month). For a quick test set
`EMAIL_FROM="HumSafar <onboarding@resend.dev>"`. For production, verify your own
domain in Resend so SPF/DKIM/DMARC pass and mail reaches inboxes.

---

## 🛡️ Turnstile

1. Cloudflare dashboard → Turnstile → add a site.
2. Put the **Site key** in the frontend `VITE_TURNSTILE_SITE_KEY`.
3. Put the **Secret key** in the server `TURNSTILE_SECRET_KEY`.
4. Set `TURNSTILE_ENFORCE=true` in production to hard-require it.

---

## 🚢 Deploy

- **API**: Render / Railway / Fly.io — set all `.env` vars, run `npm run build` then `npm start`. Ensure `NODE_ENV=production` and `ALLOWED_ORIGINS=https://your-domain.com`.
- **DB migrations**: run `npm run db:push` (or `db:migrate` for versioned migrations) against the production database.
- Always serve over HTTPS (the platform's proxy handles TLS; HSTS is enabled).
