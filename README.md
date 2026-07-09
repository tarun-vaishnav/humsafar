<!-- ══════════════════════════════════════════════════════════════════════════ -->
<!--                              H U M S A F A R                               -->
<!-- ══════════════════════════════════════════════════════════════════════════ -->

<div align="center">

<a name="top"></a>

<!-- Animated header wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:E8735A,50:C9A03A,100:E8735A&height=220&section=header&text=HumSafar&fontColor=ffffff&fontSize=72&fontAlignY=38&desc=Rail%20%26%20Road%20%C2%B7%20India%20%E2%80%94%20a%20premium%20journey%20booking%20experience&descAlignY=60&descSize=18&animation=fadeIn" width="100%" alt="HumSafar" />

<!-- Typing tagline -->
<a href="#top">
  <img src="https://readme-typing-svg.demolab.com?font=Fraunces&weight=600&size=26&pause=1000&color=E8735A&center=true&vCenter=true&width=720&lines=Compare+trains+%26+buses+across+India;Find+the+best+fares%2C+every+time;Book+with+real+human+assistance;The+journey+writes+itself." alt="Typing tagline" />
</a>

<br/>

<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Fastify-5-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres" />
</p>

<p>
  <img src="https://img.shields.io/badge/frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/api-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white" alt="Railway" />
  <img src="https://img.shields.io/badge/license-MIT-E8735A?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-C9A03A?style=flat-square" alt="PRs welcome" />
</p>

<sub><b>A warm, premium, motion-rich platform to compare and book trains &amp; intercity buses — backed by a hardened Fastify API and a live admin-managed inventory.</b></sub>

</div>

<br/>

<!-- ─────────────────────────────────────────────────────────────────────────── -->

## ✨ Overview

**HumSafar** ("fellow traveller") is a two-part application:

- 🎨 **Frontend** — a Vite + React 19 single-page experience with a cinematic
  preloader, GSAP-driven motion, a 3D hero scene, and a calm, editorial design
  system built on warm neutrals and a coral → gold gradient.
- 🛡️ **API** — a security-hardened Fastify + Prisma service backed by
  PostgreSQL (Neon), serving live train &amp; bus inventory, booking inquiries,
  status tracking, and an obscured admin dashboard.

<div align="center">
<table>
<tr>
<td align="center" width="25%">🚆<br/><b>Live inventory</b><br/><sub>Trains &amp; buses from DB</sub></td>
<td align="center" width="25%">🔎<br/><b>Smart search</b><br/><sub>Both directions, sorted by fare</sub></td>
<td align="center" width="25%">📝<br/><b>Guided booking</b><br/><sub>Human-assisted inquiries</sub></td>
<td align="center" width="25%">🔐<br/><b>Hardened admin</b><br/><sub>JWT + obscure path</sub></td>
</tr>
</table>
</div>

<br/>

## 🎬 Experience Highlights

| Moment | What happens |
| --- | --- |
| **Preloader** | A 3D-tilted route line draws itself, station nodes light up, a train head glides along, and *"HumSafar"* is written in calligraphy by a moving pen nib. |
| **Hero** | A living scene with layered depth, magnetic cursor, and a warm ambient glow. |
| **Search** | Query live routes; results merge trains + buses, both directions, parsed by duration and fare. |
| **Inquiry** | A multi-step flow with captcha (Cloudflare Turnstile) that turns interest into a delivered booking request. |
| **Track** | Look up an inquiry and follow its status history. |
| **Admin** | Manage train &amp; bus records, review inquiries — all behind an obscured, JWT-protected path. |

<br/>

## 🧱 Tech Stack

<div align="center">

**Frontend**

