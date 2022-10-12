# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Products

- Index  [token required] GET: <http://localhost:3000/products>
- Show (args: product id) [token required] GET: <http://localhost:3000/products/:id>
- Create (args: Product) [token required] POST: <http://localhost:3000/products>
- Delete (args: product id) [token required] DELETE: <http://localhost:3000/products/:id>

### Users

- Index [token required] GET: <http://localhost:3000/users>
- Show (args: id) [token required] GET: <http://localhost:3000/users/:id>
- Register (args: User) POST: <http://localhost:3000/users/register>
- Login (args: username, password) POST: <http://localhost:3000/users/login>
- Delete (args: id) [token required] DELETE: <http://localhost:3000/users/:id>

### Orders

- Current Order by user (args: user id) [token required] GET: <http://localhost:3000/orders/:userId>
- Create (args: Order) [token required] POST: <http://localhost:3000/orders>
- Delete (args: order id) [token required] DELETE <http://localhost:3000/orders/:id>

## Database Schema

### products

- id SERIAL PRIMARY KEY
- name VARCHAR(255)
- price FLOAT

### users

- id SERIAL PRIMARY KEY
- first_name VARCHAR(50)
- last_name VARCHAR(50)
- username VARCHAR(50)
- password VARCHAR

### orders

- id SERIAL PRIMARY KEY
- user_id INTEGER REFERENCES users(id)
- status VARCHAR(50)

### orders_products

- id SERIAL PRIMARY KEY
- product_id INTEGER REFERENCES products(id)
- order_id INTEGER REFERENCES orders(id)
- quantity INTEGER
