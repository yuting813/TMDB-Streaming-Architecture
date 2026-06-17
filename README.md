[English](README.md) | [繁體中文](README.zh-TW.md)

# TMDB Streaming Architecture — Frontend Engineering Portfolio

This is not a simple "feature showcase" project. It is an engineering architecture proof-of-concept focused on **asynchronous state dependency chains** and **edge cases**. It demonstrates how to design a **predictable, foolproof, and highly defensive** state management system across three asynchronous data streams: **Firebase Auth (Identity)**, **Stripe (Subscription/Payment)**, and **TMDB (Static Data)**.

- **Live Demo**: [stream.tinahu.dev](https://stream.tinahu.dev/)
- **Demo Account**: Email `demo@tinahu.dev` / Password `Demo1234!` (Includes Stripe test subscription permissions)

---

## Core Architecture & Engineering Decisions

### 1. Guarded Render Chain

Firestore queries can only be initiated after the Firebase Auth state is confirmed—this is a natural waterfall dependency. Using a single complex `if` statement would result in unmaintainable logic.

**Design Decision**: Implemented a strict early-return chain in `pages/index.tsx`, where each layer focuses exclusively on a single defensive boundary:

```tsx
// Layer 1 — Loading Guard: Full-screen Spinner if any data source is loading
if (authLoading || subscriptionLoading) return <Loader />;

// Layer 2 — Auth Guard: Block rendering for unauthenticated users
// (Redirect is handled by the onAuthStateChanged callback inside useAuth)
if (!user) return null;

// Layer 3 — Error Handling: Fallback UI for Firestore connection failures
if (subscriptionError) return <ErrorState />;

// Layer 4 — Permission Guard: Lock users without active subscriptions to the Plans page
if (!subscription) return <Plans products={products} />;

// Layer 5 — Mount the main core component after passing all guards
return <MainContent />;
```

The advantage: If new edge cases need to be added in the future, simply insert another `if` layer without risking regression bugs.

---

### 2. `initialLoading` — The Root Solution to FOUC

Firebase authentication relies on asynchronous callbacks. Before the SDK confirms the user's state, `user` temporarily resolves to `null`. If route guards are triggered at this exact moment, an already-logged-in user will experience a severe Flash of Unauthenticated Content (FOUC) from the "Login Page → Home Page".

**Design Decision**: Implemented a robust `initialLoading` timing lock within `useAuth`. Children rendering is forcibly intercepted until the first `onAuthStateChanged` callback confirmation is received:

```tsx
<AuthContext.Provider value={memoedValue}>
	{initialLoading ? <Loader /> : children}
</AuthContext.Provider>
```

---

### 3. API Defense Layer: The Three Lines of Defense for `tmdbFetch`

Direct usage of native `fetch()` within components is strictly prohibited. All network requests are routed through `utils/request.ts`, enforcing three major protections:

1. **Request Deduplication (In-flight Cache)**: `getStaticProps` runs 8 requests in parallel, and different routing pages may contain duplicate URLs. Using a module-level `Map<string, Promise>` cache, identical URLs return the exact same Promise instance, blocking duplicate traffic. If the Promise rejects, the cache entry is automatically cleared to allow retries.
2. **Build Hang Prevention (Timeout)**: An `AbortController` with an 8-second timeout is built-in to prevent unstable TMDB network conditions from causing Next.js builds to hang indefinitely.
3. **Safe Interruption Aggregation (`mergeAbortSignals`)**: Perfectly unifies "Network Timeout Events" and "Component Unmount Events". Firing an Abort from either side cleanly terminates the underlying `fetch`. After aborting, `removeEventListener` is synchronously executed to clear the listeners of both original signals, completely eradicating React Memory Leaks and dangling asynchronous callbacks. (Note: hand-rolled as a Safari polyfill — `AbortSignal.any()` is not supported in older Safari versions.)

---

### 4. Modal Race Condition Defense (Stale Result Cancellation)

When a user rapidly clicks through the movie list, an old `fetch` result might arrive after a new Modal has already rendered, overwriting the state and causing UI corruption (Race Condition).

**Design Decision**: Integrated the Cancellation Token Pattern, giving asynchronous requests the ability to self-invalidate:

```tsx
let active = true;
async function fetchMovie() {
  const data = await tmdbFetch(...);
  if (!active) return; // Discard stale results upon component unmount to prevent state pollution
  setTrailer(key);
}
return () => { active = false; };
```

---

### 5. Dual-Track State Architecture: ISR + Firestore

The update frequencies of the movie list and user profile data are vastly different. Forcing them into the same data layer would lead to state decoupling. This project splits the data flow based on its characteristics:

| Track               | Mechanism                                              | Trigger Timing                           | Single Source of Truth (SSOT) |
| ------------------- | ------------------------------------------------------ | ---------------------------------------- | ----------------------------- |
| Movie Category Data | Next.js ISR (`getStaticProps` + `revalidate: 3600`)    | Build Time + Hourly background increment | TMDB API                      |
| User Profile Data   | Firestore `onSnapshot` (`useList` / `useSubscription`) | Real-time push on any DB change          | Firestore                     |

**Design Decision**: For the user's "My List", I abandoned the traditional approach of storing state in Redux/Recoil before asynchronously pushing it to the backend. Instead, Firestore is used directly as the SSOT. The component is only responsible for triggering writes and relies on `onSnapshot` to passively receive changes, completely eliminating the risk of state inconsistency caused by premature UI updates.

**Error Fallback**: The `catch` block in `getStaticProps` returns an empty array when a TMDB request fails and shortens the `revalidate` to 60 seconds, ensuring a quick rebuild retry after a build failure.

---

### 6. State Selection: Context vs. Recoil (Decoupling by Data Flow)

- **Auth (React Context)**: Authentication state is a top-of-the-tree dependency with a low mutation frequency. `useAuth` encapsulates the complete Firebase subscription lifecycle and automatic logout timer protection, using `useMemo` to block rendering noise.

- **UI State (Recoil Atom)**: Using Context for Banner, Thumbnail, and Modal would trigger large-scale, unnecessary re-renders. This system uses Recoil atoms as a lightweight Publish/Subscribe event bus, completely decoupling the components—clicking a Thumbnail simply calls `setCurrentMovie(movie)` without any Prop Drilling.

  **Write-Side Isolation**: `Thumbnail` utilizes `useSetRecoilState` (pure write setter) instead of `useRecoilState`. Because the Thumbnail only needs to dispatch state and never read it, `useSetRecoilState` ensures that none of the thumbnail components are registered as subscribers to the Recoil atom, completely eradicating the O(N) chain-rendering issue where "clicking any thumbnail causes all thumbnails on the screen to re-render simultaneously". The `Home` page itself also holds no references to `modalState`, ensuring page-level components are fully detached from the UI interaction state subscription chain.

---

## System Architecture Diagram

```mermaid
graph TD
    subgraph "Build Time — ISR"
        A[getStaticProps] -->|Promise.all x8| B["tmdbFetch&lt;T&gt;()"]
        B -->|revalidate 3600| C[Static HTML + Props]
    end

    subgraph "Runtime — Auth Layer"
        D[Firebase onAuthStateChanged] --> E[AuthProvider Context]
        E -->|initialLoading gate| F[App Children Mounted]
    end

    subgraph "Runtime — Firestore Realtime"
        E -->|user.uid| G[useSubscription onSnapshot]
        E -->|user.uid| H[useList onSnapshot]
        G -->|subscription / loading / error| I[5-Layer Guard Chain]
        H -->|list array| J[My List Row]
    end

    subgraph "UI State — Recoil"
        K[Banner / Thumbnail] -->|setCurrentMovie + setShowModal| L[Recoil Atoms]
        L -->|movieState / modalState| M[Modal Component]
    end

    C --> I
    I -->|All guards pass| N[Full Home Page]
    N --> K
```

---

## Edge Case Handling & Quality Assurance

- **3-State Image Machine**: Every image component maintains three states—Loading (`animate-pulse` Skeleton to prevent CLS), Success (`opacity-100` fade-in to prevent flashing), and Failure (local fallback image to prevent broken links). `onError` simultaneously triggers `setIsLoaded(true)`, ensuring the skeleton instantly disappears once the fallback initiates. Implemented in both `Thumbnail.tsx` and `Modal.tsx`.
- **Immutable Route Whitelist**: `Object.freeze(['/login', ...])` ensures that the Auth guard's judgment criteria cannot be accidentally mutated by any module at runtime.
- **Jest Unit Testing**: Focused on `useSubscription`, utilizing Mock Firestore to test 6 boundary state machine transitions: `null user`, `empty list`, `onSnapshot error`, `loading`, `subscription active`, and `subscription inactive`, validating robustness under extreme scenarios.

---

## Project Structure

```
pages/          # Routing entry points (Keep logic minimal, delegate complexity to Hooks)
components/     # UI Presentation Layer (Does not handle direct API calls)
hooks/          # Defensive state management logic (useAuth / useSubscription / useList)
atoms/          # Atomic Recoil state
utils/          # API forwarding interface and network layer defense implementations
```

## Firestore Data Schema

```
customers/
  {uid}/
    subscriptions/
      {subscriptionId} → { status, current_period_start, current_period_end }
    myList/
      {movieId} → { id, title, poster_path, backdrop_path, ... }

products/
  {productId}/
    prices/
      {priceId} → { unit_amount, currency, interval }
```

> **Security Rule**: `customers/{uid}` and its sub-collections (`subscriptions`, `checkout_sessions`, `payments`) are restricted to `request.auth.uid == uid`. `products/**` is publicly readable (`if true`) since it contains only plan metadata. Write access to subscription records is reserved for the Stripe Firebase Extension webhook — no client-side write is permitted.

---

## About Me

My past 6 years in procurement management trained me to have a heightened sensitivity toward "Risk Control" and "Extreme Scenario Anticipation". While transitioning into a Frontend Engineer, I channeled this mindset into a pursuit of **Defensive Design**.

This project is the physical manifestation of that mindset: the three-state planning of every component, the interruption logic of every AbortSignal, and the caching of every layer of Promise requests all reflect my deep consideration for "How do we guarantee UI consistency when the system is imperfect?".

- **Website**: [tinahu.dev](https://www.tinahu.dev/)
- **GitHub**: [yuting813](https://github.com/yuting813)
- **Email**: tinahuu321@gmail.com

> **Educational Use Disclaimer**
> This project is solely for personal technical demonstration and educational purposes. It is **NOT** a commercial product and is not affiliated with any streaming media service. All movie data is provided by the [TMDB API](https://www.themoviedb.org/).
