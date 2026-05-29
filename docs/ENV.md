# Environment variables (production)

DevPulse uses a **split deploy**:

| Host | Role | Build / start |
|------|------|----------------|
| **Vercel** | React SPA (`dist/`) | `npm run build` |
| **Render** | REST API + PostgreSQL | `npm run build` then `npm start` |

---

## Vercel (frontend)

Set in **Project → Settings → Environment Variables** (Production + Preview):

| Variable | Production value | Notes |
|----------|------------------|--------|
| `VITE_API_URL` | `https://devpulse-wordpress.onrender.com` | Host only — no `/api` suffix (paths already use `/api/...`) |
| `VITE_SHOW_ADMIN_LOGIN` | `false` | Hides public admin entry; log in via direct flow if needed |
| `VITE_GEMINI_API_KEY` | *(optional)* | Only for the floating recruiter chat; key is visible in the browser |

Do **not** put `DATABASE_URL`, `JWT_SECRET`, or `ADMIN_PASSWORD` on Vercel.

---

## Render (API)

| Variable | Required | Notes |
|----------|----------|--------|
| `NODE_ENV` | Yes | `production` |
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `JWT_SECRET` | Yes | `openssl rand -hex 32` (min 32 characters) |
| `ADMIN_USERNAME` | Yes | Admin login username |
| `ADMIN_PASSWORD` | Yes | Strong password (not `password`) |
| `GEMINI_API_KEY` | Optional | Powers **Admin → Gemini report** (server-side only) |
| `PUBLIC_SITE_URL` | Recommended | e.g. `https://wondwosenportifolio.vercel.app` (API root redirect) |
| `CORS_ORIGINS` | Optional | Extra allowed origins, comma-separated |
| `PORT` | Auto | Render sets this |

CORS already allows `*.vercel.app` and your known production domains.

---

## Local development

```bash
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD
npm install
npm run dev
```

- `VITE_API_URL` **empty** → requests go to `/api` on `http://localhost:3000`
- `VITE_SHOW_ADMIN_LOGIN=true` → convenient admin nav link

---

## Security checklist before push

- [ ] `.env` / `.env.local` not committed (see `.gitignore`)
- [ ] `.env.example` has **placeholders only** (no real DB password)
- [ ] `JWT_SECRET` and `ADMIN_PASSWORD` set on Render
- [ ] `VITE_SHOW_ADMIN_LOGIN=false` on Vercel production
- [ ] Rotate Neon password if it was ever committed to git
- [ ] `GEMINI_API_KEY` only on Render (admin report), not in client build unless chat is required

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| API calls fail from Vercel | `VITE_API_URL` = Render host only (no `/api`); redeploy after env change |
| CORS error | Add origin to `CORS_ORIGINS` on Render or use a `*.vercel.app` URL |
| Admin login fails | Set `ADMIN_USERNAME` / `ADMIN_PASSWORD` on Render |
| Gemini report fails | Set `GEMINI_API_KEY` on Render (not Vercel) |
| “Failed to fetch” locally | Run `npm run dev`; ensure `DATABASE_URL` or SQLite fallback works |
