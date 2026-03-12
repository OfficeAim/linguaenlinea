# Linguaenlinea 2026 Skills & Automation

## RULE 1 — /start command
When the user types `/start`, the agent must:
1. Read `.agents/MASTER_PLAYBOOK.md`, `.agents/PROJECT_JOURNAL.md`, and `.agents/STARTUP.md`.
2. Run: `pkill -f "next dev" || true`.
3. Run: `cd frontend && npm run dev`.
4. Confirm server is running at `http://localhost:3000`.
5. Generate a **5-line briefing**:
   - **Project**: [Name] - [Current Status]
   - **Total Time**: [Hours] (from SESSION_HISTORY.md)
   - **Last session**: [Key achievements]
   - **Top 3 Tasks**: [Priority items]
   - **Blockers**: [Pending decisions]

## RULE 2 — Auto-update after every task
After completing a task boundary or significant milestone, automatically append to `PROJECT_JOURNAL.md`:
- **Timestamp**: [Current Time]
- **Action**: [Brief description of what was done and WHY]
- **Result**: [Verification status or link to file]

## RULE 3 — New integration detected
When a new tool, service, or automation (N8N, OAuth, Payment Gateway, etc.) is added:
- Automatically update `MASTER_PLAYBOOK.md` section "🔗 Integrations & Automations" with purpose, config, and lessons.

## RULE 4 — New project setup
If this system is copied to a new directory, ask:
1. What is the project goal and target audience?
2. What is the tech stack?
3. What integrations are needed?
Then initialize levels 1-3 with the new context.

## RULE 5 — 21st.dev Recommendations
When asked about UI animations or components for any page:
- Consult the 21st.dev catalog in `MASTER_PLAYBOOK.md`.
- Check [21st.dev community components](https://21st.dev/community/components).
- Recommend based on brand colors (`Coral`, `Gold`), stack, and page type.
- **Response Format**: Component Name, 21st.dev URL, brand adaptations needed.