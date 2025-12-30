-- 🔧 MutuTech Fresh - Create Tables Only (Simple)
-- Run this in MutuTech Solutions Supabase Dashboard → SQL Editor
-- Project: https://yqvfcuwfusfoiggayrfm.supabase.co

-- 1. Create blog table
CREATE TABLE IF NOT EXISTS blog (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  image TEXT,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio(slug);
CREATE INDEX IF NOT EXISTS idx_products_id ON products(id);

-- 5. Verify tables creation
SELECT 'blog table created' as status, COUNT(*) as count FROM blog;
SELECT 'portfolio table created' as status, COUNT(*) as count FROM portfolio;
SELECT 'products table created' as status, COUNT(*) as count FROM products;

-- 6. Insert test data (optional)
INSERT INTO blog (id, title, slug, content, image, date) VALUES 
('blog-test-1', 'Welcome to MutuTech Solutions', 'welcome-mututech-solutions', 
'MutuTech Solutions provides professional IT services and technology solutions for modern businesses.', 
'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format', 
'30/12/2025')
ON CONFLICT (id) DO NOTHING;

INSERT INTO portfolio (id, title, slug, description, category, image) VALUES 
('portfolio-test-1', 'Web Development Project', 'web-development-project', 
'Professional web development solution for modern business needs', 'Web Development', 
'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&auto=format')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, price, features) VALUES 
('product-test-1', 'Basic Web Package', 'Rp 5.000.000', 
ARRAY['Responsive Design', 'Basic SEO', 'Mobile Friendly', '1 Year Support'])
ON CONFLICT (id) DO NOTHING;

-- 7. Final verification
SELECT 'MutuTech Fresh Tables Created Successfully!' as final_status;
SELECT 'Ready for admin panel testing' as next_step;
