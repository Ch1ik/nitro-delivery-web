# 🚀 Nitro Delivery – Business Platform

Award-winning B2B logistics platform with multi-language support, real-time tracking, and full-stack architecture.

## Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (via better-sqlite3)
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Languages**: English, French, Arabic (RTL)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
The `.env.local` file is pre-configured for local development. No changes needed.

### 3. Run both frontend & backend together
```bash
npm run dev:all
```

Or run them separately in two terminals:
```bash
# Terminal 1 - Backend API (port 4000)
npm run server:watch

# Terminal 2 - Frontend (port 3000)
npm run dev
```

### 4. Open the app
- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/health

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nitro.dz | admin123 |
| Business | partner@nitro.dz | business123 |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/auth/login | Login with email + password |
| POST | /v1/auth/signup | Submit business signup request |
| GET | /v1/auth/me | Get current user profile |

### Deliveries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/deliveries | List deliveries (filtered by role) |
| POST | /v1/deliveries | Create new delivery |
| GET | /v1/deliveries/stats | Dashboard stats |
| PATCH | /v1/deliveries/:id/status | Update status (admin only) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/admin/businesses | List all businesses |
| PATCH | /v1/admin/businesses/:id/price | Set fixed price |
| GET | /v1/admin/signup-requests | List signup requests |
| PATCH | /v1/admin/signup-requests/:id | Approve or reject |
| GET | /v1/admin/settings | Get platform settings |
| PATCH | /v1/admin/settings | Update settings |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/profile | Get current profile |
| PATCH | /v1/profile | Update profile |
| PATCH | /v1/profile/password | Change password |

## Database
SQLite file is created automatically at `nitro.db` on first run with seed data.

## Project Structure
```
nitro-delivery/
├── src/                    # Frontend (React)
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/api.ts     # All API calls
│   └── translations.ts
├── server/                 # Backend (Express)
│   ├── db/database.ts      # SQLite setup + seed
│   ├── middleware/auth.ts  # JWT middleware
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── deliveries.ts
│   │   ├── admin.ts
│   │   └── profile.ts
│   └── index.ts            # Express entry point
├── .env.local              # Environment variables
└── nitro.db                # SQLite database (auto-created)
```
