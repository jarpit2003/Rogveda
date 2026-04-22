# 🏥 Rogveda — Medical Travel Booking Platform

> A production-grade mini booking platform for international patients seeking medical procedures in India.
> Patients search hospitals, compare pricing across currencies, and book procedures with BNPL.
> Vendors receive bookings in real time and manage tasks through a protected dashboard.
> **Built end-to-end in under 12 hours.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-rogveda--tau.vercel.app-blue?style=for-the-badge)](https://rogveda-tau.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-jarpit2003%2FRogveda-black?style=for-the-badge&logo=github)](https://github.com/jarpit2003/Rogveda)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://rogveda-tau.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com)

---

## 🔗 Quick Links

| | Link |
|---|---|
| 🌐 Patient App | https://rogveda-tau.vercel.app |
| 🏥 Vendor Dashboard | https://rogveda-tau.vercel.app/vendor/login |
| 📦 Repository | https://github.com/jarpit2003/Rogveda |

**Vendor credentials:** `apollo` / `apollo123`

---

## 🧠 What Makes This Different

This isn't three separate pages stitched together. It's one connected system:

- A patient books on the frontend → a real record is written to PostgreSQL → the vendor sees it instantly on their dashboard → the vendor marks a task complete → the booking status updates back in the database.
- Every piece of data comes from the API. Zero hardcoded frontend data.
- The vendor dashboard is protected at the **middleware layer** — not just a client-side redirect.
- The Supabase service role key is guarded with a `server-only` import — it physically cannot be bundled into the client.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                            │
│                                                                      │
│  ┌──────────────────┐  ┌───────────────────┐  ┌──────────────────┐  │
│  │   Search Page    │  │   Booking Flow    │  │  Vendor Dashboard│  │
│  │  SSR + CSR       │  │  Client-side      │  │  Cookie-protected│  │
│  │  /               │  │  /booking/[id]    │  │  /vendor/dash    │  │
│  └────────┬─────────┘  └────────┬──────────┘  └────────┬─────────┘  │
└───────────┼─────────────────────┼─────────────────────┼─────────────┘
            │                     │                      │
            ▼                     ▼                      ▼
┌──────────────────────────────────────────────────────────────────────┐
│              Next.js 14 App Router — Vercel Edge Network             │
│                                                                      │
│  ┌─────────────────┐   ┌─────────────────┐   ┌────────────────────┐ │
│  │ GET             │   │ POST            │   │ middleware.ts      │ │
│  │ /api/hospitals  │   │ /api/bookings   │   │                    │ │
│  │                 │   │                 │   │ Intercepts:        │ │
│  │ → joins doctors │   │ → 4 sequential  │   │ /vendor/dashboard  │ │
│  │   + pricing     │   │   DB writes     │   │                    │ │
│  └─────────────────┘   └─────────────────┘   │ Reads cookie →     │ │
│                                               │ redirect if invalid│ │
│  ┌─────────────────┐   ┌─────────────────┐   └────────────────────┘ │
│  │ POST            │   │ GET             │                           │
│  │ /vendor/login   │   │ /vendor/bookings│                           │
│  │                 │   │                 │                           │
│  │ → sets HTTP-only│   │ → joined query  │                           │
│  │   cookie (24h)  │   │   across 4 tbls │                           │
│  └─────────────────┘   └─────────────────┘                           │
│                                                                      │
│  ┌─────────────────┐                                                 │
│  │ PATCH           │                                                 │
│  │ /vendor/tasks/  │                                                 │
│  │ [id]            │                                                 │
│  │                 │                                                 │
│  │ → marks task    │                                                 │
│  │   complete +    │                                                 │
│  │   updates status│                                                 │
│  └─────────────────┘                                                 │
└──────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      Supabase — PostgreSQL                           │
│                                                                      │
│   hospitals ──────< doctors ──────< pricing                          │
│       │                                                              │
│       └──────────────────────────────────────────────┐              │
│                                                       │              │
│   patients ───────< bookings ─────< vendor_tasks      │              │
│       │                 │                             │              │
│       └──< wallet_transactions                        │              │
│                         │                             │              │
│                    hospital_id ───────────────────────┘              │
│                                                                      │
│   RLS enabled on all tables (auto-trigger on CREATE TABLE)           │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
hospitals                          doctors
─────────────────────────          ─────────────────────────
id           uuid  PK              id             uuid  PK
name         text                  hospital_id    uuid  FK → hospitals
location     text                  name           text
procedure    text                  experience_yrs int
image_url    text  nullable        created_at     timestamptz
accreditation text
created_at   timestamptz

pricing                            patients
─────────────────────────          ─────────────────────────
id           uuid  PK              id             uuid  PK
hospital_id  uuid  FK → hospitals  name           text
doctor_id    uuid  FK → doctors    email          text  nullable
room_type    text                  wallet_balance numeric  ← goes negative (BNPL)
price_usd    numeric               created_at     timestamptz
created_at   timestamptz

bookings                           vendor_tasks
─────────────────────────          ─────────────────────────
id           uuid  PK              id             uuid  PK
patient_id   uuid  FK → patients   booking_id     uuid  FK → bookings
hospital_id  uuid  FK → hospitals  task_name      text  default "Visa Invite Letter"
doctor_id    uuid  FK → doctors    is_complete    bool  default false
room_type    text                  completed_at   timestamptz nullable
price_usd    numeric               created_at     timestamptz
status       text  ← "Confirmed" | "In Progress"
created_at   timestamptz

wallet_transactions
─────────────────────────
id           uuid  PK
patient_id   uuid  FK → patients
booking_id   uuid  FK → bookings
amount       numeric  ← always negative (debit)
type         text     ← "booking_charge"
created_at   timestamptz
```

---

## 🔄 Booking Flow — End to End

```
[Patient]                    [Next.js API]               [Supabase]
    │                              │                          │
    │  clicks "Book Now"           │                          │
    │ ─────────────────────────►  │                          │
    │                              │                          │
    │  /booking/[hospitalId]       │                          │
    │  ?doctorId=&roomType=&price= │                          │
    │                              │                          │
    │  clicks "Confirm Booking"    │                          │
    │ ─────────────────────────►  │                          │
    │                              │                          │
    │         POST /api/bookings   │                          │
    │ ─────────────────────────►  │                          │
    │                              │  INSERT bookings         │
    │                              │ ────────────────────►   │
    │                              │  ← booking.id           │
    │                              │                          │
    │                              │  INSERT wallet_txn       │
    │                              │ ────────────────────►   │
    │                              │                          │
    │                              │  UPDATE patient wallet   │
    │                              │ ────────────────────►   │
    │                              │  ← new_balance          │
    │                              │                          │
    │                              │  INSERT vendor_task      │
    │                              │ ────────────────────►   │
    │                              │                          │
    │  { booking_id, balance }     │                          │
    │ ◄─────────────────────────  │                          │
    │                              │                          │
    │  redirect /confirmation      │                          │
    │                              │                          │

[Vendor]                     [Next.js API]               [Supabase]
    │                              │                          │
    │  GET /vendor/dashboard       │                          │
    │ ─────────────────────────►  │                          │
    │  (middleware checks cookie)  │                          │
    │                              │  SELECT bookings         │
    │                              │  JOIN patients           │
    │                              │  JOIN hospitals          │
    │                              │  JOIN doctors            │
    │                              │  LEFT JOIN vendor_tasks  │
    │                              │ ────────────────────►   │
    │  sees new booking            │                          │
    │ ◄─────────────────────────  │                          │
    │                              │                          │
    │  marks task complete         │                          │
    │ ─────────────────────────►  │                          │
    │         PATCH /vendor/tasks/[id]                        │
    │                              │  UPDATE vendor_tasks     │
    │                              │  UPDATE bookings status  │
    │                              │ ────────────────────►   │
    │  status → "In Progress"      │                          │
    │ ◄─────────────────────────  │                          │
```

---

## 🔐 Auth & Security Design

```
Vendor Login Flow
─────────────────
POST /api/vendor/login
  ├── Reads VENDOR_USERNAME + VENDOR_PASSWORD from env (never exposed to client)
  ├── On match: sets HTTP-only cookie vendor_session=valid, maxAge=86400
  └── On fail: 401 Unauthorized

Route Protection (middleware.ts — runs at Edge)
────────────────────────────────────────────────
Every request to /vendor/dashboard/* is intercepted
  ├── Reads vendor_session cookie
  ├── If missing or invalid → redirect to /vendor/login
  └── If valid → allow through

API Protection
──────────────
GET /api/vendor/bookings   → checks cookie server-side, returns 401 if invalid
PATCH /api/vendor/tasks/*  → checks cookie server-side, returns 401 if invalid

Key Security Decisions
───────────────────────
✓ SUPABASE_SERVICE_ROLE_KEY guarded with `import 'server-only'`
  → physically cannot be bundled into client JS
✓ Vendor credentials stored in env vars, never in code
✓ HTTP-only cookie → not accessible via document.cookie (XSS safe)
✓ RLS enabled on all Supabase tables via event trigger
```

---

## 💡 Key Design Decisions

| Decision | Why |
|---|---|
| SSR for home page, CSR for booking | Home page benefits from server-side fetch for SEO + speed. Booking is interactive, needs client state. |
| `server-only` on `lib/supabase.ts` | Prevents the service role key from ever reaching the browser bundle, even accidentally. |
| Sequential DB writes (not a transaction) | Supabase JS client doesn't support multi-statement transactions. Sequential writes with error handling is the pragmatic choice. |
| URL search params for booking state | Avoids global state management complexity. Booking details passed cleanly via URL, readable and shareable. |
| Middleware for vendor auth | Edge middleware runs before the page renders — no flash of protected content, no client-side redirect flicker. |
| BNPL via negative wallet balance | Simplest correct implementation — no credit system needed, wallet just goes negative and is shown to the patient. |

---

## 📁 Project Structure

```
rogveda/
├── app/
│   ├── _components/
│   │   └── SearchClient.tsx        # 'use client' wrapper — receives SSR data
│   ├── api/
│   │   ├── hospitals/route.ts      # GET — hospitals + doctors + pricing (parallel fetch)
│   │   ├── bookings/route.ts       # POST — 4-step booking creation
│   │   └── vendor/
│   │       ├── login/route.ts      # POST — credential check + cookie set
│   │       ├── bookings/route.ts   # GET — joined query across 4 tables (auth)
│   │       └── tasks/[id]/route.ts # PATCH — mark complete + update status (auth)
│   ├── booking/[hospitalId]/
│   │   └── page.tsx                # Booking confirmation screen (client)
│   ├── confirmation/
│   │   └── page.tsx                # Post-booking success screen
│   ├── vendor/
│   │   ├── login/page.tsx          # Vendor login form
│   │   └── dashboard/page.tsx      # Bookings list + task management
│   ├── layout.tsx                  # Root layout — wraps with CurrencyProvider
│   └── page.tsx                    # Home — SSR fetch → passes to SearchClient
├── components/
│   ├── HospitalCard.tsx            # Doctor/room dropdowns, dynamic price, Book Now
│   ├── CurrencyToggle.tsx          # USD / INR / NGN switcher (reads context)
│   └── TrustSignals.tsx            # JCI, BNPL, Visa, 24/7 trust strip
├── context/
│   └── CurrencyContext.tsx         # Global currency state (React context)
├── lib/
│   ├── supabase.ts                 # Supabase clients — server-only guarded
│   ├── currency.ts                 # Rates + convertPrice formatter
│   └── types.ts                    # All TypeScript interfaces
└── middleware.ts                   # Edge middleware — vendor session guard
```

---

## 🚀 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API routes in one — no separate backend needed |
| Language | TypeScript | Type safety across API ↔ frontend boundary |
| Styling | Tailwind CSS | Fast, consistent, mobile-first |
| Database | Supabase (PostgreSQL) | Relational data, real-time capable, free tier |
| Auth | HTTP-only cookie | Simple, secure, no JWT complexity needed |
| Deployment | Vercel | Zero-config Next.js deployment |
| Icons | lucide-react | Clean, consistent icon set |

---

## 🤖 AI Tool Used

**Amazon Q Developer** (AWS IDE plugin) — used for scaffolding every file, API route, component, and the database schema. Each file was prompted individually with precise specs.

**What I manually fixed:**
- UUID seed data had a `p` prefix (`p1111111-...`) — invalid hex, PostgreSQL rejected it. Fixed to `e1111111-...`
- Added `import 'server-only'` to `lib/supabase.ts` after diagnosing a client-side bundle error (`supabaseKey is required`)
- Supabase joined query returns nested objects (`patients.name`) — manually mapped to flat shape expected by the vendor dashboard

---

## 🧗 Hardest Part

**Keeping the Supabase service role key off the client bundle.**

The app uses two Supabase clients — an anon client (safe for the browser) and an admin client with the service role key (server-only). Both were exported from the same `lib/supabase.ts` file. Even though the admin client was only *called* from API routes, Next.js was still bundling the entire file into the client because a component somewhere in the tree imported from it indirectly.

This caused a runtime crash: `supabaseKey is required` — the service role key is a server env var, so it's `undefined` in the browser.

The fix was adding `import 'server-only'` at the top of `lib/supabase.ts`. This is a special Next.js package that throws a **build-time error** if the file is ever imported in a client context — making it physically impossible for the key to leak, even accidentally in the future.

It's a small line of code but it required understanding how Next.js bundles server vs client modules, reading the error trace carefully, and knowing that `server-only` exists as a solution. That's the kind of thing you don't find by guessing — you find it by understanding the framework.

---

## ⚙️ Local Setup

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
# → http://localhost:3000
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/hospitals` | — | — | `Hospital[]` with doctors + pricing |
| `POST` | `/api/bookings` | — | `{ patient_id, hospital_id, doctor_id, room_type, price_usd }` | `{ booking_id, new_wallet_balance }` |
| `POST` | `/api/vendor/login` | — | `{ username, password }` | `{ success: true }` + sets cookie |
| `GET` | `/api/vendor/bookings` | Cookie | — | `VendorBooking[]` |
| `PATCH` | `/api/vendor/tasks/[id]` | Cookie | `{ is_complete }` | `{ success: true, booking_status }` |

---

## 🗺️ App Routes

| Route | Type | Description |
|---|---|---|
| `/` | SSR + Client | Hospital search + currency toggle |
| `/booking/[hospitalId]` | Client | Booking confirmation + BNPL wallet |
| `/confirmation` | Client | Post-booking success screen |
| `/vendor/login` | Client | Vendor authentication |
| `/vendor/dashboard` | Client (protected) | Bookings list + task management |
