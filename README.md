# SMT Admin (`smt-fe`)

The admin console for the SMT tattoo studio API ([`smt-be`](../smt-be)). It manages
bookings, the public portfolio, merch, and the design catalogue.

The architecture follows the `KerbsD/crud-practice-2026` feature-folder layout, with a
few deliberate upgrades:

- **TanStack Query** for all server state instead of axios + hand-rolled effects.
- **react-hook-form + zod** instead of formik + yup.
- **Route groups** (`(auth)` / `(dashboard)`) with a real session guard.
- A typed `fetch` client with automatic, single-flight token refresh.

## Stack

| Concern          | Choice                                                        |
| ---------------- | ------------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript    |
| Server state     | TanStack Query v5 (+ devtools in development)                 |
| Forms            | react-hook-form + zod (`@hookform/resolvers`)                 |
| Styling          | Tailwind CSS v4 · hand-rolled UI kit · Radix Dialog            |
| Client state     | zustand (access token only)                                   |
| Feedback         | sonner toasts · lucide-react icons                            |

## Requirements

- Node.js 20+ (the backend itself needs Node ≥ 22.18)
- `smt-be` running on **http://localhost:3000**
- This app runs on **http://localhost:3001** (the API owns 3000)

## Getting started

```bash
cd smt-fe
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

Point the backend at the frontend's origin so CORS and cookie auth work:

```dotenv
# smt-be/.env
CORS_ORIGINS=http://localhost:3001
CLIENT_URL=http://localhost:3001
```

`CLIENT_URL` also controls the verification / reset links sent by email:
`${CLIENT_URL}/verify-email#token=…` and `${CLIENT_URL}/reset-password#token=…`.

## Scripts

| Command             | Purpose                                |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Dev server on port 3001 (Turbopack)    |
| `npm run build`     | Production build                       |
| `npm run start`     | Serve the production build on 3001     |
| `npm run lint`      | ESLint (includes React Compiler rules) |
| `npm run typecheck` | `next typegen` + `tsc --noEmit`         |

## Project structure

```text
src/
├─ api/            Typed request functions, one module per resource
├─ app/
│  ├─ (auth)/      Public auth screens (shared split-screen layout)
│  └─ (dashboard)/ Guarded admin screens (AuthGuard + AppShell)
├─ components/
│  ├─ layouts/     AppShell, AuthShell, AuthGuard, skeletons
│  ├─ providers/   QueryClient provider
│  └─ ui/          Tailwind UI kit (button, dialog, table primitives…)
├─ configs/        Env, navigation, zod schemas
├─ context/        AuthProvider — bootstraps the session
├─ lib/            fetch client, query keys, formatting, hooks
├─ modules/        Feature folders (Auth, Booking, Portfolio, Merch, Design, Dashboard)
├─ store/          zustand auth store (in-memory token)
└─ types/          Domain models and API envelopes
```

Each feature folder keeps its page component, form dialog, query hooks, and mutations
together. Shared visual primitives live in `components/ui`, never in feature folders.

## Authentication model

The backend issues a short-lived **access token** in the JSON body and a rotating
**httpOnly refresh cookie** scoped to `/auth`.

- The access token lives **in memory only** (zustand). It is never written to
  `localStorage`, so XSS cannot exfiltrate a long-lived credential.
- Every request sends `Authorization: Bearer <token>`.
- On a `401` from a non-auth endpoint, the client performs **one** `POST /auth/refresh`
  (concurrent 401s share the same promise so the rotating refresh token is only used
  once) and replays the original request.
- On page load, `AuthProvider` calls `/auth/refresh` once to discover whether the
  refresh cookie is still valid. Until that resolves, `AuthGuard` shows a full-page
  loader; after it resolves without a token, the user is redirected to
  `/login?next=<path>` (the `next` value is sanitized to same-app paths).
- `/auth/refresh` and `/auth/logout` require a trusted `Origin` on the backend, so the
  frontend always calls them with `credentials: "include"`.
- Email verification and password reset tokens are delivered in the URL **hash**
  (`#token=…`), keeping them out of server logs and `Referer` headers. The frontend
  reads them with a hydration-safe `useSyncExternalStore` hook.

## Server state conventions

- Query keys are centralized in `src/lib/query-keys.ts`; mutations invalidate a whole
  resource prefix (e.g. `["bookings"]`), which also refreshes dashboard counters.
- Lists use `keepPreviousData` so pagination and filtering don't flash empty.
- API errors become a typed `ApiError` with `status`, `fieldErrors`, and the raw
  payload. `applyApiErrors` maps `{ errors: [{ field, message }] }` onto form fields.
- All management screens call the `/admin/*` endpoints. Nothing is persisted in
  component state beyond UI concerns.

## Notes on Next.js 16

This project uses `cacheComponents` and `partialPrefetching`. Any client hook that reads
the URL (`useSearchParams`) is wrapped in `<Suspense>` at the page level. Because the
data layer is entirely client-side TanStack Query, pages are still statically
prerendered and hydrate into the live dashboard.

The dashboard layout and pages export `instant = false`: the admin console is
client-rendered behind a session guard, so it deliberately blocks on the auth
bootstrap instead of prerendering a cached shell. This opts those segments out of
the dev-only instant-navigation validator.
