-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Raw Materials', 'Basic materials used in production'),
('Electronics', 'Electronic components and devices'),
('Furniture', 'Office and warehouse furniture'),
('Packaging', 'Boxes, tape, and packing materials')
ON CONFLICT (name) DO NOTHING;

-- Insert Warehouses
INSERT INTO warehouses (name, location, capacity, active) VALUES
('Main Warehouse', 'New York, NY', 10000, true),
('Warehouse 2', 'Newark, NJ', 5000, true);

-- Insert Locations
INSERT INTO locations (warehouse_id, code, name) VALUES
(1, 'MAIN-RACK-A', 'Rack A'),
(1, 'MAIN-RACK-B', 'Rack B'),
(2, 'W2-PROD-FLR', 'Production Floor'),
(2, 'W2-SEC-1', 'Section 1');

-- Insert Products
INSERT INTO products (sku, name, description, category_id, price, reorder_point) VALUES
('RM-001', 'Steel Rods', '10mm steel rods for construction', 1, 15.50, 100),
('RM-002', 'Aluminum Sheets', '5mm aluminum sheets', 1, 45.00, 50),
('EL-001', 'Microcontroller Board', 'Development board v2', 2, 25.00, 20),
('EL-002', '10K Resistors Pack', 'Pack of 100 10K ohm resistors', 2, 5.00, 200),
('FN-001', 'Office Chair', 'Ergonomic office chair', 3, 120.00, 10),
('FN-002', 'Standing Desk', 'Adjustable standing desk', 3, 250.00, 5),
('PK-001', 'Cardboard Boxes (Med)', 'Medium sized shipping boxes', 4, 1.20, 500),
('PK-002', 'Packing Tape', 'Heavy duty clear packing tape', 4, 3.50, 100)
ON CONFLICT (sku) DO NOTHING;

