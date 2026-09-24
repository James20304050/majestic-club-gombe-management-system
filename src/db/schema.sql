-- =========================================================================
-- MAJESTIC CLUB GOMBE ENTERTAINMENT & HOSPITALITY ENTERPRISE SYSTEM
-- PRODUCTION POSTGRESQL / SUPABASE RELATIONAL DATABASE SCHEMA
-- Gombe State, Nigeria
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (id, name, description) VALUES
    ('owner', 'Owner', 'Full executive rights, financial oversight, high-level reports'),
    ('board_director', 'Board / Director', 'High-level executive reporting, financial auditing'),
    ('general_manager', 'General Manager', 'Complete operational oversight, approvals, stock overrides'),
    ('stock_manager', 'Stock Manager', 'Main warehouse stock, transfers, supplier receipts'),
    ('bar_manager', 'Bar Manager', 'Bar locations, transfers, wastage approvals, reconciliations'),
    ('sales_staff', 'Sales Staff', 'Dedicated refrigerator sales, POS register, closing stock counts'),
    ('snooker_manager', 'Snooker Manager', 'Snooker & pool table bookings, rates, tournament management'),
    ('auditor', 'Auditor', 'Read-only access to transactions, variance reports, and audit logs'),
    ('system_admin', 'System Administrator', 'User management, configuration, database integrity')
ON CONFLICT (id) DO NOTHING;

-- 2. USERS & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id VARCHAR(50) REFERENCES roles(id) ON DELETE RESTRICT,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. LOCATIONS TABLE (Main Store, Bars, Floors)
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('main_store', 'main_bar', 'club_bar', 'vip_bar', 'refrigerator')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO locations (id, name, code, type, description) VALUES
    ('loc_main_store', 'Main Central Store', 'LOC-STORE', 'main_store', 'Central bulk warehouse for beverage receiving'),
    ('loc_main_bar', 'Main Hall Bar', 'LOC-MAINBAR', 'main_bar', 'Ground floor central bar station'),
    ('loc_club_bar', 'Club Floor Bar', 'LOC-CLUBBAR', 'club_bar', 'Nightclub active dance-floor bar service'),
    ('loc_vip_bar', 'VIP Lounge Bar', 'LOC-VIPBAR', 'vip_bar', 'Exclusive mezzanine VIP bar')
ON CONFLICT (id) DO NOTHING;

-- 4. REFRIGERATORS TABLE (20 Dedicated Refrigerators FR-001 to FR-020)
CREATE TABLE IF NOT EXISTS refrigerators (
    id VARCHAR(20) PRIMARY KEY, -- FR-001 ... FR-020
    name VARCHAR(100) NOT NULL,
    location_id VARCHAR(50) REFERENCES locations(id) ON DELETE SET NULL,
    floor_zone VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 500 CHECK (capacity > 0),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline')),
    current_temperature NUMERIC(4, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STAFF TABLE
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    staff_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. SG-001 to SG-020
    full_name VARCHAR(255) NOT NULL,
    role_id VARCHAR(50) REFERENCES roles(id),
    assigned_refrigerator_id VARCHAR(20) REFERENCES refrigerators(id) ON DELETE SET NULL,
    phone VARCHAR(50) NOT NULL,
    national_id VARCHAR(50),
    hired_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PRODUCT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS product_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO product_categories (id, name, code, description) VALUES
    ('BEER', 'Beer & Stout', 'CAT-BEER', 'Premium Nigerian and imported lagers and stouts'),
    ('WATER', 'Table & Bottled Water', 'CAT-WATR', 'Spring and purified table water products'),
    ('SOFT DRINKS', 'Soft Drinks & Sodas', 'CAT-SOFT', 'Carbonated soft drinks and energy beverages'),
    ('WINE', 'Wines & Champagnes', 'CAT-WINE', 'Red, white, sparkling and fine champagnes'),
    ('SPIRITS', 'Spirits & Whiskeys', 'CAT-SPRT', 'Cognac, vodka, rum, gin, tequila and whiskey'),
    ('OTHER DRINKS', 'Other Beverages', 'CAT-OTHR', 'Cocktails, mixers and non-alcoholic specialities')
ON CONFLICT (id) DO NOTHING;

-- 7. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. LIFE-001, HEIN-001
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(50) REFERENCES product_categories(id) ON DELETE RESTRICT,
    brand VARCHAR(100) NOT NULL,
    unit VARCHAR(50) DEFAULT 'Bottle',
    purchase_price NUMERIC(12, 2) NOT NULL CHECK (purchase_price >= 0),
    selling_price NUMERIC(12, 2) NOT NULL CHECK (selling_price >= 0),
    min_stock_level INT DEFAULT 20 CHECK (min_stock_level >= 0),
    max_stock_level INT DEFAULT 500 CHECK (max_stock_level >= min_stock_level),
    qr_code VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    image_url TEXT,
    volume VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. STOCK BALANCES TABLE (Real-time balances across warehouse, bars & refrigerators)
CREATE TABLE IF NOT EXISTS stock_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id VARCHAR(50) NOT NULL, -- can be location_id or refrigerator_id
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_non_negative_stock CHECK (quantity >= 0),
    UNIQUE(location_id, product_id)
);

-- 9. PERMANENT STOCK TRANSACTIONS LEDGER (Immutable audit of all stock movements)
CREATE TABLE IF NOT EXISTS stock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    movement_type VARCHAR(50) NOT NULL CHECK (
        movement_type IN (
            'OPENING_STOCK', 
            'STOCK_RECEIVED', 
            'STOCK_TRANSFER', 
            'SALE', 
            'RETURN', 
            'WASTAGE', 
            'COMPLIMENTARY', 
            'ADJUSTMENT', 
            'CLOSING_COUNT'
        )
    ),
    location_id VARCHAR(50) NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL, -- negative for sales/transfer out/wastage, positive for receipt/transfer in
    unit_price NUMERIC(12, 2) DEFAULT 0,
    total_price NUMERIC(12, 2) DEFAULT 0,
    reason TEXT,
    notes TEXT,
    batch_reference VARCHAR(100),
    ip_device VARCHAR(100)
);

