CREATE TABLE IF NOT EXISTS orders (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255)   NOT NULL,
    item_name     VARCHAR(255)   NOT NULL,
    amount        DECIMAL(10, 2) NOT NULL,
    status        VARCHAR(50)    NOT NULL DEFAULT 'PLACED',
    created_at    DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);
