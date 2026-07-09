# Deployment & Security Guide

This project is a two-part app: a **Vite/React frontend** (repo root) and a
**Fastify/Prisma API** (`server/`). Follow this before pushing to GitHub and
deploying.

---

## 🔒 Before you push to GitHub

1. **No secrets are committed.** Real credentials live only in `.env` /
   `.env.local`, which are gitignored (root and `server/.gitignore`). Only the
   `*.env.example` templates — with placeholder values — are tracked.

   Verify nothing sensitive is staged:
   ```bash
   git init
   git add -A
   git status                       # confirm no .env / .env.local appear
   git ls-files | grep -E "\.env($|\.local)" && echo "STOP: secret tracked!" || echo "clean"
   ```

2. **Rotate anything that was ever in a local `.env`.** If a real key was
   present on disk during development (Neon password, Resend key), treat it as
   burned and rotate it before go-live:
   - **Neon**: dashboard → Roles → reset password (new `DATABASE_URL`).
   - **Resend**: dashboard → API Keys → revoke & recreate.

---

## 🚀 Frontend (Vercel / Netlify / static host)

```bash
npm install
npm run build        # outputs dist/
```
Set environment variables in the host dashboard (copy from `.env.example`):
- `VITE_API_BASE_URL` → your deployed API URL (https).
- `VITE_TURNSTILE_SITE_KEY` → Cloudflare Turnstile **site** key.
- `VITE_ADMIN_PATH` → must match the server's `ADMIN_PATH_SECRET`.

> All `VITE_*` values are **public** (bundled into client JS). Never put a
> secret behind a `VITE_` prefix.

---

## 🖥️ API (Render / Railway / Fly.io)

```bash
cd server
npm install
npm run build        # tsc → dist/
npm start            # node dist/index.js
```
Set environment variables (copy from `server/.env.example`) and in particular:

| Var | Production requirement |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Neon/Supabase Postgres URL (SSL). |
| `JWT_SECRET` | Unique random string, **≥ 32 chars**. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_PATH_SECRET` | Random URL segment, **not** the default. Must match `VITE_ADMIN_PATH`. |
| `ALLOWED_ORIGINS` | Your real domain(s), comma-separated. **No localhost.** |
| `RESEND_API_KEY` / `EMAIL_FROM` | From Resend, with a verified domain. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile **secret** key. |
| `TURNSTILE_ENFORCE` | `true` |

The server **refuses to boot in production** if `JWT_SECRET`, `ADMIN_PATH_SECRET`,
or `ALLOWED_ORIGINS` are left at insecure/default values (see `server/src/lib/env.ts`).

### Database setup (once, against production DB)
```bash
npm run db:push          # create tables
npm run db:seed          # create admin login
npm run db:seed:trains   # load train inventory (optional)
```

---

## 🛡️ Security features already in place

- **Helmet** — HSTS, strict CSP, `X-Content-Type-Options`, frameguard, no `X-Powered-By`.
- **CORS** — allow-list only in production (no wildcards).
- **Rate limiting** — global 100/min per IP, inquiries 5/15min, admin login 10/5min, with ban on abuse.
- **HTTPS enforcement** — plaintext requests rejected behind proxy in production.
- **Input validation & sanitization** — strict Zod schemas, control-char stripping, output escaping.
- **Auth** — bcrypt password hashing, signed JWT session cookies, obscure admin path as defense-in-depth.
- **Body-size limit** + generic error responses (no stack traces) + redacted logs.
- **Data retention** — inquiries auto-purged after 2 months.

---

## ✅ Pre-deploy checklist

- [ ] `git status` shows no `.env` / `.env.local` tracked.
- [ ] Neon & Resend credentials rotated if ever exposed locally.
- [ ] Production env vars set on both hosts (frontend + API).
- [ ] `JWT_SECRET` and `ADMIN_PATH_SECRET` are strong & unique.
- [ ] `ALLOWED_ORIGINS` = real domain(s), `TURNSTILE_ENFORCE=true`.
- [ ] `npm run build` passes for both frontend and `server/`.
- [ ] `db:push` + `db:seed` run against the production database.
