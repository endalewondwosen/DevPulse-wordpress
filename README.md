<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DevPulse Portfolio

Full-stack portfolio (React + Express + PostgreSQL).

## Run locally

**Prerequisites:** Node.js 18+

1. `npm install`
2. `cp .env.example .env` and fill in `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD`
3. `npm run dev` → http://localhost:3000

See **[docs/ENV.md](docs/ENV.md)** for Vercel + Render production variables.

## Deploy

| Platform | What to deploy |
|----------|----------------|
| **Vercel** | Frontend (`npm run build` → `dist/`) |
| **Render** | API (`npm start`, `server.ts`) |

Production checklist: [docs/ENV.md](docs/ENV.md)
