# SKILLS REGISTRY & AUTOMATION (LINGUAENLINEA 2026)

> **[SYSTEM DIRECTIVE: LAZY LOADING]**
> Antigravity MUST act as a router. DO NOT load or assume business rules unless the current task specifically triggers them. When a trigger matches, silently read the target file before proceeding.

## 🛠 GLOBAL AUTOMATIONS (Always Active)

- **TRIGGER: User types `/start`**
  - **ACTION:** Immediately execute `.agents/session-startup.md`. Do not ask for confirmation.

- **TRIGGER: Completing a task boundary or major milestone**
  - **ACTION:** Automatically append a new entry to `.agents/PROJECT_JOURNAL.md`. You MUST strictly use the Engram format (What / Why / Where / Learned). 

- **TRIGGER: A new external integration is added (N8N, OAuth, Payment, etc.)**
  - **ACTION:** Automatically update `.agents/MASTER_PLAYBOOK.md` (Section 5: Integrations & Automations) with the new tool's purpose and config.

- **TRIGGER: System is copied to a new directory (Project Init)**
  - **ACTION:** Prompt the user for: 1) Project goal & audience, 2) Tech stack, 3) Required integrations.

## 🧠 SKILLS ROUTER (Load Only When Needed)

- **DOMAIN: UI Animations, Styling, and Frontend Components**
  - **TRIGGER:** User asks to build UI, animations, or landing pages.
  - **ACTION:** Read `.agents/MASTER_PLAYBOOK.md` (Section 4: Animations & UI Components). Follow the 21st.dev guidelines and enforce the Premium Dark Mode aesthetic (Coral & Gold).

- **DOMAIN: Database, Authentication & Backend**
  - **TRIGGER:** Task involves Supabase, RLS policies, user profiles, or Auth loops.
  - **ACTION:** Read `.agents/rules/supabase-auth.md` *(Note: Read this file only if it exists).*

- **DOMAIN: Gamification & Progression Logic**
  - **TRIGGER:** Task involves XP, Energy tokens, streaks, or locking/unlocking lessons.
  - **ACTION:** Read `.agents/rules/gamification.md` *(Note: Read this file only if it exists).*

- **DOMAIN: Pedagogical Content & NotebookLM (RAG)**
  - **TRIGGER:** User asks to generate lessons, quizzes, ERK/SLO alignment, or contrastive grammar (L1 sensitivity).
  - **ACTION:** Read `.agents/rules/pedagogy-rag.md` *(Note: Read this file only if it exists).*
