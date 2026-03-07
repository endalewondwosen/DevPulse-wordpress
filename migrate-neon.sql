-- Database Migration Script for Neon PostgreSQL
-- This ensures all required columns exist in the tables

-- Add image_url column to posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE posts ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to posts table';
    END IF;
END $$;

-- Add status column to posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'status'
    ) THEN
        ALTER TABLE posts ADD COLUMN status TEXT DEFAULT 'publish';
        RAISE NOTICE 'Added status column to posts table';
    END IF;
END $$;

-- Add created_at column to posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE posts ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added created_at column to posts table';
    END IF;
END $$;

-- Check and create other tables if they don't exist
CREATE TABLE IF NOT EXISTS post_meta (
    id SERIAL PRIMARY KEY,
    post_id INTEGER,
    meta_key TEXT,
    meta_value TEXT
);

CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS api_logs (
    id SERIAL PRIMARY KEY,
    endpoint TEXT,
    method TEXT,
    post_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'post_meta' AND constraint_name = 'fk_post_meta_post_id'
    ) THEN
        ALTER TABLE post_meta ADD CONSTRAINT fk_post_meta_post_id 
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint to post_meta';
    END IF;
END $$;

RAISE NOTICE 'Migration completed successfully!';
