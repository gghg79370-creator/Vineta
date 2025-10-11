-- =============================================
-- Vineta E-commerce Database Schema
-- =============================================
-- This schema is designed for Supabase PostgreSQL
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    price TEXT NOT NULL,
    old_price TEXT,
    image TEXT NOT NULL,
    images TEXT[],
    description TEXT,
    colors TEXT[] NOT NULL DEFAULT '{}',
    sizes TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL CHECK (category IN ('women', 'men')),
    badges JSONB,
    rating NUMERIC(2, 1),
    review_count INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    availability TEXT DEFAULT 'متوفر',
    items_left INTEGER,
    sold_in_24h INTEGER,
    viewing_now INTEGER,
    sale_end_date TIMESTAMP WITH TIME ZONE,
    specifications TEXT[],
    material_composition TEXT,
    care_instructions TEXT[],
    weight NUMERIC(10, 2),
    weight_unit TEXT CHECK (weight_unit IN ('kg', 'g')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    price TEXT NOT NULL,
    old_price TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, size, color)
);

-- =============================================
-- CUSTOMERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'Customer' CHECK (role IN ('Administrator', 'Editor', 'Support', 'Customer')),
    addresses JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'Processing' CHECK (status IN ('Processing', 'On the way', 'Delivered', 'Cancelled')),
    total TEXT NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    payment_method TEXT,
    tracking_number TEXT,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    tracking_history JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    image TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CART TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    selected_size TEXT NOT NULL,
    selected_color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, selected_size, selected_color)
);

-- =============================================
-- WISHLIST TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS wishlist (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    note TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Visible' CHECK (status IN ('Visible', 'Hidden')),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BLOG POSTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Published', 'Draft')),
    content TEXT NOT NULL,
    featured_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DISCOUNTS/COUPONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS discounts (
    id BIGSERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Inactive')),
    min_purchase NUMERIC(10, 2),
    max_discount NUMERIC(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ANNOUNCEMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- HERO SLIDES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS hero_slides (
    id BIGSERIAL PRIMARY KEY,
    bg_image TEXT NOT NULL,
    bg_video TEXT,
    bg_video_type TEXT,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT,
    button_text TEXT NOT NULL,
    page TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Visible' CHECK (status IN ('Visible', 'Hidden')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SALE CAMPAIGNS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS sale_campaigns (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    discount_text TEXT NOT NULL,
    coupon_code TEXT,
    button_text TEXT NOT NULL,
    image TEXT NOT NULL,
    sale_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    page TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONTACT MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Unread' CHECK (status IN ('Unread', 'Read', 'Replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Subscribed' CHECK (status IN ('Subscribed', 'Unsubscribed')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES for better performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts(code);

-- =============================================
-- TRIGGERS for updated_at timestamps
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at BEFORE UPDATE ON discounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sale_campaigns_updated_at BEFORE UPDATE ON sale_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, only admins can write
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

CREATE POLICY "Only admins can update products" ON products
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

CREATE POLICY "Only admins can delete products" ON products
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

-- Product Variants: Follow product policies
CREATE POLICY "Product variants are viewable by everyone" ON product_variants
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage variants" ON product_variants
    FOR ALL USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

-- Customers: Users can view/update their own data, admins can view all
CREATE POLICY "Users can view their own data" ON customers
    FOR SELECT USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM customers WHERE id = auth.uid() AND role IN ('Administrator', 'Editor', 'Support')
    ));

CREATE POLICY "Users can update their own data" ON customers
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can create customer profile on signup" ON customers
    FOR INSERT WITH CHECK (true);

-- Orders: Users can view their own orders, admins can view all
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM customers WHERE id = auth.uid() AND role IN ('Administrator', 'Editor', 'Support')
    ));

CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders" ON orders
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role IN ('Administrator', 'Editor'))
    );

-- Reviews: Everyone can read approved, users can write, admins can manage
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
    FOR SELECT USING (status = 'Approved' OR auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM customers WHERE id = auth.uid() AND role IN ('Administrator', 'Editor')
    ));

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM customers WHERE id = auth.uid() AND role IN ('Administrator', 'Editor')
    ));

-- Cart: Users can manage their own cart
CREATE POLICY "Users can view their own cart" ON cart
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart" ON cart
    FOR ALL USING (auth.uid() = user_id);

-- Wishlist: Users can manage their own wishlist
CREATE POLICY "Users can view their own wishlist" ON wishlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist" ON wishlist
    FOR ALL USING (auth.uid() = user_id);

-- Categories: Everyone can read, only admins can write
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

-- Blog Posts: Everyone can read published, admins can manage
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
    FOR SELECT USING (status = 'Published' OR EXISTS (
        SELECT 1 FROM customers WHERE id = auth.uid() AND role IN ('Administrator', 'Editor')
    ));

CREATE POLICY "Only admins can manage blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role IN ('Administrator', 'Editor'))
    );

-- Discounts: Everyone can read active, only admins can write
CREATE POLICY "Active discounts are viewable by everyone" ON discounts
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage discounts" ON discounts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

-- Announcements: Everyone can read active, only admins can write
CREATE POLICY "Active announcements are viewable by everyone" ON announcements
    FOR SELECT USING (status = 'Active' OR EXISTS (
        SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

CREATE POLICY "Only admins can manage announcements" ON announcements
    FOR ALL USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

-- Hero Slides: Everyone can read visible, only admins can write
CREATE POLICY "Visible hero slides are viewable by everyone" ON hero_slides
    FOR SELECT USING (status = 'Visible' OR EXISTS (
        SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

CREATE POLICY "Only admins can manage hero slides" ON hero_slides
    FOR ALL USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

-- Sale Campaigns: Everyone can read active, only admins can write
CREATE POLICY "Active sale campaigns are viewable by everyone" ON sale_campaigns
    FOR SELECT USING (status = 'Active' OR EXISTS (
        SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

CREATE POLICY "Only admins can manage sale campaigns" ON sale_campaigns
    FOR ALL USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

-- Contact Messages: Only admins can view
CREATE POLICY "Only admins can view contact messages" ON contact_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role IN ('Administrator', 'Support'))
    );

CREATE POLICY "Anyone can create contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Newsletter Subscribers: Anyone can subscribe
CREATE POLICY "Newsletter subscribers viewable by admins" ON newsletter_subscribers
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM customers WHERE id = auth.uid() AND role = 'Administrator')
    );

CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Run these in the Supabase Storage settings or via SQL:
-- 
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('products', 'products', true);
--
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('blog', 'blog', true);
--
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('avatars', 'avatars', true);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to get product with average rating
CREATE OR REPLACE FUNCTION get_product_with_rating(product_id_param BIGINT)
RETURNS TABLE (
    product_data JSONB,
    avg_rating NUMERIC,
    review_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        row_to_json(p)::JSONB as product_data,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'Approved'
    WHERE p.id = product_id_param
    GROUP BY p.id;
END;
$$ LANGUAGE plpgsql;

-- Function to update product review count and rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE product_id = NEW.product_id AND status = 'Approved'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = NEW.product_id AND status = 'Approved'
        )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_on_review AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();
