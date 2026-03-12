#!/bin/bash

# Configuration
OUTPUT_FILE="../.agents/SESSION_HISTORY.md"
mkdir -p ../.agents

# Go to the git root
cd frontend || { echo "❌ Error: frontend directory not found"; exit 1; }

# Temporary file for building the history
TMP_BODY=$(mktemp)

# Get unique working days in reverse order
DATES=$(git log --format="%ad" --date=short | sort -r | uniq)

TOTAL_SECONDS=0

# Loop through each day
for DATE in $DATES; do
    echo "## Session: $DATE" >> "$TMP_BODY"
    
    # Get first and last commit times for the day
    START_TIME=$(git log --after="$DATE 00:00:00" --before="$DATE 23:59:59" --format="%at" --reverse | head -1)
    END_TIME=$(git log --after="$DATE 00:00:00" --before="$DATE 23:59:59" --format="%at" | head -1)
    
    # Format times for display (Mac compatible date -r)
    START_HUMAN=$(date -r "$START_TIME" +"%H:%M")
    END_HUMAN=$(date -r "$END_TIME" +"%H:%M")
    
    # Calculate duration
    DIFF=$((END_TIME - START_TIME))
    TOTAL_SECONDS=$((TOTAL_SECONDS + DIFF))
    
    HRS=$((DIFF / 3600))
    MIN=$(((DIFF % 3600) / 60))
    
    echo "- **Time**: $START_HUMAN - $END_HUMAN ($HRS h $MIN m)" >> "$TMP_BODY"
    echo "- **Tasks done**:" >> "$TMP_BODY"
    
    # List unique commit messages for that day
    git log --after="$DATE 00:00:00" --before="$DATE 23:59:59" --format="  * %s" | sort | uniq >> "$TMP_BODY"
    echo "" >> "$TMP_BODY"
done

# Calculate total time
TOTAL_HRS=$((TOTAL_SECONDS / 3600))
TOTAL_MIN=$(((TOTAL_SECONDS % 3600) / 60))

# Create the final file with header
echo "# Project Session History" > "$OUTPUT_FILE"
echo "**Total accumulated time: $TOTAL_HRS h $TOTAL_MIN m**" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat "$TMP_BODY" >> "$OUTPUT_FILE"

# Cleanup
rm "$TMP_BODY"

echo "✅ Session history updated in .agents/SESSION_HISTORY.md"
