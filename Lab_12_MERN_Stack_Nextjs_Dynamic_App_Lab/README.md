# Rustik Plank MERN + Next.js eCommerce

Complete dynamic furniture eCommerce app inspired by the provided Rustik Plank reference template.

## Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB (Mongoose)
- Features: Auth, product/category/blog/order CRUD, cart, checkout, admin panel, responsive UI

## Project Structure

- `frontend/` Next.js app
- `backend/` Express + MongoDB API

## 1) Backend Setup

1. Open `backend/.env` and set your real MongoDB URI:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=rustik_secret
FRONTEND_URL=http://localhost:3000
```

2. Run backend:

```bash
cd backend
npm install
npm run seed
npm run dev
```

Seed creates demo users:

- Admin: `admin@rustikplank.com` / `admin123`
- Customer: `customer@rustikplank.com` / `customer123`

## 2) Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## Main Routes

- `/` Home (Rustik style landing page)
- `/shop` Product catalog
- `/categories/[slug]` Category listing
- `/products/[slug]` Product detail
- `/cart` Cart
- `/checkout` Checkout
- `/blog`, `/blog/[slug]`
- `/account/login`, `/account/register`
- `/admin` Admin CRUD panel