-- 10. STOCK TRANSFERS TABLE
CREATE TABLE IF NOT EXISTS stock_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    from_location_id VARCHAR(50) NOT NULL,
    from_location_name VARCHAR(100) NOT NULL,
    to_location_id VARCHAR(50) NOT NULL,
    to_location_name VARCHAR(100) NOT NULL,
    authorized_by UUID REFERENCES users(id),
    received_by UUID REFERENCES users(id),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'received', 'cancelled')),
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    received_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- 11. STOCK TRANSFER ITEMS
CREATE TABLE IF NOT EXISTS stock_transfer_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_id UUID REFERENCES stock_transfers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
);

-- 12. SALES TABLE
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    staff_id UUID REFERENCES staff(id),
    staff_name VARCHAR(255) NOT NULL,
    refrigerator_id VARCHAR(20) REFERENCES refrigerators(id),
    table_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255),
    total_quantity INT NOT NULL CHECK (total_quantity > 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('CASH', 'POS_TRANSFER', 'CARD', 'VIP_TAB')),
    payment_reference VARCHAR(100),
    payment_status VARCHAR(30) DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date DATE DEFAULT CURRENT_DATE,
    notes TEXT
);

-- 13. SALE ITEMS TABLE
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category_id VARCHAR(50) REFERENCES product_categories(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0)
);

-- 14. END-OF-DAY PHYSICAL STOCK COUNTS TABLE
CREATE TABLE IF NOT EXISTS stock_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    refrigerator_id VARCHAR(20) REFERENCES refrigerators(id),
    staff_id UUID REFERENCES staff(id),
    staff_name VARCHAR(255) NOT NULL,
    total_expected INT NOT NULL,
    total_physical INT NOT NULL,
    total_variance INT NOT NULL, -- physical - expected
    status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    manager_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. STOCK COUNT ITEMS TABLE
CREATE TABLE IF NOT EXISTS stock_count_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    count_id UUID REFERENCES stock_counts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    opening_stock INT NOT NULL DEFAULT 0,
    stock_received INT NOT NULL DEFAULT 0,
    stock_transferred INT NOT NULL DEFAULT 0,
    sales INT NOT NULL DEFAULT 0,
    wastage INT NOT NULL DEFAULT 0,
    complimentary INT NOT NULL DEFAULT 0,
    expected_closing_stock INT NOT NULL,
    physical_closing_stock INT NOT NULL,
    variance INT NOT NULL, -- physical - expected
    unit_price NUMERIC(12, 2) NOT NULL,
    variance_value NUMERIC(12, 2) NOT NULL,
    notes TEXT
);

