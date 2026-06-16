-- ============================================================
-- Online Food Order Processing System - Full Schema Setup
-- Run this in MySQL Workbench or MySQL CLI
-- ============================================================

-- ============================================================
-- 1. ORDER_DB  (used by order-service on port 8081)
-- ============================================================
CREATE DATABASE IF NOT EXISTS order_db;
USE order_db;

CREATE TABLE IF NOT EXISTS orders (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    item_name     VARCHAR(255) NOT NULL,
    amount        DECIMAL(10, 2) NOT NULL,
    status        VARCHAR(50)  NOT NULL DEFAULT 'PLACED',
    created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

-- ============================================================
-- 2. PAYMENT_DB  (used by payment-service)
-- ============================================================
CREATE DATABASE IF NOT EXISTS payment_db;
USE payment_db;

CREATE TABLE IF NOT EXISTS payments (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id       BIGINT       NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50)  NOT NULL,
    created_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

-- ============================================================
-- 3. KITCHEN_DB  (used by kitchen-service)
-- ============================================================
CREATE DATABASE IF NOT EXISTS kitchen_db;
USE kitchen_db;

CREATE TABLE IF NOT EXISTS kitchen_tickets (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT      NOT NULL,
    status      VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    prepared_at DATETIME(6) NULL
);

-- ============================================================
-- 4. DELIVERY_DB  (used by delivery-service on port 8084)
-- ============================================================
CREATE DATABASE IF NOT EXISTS delivery_db;
USE delivery_db;

CREATE TABLE IF NOT EXISTS bank_accounts (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(255),
    ifsc_code      VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS wallets (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    balance         DOUBLE NOT NULL DEFAULT 0.0,
    bank_account_id BIGINT NULL,
    CONSTRAINT fk_wallet_bank_account FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id)
);

CREATE TABLE IF NOT EXISTS delivery_partners (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255),
    phone         VARCHAR(50),
    is_online     BIT(1)  NOT NULL DEFAULT 0,
    current_store VARCHAR(255),
    wallet_id     BIGINT  NULL,
    CONSTRAINT fk_partner_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);

CREATE TABLE IF NOT EXISTS deliveries (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id            BIGINT      NOT NULL,
    driver_name         VARCHAR(255),
    status              VARCHAR(50),
    delivery_partner_id BIGINT,
    pickup_time         DATETIME(6) NULL,
    arrived_time        DATETIME(6) NULL,
    delivered_at        DATETIME(6) NULL,
    cancel_reason       VARCHAR(500)
);

-- ============================================================
-- Verify: Show all created tables
-- ============================================================
SELECT 'order_db.orders'             AS `Table`, COUNT(*) AS `Rows` FROM order_db.orders
UNION ALL
SELECT 'payment_db.payments'         AS `Table`, COUNT(*) AS `Rows` FROM payment_db.payments
UNION ALL
SELECT 'kitchen_db.kitchen_tickets'  AS `Table`, COUNT(*) AS `Rows` FROM kitchen_db.kitchen_tickets
UNION ALL
SELECT 'delivery_db.deliveries'      AS `Table`, COUNT(*) AS `Rows` FROM delivery_db.deliveries
UNION ALL
SELECT 'delivery_db.delivery_partners' AS `Table`, COUNT(*) AS `Rows` FROM delivery_db.delivery_partners
UNION ALL
SELECT 'delivery_db.wallets'         AS `Table`, COUNT(*) AS `Rows` FROM delivery_db.wallets
UNION ALL
SELECT 'delivery_db.bank_accounts'   AS `Table`, COUNT(*) AS `Rows` FROM delivery_db.bank_accounts;
