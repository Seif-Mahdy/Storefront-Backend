/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(10),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);