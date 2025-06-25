-- Migration script for dual printer support (FDM and Resin)
-- Run this in your Supabase SQL Editor

-- Add new columns for printer type support
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS printer_type TEXT CHECK (printer_type IN ('fdm', 'resin')) DEFAULT 'fdm',
ADD COLUMN IF NOT EXISTS material_type TEXT DEFAULT 'PLA',
ADD COLUMN IF NOT EXISTS estimated_print_time_resin FLOAT,
ADD COLUMN IF NOT EXISTS price_fdm FLOAT,
ADD COLUMN IF NOT EXISTS price_resin FLOAT;

-- Update existing records to have fdm as default printer type
UPDATE orders SET printer_type = 'fdm' WHERE printer_type IS NULL;

-- Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_printer_type ON orders(printer_type);
CREATE INDEX IF NOT EXISTS idx_orders_status_printer_type ON orders(status, printer_type);

-- Display the updated table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position; 