---
trigger: always_on
---

# PROJECT CONSTITUTION: LINGUAENLINEA 2026

## 1. MISSION & IDENTITY
- **Name:** Linguaenlinea 2026
- **Purpose:** An adaptive, interest-based Spanish learning 
  platform open to anyone who wants to learn Spanish — for free.
- **Core Content:** Merge "Aprendamos Español" (Cuba) content 
  with "Aula América" pedagogical structure.
- **Cultural Scope:** Pan-Latin American — Cuba, Argentina, 
  Mexico, Colombia, Peru, Spain and beyond.
- **Compliance:** Dutch Track must align with SLO 2026 
  Kerndoelen 37, 38, 39 (Moderne Vreemde Talen).

## 2. TOOL HIERARCHY (NON-NEGOTIABLE)
- **Antigravity:** Main orchestrator. Executes all steps 
  and coordinates all other tools.
- **NotebookLM:** Pedagogical source of truth. Antigravity 
  MUST consult it before generating ANY content modules, 
  SLO alignments, or cultural references.
- **Stitch MCP:** Exclusive UI designer. Antigravity must 
  not generate manual HTML/CSS if Stitch is available.
- **N8N:** Responsible for ALL automations (emails, alerts, 
  reports). No notification logic hardcoded in frontend.
- **Supabase:** Single source of truth for all user data, 
  progress, and content references.

## 3. DUAL LEARNING TRACKS
- **Dutch Track:** Full SLO 2026 compliance for Havo/Vwo 
  students. Maps all units to Kerndoelen 37, 38, 39 
  at ERK A1/A2 levels.
- **Open Track:** Free, interest-based Spanish learning 
  for anyone. No exam pressure. Same quality content.
- Track selection happens during Onboarding Test and is 
  stored in `profiles` table.

## 4. CORE BUSINESS LOGIC (NON-NEGOTIABLE)
- **Sequential Progression:** Lesson N+1 locked until 
  Lesson N is completed.
- **Completion Criteria:** Quiz score ≥ 70% required.
- **Onboarding:** Every new user must complete the 
  Personalization Test before accessing Lesson 1.

### REMEDIATION LOGIC
- Maximum 3 attempts per quiz.
- **Fail Attempt 2:** System suggests reviewing current lesson.
- **Fail Attempt 3:** 
  - Quiz blocked for 24 hours.
  - Automatic alert sent to Admin Dashboard.
- **Manual Reset:** Admins can reset attempts from Dashboard.

## 5. TECHNICAL ARCHITECTURE
- **Database:** Supabase
- **Tables Required:**
  - `profiles`: User info, L1, track preference, 
    interests, onboarding results, language preference.
  - `lessons`: id, title, content_url, audio_url, 
    slo_alignment, order_index, is_locked, track.
  - `lesson_progress`: id, student_id, lesson_id, 
    status (locked/in_progress/completed), 
    completed_at, score_required.
  - `quiz_results`: id, student_id, quiz_id, score, 
    attempts_count (integer, default 0), passed (boolean).
  - `bug_reports`: Student-submitted issues.
- **Audio Storage:** Supabase Storage bucket `audio-corpus`, 
  referenced via `audio_url` in lessons table.
- **Frontend:** Premium Dark Mode UI via Stitch MCP 
  (React/Next.js + Tailwind).

## 6. PERSONALIZATION ENGINE
- Native language (L1) — not assumed to be Dutch.
- Personal interests (music, food, travel, sports, 
  gaming, film, history, business, art).
- Learning track (Dutch Track / Open Track).
- Daily study time (10 / 30 / 60 minutes).
- Learning style (listening, reading, speaking, games).
- All preferences stored in `profiles` table.

## 7. LANGUAGE & TONE
- **Default Interface:** Dutch-Spanish.
- **Alternative:** English-Spanish.
- **Future:** Any L1-Spanish combination.
- **Cultural Tone:** Pan-Latin American — authentic 
  regional voices, not exclusively Cuban.
- **Contrastive Feedback:** Based on student's L1, 
  not assumed Dutch.
- **Fallback:** Dutch if no preference detected.

## 8. NOTIFICATION SYSTEM (via N8N)
- Welcome email on registration.
- Alert to admin on 3rd failed quiz attempt.
- Weekly progress report to student.
- All routed through N8N — never hardcoded.

## 9. ACCESS MODEL
- **Phase 1:** 100% free. No payment gateway required.
- **Phase 2:** Institutional licensing for Dutch schools 
  (Dutch Track only).

## 10. SESSION STARTUP PROTOCOL
At the start of EVERY session, Antigravity MUST:
1. Read .agents/STARTUP.md
2. Read .agents/PROJECT_JOURNAL.md (last 20 lines)
3. Kill any running server: pkill -f "next dev"
4. Start server: cd frontend && npm run dev
5. Output a 5-line briefing:
   - Last completed task
   - Current status
   - Next priority
   - Any blockers
   - Server URL
6. Check PROJECT_JOURNAL.md for ⏳ PENDING items
   and show them in the briefing as:
   
   📋 OPEN ITEMS: [count] pending
   → [first 3 items as one-liners]

## 11. SESSION CLOSURE PROTOCOL
Before finishing any session or using /save, Antigravity MUST:
1. Update .agents/PROJECT_JOURNAL.md with the latest logs.
2. Update .agents/SESSION_HISTORY.md with the session date, time spent, and tasks completed.
3. Update the total accumulated time in SESSION_HISTORY.md.
4. Final git commit and push if appropriate.

## 12. EXECUTION POLICY (BMAD LITE)
- **[MICRO]**: Small fixes or configuration changes — execute immediately.
- **[FEATURE]**: New features or design changes — show plan first, then auto-execute if approved.
- **[ARCHITECTURE]**: Major structural changes or new dependencies — require explicit approval before any execution.