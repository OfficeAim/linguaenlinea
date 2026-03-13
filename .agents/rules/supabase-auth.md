# SKILL: SUPABASE, AUTH & POSTGRES BEST PRACTICES
> **[SYSTEM DIRECTIVE]** 
> Apply these rules strictly whenever creating or modifying Supabase database schemas, Row Level Security (RLS) policies, or Authentication flows for Linguaenlinea.

## 1. AUTHENTICATION & RLS POLICIES (LEARNED FROM ENGRAM)
- **Email Confirmation vs RLS:** If "Email Confirmation" is enabled in Supabase, the user is not immediately authenticated upon registration (`auth.uid()` evaluates to null). This will break RLS `INSERT` policies for tables like `profiles`. If the UX requires instant login/profile creation post-registration, ensure "Email Confirmation" remains disabled in the Supabase dashboard.
- **Row Level Security (RLS):** ALWAYS enable RLS on every new table (e.g., `profiles`, `quiz_results`). Use policies based on `auth.uid() = id` or `auth.uid() = student_id` to restrict access strictly to the authenticated user.

## 2. ERROR HANDLING IN SUPABASE (LEARNED FROM ENGRAM)
- **Silent Serialization Errors:** Supabase Auth `Error` objects serialize as empty objects `{}` in standard console logs. NEVER use standard `console.log(error)` in `catch` blocks for Supabase. ALWAYS use `console.log(Object.getOwnPropertyNames(error))` or explicitly log `error.message`, `error.status`, and `error.name` for exhaustive debugging.

## 3. SUPABASE SSR & MIDDLEWARE (LEARNED FROM ENGRAM)
- **Client Instantiation:** Always use the modern `@supabase/ssr` package (`createBrowserClient` for client components, `createServerClient` for server components/routes) for robust cookie-based authentication.
- **Middleware Cookie Persistence:** In Next.js `middleware.ts`, you MUST explicitly copy session cookies from the initial Supabase response to the Next.js redirect response object. Failure to do this causes session loss and infinite redirection loops between `/login` and `/dashboard`.

## 4. DATABASE ARCHITECTURE
- **Single Source of Truth:** `profiles` table is the core entity holding `l1`, `track` preference, and gamification states (XP, Energy, Streaks).
- **Relational Integrity:** Ensure foreign keys (like `student_id` in `lesson_progress`) properly reference the `profiles` table with `ON DELETE CASCADE` where appropriate.
