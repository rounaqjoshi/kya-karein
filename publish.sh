#!/bin/bash
set -euo pipefail

REPO_DIR="/Users/rounaqjoshi/Library/Mobile Documents/com~apple~CloudDocs/Artifacts - ChatGPT/Artifacts/kya-karein-site"
SOURCE_DIR="/Users/rounaqjoshi/Library/Mobile Documents/com~apple~CloudDocs/Artifacts - ChatGPT/Artifacts/kya-karein-v2"
LOG="/Users/rounaqjoshi/Library/Logs/kya-karein-publish.log"

exec >> "$LOG" 2>&1
echo "=== $(date '+%Y-%m-%d %H:%M:%S') — publish start ==="

for file in index.html meals.html styles.css app.js; do
  if [ ! -f "$SOURCE_DIR/$file" ]; then
    echo "ERROR: source file not found: $SOURCE_DIR/$file"
    exit 1
  fi
done

cp "$SOURCE_DIR/index.html" "$REPO_DIR/index.html"
cp "$SOURCE_DIR/meals.html" "$REPO_DIR/meals.html"
cp "$SOURCE_DIR/styles.css" "$REPO_DIR/styles.css"
cp "$SOURCE_DIR/app.js" "$REPO_DIR/app.js"
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
