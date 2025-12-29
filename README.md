---

# Netflix Clone (Next.js + TypeScript)

A Netflix-inspired streaming web application built as a **career-transition portfolio project**, focusing on **frontend engineering quality, UX details, and real-world integrations**.

[Live Demo](https://stream.tinahu.dev) | [Source Code](https://github.com/yuting813/netflix-clone-nextjs)

---

## Overview

This project replicates core Netflix user experiences, including authentication, subscription-based access control, content browsing, and interactive media previews.

The primary goal of this project is to demonstrate **practical frontend engineering skills**, such as:

* Maintainable project structure
* Typed API integration
* UI/UX edge case handling
* Authentication and subscription flows
* Clean commit history and engineering conventions

---

## Tech Stack

* **Framework:** Next.js, React
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** MUI (Modal), Emotion
* **State Management:** Recoil
* **Authentication:** Firebase Auth
* **Database:** Firestore
* **Payments:** Stripe Checkout
* **External API:** TMDB API
* **Tooling:** ESLint, Prettier

---

## Core Features

### Media Browsing and Modal Experience

* Movie and TV show previews displayed in an interactive modal
* Trailer loading state with visual feedback
* Graceful fallback when trailers are unavailable
* Keyboard interaction support (Esc to close modal)
* Responsive layout adapted for desktop and mobile screens

---

### Authentication and Route Protection

* Centralized authentication state management via custom hooks
* Automatic redirect for unauthenticated users
* Redirect race condition fixes during authentication state initialization
* Session expiration handling based on authentication state

---

### API Architecture

* TMDB requests centralized into typed helper functions
* Clear separation between most data fetching logic and UI rendering
* Basic error handling with fallback UI and user feedback
* Reduced duplication across components through shared utilities

---

### Subscription Flow

* Stripe Checkout integration for subscription payments
* Firestore-based subscription status synchronization
* UI behavior dynamically adjusted based on subscription state
* Subscription flow designed to resemble real-world product behavior

---

## Project Structure

```
components/   Reusable UI components
hooks/        Custom hooks for business logic (auth, subscription, lists)
utils/        API helpers and shared utilities
atoms/        Recoil state definitions
constants/    Shared constants (e.g., TMDB image base URL)
lib/          Service helpers (Stripe, etc.)
pages/        Next.js routing + API routes
types/        Shared TypeScript types
```

The structure emphasizes separation of concerns and long-term maintainability.

---

## Recent Highlights

The following commits best represent my current engineering practices:

* feat(modal): improve trailer loading and fallback UX
* refactor(tmdb): centralize TMDB API requests into typed helper
* fix(auth): remove redirect race and centralize auth error handling
* style(header): adjust responsive padding for improved layout spacing

---

## Project Evolution

This project was originally created as a self-learning playground when I first started exploring React and Next.js.

Early commits may appear informal, reflecting experimentation and exploration during the learning phase.

Over the past year, I have treated this repository as a **career-transition portfolio project**, progressively improving it with:

* Consistent commit conventions
* Refactored API architecture
* Improved authentication flow
* UX and accessibility refinements
* A more maintainable project structure

Recent commits and features best represent my current engineering mindset and practices.

---

## Engineering Focus

Throughout this project, I focused on:

* Writing code that is easy to explain in interviews
* Handling common real-world edge cases encountered during development
* Prioritizing clarity, maintainability, and UX over feature count
* Treating this side project as a production-like system for learning purposes

---

## Future Improvements

Potential next steps if this project were to be extended:

* Migration to Next.js App Router
* Component and integration testing
* Performance analysis and optimization
* Improved error boundary and retry strategies

---

## About

This project is part of my transition into a frontend engineering role.
I enjoy refining user experience details, structuring codebases for clarity, and learning through real-world implementations.

**Contact:** [tinahuu321@gmail.com](mailto:tinahuu321@gmail.com) | [LinkedIn](https://www.linkedin.com/in/tina-hu-frontend) | [GitHub](https://github.com/yuting813)

---
