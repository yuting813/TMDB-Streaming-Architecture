[English](README.md) | [繁體中文](README.zh-TW.md)

# TMDB Streaming Architecture - Frontend Engineering Portfolio

A TMDB-based video streaming platform built with Next.js and TypeScript. This project focuses on UI Architecture, Predictable State, UX Edge Case Handling, and Accessibility (A11y) rather than just a collection of features.

- **Live Demo**: [stream.tinahu.dev](https://stream.tinahu.dev/)
- **Demo Account**:
  - Email: `demo@tinahu.dev`
  - Password: `Demo1234!` (Includes Stripe test subscription permissions)

---

## Project Motivation

This project simulates real-world enterprise frontend scenarios to address:

- **State & Route Protection**: Managing the dependency between Auth and Subscription status.
- **Permission-driven UI**: Real-time UI updates based on subscription access.
- **Data Robustness**: Handling inconsistent or delayed data from external APIs (TMDB).
- **Explainable Engineering**: Establishing a scalable, type-safe, and well-documented frontend structure.

---

## Engineering Challenges & Decisions

### 1. Subscription-driven UI Stability

- **Challenge**: Firebase Auth and Stripe subscription data sync asynchronously. Improper handling leads to **Race Conditions**, causing UI flickering or transient permission mismatches (e.g., a user briefly accessing restricted content before being redirected).
- **Solution**: Architected the `useSubscription` hook as the **Single Source of Truth**, integrated with **Recoil** for global state management. Implemented **Skeleton Screens** to occupy the layout until the permission handshake is complete.
- **Result**: Eliminated race conditions and content flashing, ensuring a predictable and trustworthy user experience.

### 2. Hybrid Rendering Strategy & Performance

- **Challenge**: A streaming platform requires both **SEO** (for content discoverability) and fluid navigation. Pure CSR (Client-Side Rendering) struggles with search engine indexing and **First Contentful Paint (FCP)**.
- **Solution**: Leveraged Next.js **ISR (`getStaticProps` + `revalidate`)** to pre-render HTML with TMDB data at build time and regenerate it in the background, ensuring search engine indexability and fast initial load.
- **Result**: Achieved optimal SEO performance and significantly reduced **LCP (Largest Contentful Paint)**, delivering near-instant initial page loads.

### 3. Robust UX & Edge Case Handling

- **Strategy**: Focused on system resilience against network instability and missing assets.
- **Solution**: Implemented comprehensive **Fallback UIs** (e.g., default placeholders) for image load failures. Utilized the **Next.js Image Component** to enforce aspect ratios and optimize **CLS (Cumulative Layout Shift)**, preventing jarring layout shifts during loading.

---

## Key Features

- **Authentication**: Sign up / Login / Cross-tab session sync (Firebase Auth).
- **Payment Integration**: Subscription flow and real-time access control (Stripe + Firestore).
- **Streaming Experience**: Dynamic Hero Banner and categorized horizontal carousels.
- **Video Details**: Asynchronous data fetching with YouTube trailer embedding.
- **My List**: Real-time CRUD operations synchronized with the database.

---

## Tech Stack

- **Framework**: Next.js (Pages Router), React
- **Language**: TypeScript (Type-first design)
- **Testing**: Jest, React Testing Library
- **Styling**: Tailwind CSS
- **State**: Recoil (Atomic state management)
- **Auth/Backend**: Firebase Auth, Firestore
- **Payments**: Stripe SDK
- **External API**: TMDB API

---

## Project Structure & Design Principles

This project follows the standard Next.js directory structure combined with the Separation of Concerns (SoC) principle:

```text
pages/          # Next.js routes and page entry points
components/     # UI Components (Atomic and Layout components)
hooks/          # Custom hooks for business logic (useSubscription, useAuth)
atoms/          # Recoil state definitions (e.g., Modal state)
lib/            # External service configurations (Stripe, Firebase)
utils/          # API helpers and typed fetching logic
constants/      # Global constants and API configurations
types/          # Global TypeScript types and interfaces

```

- **Pure UI Components**: Components focus solely on rendering and do not call APIs directly, ensuring a clean view layer without side effects.
- **Separation of Logic & UI**: Business logic (Firebase, Stripe) is decoupled from UI components into custom hooks for better maintainability.
- **Type-safe API Fetching**: Strictly defined API response types with TypeScript, handled within the utils layer to minimize runtime errors.
- **Atomic State Management**: Leveraged Recoil for global UI states to prevent over-rendering and maintain high performance.
- **Strict Typing**: Enforced strict typing with Interfaces; avoided the use of `any` to ensure system stability.

---

## Quality Assurance

- **CI/CD**: Automated deployment via Vercel.
- **Testing**: Implemented **Jest** and **React Testing Library** for unit testing critical business logic (e.g., useSubscription), ensuring robust handling of loading, error, and permission states.

- **Code Standards**: Configured Pre-commit hooks to enforce ESLint and Prettier checks, ensuring code consistency and quality.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yuting813/TMDB-Streaming-Architecture.git
cd TMDB-Streaming-Architecture
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Run unit tests

```bash
npm run test
```

---

##About Me

This project demonstrates how I translate my analytical logic from a procurement career into systematic frontend engineering.

- **Email**: tinahuu321@gmail.com
- **LinkedIn**: [Tina Hu](https://www.linkedin.com/in/tina-hu-frontend)
- **GitHub**: [yuting813](https://github.com/yuting813)

Note: This project was completed during my career transition to showcase engineering decisions and architectural clarity.

> **Educational Purpose Disclaimer**
> This project is for portfolio demonstration and educational purposes only. It is **NOT** a commercial product and is not affiliated with Netflix or any streaming service. All movie data is sourced from [TMDB API](https://www.themoviedb.org/).
