Utsav Backend (Node.js + Express + MongoDB)

This folder contains a minimal Express server that replaces the previous Google Apps Script backend. It exposes simple endpoints to read/write products and inquiries and uses MongoDB for storage.

Getting started

1. Install dependencies

   npm install

2. Create a MongoDB database and get a connection string (MongoDB Atlas or local). Set it in an `.env` file:

   MONGODB_URI=mongodb+srv://user:pass@cluster.example.mongodb.net/utsav?retryWrites=true&w=majority
   PORT=4000

3. Run in development:

   npm run dev

   Or start in production:

   npm start

API Endpoints

- GET /api/products — list products
- POST /api/products — create a product (body: { title, description, image, price, category })
- GET /api/inquiries — list inquiries
- POST /api/inquiries — create an inquiry (body: { name, email, phone, service, message })

Admin routes
- POST /api/products (admin) — create a product (requires ADMIN_API_KEY)
- PUT /api/products/:id (admin) — update product
- DELETE /api/products/:id (admin) — delete product
- GET /api/categories — list categories
- POST /api/categories (admin) — create category
- PUT /api/categories/:id (admin) — update category
- DELETE /api/categories/:id (admin) — delete category

The admin routes require an `ADMIN_API_KEY` set in the backend `.env`. Requests should include the key either in the header `x-admin-key`, query `?adminKey=...`, or JSON body `{ adminKey: '...' }`.

Notes
- This is a minimal scaffold. Add authentication and validation before using in production.
