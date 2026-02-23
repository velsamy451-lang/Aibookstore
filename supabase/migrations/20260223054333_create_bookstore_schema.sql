/*
  # Create Online Book Store Schema

  ## Overview
  This migration sets up the database schema for a modern online book store application with categories and books.

  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text, not null) - Category name (e.g., "Fiction", "Science", "Self-Help")
  - `slug` (text, unique, not null) - URL-friendly version of the name
  - `created_at` (timestamptz) - Timestamp when category was created
  
  ### `books`
  - `id` (uuid, primary key) - Unique identifier for each book
  - `title` (text, not null) - Book title
  - `author` (text, not null) - Book author
  - `description` (text) - Book description/synopsis
  - `price` (decimal, not null) - Book price
  - `image_url` (text) - URL to book cover image
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `isbn` (text) - ISBN number
  - `rating` (decimal) - Average rating (0-5)
  - `tags` (text[]) - Array of tags for better search and recommendations
  - `created_at` (timestamptz) - Timestamp when book was added
  
  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Allow public read access to categories and books (for browsing)
  - No write access needed for this demo (books managed via admin)
  
  ## Notes
  1. All tables have RLS enabled for security
  2. Public read-only policies allow anyone to browse the store
  3. Tags array enables AI-powered recommendations
  4. Decimal type for price ensures accurate currency handling
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  isbn text,
  rating decimal(2,1) DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view books"
  ON books FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON books USING gin(to_tsvector('english', author));
CREATE INDEX IF NOT EXISTS idx_books_tags ON books USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);