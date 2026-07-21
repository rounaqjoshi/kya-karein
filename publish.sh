#!/bin/bash
set -euo pipefail

REPO_DIR="/Users/rounaqjoshi/Library/Mobile Documents/com~apple~CloudDocs/Artifacts - ChatGPT/Artifacts/kya-karein-site"
SOURCE_DIR="/Users/rounaqjoshi/Library/Mobile Documents/com~apple~CloudDocs/Artifacts - ChatGPT/Artifacts/kya-karein-v2"
LOG="/Users/rounaqjoshi/Library/Logs/kya-karein-publish.log"

exec >> "$LOG" 2>&1
echo "=== $(date '+%Y-%m-%d %H:%M:%S') — publish start ==="

for file in index.html meals.html styles.css app.js config.js shared.js manifest.webmanifest sw.js icons/qeera-192.png icons/qeera-512.png; do
  if [ ! -f "$SOURCE_DIR/$file" ]; then
    echo "ERROR: source file not found: $SOURCE_DIR/$file"
    exit 1
  fi
done

mkdir -p "$REPO_DIR/icons"
for file in index.html meals.html styles.css app.js config.js shared.js manifest.webmanifest sw.js; do
  cp "$SOURCE_DIR/$file" "$REPO_DIR/$file"
done
cp "$SOURCE_DIR/icons/qeera-192.png" "$REPO_DIR/icons/qeera-192.png"
cp "$SOURCE_DIR/icons/qeera-512.png" "$REPO_DIR/icons/qeera-512.png"
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
