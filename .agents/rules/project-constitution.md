---
trigger: always_on
---

# PROJECT CONSTITUTION: LINGUAENLINEA 2026

## 1. MISSION & IDENTITY
- **Name:** Linguaenlinea 2026
- **Purpose:** An adaptive, interest-based Spanish learning platform for free.
- **Core Content:** Merge "Aprendamos Español" (Cuba) with "Aula América" structure.
- **Cultural Scope:** Pan-Latin American. Dutch Track must align with SLO 2026 Kerndoelen 37, 38, 39.

## 2. TOOL HIERARCHY & ORCHESTRATION (NON-NEGOTIABLE)
- **Antigravity:** Main orchestrator. Executes steps and coordinates tools.
- **NotebookLM (RAG):** Pedagogical source of truth. Consult it before generating ANY educational content.
- **Stitch MCP:** Exclusive UI designer. No manual HTML/CSS if Stitch is available.
- **N8N:** Responsible for ALL automations (emails, alerts).
- **Supabase MCP:** Single source of truth for user data and backend.

## 3. CORE BUSINESS LOGIC
- **Progression:** Lesson N+1 locked until Lesson N is completed (Quiz score ≥ 70%).
- **Onboarding:** Personalization Test required before Lesson 1.
- **Dual Tracks:** Dutch Track (SLO 2026 compliance) vs. Open Track.

## 4. SKILLS REGISTRY (Lazy Loading)
To avoid context overload, Antigravity MUST NOT load all rules at once. 
- Read `.agents/SKILLS.md` to see the index of available skills.
- Read specific technical rules located inside the `.agents/rules/` folder ONLY when the specific domain is required for the current task.

## 5. PERSISTENT MEMORY (ENGRAM PROTOCOL)
- **Startup:** At the beginning of EVERY session, strictly execute `.agents/session-startup.md`.
- **Closure:** Update `.agents/SESSION_HISTORY.md` to track time and progress.
- **Journaling:** Every entry in `.agents/PROJECT_JOURNAL.md` MUST use the Engram format:
  - **What:** What was implemented/fixed.
  - **Why:** The architectural reason behind the decision.
  - **Where:** Files modified.
  - **Learned:** New knowledge or avoided bugs for future context.

## 6. EXECUTION POLICY (SDD & HITL)
- **[MICRO]:** Small fixes — execute immediately.
- **[FEATURE]:** Spec-Driven Development. 1) Explore codebase. 2) Propose Spec & Design. 3) WAIT for my Human-in-the-Loop approval.
- **[ARCHITECTURE]:** Major changes — require explicit approval before any execution.