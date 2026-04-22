# Rogveda — Medical Travel Booking Platform

> A full-stack mini booking platform for international patients seeking medical procedures in India. Built in under 12 hours as a trial task — patients search hospitals, compare pricing, and book procedures. Vendors receive bookings in real time and manage tasks through a protected dashboard.

---

## 🌐 Live URL

**https://rogveda-tau.vercel.app**

## 📦 Repository

**https://github.com/jarpit2003/Rogveda**

## 🏥 Vendor Dashboard

**https://rogveda-tau.vercel.app/vendor/login**
```
Username: apollo
Password: apollo123
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│   ┌─────────────┐   ┌──────────────────┐   ┌───────────────┐  │
│   │  Search Page │   │  Booking Flow    │   │ Vendor Dash   │  │
│   │  (SSR + CSR) │   │  (Client)        │   │ (Protected)   │  │
│   └──────┬──────┘   └────────┬─────────┘   └───────┬───────┘  │
│          │                   │                       │          │
└──────────┼───────────────────┼───────────────────────┼──────────┘
           │                   │                       │
           ▼                   ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js 14 App Router (Vercel Edge)           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ GET           │  │ POST         │  │ Middleware             │ │
│  │ /api/hospitals│  │ /api/bookings│  │ Cookie auth guard     │ │
│  └──────────────┘  └──────────────┘  │ /vendor/dashboard     │ │
│  ┌──────────────┐  ┌──────────────┐  └───────────────────────┘ │
│  │ POST          │  │ GET          │                            │
│  │/vendor/login  │  │/vendor/      │                            │
│  └──────────────┘  │ bookings     │                            │
│  ┌──────────────┐  └──────────────┘                            │
│  │ PATCH         │                                              │
│  │/vendor/tasks/ │                                              │
│  │ [id]          │                                              │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                         │
│                                                                 │
│  hospitals ──< doctors ──< pricing                              │
│  patients  ──< bookings ──< vendor_tasks                        │
│  patients  ──< wallet_transactions                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
hospitals
├── id (uuid, PK)
├── name
├── location
├── procedure
├── image_url
├── accreditation
└── created_at

doctors
├── id (uuid, PK)
├── hospital_id (FK → hospitals)
├── name
├── experience_years
└── created_at

pricing
├── id (uuid, PK)
├── hospital_id (FK → hospitals)
├── doctor_id (FK → doctors)
├── room_type
├── price_usd
└── created_at

patients
├── id (uuid, PK)
├── name
├── email
├── wallet_balance   ← can go negative (BNPL)
└── created_at

bookings
├── id (uuid, PK)
├── patient_id (FK → patients)
├── hospital_id (FK → hospitals)
├── doctor_id (FK → doctors)
├── room_type
├── price_usd
├── status           ← "Confirmed" | "In Progress"
└── created_at

vendor_tasks
├── id (uuid, PK)
├── booking_id (FK → bookings)
├── task_name        ← "Visa Invite Letter"
├── is_complete
├── completed_at
└── created_at

wallet_transactions
├── id (uuid, PK)
├── patient_id (FK → patients)
├── booking_id (FK → bookings)
├── amount           ← negative on booking charge
├── type             ← "booking_charge"
└── created_at
```

---

## Booking Flow

```
Patient clicks "Book Now"
        │
        ▼
/booking/[hospitalId]?doctorId=&roomType=&price=...
        │
        ▼
Patient clicks "Confirm Booking"
        │
        ▼
POST /api/bookings
        │
        ├── 1. INSERT into bookings (status: "Confirmed")
        ├── 2. INSERT into wallet_transactions (amount: -price_usd)
        ├── 3. UPDATE patients SET wallet_balance = balance - price_usd
        └── 4. INSERT into vendor_tasks (task: "Visa Invite Letter")
        │
        ▼
Redirect → /confirmation?bookingId=&balance=...
        │
        ▼
Vendor sees booking on dashboard (on refresh)
        │
        ▼
Vendor marks "Visa Invite Letter" complete
        │
        ▼
PATCH /api/vendor/tasks/[id]
        │
        ├── UPDATE vendor_tasks SET is_complete = true
        └── UPDATE bookings SET status = "In Progress"
```

---

## Auth Flow (Vendor)

