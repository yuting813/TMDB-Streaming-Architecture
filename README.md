[English](README.md) | [繁體中文](README.zh-TW.md)

# Netflix Clone - Frontend Engineering Streaming Platform

A Netflix-inspired streaming web application built as a **career-transition frontend
portfolio project**, emphasizing **UI architecture, predictable state flow, UX edge cases, and accessibility** over feature quantity.

Live demo: https://stream.tinahu.dev/
Source code: https://github.com/yuting813/netflix-clone-nextjs

---

## Why This Project

This project simulates real frontend engineering challenges:

- Auth-driven UI state and route protection
- Subscription-gated UI behavior
- External API data with missing or unstable fields
- UX edge cases (loading, empty, fallback, errors)
- Component architecture that is easy to explain and evolve

The goal is to demonstrate **how I reason about frontend systems**, not just feature output.

---

## Frontend Engineering Focus

- **UI architecture**: components are pure, hooks manage side effects
- **Predictable state flow**: centralized auth and subscription state with guarded initialization
- **UX edge cases**: explicit loading, missing trailer, and fallback handling
- **Accessibility**: ESC to close modal, focus restoration, keyboard flow
- **Responsive stability**: header/rows remain stable under scroll and resize
- **Maintainability**: typed helpers + shared types to reduce UI coupling

---

## Core Features

- Sign up / sign in / auto sign-out (Firebase Auth)
- Subscription creation and gated access (Stripe + Firestore)
- Movie browsing with random hero banner and categorized horizontal rows
- Movie detail modal with trailer playback and robust fallback states
- My List with real-time sync

---

## Tech Stack

- **Framework**: Next.js (Pages Router), React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Recoil
- **Auth**: Firebase Auth
- **Database**: Firestore
- **Payments**: Stripe Checkout
- **External API**: TMDB API
- **Tooling**: ESLint, Prettier

---

## Project Structure

```text
pages/        Next.js routing + API routes
components/   Pure UI components (no side effects)
hooks/        Business logic (auth, subscription, lists)
utils/        API helpers and shared utilities
atoms/        Recoil state definitions
constants/    Shared constants (e.g. TMDB image base URL)
lib/          Service helpers (Stripe, Firebase)
types/        Shared TypeScript types
```

Design principles:

- UI components never call APIs directly
- Side effects live in hooks
- Shared types come first

---

## Setup

```bash
git clone https://github.com/your-username/netflix-clone-nextjs.git
cd netflix-clone-nextjs
npm install
cp .env.example .env.local   # add your keys
npm run dev                  # http://localhost:3000
```

### Environment Variables

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# TMDB
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## Recent Frontend Highlights

- Reduced auth redirect race conditions by introducing guarded initialization
- Improved modal UX with explicit loading and missing-trailer fallbacks
- Centralized TMDB requests into typed helpers to reduce UI coupling
- Stabilized responsive header layout under scroll and resize

---

## Future Improvements (If Extended)

- Add component and integration tests (modal, auth guard, subscription)
- Performance profiling and critical path optimizations
- More robust error boundaries and retry strategies

---

## About Me

This project is part of my transition into a frontend engineering role.

Contact: tinahuu321@gmail.com
LinkedIn: https://www.linkedin.com/in/tina-hu-frontend
GitHub: https://github.com/yuting813

---
