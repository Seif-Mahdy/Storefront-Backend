/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    price FLOAT,
    CONSTRAINT product_name_unique UNIQUE (name)
);/* Replace with your SQL commands */