```
POST /api/vendor/login
  └── Compare username/password against env vars
  └── Set HTTP-only cookie: vendor_session=valid (24h)

middleware.ts
  └── Intercepts /vendor/dashboard/*
  └── Reads vendor_session cookie
  └── Redirects to /vendor/login if missing/invalid

GET /api/vendor/bookings
  └── Reads cookie from request headers
  └── Returns 401 if not valid
```

---

## Project Structure

```
rogveda/
├── app/
│   ├── _components/
│   │   └── SearchClient.tsx       # Client wrapper for search page
│   ├── api/
│   │   ├── hospitals/route.ts     # GET hospitals with doctors + pricing
│   │   ├── bookings/route.ts      # POST create booking
│   │   └── vendor/
│   │       ├── login/route.ts     # POST vendor login
│   │       ├── bookings/route.ts  # GET all bookings (auth)
│   │       └── tasks/[id]/route.ts # PATCH mark task complete
│   ├── booking/[hospitalId]/
│   │   └── page.tsx               # Booking confirmation screen
│   ├── confirmation/
│   │   └── page.tsx               # Post-booking success screen
│   ├── vendor/
│   │   ├── login/page.tsx         # Vendor login
│   │   └── dashboard/page.tsx     # Vendor bookings dashboard
│   ├── layout.tsx                 # Root layout + CurrencyProvider
│   └── page.tsx                   # Home (SSR fetch → SearchClient)
├── components/
│   ├── HospitalCard.tsx           # Card with doctor/room dropdowns
│   ├── CurrencyToggle.tsx         # USD / INR / NGN switcher
│   └── TrustSignals.tsx           # Trust strip (JCI, BNPL, Visa, 24/7)
├── context/
│   └── CurrencyContext.tsx        # Global currency state
├── lib/
│   ├── supabase.ts                # Supabase client + admin (server-only)
│   ├── currency.ts                # Conversion rates + formatters
│   └── types.ts                   # TypeScript interfaces
└── middleware.ts                  # Vendor session guard
```

---

## What's Built

### Part 1 — Patient Search & Booking
- Search results page showing 3 hospitals for "Total Knee Replacement in Delhi"
- Doctor dropdown + room type dropdown with instant dynamic pricing
- Currency toggle: USD / INR / NGN (1 USD = 83 INR = 1,550 NGN)
- Lowest price highlighted by default per doctor
- BNPL — wallet starts at $0, goes negative on booking
- Confirmation screen with booking ID and updated wallet balance
- Trust signals: JCI/NABH accreditation, free visa assistance, 24/7 coordinator, BNPL
- Loading states, error handling, empty states throughout

### Part 2 — Vendor Dashboard
- Separate login at `/vendor/login` (apollo / apollo123)
- Protected by HTTP-only cookie via Next.js middleware
- Lists all bookings: patient, hospital, doctor, room, price, status
- Vendor marks "Visa Invite Letter" complete → status updates to "In Progress"

### Part 3 — Backend & Database
- Next.js 14 App Router API routes (no separate server)
- Supabase PostgreSQL — 7 tables, all relational with foreign keys
- All frontend data comes from API — zero hardcoded data
- Input validation and error handling on every endpoint
- `server-only` guard on Supabase admin client to prevent key leakage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | HTTP-only cookie session |
| Deployment | Vercel |
| Icons | lucide-react |

---

## AI Tool Used

**Amazon Q Developer** (AWS IDE plugin) — used for scaffolding all files, API routes, components, and database schema. Every file was prompted individually to spec. Manual fixes were made for:
- UUID seed data format (`p` prefix is invalid hex)
- `server-only` import to prevent Supabase admin keys from bundling into the client
- Supabase joined query shape mapping for vendor bookings

---

## Local Setup

```bash
git clone https://github.com/jarpit2003/Rogveda.git
cd Rogveda
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
VENDOR_USERNAME=apollo
VENDOR_PASSWORD=apollo123
VENDOR_SESSION_SECRET=rogveda_secret_session_2024
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/hospitals` | None | Fetch all hospitals with doctors and pricing |
| POST | `/api/bookings` | None | Create booking, deduct wallet, create vendor task |
| POST | `/api/vendor/login` | None | Vendor login — sets HTTP-only session cookie |
| GET | `/api/vendor/bookings` | Cookie | Fetch all bookings for vendor dashboard |
| PATCH | `/api/vendor/tasks/[id]` | Cookie | Mark task complete, update booking status |