-- 16. WASTAGE TABLE
CREATE TABLE IF NOT EXISTS wastage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    staff_id UUID REFERENCES staff(id),
    staff_name VARCHAR(255) NOT NULL,
    location_id VARCHAR(50) NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    total_items INT NOT NULL CHECK (total_items > 0),
    total_loss_value NUMERIC(12, 2) NOT NULL CHECK (total_loss_value >= 0),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. WASTAGE ITEMS TABLE
CREATE TABLE IF NOT EXISTS wastage_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wastage_id UUID REFERENCES wastage(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    total_loss NUMERIC(12, 2) NOT NULL,
    reason VARCHAR(100) NOT NULL CHECK (
        reason IN ('Broken bottle', 'Damaged product', 'Spoiled product', 'Spillage', 'Other approved reason')
    ),
    notes TEXT
);

-- 18. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    membership_tier VARCHAR(50) DEFAULT 'Regular', -- Regular, Silver, Gold, Platinum VIP
    total_visits INT DEFAULT 1,
    total_spend NUMERIC(14, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. PAYMENTS TABLE (Nigeria Paystack Ready)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    gateway_reference VARCHAR(255), -- Paystack ref
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    channel VARCHAR(50) DEFAULT 'pos' CHECK (channel IN ('cash', 'pos', 'card', 'bank_transfer', 'paystack_online')),
    purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('sale', 'snooker_booking', 'vip_booking', 'event_booking', 'tab_settlement')),
    status VARCHAR(30) DEFAULT 'successful' CHECK (status IN ('successful', 'pending', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. SNOOKER TABLES
CREATE TABLE IF NOT EXISTS snooker_tables (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Snooker Table 01, Pool Table 01
    type VARCHAR(30) NOT NULL CHECK (type IN ('snooker', 'pool')),
    hourly_price NUMERIC(10, 2) NOT NULL DEFAULT 3000 CHECK (hourly_price > 0),
    status VARCHAR(30) DEFAULT 'available' CHECK (status IN ('available', 'in_play', 'reserved', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO snooker_tables (id, name, type, hourly_price, status) VALUES
    ('snooker_01', 'Championship Snooker Table 01', 'snooker', 5000.00, 'available'),
    ('snooker_02', 'Championship Snooker Table 02', 'snooker', 5000.00, 'available'),
    ('pool_01', 'American Pool Table 01', 'pool', 3000.00, 'available'),
    ('pool_02', 'American Pool Table 02', 'pool', 3000.00, 'available')
ON CONFLICT (id) DO NOTHING;

-- 21. SNOOKER BOOKINGS
CREATE TABLE IF NOT EXISTS snooker_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    table_id VARCHAR(50) REFERENCES snooker_tables(id),
    table_name VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    duration_hours NUMERIC(4, 1) NOT NULL CHECK (duration_hours > 0),
    number_of_players INT DEFAULT 2,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'DEPOSIT_PAID')),
    status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. VIP & EVENT BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS event_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('VIP_TABLE', 'BIRTHDAY_PARTY', 'PRIVATE_EVENT', 'CORPORATE_EVENT', 'CLUB_EVENT')),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    event_date DATE NOT NULL,
    event_time VARCHAR(50) NOT NULL,
    package VARCHAR(100) NOT NULL,
    number_of_people INT NOT NULL CHECK (number_of_people > 0),
    table_area VARCHAR(100),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    deposit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'DEPOSIT_PAID', 'PENDING')),
    status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_review', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. AUDIT LOGS (Immutable Activity Log)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action TEXT NOT NULL,
    product VARCHAR(255),
    quantity INT,
    location VARCHAR(100),
    transaction_reference VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    ip_device VARCHAR(100) DEFAULT '127.0.0.1 (Web Portal)'
);

-- INDEXES FOR MAXIMUM QUERY EFFICIENCY
CREATE INDEX IF NOT EXISTS idx_stock_trans_date ON stock_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_stock_trans_loc ON stock_transactions(location_id);
CREATE INDEX IF NOT EXISTS idx_stock_trans_prod ON stock_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_staff ON sales(staff_id);
CREATE INDEX IF NOT EXISTS idx_sales_fridge ON sales(refrigerator_id);
CREATE INDEX IF NOT EXISTS idx_counts_date ON stock_counts(date);
CREATE INDEX IF NOT EXISTS idx_counts_fridge ON stock_counts(refrigerator_id);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(timestamp);