![React](https://skillicons.dev/icons?i=react,vite,tailwind,js,html,css)

**Backend &amp; Infra**

![Backend](https://skillicons.dev/icons?i=nodejs,ts,fastify,prisma,postgres,vercel)

</div>

- **Motion**: GSAP timelines, magnetic interactions, `prefers-reduced-motion` aware.
- **State/data**: TanStack Query for server state on the client.
- **Design tokens**: a single locked source of truth (`src/styles/tokens.js`) feeding Tailwind, inline styles, and shaders.
- **Security**: Helmet, CORS allow-list, rate limiting, Zod validation, bcrypt, signed JWT cookies, HTTPS enforcement, body-size limits, and inquiry auto-retention.

<br/>

## 🏗️ Architecture

```
humsafar/
├─ src/                      # Vite + React frontend
│  ├─ components/            #   hero · nav · search · inquiry · layout · ui
│  ├─ pages/                 #   HomePage · TrackPage · AdminPage · NotFound
│  ├─ services/              #   Search / Inquiry / Tracking / Admin API clients
│  ├─ animations/            #   GSAP setup
│  ├─ scene/                 #   3D materials
│  └─ styles/                #   tokens.js (locked DS) · theme · global.css
│
└─ server/                   # Fastify + Prisma API
   ├─ src/routes/            #   search · inquiries · admin
   ├─ src/lib/               #   auth · email · validation · tracking · env
   ├─ src/db/                #   client · seeders (admin · trains · buses)
   └─ prisma/schema.prisma   #   BusRecord · TrainRecord · Inquiry · AdminUser · …
```

```mermaid
flowchart LR
    U([Traveller]) -->|search / inquire| FE[React · Vite]
    A([Admin]) -->|manage inventory| FE
    FE -->|REST /api| API[Fastify]
    API -->|Prisma| DB[(PostgreSQL · Neon)]
    API -->|transactional mail| MAIL[[Resend]]
    FE -->|captcha| CF[[Cloudflare Turnstile]]
```

<br/>

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A PostgreSQL database (e.g. a free [Neon](https://neon.tech) branch)

### 1 — Frontend

```bash
npm install
cp .env.example .env.local     # set VITE_API_BASE_URL, VITE_ADMIN_PATH, …
npm run dev                    # http://localhost:5173
```

### 2 — API

```bash
cd server
npm install
cp .env.example .env           # set DATABASE_URL, JWT_SECRET, ADMIN_PATH_SECRET, …

npm run db:push                # create tables
npm run db:seed                # create the admin login
npm run db:seed:trains         # load train inventory
npm run db:seed:buses          # load bus inventory

npm run dev                    # http://localhost:3001
```

<br/>

## 🔑 Environment Variables

<details>
<summary><b>Frontend (<code>.env.local</code>)</b></summary>

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the deployed API |
| `VITE_ADMIN_PATH` | Must match the server's `ADMIN_PATH_SECRET` |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile **site** key |

> All `VITE_*` values are public (bundled into client JS). Never put a secret behind a `VITE_` prefix.

</details>

<details>
<summary><b>API (<code>server/.env</code>)</b></summary>

| Variable | Production requirement |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Neon/Supabase Postgres URL (SSL) |
| `JWT_SECRET` | Unique random string, **≥ 32 chars** |
| `ADMIN_PATH_SECRET` | Random URL segment (not the default); matches `VITE_ADMIN_PATH` |
| `ALLOWED_ORIGINS` | Your real domain(s), comma-separated — **no localhost** |
| `RESEND_API_KEY` / `EMAIL_FROM` | Resend key with a verified domain |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile **secret** key |
| `TURNSTILE_ENFORCE` | `true` |

> The server **refuses to boot in production** if `JWT_SECRET`, `ADMIN_PATH_SECRET`, or `ALLOWED_ORIGINS` are left at insecure defaults.

</details>

<br/>

## 📜 Useful Scripts

| Location | Command | Description |
| --- | --- | --- |
| root | `npm run dev` | Start the Vite dev server |
| root | `npm run build` | Production build → `dist/` |
| `server/` | `npm run dev` | Start the API with hot reload |
| `server/` | `npm run build` | `prisma generate && tsc` → `dist/` |
| `server/` | `npm run db:push` | Sync schema to the database |
| `server/` | `npm run db:seed` | Seed the admin login |
| `server/` | `npm run db:seed:trains` | Load train inventory |
| `server/` | `npm run db:seed:buses` | Load bus inventory |
| `server/` | `npm run db:studio` | Open Prisma Studio |

<br/>

## ☁️ Deployment

- **Frontend → Vercel** — build `npm run build`, output `dist/`. Set the `VITE_*` env vars in the dashboard.
- **API → Railway** — build `npm run build`, start `npm start`. Set the server env vars and run `db:push` + seeds against the production database once.

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full go-live &amp; security checklist.

<br/>

## 🛡️ Security At A Glance

`Helmet · strict CSP · HSTS` &nbsp;•&nbsp; `CORS allow-list` &nbsp;•&nbsp; `Rate limiting + abuse bans` &nbsp;•&nbsp; `Zod validation & sanitisation` &nbsp;•&nbsp; `bcrypt + signed JWT cookies` &nbsp;•&nbsp; `HTTPS enforcement` &nbsp;•&nbsp; `Obscured admin path` &nbsp;•&nbsp; `Inquiry auto-retention`

<br/>

<div align="center">

## 🎨 Design Language

<table>
<tr>
<td align="center"><img src="https://readme-typing-svg.demolab.com?font=Fraunces&size=22&color=E8735A&center=true&width=170&height=50&lines=Coral" alt="Coral" /><br/><code>#E8735A</code></td>
<td align="center"><img src="https://readme-typing-svg.demolab.com?font=Fraunces&size=22&color=C9A03A&center=true&width=170&height=50&lines=Gold" alt="Gold" /><br/><code>#C9A03A</code></td>
<td align="center"><img src="https://readme-typing-svg.demolab.com?font=Fraunces&size=22&color=2A2722&center=true&width=170&height=50&lines=Ink" alt="Ink" /><br/><code>#2A2722</code></td>
</tr>
</table>

<sub>Warm · premium · editorial — never dark, never neon, never aggressive.<br/>Type: <b>Fraunces</b> (display) · <b>Inter</b> (UI) · <b>Great Vibes</b> (calligraphy wordmark).</sub>

</div>

<br/>

## 🗺️ Roadmap

- [x] DB-backed train &amp; bus inventory with admin CRUD
- [x] Unified public search across trains + buses
- [x] Hardened, obscured admin dashboard
- [ ] Payment &amp; seat-selection integration
- [ ] Multi-language (Hindi / English) UI
- [ ] Saved trips &amp; user accounts

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:C9A03A,50:E8735A,100:C9A03A&height=120&section=footer" width="100%" alt="footer" />

<sub>Built with warmth for every fellow traveller · <b>HumSafar</b></sub>

<a href="#top">⬆ Back to top</a>

</div>
