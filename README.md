# AgriPrice SL 🌾🇱🇰

> **Enterprise Crop Price Forecasting & Direct Farmer-Buyer Marketplace tailored for Sri Lanka**

AgriPrice SL is an enterprise-grade platform built to solve agricultural price volatility, empower Sri Lankan farmers, and provide real-time wholesale price intelligence for Sri Lanka's Special Economic Centres (Dambulla, Meegoda, Pettah, Manning Market, Keppetipola, Nuwara Eliya).

---

## 🏛️ System Architecture

- **Unified Entry Point (Port 3000)**: Express acts as the primary single-port entry server handling all `/api/*` REST endpoints and serving compiled Next.js standalone pages & static assets (`/_next/static`, `frontend/.next/standalone`).
- **Data Ingestion & ML Pipeline**: Time-series forecasting module calculates 7, 14, and 30-day price projections with upper/lower confidence bands and trend analysis (% change) using Holt's Linear Exponential Smoothing.
- **Cache Acceleration**: In-memory Redis cache layer with 1-hour TTL for forecast projections and market price queries.
- **Database Layer**: Prisma ORM connecting to MySQL for relational storage of Users, Economic Centers, Crops, Historical Daily Wholesale Price Records, Farmer Inventory Listings, and Escrow Orders.
- **Trilingual Frontend**: Next.js 14 App Router supporting English (`en`), Sinhala (`si`), and Tamil (`ta`) using `next-intl` with agricultural dictionaries.
- **Interactive UI**: Recharts time-series visualization displaying historical price trends against AI forecast curves with confidence interval bands.

---

## 📁 Monorepo Layout

```
Agriprice/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma ORM schema (MySQL)
│   ├── src/
│   │   ├── controllers/         # Auth, Listing, Market, Forecast controllers
│   │   ├── routes/              # Express API endpoints
│   │   ├── services/            # Time-Series Forecasting & Redis caching
│   │   └── server.ts            # Single-port Express entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router ([locale] routing)
│   │   ├── components/          # Recharts Dashboard, Marketplace, Modals
│   │   ├── i18n/                # next-intl configuration
│   │   └── messages/            # Trilingual dictionaries (en, si, ta)
│   ├── next.config.js           # standalone output configuration
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml           # Unified production deployment (app, mysql, redis)
└── package.json                 # Monorepo workspaces & scripts
```

---

## 🚀 Quick Start & Development

### 1. Installation
```bash
npm install
```

### 2. Running Dev Servers
To run backend and frontend concurrently:
```bash
# Backend (Express API on Port 3000)
npm run dev:backend

# Frontend (Next.js App Router on Port 3001)
npm run dev:frontend
```

### 3. Production Build & Standalone Deployment
```bash
# Compile frontend Next.js standalone build & backend TypeScript
npm run build

# Start single-port Express entry point (Port 3000)
npm start
```

### 4. Docker Deployment
```bash
docker-compose up --build -d
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/forecast` | Returns 7, 14, 30-day time-series predictions, trend status, confidence bounds & combined dataset (`?crop=CARROT&center=DAMBULLA&horizon=14`) |
| `GET` | `/api/market-prices/daily` | Fetches wholesale buying/selling daily rates (`?center=DAMBULLA`) |
| `GET` | `/api/market-prices/centers` | Lists supported Sri Lankan Economic Centers |
| `GET` | `/api/market-prices/crops` | Lists supported crop varieties |
| `GET` | `/api/listings` | Lists active farmer inventory listings with filter options |
| `POST` | `/api/listings` | Creates a new farmer crop inventory listing |
| `POST` | `/api/listings/order` | Places an escrow-protected purchase order |
| `POST` | `/api/auth/request-otp` | Sends phone OTP for farmer/buyer authentication |
| `POST` | `/api/auth/verify-otp` | Verifies OTP code and returns JWT token |
| `GET` | `/health` | Server health check endpoint |

---

## 🇱🇰 Trilingual Dictionary Support

- **English (`en`)**: Standard international agricultural terminology.
- **Sinhala (`si`)**: ඊට අදාළ ශ්‍රී ලංකා කෘෂිකාර්මික හා ආර්ථික මධ්‍යස්ථාන තොරතුරු (දඹුල්ල, කැරට්, ලූනු, ආදී).
- **Tamil (`ta`)**: இலங்கை விவசாய மற்றும் பொருளாதார மைய தகவல்கள் (தம்புள்ளை, கேரட், வெங்காயம்).
