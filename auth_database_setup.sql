-- Complete Authentication and User Profile Setup for 3D Print Order System
-- SAFE VERSION: Handles existing policies and tables

-- ============================================================================
-- 1. CREATE PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  -- Address fields for delivery
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'UK',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. UPDATE ORDERS TABLE TO INCLUDE USER REFERENCES
-- ============================================================================

-- Add user_id column to link orders to authenticated users
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add customer information for guest orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) SETUP
-- ============================================================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on orders table 
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. PROFILES TABLE POLICIES (DROP AND RECREATE)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 5. ORDERS TABLE POLICIES (DROP AND RECREATE)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

-- Create policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    user_id = auth.uid() OR 
    (user_id IS NULL AND customer_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ))
  );

CREATE POLICY "Authenticated users can create orders" ON orders
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      user_id = auth.uid() OR user_id IS NULL
    )
  );

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND email LIKE '%@admin.%'
    )
  );

CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND email LIKE '%@admin.%'
    )
  );

-- ============================================================================
-- 6. TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update profile timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profile timestamp
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes on orders table
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status_user ON orders(status, user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Indexes on profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at DESC);

-- ============================================================================
-- 8. VIEW ORDER DETAILS WITH USER INFO
-- ============================================================================

-- Create a view that combines order and user information
CREATE OR REPLACE VIEW order_details AS
SELECT 
  o.*,
  p.full_name as customer_full_name,
  p.address_line_1,
  p.address_line_2,
  p.city,
  p.postal_code,
  p.country,
  CASE 
    WHEN o.user_id IS NOT NULL THEN 'authenticated'
    ELSE 'guest'
  END as order_type
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check if everything was created successfully
SELECT 'Setup completed successfully!' as message;