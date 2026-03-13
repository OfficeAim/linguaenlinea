---
trigger: always_on
---

# SESSION STARTUP PROTOCOL

At the start of EVERY new conversation, before writing any code or answering, Antigravity MUST execute these steps in order:

1. **Context Recovery (Engram):** 
   - Read `.agents/MASTER_PLAYBOOK.md` to understand the global architecture and stack.
   - Read `.agents/PROJECT_JOURNAL.md` (Pending Tasks and latest Engram entries) to recover the exact What/Why/Where/Learned context from the last session.

2. **Environment Boot:**
   - Run the development server in the background: 
     `pkill -f "next dev" || true && cd frontend && npm run dev`

3. **Health Check (Progressive Disclosure):**
   - Verify `http://localhost:3000` is responding. 
   - *Note: Do NOT run TypeScript diagnostics (`tsc`) or Git logs unless specifically requested for the current task to avoid context overload.*

4. **Output Briefing:**
   - Generate a briefing using EXACTLY this format to signal readiness:

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 LINGUAENLINEA SESSION READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Last task: [Extract 'What' from the latest Engram in PROJECT_JOURNAL.md]
📍 Status: [Extract current status from STARTUP.md]
🎯 Next: [Top priority for today]
⚠️ Blockers: [List blockers or "None"]
🌐 http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready. What are we building today?