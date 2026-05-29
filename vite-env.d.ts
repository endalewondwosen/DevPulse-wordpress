/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Render (or local) API base, e.g. https://your-api.onrender.com/api — empty = same origin */
  readonly VITE_API_URL?: string;
  /** Show Admin nav link before login (use false on Vercel production) */
  readonly VITE_SHOW_ADMIN_LOGIN?: string;
  /** Optional: public recruiter chat (exposed in browser bundle) */
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

