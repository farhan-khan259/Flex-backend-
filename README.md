# FLEX backend

Express and MongoDB API for customer authentication, profiles, contact messages, and transactional email.

## Setup

1. Copy `.env.example` to `.env`.
2. Add `MONGO_URI` (or `MONGO_URI_DIRECT` as a fallback), a long random `JWT_SECRET`, and the Google app password in `SMTP_PASS`.
3. Run `npm install` and `npm run dev`.
4. Run the frontend with `npm run dev` from `Flex-frontend`.

The frontend development server proxies `/api` to `http://localhost:5001`. For a separately hosted frontend, set `VITE_API_URL` to the API origin and set `CLIENT_URL` in the backend to the exact frontend origin. Multiple allowed frontend origins can be comma-separated.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/auth/profile`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `POST /api/contact`
- `GET/PUT /api/account/cart`
- `GET/PUT /api/account/wishlist`
- `GET /api/health`

Authentication uses an HTTP-only JWT cookie. Do not commit `.env`.
# Flex-backend-
