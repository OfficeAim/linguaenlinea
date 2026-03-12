#!/bin/bash
echo "💾 Saving session..."
DATE=$(date +"%Y-%m-%d")
TIME=$(date +"%H:%M")

cd /Users/rodyfigueroa/Movies/linguaenlinea-2026/frontend
CHANGES=$(git status --short | wc -l)

if [ $CHANGES -gt 0 ]; then
  echo ""
  echo "📝 $CHANGES uncommitted files found."
  echo "Enter commit message (or press Enter to skip):"
  read COMMIT_MSG
  if [ ! -z "$COMMIT_MSG" ]; then
    git add .
    git commit -m "$COMMIT_MSG"
    git push origin main
    echo "✅ Pushed to GitHub"
  fi
else
  echo "✅ Nothing to commit — repo is clean"
fi

echo "" >> /Users/rodyfigueroa/Movies/linguaenlinea-2026/session-log.md
echo "## Session saved: $DATE at $TIME" >> /Users/rodyfigueroa/Movies/linguaenlinea-2026/session-log.md
echo ""
echo "✅ Session saved! Tot morgen 👋"
