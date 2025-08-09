-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  store_type TEXT NOT NULL,
  cuisine TEXT[],
  categories TEXT[],
  address JSONB NOT NULL,
  coordinates JSONB NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  open_hours JSONB,
  rating FLOAT DEFAULT 0,
  total_ratings INT DEFAULT 0,
  price_range INT DEFAULT 1,
  image_url TEXT,
  cover_image_url TEXT,
  banner_images TEXT[],
  status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT false,
  delivery_fee NUMERIC(10, 2),
  minimum_order NUMERIC(10, 2) DEFAULT 0,
  delivery_time INTEGER,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  license_number TEXT,
  tax_id TEXT,
  social_media JSONB,
  special_offers TEXT[],
  tags TEXT[],
  return_policy TEXT,
  shipping_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on store_type for filtering
CREATE INDEX IF NOT EXISTS idx_stores_store_type ON stores(store_type);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);

-- Create index on owner_id for quick lookup of stores by owner
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);

-- Create index on cuisine for filtering restaurants
CREATE INDEX IF NOT EXISTS idx_stores_cuisine ON stores USING gin(cuisine);

-- Create index on categories for filtering other store types
CREATE INDEX IF NOT EXISTS idx_stores_categories ON stores USING gin(categories);

-- Create index on featured for showcasing featured stores
CREATE INDEX IF NOT EXISTS idx_stores_featured ON stores(featured);

-- Create products table for store inventory
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price NUMERIC(10, 2) NOT NULL,
  discounted_price NUMERIC(10, 2),
  image_url TEXT,
  additional_images TEXT[],
  sku TEXT,
  barcode TEXT,
  weight NUMERIC(10, 2),
  dimensions JSONB,
  brand TEXT,
  manufacturer TEXT,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  features TEXT[],
  ingredients TEXT[],
  nutritional_info JSONB,
  preparation_time INTEGER,
  spicy_level INTEGER,
  vegetarian BOOLEAN DEFAULT false,
  vegan BOOLEAN DEFAULT false,
  gluten_free BOOLEAN DEFAULT false,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  warranty TEXT,
  return_policy TEXT,
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on store_id for quick lookup of products by store
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);

-- Create index on category for filtering products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create index on subcategory for filtering products
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);

-- Create index on brand for filtering products
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Create index on tags for searching products
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);

-- Create index on available status for filtering out unavailable products
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

-- Create index on featured for showcasing featured products
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- Migrate data from restaurants table to stores table if restaurants table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'restaurants') THEN
    INSERT INTO stores (
      owner_id, name, description, store_type, cuisine, address, coordinates, 
      phone, email, website, open_hours, rating, total_ratings, price_range, 
      image_url, cover_image_url, status, is_active, delivery_fee, minimum_order, 
      delivery_time, featured, created_at, updated_at
    )
    SELECT 
      owner_id, name, description, 'restaurant', cuisine_type, address, coordinates, 
      phone, email, website, opening_hours, rating, rating_count, price_range, 
      image_url, cover_image_url, status, is_active, delivery_fee, minimum_order_amount, 
      estimated_delivery_time, featured, created_at, updated_at
    FROM restaurants;
    
    -- If menu_items table exists, migrate to products
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'menu_items') THEN
      INSERT INTO products (
        store_id, name, description, category, price, discounted_price, 
        image_url, ingredients, nutritional_info, spicy_level, vegetarian, 
        vegan, gluten_free, featured, available, preparation_time, created_at, updated_at
      )
      SELECT 
        (SELECT stores.id FROM stores JOIN restaurants ON restaurants.owner_id = stores.owner_id 
         WHERE restaurants.id = menu_items.restaurant_id LIMIT 1),
        name, description, category, price, discounted_price, 
        image_url, ingredients, nutrition_info, spicy_level, vegetarian, 
        vegan, gluten_free, featured, is_available, preparation_time, created_at, updated_at
      FROM menu_items;
    END IF;
  END IF;
END$$;

-- Update orders table if it exists to reference store_id instead of restaurant_id
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') 
     AND EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'restaurant_id') THEN
    
    -- Add store_id column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'store_id') THEN
      ALTER TABLE orders ADD COLUMN store_id UUID REFERENCES stores(id);
    END IF;
    
    -- Update store_id based on restaurant_id
    UPDATE orders o
    SET store_id = (
      SELECT s.id 
      FROM stores s
      JOIN restaurants r ON r.owner_id = s.owner_id
      WHERE r.id = o.restaurant_id
      LIMIT 1
    )
    WHERE o.restaurant_id IS NOT NULL;
    
    -- After migrating the data, you may want to drop the restaurant_id column or keep it for backward compatibility
    -- ALTER TABLE orders DROP COLUMN restaurant_id;
  END IF;
END$$;

-- Create a view for backward compatibility
CREATE OR REPLACE VIEW restaurants_view AS
SELECT 
  id, 
  owner_id, 
  name, 
  description, 
  cuisine as cuisine_type,
  address, 
  coordinates, 
  phone, 
  email, 
  website, 
  open_hours as opening_hours,
  rating, 
  total_ratings as rating_count, 
  price_range, 
  image_url, 
  cover_image_url, 
  status, 
  is_active, 
  delivery_fee, 
  minimum_order as minimum_order_amount, 
  delivery_time as estimated_delivery_time, 
  featured, 
  created_at, 
  updated_at
FROM stores
WHERE store_type = 'restaurant';

COMMENT ON VIEW restaurants_view IS 'View for backward compatibility with the old restaurants table';
