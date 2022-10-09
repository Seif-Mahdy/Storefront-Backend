/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS products_orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    order_idINTEGER REFERENCES orders(id) ON DELETE CASCADE,
    quantity INTEGER,
);