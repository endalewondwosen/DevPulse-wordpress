import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "devpulse-secret-key-123";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/enterprize-app?schema=public",
  ssl: process.env.NODE_ENV === "production" && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost") 
    ? { rejectUnauthorized: false } 
    : false
});

// Initialize Database (PostgreSQL CPTs and Meta)
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        type TEXT NOT NULL, -- 'project' or 'snippet'
        status TEXT DEFAULT 'publish',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS post_meta (
        id SERIAL PRIMARY KEY,
        post_id INTEGER,
        meta_key TEXT,
        meta_value TEXT,
        FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS api_logs (
        id SERIAL PRIMARY KEY,
        endpoint TEXT,
        method TEXT,
        post_id INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed data if empty
    const postCountResult = await pool.query("SELECT COUNT(*) FROM posts");
    const count = parseInt(postCountResult.rows[0].count);

    if (count === 0) {
      console.log("Seeding initial data...");
      const insertPostText = "INSERT INTO posts (title, content, type, status) VALUES ($1, $2, $3, $4) RETURNING id";
      const insertMetaText = "INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES ($1, $2, $3)";

      const res1 = await pool.query(insertPostText, ["Portfolio Website", "A high-performance portfolio built with React.", "project", "publish"]);
      const p1 = res1.rows[0].id;
      await pool.query(insertMetaText, [p1, "github_url", "https://github.com/user/portfolio"]);
      await pool.query(insertMetaText, [p1, "project_url", "https://portfolio-demo.com"]);
      await pool.query(insertMetaText, [p1, "tech_stack", "React, Tailwind, Vite"]);

      const res2 = await pool.query(insertPostText, ["E-commerce API", "Node.js backend for a modern store.", "project", "publish"]);
      const p2 = res2.rows[0].id;
      await pool.query(insertMetaText, [p2, "github_url", "https://github.com/user/shop-api"]);
      await pool.query(insertMetaText, [p2, "project_url", "https://api-docs.shop.com"]);
      await pool.query(insertMetaText, [p2, "tech_stack", "Node.js, Express, PostgreSQL"]);

      const res3 = await pool.query(insertPostText, ["React UseEffect Hook", "Common patterns for useEffect.", "snippet", "publish"]);
      const s1 = res3.rows[0].id;
      await pool.query(insertMetaText, [s1, "language", "typescript"]);

      // Private content
      const res4 = await pool.query(insertPostText, ["Secret Project X", "This is a private project only visible to authenticated developers.", "project", "private"]);
      const p3 = res4.rows[0].id;
      await pool.query(insertMetaText, [p3, "tech_stack", "Stealth, AI, Quantum"]);
    }
  } catch (err) {
    console.error("Database initialization failed", err);
  }
};

async function startServer() {
  const app = express();
  // Render injects its own PORT environment variable. We must bind to it.
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Request Logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
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

  // Login Route
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // Simple mock auth
    if (username === "admin" && password === "password") {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token });
    }
    res.status(401).json({ error: "Invalid credentials" });
  });

  // Logging Middleware (Requested functionality)
  app.use(async (req, res, next) => {
    if (req.path.startsWith('/api/posts/')) {
      const id = req.path.split('/').pop();
      if (id && !isNaN(Number(id))) {
        try {
          await pool.query(
            "INSERT INTO api_logs (endpoint, method, post_id) VALUES ($1, $2, $3)",
            [req.path, req.method, parseInt(id)]
          );
        } catch (e) {
          console.error("Failed to log API request", e);
        }
      }
    }
    next();
  });

  // Create Post Route (Authenticated)
  app.post("/api/posts", authenticateToken, async (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { title, content, type, status, meta } = req.body;
    
    if (!title || !type) {
      return res.status(400).json({ error: "Title and Type are required" });
    }

    try {
      const insertPostText = "INSERT INTO posts (title, content, type, status) VALUES ($1, $2, $3, $4) RETURNING id";
      const result = await pool.query(insertPostText, [title, content || "", type, status || "publish"]);
      const postId = result.rows[0].id;

      if (meta && typeof meta === 'object') {
        const insertMetaText = "INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES ($1, $2, $3)";
        for (const [key, value] of Object.entries(meta)) {
          if (value !== undefined && value !== null) {
            await pool.query(insertMetaText, [postId, key, String(value)]);
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
    const { title, content, type, status, meta } = req.body;

    try {
      const updatePostText = "UPDATE posts SET title = $1, content = $2, type = $3, status = $4 WHERE id = $5 RETURNING id";
      const result = await pool.query(updatePostText, [title, content || "", type, status || "publish", id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      await pool.query("DELETE FROM post_meta WHERE post_id = $1", [id]);
      if (meta && typeof meta === 'object') {
        const insertMetaText = "INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES ($1, $2, $3)";
        for (const [key, value] of Object.entries(meta)) {
          if (value !== undefined && value !== null && value !== "") {
            await pool.query(insertMetaText, [id, key, String(value)]);
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
      const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING id", [id]);

      if (result.rowCount === 0) {
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

      let query = "SELECT * FROM posts WHERE type = $1 AND (status = 'publish'";
      let params: any[] = [type];
      let paramCount = 2; // Next param index

      if (user) {
        query += " OR status = 'private'";
      }
      query += ")";

      if (search) {
        query += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount + 1})`;
        params.push(`%${search}%`, `%${search}%`);
        paramCount += 2;
      }

      const postResults = await pool.query(query + " ORDER BY id ASC", params);
      const posts = postResults.rows;
      
      const postsWithMeta = await Promise.all(posts.map(async (post: any) => {
        const metaResults = await pool.query("SELECT meta_key, meta_value FROM post_meta WHERE post_id = $1", [post.id]);
        const metaObj = metaResults.rows.reduce((acc: any, m: any) => {
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
      const postResult = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
      const post = postResult.rows[0];
      
      if (!post) return res.status(404).json({ error: "Post not found" });

      const metaResult = await pool.query("SELECT meta_key, meta_value FROM post_meta WHERE post_id = $1", [post.id]);
      const metaObj = metaResult.rows.reduce((acc: any, m: any) => {
        acc[m.meta_key] = m.meta_value;
        return acc;
      }, {});

      res.json({ ...post, meta: metaObj });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Stats for the dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const logsResult = await pool.query("SELECT endpoint, COUNT(*) as views FROM api_logs GROUP BY endpoint ORDER BY views DESC LIMIT 5");
      res.json(logsResult.rows || []);
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

  // Initialize DB before listening
  await initDb();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DevPulse Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.dir);
