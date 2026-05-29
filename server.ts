import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function requireProductionEnv() {
  if (process.env.NODE_ENV !== "production") return;
  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");
  if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
  if (missing.length > 0) {
    console.error(
      `[env] Missing required production variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }
}

requireProductionEnv();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "dev-only-jwt-secret-change-in-production");

const ADMIN_USERNAME =
  process.env.ADMIN_USERNAME ||
  (process.env.NODE_ENV === "production" ? "" : "admin");

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  (process.env.NODE_ENV === "production" ? "" : "password");

//
// --- DATABASE CONFIGURATION ---
const isPostgres = !!process.env.DATABASE_URL;
let pgPool: pg.Pool | null = null;
let sqliteDb: any = null;

if (isPostgres) {
  pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log("Using PostgreSQL backend");
} else {
  sqliteDb = new Database("devpulse.db");
  console.log("Using SQLite backend");
}

// Unified Query Helper
async function query(text: string, params: any[] = []) {
  if (isPostgres) {
    const res = await pgPool!.query(text, params);
    return res.rows;
  } else {
    // Convert Postgres $1, $2 to SQLite ?
    const sqliteText = text.replace(/\$(\d+)/g, '?');
    const stmt = sqliteDb.prepare(sqliteText);
    if (text.trim().toUpperCase().startsWith("SELECT")) {
      return stmt.all(...params);
    } else {
      const result = stmt.run(...params);
      return { lastInsertRowid: result.lastInsertRowid, changes: result.changes };
    }
  }
}

async function queryOne(text: string, params: any[] = []) {
  const rows = await query(text, params);
  return rows.length > 0 ? rows[0] : null;
}

async function exec(text: string) {
  if (isPostgres) {
    await pgPool!.query(text);
  } else {
    sqliteDb.exec(text);
  }
}

// Initialize Database
async function initDb() {
  const idType = isPostgres ? "SERIAL PRIMARY KEY" : "INTEGER PRIMARY KEY AUTOINCREMENT";
  const timestampDefault = isPostgres ? "CURRENT_TIMESTAMP" : "CURRENT_TIMESTAMP";

  await exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id ${idType},
      title TEXT NOT NULL,
      content TEXT,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'publish',
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT ${timestampDefault}
    );
  `);

  // Migration for image_url
  try {
    if (isPostgres) {
      await exec(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT`);
    } else {
      await exec(`ALTER TABLE posts ADD COLUMN image_url TEXT`);
    }
  } catch (e) {
    // Column likely already exists
  }

  // Migration for sort_order in posts
  try {
    if (isPostgres) {
      await exec(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    } else {
      await exec(`ALTER TABLE posts ADD COLUMN sort_order INTEGER DEFAULT 0`);
    }
  } catch (e) {
    // Column likely already exists
  }

  // Migration for sort_order in experience
  try {
    if (isPostgres) {
      await exec(`ALTER TABLE experience ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    } else {
      await exec(`ALTER TABLE experience ADD COLUMN sort_order INTEGER DEFAULT 0`);
    }
  } catch (e) {
    // Column likely already exists
  }

  // Migration for messages.status
  try {
    if (isPostgres) {
      await exec(`ALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unread'`);
    } else {
      await exec(`ALTER TABLE messages ADD COLUMN status TEXT DEFAULT 'unread'`);
    }
  } catch (e) {
    // Column likely already exists
  }

  await exec(`
    CREATE TABLE IF NOT EXISTS post_meta (
      id ${idType},
      post_id INTEGER,
      meta_key TEXT,
      meta_value TEXT
    );

    CREATE TABLE IF NOT EXISTS experience (
      id ${idType},
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS skills (
      id ${idType},
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS api_logs (
      id ${idType},
      endpoint TEXT,
      method TEXT,
      post_id INTEGER,
      timestamp TIMESTAMP DEFAULT ${timestampDefault}
    );

    CREATE TABLE IF NOT EXISTS messages (
      id ${idType},
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at TIMESTAMP DEFAULT ${timestampDefault}
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id ${idType},
      name TEXT NOT NULL,
      issuer TEXT NOT NULL,
      date TEXT NOT NULL,
      url TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      id ${idType},
      key TEXT UNIQUE NOT NULL,
      value TEXT
    );
  `);

  // Seed data if empty
  const countRes = await queryOne("SELECT COUNT(*) as count FROM posts");
  const count = parseInt(countRes.count);

  if (count === 0) {
    console.log("Seeding initial data...");
    const projects = [
      {
        title: "E-service portal",
        content: "I have developed E-eservice platform for different cities such as shaggar, Shashemen, Dire Dawa, Adama cities. eservice system is an electronic platform that provide online government service for the citizens.",
        type: "project",
        image_url: "https://picsum.photos/seed/portal/800/450",
        meta: { tech_stack: "React, Node.js, PostgreSQL", project_url: "https://eservice.gov.et" }
      },
      {
        title: "Shagger city traffic management system",
        content: "The system allow traffic police and traffic controller to register traffic penalty or traffic charges on drivers. It also allows crime controller to register traffic accident and drivers to complain.",
        type: "project",
        image_url: "https://picsum.photos/seed/traffic/800/450",
        meta: { tech_stack: "React, NestJS, PostgreSQL" }
      },
      {
        title: "ElectroCart – AI-Powered E-Commerce",
        content: "A state-of-the-art e-commerce storefront for premium electronics, built with Next.js 14 (App Router) and React 19. Integrates Google Gemini API for personalized shopping experiences.",
        type: "project",
        image_url: "https://picsum.photos/seed/ecommerce/800/450",
        meta: { tech_stack: "Next.js 14, React 19, Gemini API", github_url: "https://github.com/wondwosen/electrocart" }
      }
    ];

    for (const p of projects) {
      let postId;
      if (isPostgres) {
        const res = await query("INSERT INTO posts (title, content, type, image_url) VALUES ($1, $2, $3, $4) RETURNING id", [p.title, p.content, p.type, p.image_url]);
        postId = res[0].id;
      } else {
        const res = await query("INSERT INTO posts (title, content, type, image_url) VALUES ($1, $2, $3, $4)", [p.title, p.content, p.type, p.image_url]);
        postId = res.lastInsertRowid;
      }
      
      if (p.meta) {
        for (const [key, value] of Object.entries(p.meta)) {
          await query("INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES ($1, $2, $3)", [postId, key, value]);
        }
      }
    }
  }

  // Seed Snippets if empty
  const snippetCountRes = await queryOne("SELECT COUNT(*) as count FROM posts WHERE type = 'snippet'");
  if (parseInt(snippetCountRes.count) === 0) {
    const snippets = [
    {
      title: "React Database Retry Hook",
      content: "A robust custom hook for handling database connections with automatic retries and 'waking up' state management. Perfect for serverless databases with cold starts.",
      type: "snippet",
      meta: { 
        language: "typescript", 
        code: `const useDatabaseRetry = (fetchFn, maxRetries = 3) => {
  const [loading, setLoading] = useState(true);
  const [isWakingUp, setIsWakingUp] = useState(false);

  const execute = async (retryCount = 0) => {
    try {
      await fetchFn();
      setLoading(false);
      setIsWakingUp(false);
    } catch (err) {
      if (retryCount < maxRetries) {
        setIsWakingUp(true);
        setTimeout(() => execute(retryCount + 1), 3000);
      } else {
        setLoading(false);
        setIsWakingUp(false);
      }
    }
  };

  return { loading, isWakingUp, execute };
};`
      }
    },
    {
      title: "Express Unified Query Helper",
      content: "A clean utility function that abstracts database interactions, supporting both SQLite for local development and PostgreSQL for production environments.",
      type: "snippet",
      meta: { 
        language: "javascript", 
        code: `async function query(text, params = []) {
  if (isPostgres) {
    const res = await pgPool.query(text, params);
    return res.rows;
  } else {
    const sqliteText = text.replace(/\\$(\\d+)/g, '?');
    const stmt = sqliteDb.prepare(sqliteText);
    if (text.trim().toUpperCase().startsWith("SELECT")) {
      return stmt.all(...params);
    } else {
      const result = stmt.run(...params);
      return { lastInsertRowid: result.lastInsertRowid, changes: result.changes };
    }
  }
};`
      }
    },
    {
      title: "Tailwind Shimmer Animation",
      content: "Custom Tailwind CSS configuration and utility classes for creating smooth, high-performance skeleton loader shimmer effects.",
      type: "snippet",
      meta: { 
        language: "css", 
        code: `@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}`
      }
    }
  ];

  for (const s of snippets) {
    let postId;
    if (isPostgres) {
      const res = await query("INSERT INTO posts (title, content, type) VALUES ($1, $2, $3) RETURNING id", [s.title, s.content, s.type]);
      postId = res[0].id;
    } else {
      const res = await query("INSERT INTO posts (title, content, type) VALUES ($1, $2, $3)", [s.title, s.content, s.type]);
      postId = res.lastInsertRowid;
    }
    
    if (s.meta) {
      for (const [key, value] of Object.entries(s.meta)) {
        await query("INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES ($1, $2, $3)", [postId, key, value]);
      }
    }
  }
  }

  // Seed Experience if empty
  const expCountRes = await queryOne("SELECT COUNT(*) as count FROM experience");
  // Seed Skills if empty
  const skillCountRes = await queryOne("SELECT COUNT(*) as count FROM skills");
  const skillCount = parseInt(skillCountRes.count);
  if (skillCount === 0) {
    const skills = [
      { cat: "frontend", name: "React JS / Next JS", order: 1 },
      { cat: "frontend", name: "TypeScript", order: 2 },
      { cat: "frontend", name: "Tailwind CSS", order: 3 },
      { cat: "frontend", name: "Redux / Zustand", order: 4 },
      { cat: "backend", name: "Node.js / Express", order: 1 },
      { cat: "backend", name: "Nest JS", order: 2 },
      { cat: "backend", name: "Laravel / PHP", order: 3 },
      { cat: "backend", name: "Prisma ORM", order: 4 },
      { cat: "devops", name: "PostgreSQL / MySQL", order: 1 },
      { cat: "devops", name: "MongoDB", order: 2 },
      { cat: "devops", name: "Docker / Git", order: 3 },
      { cat: "additional", name: "AI Prompt Engineering", order: 1 },
      { cat: "additional", name: "System Design", order: 2 },
      { cat: "additional", name: "Microservices", order: 3 }
    ];

    for (const s of skills) {
      await query("INSERT INTO skills (category, name, sort_order) VALUES ($1, $2, $3)", [s.cat, s.name, s.order]);
    }
  }

  // Ensure specific requested skills exist
  const requestedSkills = [
    { cat: "frontend", name: "Redux" },
    { cat: "frontend", name: "Zustand" },
    { cat: "backend", name: "Prisma" },
    { cat: "devops", name: "PostgreSQL" },
    { cat: "devops", name: "MySQL" },
    { cat: "devops", name: "MongoDB" },
    { cat: "devops", name: "Docker" },
    { cat: "devops", name: "Git" },
    { cat: "additional", name: "AI Prompt Engineering" }
  ];

  for (const s of requestedSkills) {
    const exists = await queryOne("SELECT id FROM skills WHERE name = $1", [s.name]);
    if (!exists) {
      await query("INSERT INTO skills (category, name, sort_order) VALUES ($1, $2, $3)", [s.cat, s.name, 99]);
    }
  }

  // Seed Certifications if empty
  const certCountRes = await queryOne("SELECT COUNT(*) as count FROM certifications");
  const certCount = parseInt(certCountRes.count);
  if (certCount === 0) {
    const certs = [
      { name: "Full Stack Web Development", issuer: "Udemy", date: "2023", url: "#", order: 1 },
      { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "2024", url: "#", order: 2 },
      { name: "Meta Front-End Developer Professional Certificate", issuer: "Coursera", date: "2023", url: "#", order: 3 }
    ];
    for (const c of certs) {
      await query("INSERT INTO certifications (name, issuer, date, url, sort_order) VALUES ($1, $2, $3, $4, $5)", [c.name, c.issuer, c.date, c.url, c.order]);
    }
  }

  // Seed Settings if empty
  const settingsCountRes = await queryOne("SELECT COUNT(*) as count FROM settings");
  const settingsCount = parseInt(settingsCountRes.count);
  if (settingsCount === 0) {
    const defaultSettings = [
      { key: 'profile_image', value: '/profile.png' },
      { key: 'resume_url', value: '/resume.pdf' },
      { key: 'site_title', value: 'DevPulse Portfolio' },
      { key: 'hero_title', value: 'Architecting Digital Excellence' },
      { key: 'hero_subtitle', value: 'Full Stack Engineer & System Architect' },
      { key: 'contact_email', value: 'endalewondwosen@gmail.com' }
    ];
    for (const s of defaultSettings) {
      await query("INSERT INTO settings (key, value) VALUES ($1, $2)", [s.key, s.value]);
    }
  }
}

async function startServer() {
  await initDb();
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const PUBLIC_SITE_URL =
    process.env.PUBLIC_SITE_URL || "https://wondwosenportifolio.vercel.app";

  const extraCorsOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (no Origin header)
      if (!origin) return callback(null, true);

      const allowList = new Set([
        "https://devpulse-wordpress.onrender.com",
        "https://wondwosenportifolio.vercel.app", // legacy typo domain (kept for compatibility)
        "https://wondwosenportfolio.vercel.app",
        ...extraCorsOrigins,
      ]);

      if (allowList.has(origin)) return callback(null, true);

      // Allow Vercel previews like https://<branch>-<project>.vercel.app
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      // Allow localhost / 127.0.0.1 (any port) in non-production for local dev
      if (
        process.env.NODE_ENV !== "production" &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS: origin not allowed"), false);
    },
    credentials: true,
  }));

  app.use(express.json());

  // If this service is used as an API backend (e.g. Render),
  // redirect the public root/non-API pages to the main Vercel site.
  if (process.env.NODE_ENV === "production") {
    app.get("/", (_req, res) => res.redirect(302, PUBLIC_SITE_URL));
    app.get(/^\/(?!api\/|uploads\/).*/, (_req, res) => res.redirect(302, PUBLIC_SITE_URL));
  }

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure Multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only images and PDFs are allowed'));
      }
    }
  });

  // Serve static files from public/uploads
  app.use('/uploads', express.static(uploadsDir));

  // Request Logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Debug endpoint to check database structure and data
  app.get("/api/debug/posts", async (req, res) => {
    try {
      // Check table structure
      const structure = await query(`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'posts' 
        ORDER BY ordinal_position
      `);
      
      // Check actual data
      const data = await query("SELECT id, title, image_url, sort_order FROM posts ORDER BY id LIMIT 10");
      
      res.json({
        database: isPostgres ? 'PostgreSQL' : 'SQLite',
        structure,
        data,
        count: data.length
      });
    } catch (error) {
      console.error("Debug error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Debug endpoint to check uploads directory
  app.get("/api/debug/uploads", (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const uploadsDir = path.join(__dirname, "public", "uploads");
      let files = [];
      let dirExists = false;
      
      try {
        files = fs.readdirSync(uploadsDir);
        dirExists = true;
      } catch (err) {
        dirExists = false;
      }
      
      res.json({
        uploadsDir,
        dirExists,
        files: files.map(file => ({
          name: file,
          path: path.join(uploadsDir, file),
          url: `/uploads/${file}`
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Auth Middleware
  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token === "null" || token === "undefined") {
      (req as any).user = null;
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        // Only log warning for non-GET requests to reduce noise, 
        // as GET requests are handled gracefully by falling back to guest mode.
        if (req.method !== 'GET') {
          console.warn("JWT Verification failed:", err.message);
        }
        
        // For GET requests, we can just treat as unauthenticated instead of blocking
        if (req.method === 'GET') {
          (req as any).user = null;
          return next();
        }
        return res.status(403).json({ error: "Invalid or expired token", code: "AUTH_INVALID" });
      }
      (req as any).user = user;
      next();
    });
  };

  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ error: "Unauthorized", code: "AUTH_REQUIRED" });
    }
    next();
  };

  // Login Route
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      return res.status(503).json({ error: "Admin login is not configured on the server" });
    }
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
      return res.json({ token });
    }
    res.status(401).json({ error: "Invalid credentials" });
  });

  // Admin Gemini report (API key stays on server — never bundled in Vite)
  app.post("/api/admin/gemini-report", authenticateToken, requireAuth, async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not set on the API server (Render)",
        });
      }
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const {
        projectCount = 0,
        snippetCount = 0,
        messageCount = 0,
        unreadCount = 0,
        skills = [],
        stats = {},
      } = req.body ?? {};

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                text: `As a portfolio analytics assistant, analyze the following data and provide a concise, professional summary report for the developer.
Data:
- Projects: ${projectCount}
- Code Lab: ${snippetCount}
- Total Messages: ${messageCount} (${unreadCount} unread)
- Top Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
- API Activity: ${JSON.stringify(stats)}

Provide insights on portfolio engagement, content balance, and suggestions for improvement. Format the output in Markdown.`,
              },
            ],
          },
        ],
      });
      res.json({ report: response.text || "No report generated." });
    } catch (error: any) {
      console.error("Gemini report error:", error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  });

  // Logging Middleware (Requested functionality)
  app.use(async (req, res, next) => {
    if (req.path.startsWith('/api/posts/')) {
      const id = req.path.split('/').pop();
      if (id && !isNaN(Number(id))) {
        await query("INSERT INTO api_logs (endpoint, method, post_id) VALUES ($1, $2, $3)", [req.path, req.method, id]);
      }
    }
    next();
  });

  // File Upload Route (Authenticated)
  app.post("/api/upload", authenticateToken, upload.single('image'), (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Settings Routes
  app.get("/api/settings", async (req, res) => {
    try {
      const rows = await query("SELECT key, value FROM settings");
      const settings = rows.reduce((acc: any, row: any) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const settings = req.body;
    try {
      for (const [key, value] of Object.entries(settings)) {
        if (isPostgres) {
          await query("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value", [key, value]);
        } else {
          // SQLite version
          const exists = await queryOne("SELECT id FROM settings WHERE key = $1", [key]);
          if (exists) {
            await query("UPDATE settings SET value = $1 WHERE key = $2", [value, key]);
          } else {
            await query("INSERT INTO settings (key, value) VALUES ($1, $2)", [key, value]);
          }
        }
      }
      res.json({ message: "Settings updated" });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Create Post Route (Authenticated)
  app.post("/api/posts", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { title, content, type, status, image_url, meta, sort_order } = req.body;
    
    // Debug logging
    console.log("POST /api/posts received:", {
      title,
      content,
      type,
      status,
      image_url,
      sort_order,
      meta
    });
    
    if (!title || !type) {
      return res.status(400).json({ error: "Title and Type are required" });
    }

    try {
      let postId;
      if (isPostgres) {
        const result = await query("INSERT INTO posts (title, content, type, status, image_url, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [title, content || "", type, status || "publish", image_url || null, sort_order || 0]);
        postId = result[0].id;
      } else {
        const result = await query("INSERT INTO posts (title, content, type, status, image_url, sort_order) VALUES ($1, $2, $3, $4, $5, $6)", [title, content || "", type, status || "publish", image_url || null, sort_order || 0]);
        postId = result.lastInsertRowid;
      }

      if (meta && typeof meta === 'object') {
        for (const [key, value] of Object.entries(meta)) {
          if (value !== undefined && value !== null) {
            await query("INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES ($1, $2, $3)", [postId, key, String(value)]);
          }
        }
      }

      res.json({ id: postId, message: "Post created successfully" });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update Post Route (Authenticated)
  app.put("/api/posts/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { title, content, type, status, image_url, meta, sort_order } = req.body;
    
    // Debug logging
    console.log("PUT /api/posts received:", {
      id,
      title,
      content,
      type,
      status,
      image_url,
      sort_order,
      meta
    });

    try {
      const result = await query("UPDATE posts SET title = $1, content = $2, type = $3, status = $4, image_url = $5, sort_order = $6 WHERE id = $7", [title, content || "", type, status || "publish", image_url || null, sort_order || 0, id]);

      if (!isPostgres && result.changes === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Update meta: delete old and insert new
      await query("DELETE FROM post_meta WHERE post_id = $1", [id]);
      if (meta && typeof meta === 'object') {
        for (const [key, value] of Object.entries(meta)) {
          if (value !== undefined && value !== null && value !== "") {
            await query("INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES ($1, $2, $3)", [id, key, String(value)]);
          }
        }
      }

      res.json({ message: "Post updated successfully" });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete Post Route (Authenticated)
  app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    try {
      await query("DELETE FROM post_meta WHERE post_id = $1", [id]);
      const result = await query("DELETE FROM posts WHERE id = $1", [id]);

      if (!isPostgres && result.changes === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API Routes (Simulating WP REST API)
  app.get("/api/posts", authenticateToken, async (req, res) => {
    try {
      const type = req.query.type || 'project';
      const search = req.query.search as string;
      const user = (req as any).user;
      
      console.log(`Fetching posts: type=${type}, search=${search}, authenticated=${!!user}`);

      let queryText = "SELECT * FROM posts WHERE type = $1 AND (status = 'publish'";
      let params: any[] = [type];

      if (user) {
        queryText += " OR status = 'private'";
      }
      queryText += ")";

      if (search) {
        queryText += " AND (title LIKE $2 OR content LIKE $3)";
        params.push(`%${search}%`, `%${search}%`);
      }

      queryText += " ORDER BY sort_order ASC, created_at DESC";

      const posts = await query(queryText, params);
      
      const postsWithMeta = await Promise.all(posts.map(async (post: any) => {
        const meta = await query("SELECT meta_key, meta_value FROM post_meta WHERE post_id = $1", [post.id]);
        const metaObj = meta.reduce((acc: any, m: any) => {
          acc[m.meta_key] = m.meta_value;
          return acc;
        }, {});
        return { ...post, meta: metaObj };
      }));

      res.json(postsWithMeta);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await queryOne("SELECT * FROM posts WHERE id = $1", [req.params.id]);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const meta = await query("SELECT meta_key, meta_value FROM post_meta WHERE post_id = $1", [post.id]);
      const metaObj = meta.reduce((acc: any, m: any) => {
        acc[m.meta_key] = m.meta_value;
        return acc;
      }, {});

      res.json({ ...post, meta: metaObj });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Experience Routes
  app.get("/api/experience", async (req, res) => {
    try {
      const experience = await query("SELECT * FROM experience ORDER BY sort_order ASC, id DESC");
      res.json(experience);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experience" });
    }
  });

  app.post("/api/experience", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { company, role, period, description, sort_order } = req.body;
    try {
      if (isPostgres) {
        const result = await query("INSERT INTO experience (company, role, period, description, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING id", [company, role, period, description, sort_order || 0]);
        res.json({ id: result[0].id, message: "Experience added" });
      } else {
        const result = await query("INSERT INTO experience (company, role, period, description, sort_order) VALUES ($1, $2, $3, $4, $5)", [company, role, period, description, sort_order || 0]);
        res.json({ id: result.lastInsertRowid, message: "Experience added" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to add experience" });
    }
  });

  app.put("/api/experience/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const { company, role, period, description, sort_order } = req.body;
    try {
      await query("UPDATE experience SET company = $1, role = $2, period = $3, description = $4, sort_order = $5 WHERE id = $6", [company, role, period, description, sort_order || 0, id]);
      res.json({ message: "Experience updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update experience" });
    }
  });

  app.delete("/api/experience/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    try {
      await query("DELETE FROM experience WHERE id = $1", [id]);
      res.json({ message: "Experience deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete experience" });
    }
  });

  // Skills Routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await query("SELECT * FROM skills ORDER BY category, sort_order ASC");
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { category, name, sort_order } = req.body;
    try {
      if (isPostgres) {
        const result = await query("INSERT INTO skills (category, name, sort_order) VALUES ($1, $2, $3) RETURNING id", [category, name, sort_order || 0]);
        res.json({ id: result[0].id, message: "Skill added" });
      } else {
        const result = await query("INSERT INTO skills (category, name, sort_order) VALUES ($1, $2, $3)", [category, name, sort_order || 0]);
        res.json({ id: result.lastInsertRowid, message: "Skill added" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to add skill" });
    }
  });

  app.put("/api/skills/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const { category, name, sort_order } = req.body;
    try {
      await query("UPDATE skills SET category = $1, name = $2, sort_order = $3 WHERE id = $4", [category, name, sort_order || 0, id]);
      res.json({ message: "Skill updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    try {
      await query("DELETE FROM skills WHERE id = $1", [id]);
      res.json({ message: "Skill deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // Certifications Routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await query("SELECT * FROM certifications ORDER BY sort_order ASC, id DESC");
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  app.post("/api/certifications", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { name, issuer, date, url, sort_order } = req.body;
    try {
      if (isPostgres) {
        const result = await query("INSERT INTO certifications (name, issuer, date, url, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING id", [name, issuer, date, url, sort_order || 0]);
        res.json({ id: result[0].id, message: "Certification added" });
      } else {
        const result = await query("INSERT INTO certifications (name, issuer, date, url, sort_order) VALUES ($1, $2, $3, $4, $5)", [name, issuer, date, url, sort_order || 0]);
        res.json({ id: result.lastInsertRowid, message: "Certification added" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to add certification" });
    }
  });

  app.put("/api/certifications/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const { name, issuer, date, url, sort_order } = req.body;
    try {
      await query("UPDATE certifications SET name = $1, issuer = $2, date = $3, url = $4, sort_order = $5 WHERE id = $6", [name, issuer, date, url, sort_order || 0, id]);
      res.json({ message: "Certification updated" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update certification" });
    }
  });

  app.delete("/api/certifications/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    try {
      await query("DELETE FROM certifications WHERE id = $1", [id]);
      res.json({ message: "Certification deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete certification" });
    }
  });

  // Contact Messages Routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }
    try {
      if (isPostgres) {
        await query("INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)", [name, email, subject || "No Subject", message]);
      } else {
        await query("INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)", [name, email, subject || "No Subject", message]);
      }
      res.json({ message: "Message sent successfully! I will get back to you soon." });
    } catch (error) {
      console.error("Contact error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/messages", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    try {
      const messages = await query("SELECT * FROM messages ORDER BY created_at DESC");
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.put("/api/messages/:id/read", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    try {
      await query("UPDATE messages SET status = 'read' WHERE id = $1", [id]);
      res.json({ message: "Message marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update message" });
    }
  });

  app.delete("/api/messages/:id", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    try {
      await query("DELETE FROM messages WHERE id = $1", [id]);
      res.json({ message: "Message deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // Resume Download Route
  app.get("/api/resume/download", (req, res) => {
    const resumePath = path.join(__dirname, "public", "resume.pdf");
    
    // Check if file exists
    if (fs.existsSync(resumePath)) {
      res.setHeader('Content-Disposition', 'attachment; filename=Wondwosen_Endale_Resume.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(resumePath);
    } else {
      res.status(404).json({ error: "Resume file not found" });
    }
  });

  // Stats for the dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const logs = await query("SELECT endpoint, COUNT(*) as views FROM api_logs GROUP BY endpoint ORDER BY views DESC LIMIT 5");
      res.json(logs || []);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // API Catch-all (prevent falling through to Vite)
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found", path: req.path });
  });

  // Global Error Handler (prevents HTML error pages)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message,
      path: req.path 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DevPulse Server running on http://localhost:${PORT}`);
  });
}

startServer();
