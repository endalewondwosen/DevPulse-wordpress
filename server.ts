import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import jwt from "jsonwebtoken";

const JWT_SECRET = "devpulse-secret-key-123";

const db = new Database("devpulse.db");

// Initialize Database (Simulating WordPress CPTs and Meta)
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT NOT NULL, -- 'project' or 'snippet'
    status TEXT DEFAULT 'publish',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS post_meta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    meta_key TEXT,
    meta_value TEXT,
    FOREIGN KEY(post_id) REFERENCES posts(id)
  );

  CREATE TABLE IF NOT EXISTS api_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT,
    method TEXT,
    post_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
if (postCount.count === 0) {
  const insertPost = db.prepare("INSERT INTO posts (title, content, type) VALUES (?, ?, ?)");
  const insertMeta = db.prepare("INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES (?, ?, ?)");

  const p1 = insertPost.run("Portfolio Website", "A high-performance portfolio built with React.", "project").lastInsertRowid;
  insertMeta.run(p1, "github_url", "https://github.com/user/portfolio");
  insertMeta.run(p1, "project_url", "https://portfolio-demo.com");
  insertMeta.run(p1, "tech_stack", "React, Tailwind, Vite");

  const p2 = insertPost.run("E-commerce API", "Node.js backend for a modern store.", "project").lastInsertRowid;
  insertMeta.run(p2, "github_url", "https://github.com/user/shop-api");
  insertMeta.run(p2, "project_url", "https://api-docs.shop.com");
  insertMeta.run(p2, "tech_stack", "Node.js, Express, PostgreSQL");

  const s1 = insertPost.run("React UseEffect Hook", "Common patterns for useEffect.", "snippet").lastInsertRowid;
  insertMeta.run(s1, "language", "typescript");

  // Private content
  const p3 = insertPost.run("Secret Project X", "This is a private project only visible to authenticated developers.", "project").lastInsertRowid;
  db.prepare("UPDATE posts SET status = 'private' WHERE id = ?").run(p3);
  insertMeta.run(p3, "tech_stack", "Stealth, AI, Quantum");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return next(); // Not logged in, but might be accessing public content

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      (req as any).user = user;
      next();
    });
  };

  // Login Route
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // Simple mock auth
    if (username === "admin" && password === "password") {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }
    res.status(401).json({ error: "Invalid credentials" });
  });

  // Logging Middleware (Requested functionality)
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/posts/')) {
      const id = req.path.split('/').pop();
      if (id && !isNaN(Number(id))) {
        db.prepare("INSERT INTO api_logs (endpoint, method, post_id) VALUES (?, ?, ?)")
          .run(req.path, req.method, id);
      }
    }
    next();
  });

  // Create Post Route (Authenticated)
  app.post("/api/posts", authenticateToken, (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { title, content, type, status, meta } = req.body;
    
    if (!title || !type) {
      return res.status(400).json({ error: "Title and Type are required" });
    }

    try {
      const insertPost = db.prepare("INSERT INTO posts (title, content, type, status) VALUES (?, ?, ?, ?)");
      const result = insertPost.run(title, content || "", type, status || "publish");
      const postId = result.lastInsertRowid;

      if (meta && typeof meta === 'object') {
        const insertMeta = db.prepare("INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES (?, ?, ?)");
        for (const [key, value] of Object.entries(meta)) {
          if (value) insertMeta.run(postId, key, String(value));
        }
      }

      res.json({ id: postId, message: "Post created successfully" });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API Routes (Simulating WP REST API)
  app.get("/api/posts", authenticateToken, (req, res) => {
    const type = req.query.type || 'project';
    const search = req.query.search as string;
    const user = (req as any).user;
    
    let query = "SELECT * FROM posts WHERE type = ? AND (status = 'publish'";
    let params: any[] = [type];

    if (user) {
      query += " OR status = 'private'";
    }
    query += ")";

    if (search) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const posts = db.prepare(query).all(...params);
    
    const postsWithMeta = posts.map((post: any) => {
      const meta = db.prepare("SELECT meta_key, meta_value FROM post_meta WHERE post_id = ?").all(post.id);
      const metaObj = meta.reduce((acc: any, m: any) => {
        acc[m.meta_key] = m.meta_value;
        return acc;
      }, {});
      return { ...post, meta: metaObj };
    });

    res.json(postsWithMeta);
  });

  app.get("/api/posts/:id", (req, res) => {
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id) as any;
    if (!post) return res.status(404).json({ error: "Post not found" });

    const meta = db.prepare("SELECT meta_key, meta_value FROM post_meta WHERE post_id = ?").all(post.id);
    const metaObj = meta.reduce((acc: any, m: any) => {
      acc[m.meta_key] = m.meta_value;
      return acc;
    }, {});

    res.json({ ...post, meta: metaObj });
  });

  // Stats for the dashboard
  app.get("/api/stats", (req, res) => {
    const logs = db.prepare("SELECT endpoint, COUNT(*) as views FROM api_logs GROUP BY endpoint ORDER BY views DESC LIMIT 5").all();
    res.json(logs);
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
