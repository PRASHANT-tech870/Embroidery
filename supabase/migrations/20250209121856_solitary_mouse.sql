/*
  # Initial Schema Setup for Embroidery Website

  1. New Tables
    - users
      - Standard user information
      - Profile details
    - designs
      - Available embroidery designs
      - Price and details
    - orders
      - Customer orders
      - Order status tracking
    - order_items
      - Individual items in orders
    - messages
      - Customer support messages

  2. Security
    - RLS enabled on all tables
    - Policies for user access control
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  address text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Designs table
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  image_url text,
  category text,
  dimensions text,
  stitch_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view designs" ON designs
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify designs" ON designs
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  ));

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  status text DEFAULT 'pending',
  total_amount decimal,
  payment_status text DEFAULT 'pending',
  shipping_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  design_id uuid REFERENCES designs(id),
  quantity integer DEFAULT 1,
  price_at_time decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);