# Specification: Google OAuth Integration (Linguaenlinea 2026)

## 1. Overview
Implement Google OAuth authentication using `@supabase/ssr` within the Next.js App Router architecture. This specification follows the **Spec-Driven Development (SDD)** pipeline and adheres to the project's security and performance rules.

## 2. Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Auth Provider**: Supabase Auth (Google Provider)
- **Client Library**: `@supabase/ssr`
- **UI Components**: Tailwind CSS + Lucide React (Premium Dark Mode)

## 3. Architecture & Components

### 3.1. Supabase SSR Utilities (`frontend/utils/supabase/`)
We need to ensure the standard SSR clients are implemented:
- `client.ts`: Uses `createBrowserClient` for Client Components.
- `server.ts`: Uses `createServerClient` for Server Components, Actions, and Route Handlers.
- `middleware.ts`: Located in `frontend/middleware.ts`, responsible for refreshing the session and persisting cookies.

### 3.2. Auth Callback Handler (`app/auth/callback/route.ts`)
A GET route handler to exchange the temporary `code` for a permanent session.
- **Logic**:
  1. Extract `code` from URL parameters.
  2. Exchange code via `supabase.auth.exchangeCodeForSession(code)`.
  3. Redirect to the original `next` destination or `/hub` (Onboarding/Dashboard).
- **Flag**: `export const dynamic = 'force-dynamic'` to avoid build-time static generation.

### 3.3. Google Sign-In Trigger (UI)
A Client Component (e.g., inside `Onboarding` or `Login`) that calls:
```typescript
const signInWithGoogle = async () => {
  const supabase = createBrowserClient();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
```

### 3.4. Database & Profiles (`profiles` table)
- **Automatic Sync**: Ensure a Postgres trigger exists in Supabase to create a record in `public.profiles` when a new user signs up via Google.
- **Initial State**: New profiles should default to `FREE` tier and have `l1` set to Dutch (unless otherwise specified by the user's Google locale).

## 4. Logical Steps for Implementation

1. **Phase 1: Configuration**
   - Verify Supabase Dashboard has Google Provider enabled with `Client ID` and `Client Secret`.
   - Update `.env.local` with necessary keys.

2. **Phase 2: SSR Infrastructure**
   - Create/Verify `utils/supabase/server.ts` and `client.ts`.
   - Implement `middleware.ts` following the "Cookie Persistence" rule (explicitly copying cookies to the response).

3. **Phase 3: Callback Route**
   - Create `app/auth/callback/route.ts` to handle the OAuth flow redirect.

4. **Phase 4: UI Integration**
   - Add a "Sign in with Google" button to the `Login/Onboarding` flow using the brand's Coral/Gold aesthetic.
   - Implement the sign-in logic using `signInWithOAuth`.

5. **Phase 5: Verification**
   - Test the full loop: `Login -> Google Auth -> Callback -> Dashboard`.
   - Verify `profiles` entry is created.

## 5. Security & Best Practices
- **RLS**: All tables accessed after login must have RLS enabled.
- **Error Handling**: Use `Object.getOwnPropertyNames(error)` for Supabase errors as per `.agents/rules/supabase-auth.md`.
- **Hydration**: Use the "Mounted Pattern" if the login button depends on client-side state.

---
**Status**: Pending Human Approval [HITL]
