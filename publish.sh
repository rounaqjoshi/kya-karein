#!/bin/bash
set -euo pipefail

REPO_DIR="/Users/rounaqjoshi/Documents/Claude/Artifacts/kya-karein-site"
SOURCE="/Users/rounaqjoshi/Documents/Claude/Artifacts/gta-weekly-dashboard.html"
LOG="/Users/rounaqjoshi/Library/Logs/kya-karein-publish.log"

exec >> "$LOG" 2>&1
echo "=== $(date '+%Y-%m-%d %H:%M:%S') — publish start ==="

if [ ! -f "$SOURCE" ]; then
  echo "ERROR: source file not found: $SOURCE"
  exit 1
fi

cp "$SOURCE" "$REPO_DIR/index.html"
cd "$REPO_DIR"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

git add -A
if git diff --cached --quiet; then
  echo "No changes — skipping commit."
else
  git commit -m "Weekly dashboard refresh"
  git push
  echo "Pushed to GitHub."
fi

echo "=== $(date '+%Y-%m-%d %H:%M:%S') — publish done ==="
