# Nitro Delivery - Backend Implementation Guide

This guide outlines the steps to build a robust Node.js/Express backend for the Nitro Delivery platform.

## Prerequisites
- Node.js (v18+)
- PostgreSQL or MongoDB (PostgreSQL recommended for logistics)
- Redis (for real-time tracking caching)

## Step 1: Initialize the Project
```bash
mkdir nitro-backend
cd nitro-backend
npm init -y
npm install express cors dotenv helmet morgan jsonwebtoken bcryptjs pg typeorm reflect-metadata
npm install -D typescript @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken @types/bcryptjs ts-node-dev
npx tsc --init
```

## Step 2: Project Structure
```text
src/
  config/         # Database and environment config
  controllers/    # Request handlers
  entities/       # Database models (TypeORM)
  middleware/     # Auth, validation, error handling
  routes/         # API route definitions
  services/       # Business logic
  utils/          # Helpers
  index.ts        # Entry point
```

## Step 3: Database Schema (Core Entities)
1. **User/Business**: id, email, password, business_name, phone, role (admin/business).
2. **Delivery**: id, business_id, client_name, client_phone, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, status (pending/confirmed/done/denied), price, addons (JSONB).
3. **Driver**: id, name, phone, vehicle_type, current_lat, current_lng, status (active/busy).

## Step 4: Authentication Flow
1. Implement JWT-based authentication.
2. Create `POST /api/auth/login` and `POST /api/auth/register`.
3. Add `authMiddleware` to protect business routes.

## Step 5: Core API Endpoints
- `GET /api/deliveries`: List deliveries for the logged-in business.
- `POST /api/deliveries`: Create a new delivery.
- `GET /api/deliveries/:id`: Get delivery details.
- `PATCH /api/admin/deliveries/:id/status`: (Admin only) Update delivery status.
- `GET /api/stats/business`: Get KPI data for the dashboard.

## Step 6: Real-time Integration (Optional but Recommended)
Use Socket.io to push status updates to the frontend:
```typescript
io.on('connection', (socket) => {
  socket.join(`business_${businessId}`);
});
// When status changes:
io.to(`business_${businessId}`).emit('delivery_update', updatedDelivery);
```

## Step 7: Deployment
1. Set up a CI/CD pipeline (GitHub Actions).
2. Deploy to a cloud provider (AWS, Google Cloud, or Heroku).
3. Use a managed database service (RDS, Supabase).

## Frontend Integration
Update `src/services/api.ts` in the frontend to point to your new backend URL:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```
