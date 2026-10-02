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
| `VITE_SHOW_ADMIN_LOGIN` | `false` | Hides **Login** in nav, login modal, and admin tab for visitors. Set `true` temporarily when you need to sign in again, redeploy, then set back to `false`. If you still have a session (`devpulse_token`), **Dashboard** stays available until you log out. |
| `VITE_GEMINI_API_KEY` | *(optional)* | Only for the floating recruiter chat; key is visible in the browser |

Do **not** put `DATABASE_URL`, `JWT_SECRET`, or `ADMIN_PASSWORD` on Vercel.

---

## Render (API)

**Do not set `VITE_*` variables on Render.** Names starting with `VITE_` are read only when Vercel (or local `npm run build`) builds the React app. Render redeploys do not change Login visibility on your live site.

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

## Cold starts (Render free + Neon free)

Long first loads (30–60s) are usually the **API sleeping** on Render free tier (Neon can add a smaller wake delay).

### App-side mitigation (already in code)

The frontend caches the last successful portfolio payload in `localStorage` and shows it immediately on the next visit while refreshing in the background. First visit on a new device can still wait on a cold API.

### Warm the API (recommended)

Ping the health endpoint so Render is less likely to sleep:

```
https://YOUR-RENDER-HOST/api/health
```

Example with [UptimeRobot](https://uptimerobot.com/) (free):

1. Add a **HTTP(s)** monitor  
2. URL = `https://devpulse-wordpress.onrender.com/api/health` (your real host)  
3. Interval = **5–10 minutes**  
4. Expect HTTP **200** and JSON `{ "status": "ok", ... }`

Alternatives: cron-job.org, EasyCron, or a GitHub Action on a schedule.

Most reliable long-term: Render **always-on** / paid web service so the process never sleeps.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| **Render: build OK, start exits 1** | In Render → **Environment**, add `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD`, and `NODE_ENV=production`. Redeploy. Check **Logs** for `[env] Render deploy failed` or `[startup] Database init failed` |
| API calls fail from Vercel | `VITE_API_URL` = Render host only (no `/api`); redeploy after env change |
| CORS error | Add origin to `CORS_ORIGINS` on Render or use a `*.vercel.app` URL |
| Admin login fails | Set `ADMIN_USERNAME` / `ADMIN_PASSWORD` on Render |
| Gemini report fails | Set `GEMINI_API_KEY` on Render (not Vercel) |
| “Failed to fetch” locally | Run `npm run dev`; ensure `DATABASE_URL` or SQLite fallback works |
| Site feels empty for 30–60s | Warm API via health ping (above); cache helps on return visits |

### Render deploy exited with status 1

1. Open the service → **Logs** → find the line starting with `[env]` or `[startup]`.
2. Add missing variables (minimum):

   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...   (Neon, sslmode=require)
   JWT_SECRET=<32+ random chars>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<strong password>
   PUBLIC_SITE_URL=https://wondwosenportifolio.vercel.app
   ```

3. **Save** → **Manual Deploy** → **Clear build cache & deploy** (if env was added after last deploy).
4. Health check: `https://devpulse-wordpress.onrender.com/api/health` should return JSON.