-- Insert Stock Levels
INSERT INTO stock_levels (product_id, location_id, quantity) VALUES
(1, 1, 150),  -- RM-001 at Rack A (Above reorder 100)
(1, 2, 50),   -- RM-001 at Rack B (Total 200 > 100)
(2, 1, 40),   -- RM-002 at Rack A (Below reorder 50) -> Low Stock
(3, 3, 0),    -- EL-001 at Prod Floor (Zero) -> Out of Stock
(4, 4, 500),  -- EL-002 at Section 1 (Above reorder 200)
(5, 1, 5),    -- FN-001 at Rack A (Below reorder 10) -> Low Stock
(6, 2, 15),   -- FN-002 at Rack B (Above reorder 5)
(7, 4, 1000), -- PK-001 at Section 1 (Above reorder 500)
(8, 1, 90)    -- PK-002 at Rack A (Below reorder 100) -> Low Stock
ON CONFLICT (product_id, location_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- Insert Receipts
INSERT INTO receipts (receipt_number, supplier, status, date, created_by) VALUES
('REC-1001', 'ABC Steel', 'Done', '2026-09-20', 1),
('REC-1002', 'Global Metals', 'Done', '2026-09-21', 1),
('REC-1003', 'Office Supplies Inc', 'Draft', '2026-09-25', 1)
ON CONFLICT (receipt_number) DO NOTHING;

-- Insert Receipt Lines (assumes receipt IDs are 1, 2, 3)
INSERT INTO receipt_lines (receipt_id, product_id, location_id, quantity) VALUES
(1, 1, 1, 50),
(1, 2, 1, 40),
(2, 3, 3, 20),
(3, 5, 2, 10);

-- Insert Ledger Entries for Receipts
INSERT INTO stock_ledger (entry_type, product_id, to_location_id, qty_delta, ref_type, ref_id, user_id, created_at) VALUES
('receipt', 1, 1, 50, 'receipt', 'REC-1001', 1, '2026-09-20 10:00:00'),
('receipt', 2, 1, 40, 'receipt', 'REC-1001', 1, '2026-09-20 10:05:00'),
('receipt', 3, 3, 20, 'receipt', 'REC-1002', 1, '2026-09-21 11:00:00');

-- Apply Receipt Stock Changes
UPDATE stock_levels SET quantity = quantity + 50 WHERE product_id = 1 AND location_id = 1;
UPDATE stock_levels SET quantity = quantity + 40 WHERE product_id = 2 AND location_id = 1;
INSERT INTO stock_levels (product_id, location_id, quantity) VALUES (3, 3, 20) ON CONFLICT (product_id, location_id) DO UPDATE SET quantity = stock_levels.quantity + 20;

-- Insert Deliveries
INSERT INTO delivery_orders (order_number, customer, status, date, created_by) VALUES
('DEL-1001', 'BuildCo Construction', 'Done', '2026-09-22', 1),
('DEL-1002', 'Retail Partners LLC', 'Ready', '2026-09-24', 1),
('DEL-1003', 'Direct Client', 'Draft', '2026-09-26', 1)
ON CONFLICT (order_number) DO NOTHING;

-- Insert Delivery Lines (assumes delivery IDs are 1, 2, 3)
INSERT INTO delivery_lines (delivery_id, product_id, location_id, quantity) VALUES
(1, 1, 1, 10),
(1, 7, 4, 100),
(2, 6, 2, 5),
(3, 2, 1, 10);

-- Insert Ledger Entries for Deliveries
INSERT INTO stock_ledger (entry_type, product_id, from_location_id, qty_delta, ref_type, ref_id, user_id, created_at) VALUES
('delivery', 1, 1, -10, 'delivery_order', 'DEL-1001', 1, '2026-09-22 14:00:00'),
('delivery', 7, 4, -100, 'delivery_order', 'DEL-1001', 1, '2026-09-22 14:05:00');

-- Apply Delivery Stock Changes
UPDATE stock_levels SET quantity = quantity - 10 WHERE product_id = 1 AND location_id = 1;
UPDATE stock_levels SET quantity = quantity - 100 WHERE product_id = 7 AND location_id = 4;

-- Insert Internal Transfers
INSERT INTO internal_transfers (transfer_number, product_id, from_location_id, to_location_id, quantity, status, date, created_by) VALUES
('TRF-1001', 4, 4, 3, 50, 'Done', '2026-09-23', 1),
('TRF-1002', 8, 1, 2, 10, 'Draft', '2026-09-25', 1)
ON CONFLICT (transfer_number) DO NOTHING;

-- Insert Ledger Entries for Transfers
INSERT INTO stock_ledger (entry_type, product_id, from_location_id, to_location_id, qty_delta, ref_type, ref_id, user_id, created_at) VALUES
('transfer', 4, 4, 3, 50, 'internal_transfer', 'TRF-1001', 1, '2026-09-23 09:30:00');

-- Apply Transfer Stock Changes
UPDATE stock_levels SET quantity = quantity - 50 WHERE product_id = 4 AND location_id = 4;
INSERT INTO stock_levels (product_id, location_id, quantity) VALUES (4, 3, 50) ON CONFLICT (product_id, location_id) DO UPDATE SET quantity = stock_levels.quantity + 50;


-- Insert Adjustments
INSERT INTO stock_adjustments (adjustment_number, product_id, location_id, recorded_qty, counted_qty, delta, status, reason, date, created_by) VALUES
('ADJ-1001', 5, 1, 6, 5, -1, 'Done', 'Damaged during forklift operation', '2026-09-24', 1),
('ADJ-1002', 2, 1, 35, 40, 5, 'Draft', 'Found extra stock in corner', '2026-09-26', 1)
ON CONFLICT (adjustment_number) DO NOTHING;

-- Insert Ledger Entries for Adjustments
INSERT INTO stock_ledger (entry_type, product_id, from_location_id, qty_delta, ref_type, ref_id, user_id, created_at) VALUES
('adjustment', 5, 1, -1, 'stock_adjustment', 'ADJ-1001', 1, '2026-09-24 16:45:00');

-- Apply Adjustment Stock Changes
UPDATE stock_levels SET quantity = quantity - 1 WHERE product_id = 5 AND location_id = 1;
