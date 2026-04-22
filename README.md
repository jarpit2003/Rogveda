# Rogveda — Medical Travel Booking Platform

A mini medical travel booking platform built for the Rogveda trial task. International patients can search hospitals, compare pricing, and book procedures. Vendors receive bookings in real time and manage tasks through a separate dashboard.

---

## Live URL

> https://rogveda-tau.vercel.app

## Repository

> https://github.com/jarpit2003/Rogveda

## Vendor Dashboard

> https://rogveda-tau.vercel.app/vendor/login
> Username: `apollo` | Password: `apollo123`

---

## What's Built

### Part 1 — Patient Search & Booking
- Search results page showing 3 hospitals for "Total Knee Replacement in Delhi"
- Each hospital card has a doctor dropdown and room type dropdown with dynamic pricing
- Currency toggle: USD / INR / NGN (static rates: 1 USD = 83 INR = 1,550 NGN)
- Lowest price shown by default per doctor
- BNPL booking flow — patient wallet starts at $0, goes negative on booking
- Booking confirmation screen with booking ID and updated wallet balance
- Trust signals: JCI/NABH accreditation, free visa assistance, 24/7 coordinator, BNPL
- Loading states, error handling, empty states handled throughout

### Part 2 — Vendor Dashboard
- Separate login at `/vendor/login` (hardcoded: apollo / apollo123)
- Protected by HTTP-only cookie session via middleware
- Dashboard lists all bookings with patient name, hospital, doctor, room, price, status
- Vendor can mark "Visa Invite Letter" task as complete
- Marking complete updates booking status to "In Progress" in real time

### Part 3 — Backend & Database
- Next.js 14 App Router API routes
- Supabase (PostgreSQL) database
- Tables: `hospitals`, `doctors`, `pricing`, `patients`, `bookings`, `vendor_tasks`, `wallet_transactions`
- All data fetched from API — no hardcoded frontend data
- Input validation and error handling on all endpoints

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Cookie-based session (vendor) |
| Deployment | Vercel |
| Icons | lucide-react |

---

## AI Tool Used

**Amazon Q Developer** (AWS IDE plugin) — used for scaffolding all files, API routes, components, and database schema. Prompts were written to spec each file individually. Manual changes were made to fix UUID seed data issues and prevent server-only modules from being bundled on the client.

---

## Local Setup

```bash
git clone https://github.com/jarpit2003/Rogveda.git
cd Rogveda
npm install
```

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
VENDOR_USERNAME=apollo
VENDOR_PASSWORD=apollo123
VENDOR_SESSION_SECRET=rogveda_secret_session_2024
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Setup

Run the SQL files in order in your Supabase SQL Editor:

1. Schema (creates all 7 tables)
2. Seed data (3 hospitals, 6 doctors, 20 pricing rows, 1 demo patient)

---

## Routes

| Route | Description |
|---|---|
| `/` | Patient search & hospital listing |
| `/booking/[hospitalId]` | Booking confirmation screen |
| `/confirmation` | Post-booking confirmation |
| `/vendor/login` | Vendor login |
| `/vendor/dashboard` | Vendor bookings dashboard |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hospitals` | Fetch all hospitals with doctors and pricing |
| POST | `/api/bookings` | Create a booking, deduct wallet, create vendor task |
| POST | `/api/vendor/login` | Vendor login, sets session cookie |
| GET | `/api/vendor/bookings` | Fetch all bookings (vendor auth required) |
| PATCH | `/api/vendor/tasks/[id]` | Mark task complete, update booking status |
