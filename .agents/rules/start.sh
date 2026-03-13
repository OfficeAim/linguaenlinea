#!/bin/bash
echo "🚀 Linguaenlinea 2026 — Starting session..."
echo ""
echo "📋 LAST SESSION NOTES:"
echo "======================"
tail -60 /Users/rodyfigueroa/Movies/linguaenlinea-2026/session-log.md
echo ""
echo "🌐 Starting Next.js dev server..."
cd /Users/rodyfigueroa/Movies/linguaenlinea-2026/frontend
npm run dev
