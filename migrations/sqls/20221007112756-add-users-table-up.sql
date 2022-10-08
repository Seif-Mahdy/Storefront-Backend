/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR,
    CONSTRAINT user_full_name_unique UNIQUE (first_name, last_name)
);