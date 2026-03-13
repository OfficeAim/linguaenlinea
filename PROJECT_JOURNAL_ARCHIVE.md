# PROJECT JOURNAL ARCHIVE: Linguaenlinea 2026
(Detalles históricos de las fases completadas hasta el 13 de marzo de 2026)

## ⏳ PENDING — Revisit these items (Copied from active journal)
- [ ] [PRIORITY: HIGH] Live Site Mobile Audit (March 12, 2026): Open https://linguaenlinea.vercel.app on a physical smartphone. Check if the Animated Shader Background and the Official Logos render smoothly without lag.
- [ ] [PRIORITY: HIGH] Production Contact Test (March 12, 2026): Submit a real message through the /contact form on the live Vercel URL to verify the Resend API and DNS verification in the production environment.
- [ ] [PRIORITY: HIGH] Roadmap Decision (March 12, 2026): Decide the next build phase: Google OAuth Integration for user accounts or the Bilingual Spanish Verb Conjugator widget.
- [ ] EXECUTION POLICY — Add to project-constitution.md:
      [MICRO] execute immediately
      [FEATURE] show plan then auto-execute  
      [ARCHITECTURE] wait for explicit approval
- [ ] Spanish Verb Conjugator — Build as /dashboard/conjugador
      Bilingual (NL/EN), connects to active lessons
      API option: Verbix free tier or hardcoded top 100 verbs
- [x] Vercel deploy — production launch
- [x] Login page (/login) con Supabase Auth
- [x] Logout button en student dashboard
- [x] Parental Consent logic for minors (<16)
- [ ] [PRIORITY: HIGH] Connect linguaenlinea.eu domain in Vercel
- [ ] [PRIORITY: HIGH] Rename Vercel project from "frontend" to "linguaenlinea"
- [ ] [PRIORITY: HIGH] Fix RLS policies for `quiz_results` in Supabase
- [ ] [PRIORITY: MEDIUM] Guided tour for new students on Dashboard
- [ ] [PRIORITY: MEDIUM] Move "Spaans klinkt anders" (Phonetic Intro) screen before Lesson 1
- [ ] [PRIORITY: MEDIUM] Implement 3-role architecture (Student, Teacher, Admin)
- [ ] [PRIORITY: MEDIUM] Admin and Teacher Dashboards
- [ ] [PRIORITY: LOW] Create contact@linguaenlinea.eu with Zoho Mail
- [ ] [PRIORITY: HIGH] Physical device responsive audit
- [ ] ARCHITECTURE: Sistema de 3 roles (student/teacher/admin) en Supabase
- [ ] Dashboard Admin (/admin):
      - Lista estudiantes + progreso
      - Métricas (XP, streaks, quizzes)
      - Bug reports internos
      - Chat/respuestas a estudiantes
- [ ] Dashboard Profesor (/teacher):
      - Ver sus grupos
      - Inscribir/dar de baja estudiantes
      - Ver progreso del grupo
- [ ] Priority: ARCHITECTURE — necesita aprobación antes de implementar
- [x] Google OAuth login (Supabase SSR)
- [x] Fix Runtime PageNotFoundError (Turbopack/src-middleware conflict)
- [x] Generate Lesson 2 Pedagogical RAG content
- [x] Implement Lesson 2 UI components (Matching Game, Video Player)

## Project Context
- **Stack**: Next.js, TypeScript, Tailwind, Supabase.
- **Audience**: Dutch secondary level students (SLO Track) and Open Track learners worldwide.
- **Goals**: Create an adaptive, interest-based Spanish platform that feels premium and localized.

## Session Log (Phase 1 & Infrastructure)

### Session: 2026-03-07
- **Problem**: Resend API key caused build failures in Vercel.
- **Solution**: Initialized Resend with a fallback empty string.

### Session: 2026-03-08
- **Decisions**: Implemented ContainerScroll, Particle Text Engine, and Perfil Photos.
- **Problem**: Landing page CTA contrast.
- **Result**: Fixed invisible button.

## Session Log (Auth, Responsive, Branding)

### Session: 2026-03-10
- **What**: Branding Unification, StudyLamp assistant ('Jorge Lamp'), GDPR Cookie Banner.

### Session: 2026-03-11
- **What**: Supabase credentials, GitHub push, Vercel deployment.

### Session: 2026-03-12
- **What**: Full Auth System (Supabase SSR), Parental Consent logic, Responsive Overhaul, Hydration Mismatch fixes.

### Session: 2026-03-12 (Auth Loop Fix)
- **What**: Overhauled auth redirect logic in middleware. Explicit cookie propagation.

### Session: 2026-03-12 (UI Polish)
- **What**: Replaced PNG placeholders with Lucide React icons.

## Session Log (Lesson 2 & Bugfixes)

### Session: 2026-03-13 (Bug Fix: Turbopack)
- **What**: Consolidated middleware into `src/middleware.ts`. Fixed 404/500 errors.

### Session: 2026-03-13 (Lesson 2 RAG & Database)
- **What**: Structured Lesson 2 content based on NotebookLM. Injected into Supabase.

### Session: 2026-03-13 (Lesson 2 Components & Refactoring)
- **What**: Implemented `VocabularyMatchingGame.tsx` and dynamic `LessonView.tsx`.
- **Learned**: JSON mapping for interactive dialogues.

---
*Fin del Archivo Histórico (Fase 1 y 2)*
