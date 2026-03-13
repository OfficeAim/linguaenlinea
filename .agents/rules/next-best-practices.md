# SKILL: NEXT.JS APP ROUTER & REACT BEST PRACTICES
> **[SYSTEM DIRECTIVE]** 
> Apply these rules strictly whenever creating or modifying Next.js components, pages, or routing logic for Linguaenlinea.

## 1. ARCHITECTURE & COMPONENTS (SERVER VS CLIENT)
- **Server Components by Default:** All components inside `app/` are Server Components by default. Use them for fetching data and rendering static HTML.
- **Client Components (`"use client"`):** ONLY use `"use client"` at the top of the file if the component requires:
  - React hooks (`useState`, `useEffect`, `useContext`).
  - Browser APIs (`window`, `localStorage`).
  - Event listeners (`onClick`, `onChange`).

## 2. STRICT ROUTING & NAVIGATION (LEARNED FROM ENGRAM)
- **Current Path:** NEVER use `useRouter().pathname` (it is deprecated in App Router and causes crashes). ALWAYS use `usePathname()` from `next/navigation`.
- **Back Navigation:** Prefer `router.push('/')` instead of `router.back()` to avoid confusing loops if the user navigated directly to a subpage.
- **Auth Redirects:** For critical authentication gates (like clearing session state after login/logout), use `window.location.href` instead of `router.push` to guarantee full page reloads and state clearance.

## 3. HYDRATION MISMATCH PREVENTION (LEARNED FROM ENGRAM)
- **Dynamic Data:** NEVER use dynamic values like `new Date()`, `Math.random()`, or browser globals (`window`, `localStorage`) directly in the render body of a component.
- **The Mounted Pattern:** If you need to access client-side objects or dynamic data, you MUST implement a `mounted` state pattern:
  ```tsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // or a skeleton loader
  // Safe to use window or dynamic data here
4. API ROUTES (ROUTE HANDLERS)
App Router API routes must be placed in app/api/[route]/route.ts.
Static vs Dynamic: If an API route uses external services (like Resend) or reads cookies, you MUST add export const dynamic = 'force-dynamic' at the top of the file to prevent Vercel static generation build collisions.
5. UI & STYLING
Always rely on Tailwind CSS for styling.
Use Lucide React for all iconography. Never use heavy static PNGs for UI icons.
Ensure the "Premium Dark Mode" aesthetic by utilizing the brand tokens (Coral #e63946, Gold, Dark background #1a1a2e).