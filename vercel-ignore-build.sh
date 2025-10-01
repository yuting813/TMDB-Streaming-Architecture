#!/usr/bin/env bash
set -euo pipefail

PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
CURR="${VERCEL_GIT_COMMIT_SHA:-}"

# 第一次部署沒有 PREV，照常建置
if [ -z "$PREV" ] || [ -z "$CURR" ]; then
  echo "No previous SHA; building."
  exit 1
fi

CHANGED="$(git diff --name-only "$PREV" "$CURR")"
echo "Changed files:"
echo "$CHANGED"

# 只改文件/設定就跳過建置；有任一程式碼變更則建置
DOCS_REGEX='^(README\.md|README\.zh-TW\.md|docs/|\.github/|\.vscode/)'

if echo "$CHANGED" | grep -qE "$DOCS_REGEX"; then
  if echo "$CHANGED" | grep -vqE "$DOCS_REGEX"; then
    echo "Detected non-doc changes -> build."
    exit 1
  else
    echo "Only docs/metadata changed -> skip build."
    exit 0
  fi
else
  echo "Code changes detected -> build."
  exit 1
fi
