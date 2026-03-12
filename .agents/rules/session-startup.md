---
trigger: always_on
---

At the start of EVERY new conversation, before anything else:
1. Read .agents/STARTUP.md
2. Read the last 20 lines of .agents/PROJECT_JOURNAL.md
3. Run: pkill -f "next dev" && cd frontend && npm run dev
4. Output a briefing with exactly 5 lines:
   - ✅ Last completed task
   - 📍 Current status  
   - 🎯 Next priority
   - ⚠️ Any blockers
   - 🌐 Server URL (localhost:3000)
5. After server starts, open browser check:
   - Verify localhost:3000 is responding
   - Report which pages were last modified (git log --oneline -5)
   - Show any TypeScript errors: cd frontend && npx tsc --noEmit 2>&1 | head -20

6. End briefing with this exact format:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 LINGUAENLINEA SESSION READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Last task: [from PROJECT_JOURNAL]
📍 Status: [from STARTUP.md]
🎯 Next: [top priority]
⚠️ Blockers: [or "None"]
🌐 http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready. What are we building today?