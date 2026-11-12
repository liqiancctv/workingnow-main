#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR"

if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  printf 'Error: this script must be run inside a Git repository.\n' >&2
  exit 1
fi

BRANCH=$(git symbolic-ref --quiet --short HEAD || true)
if [ -z "$BRANCH" ]; then
  printf 'Error: HEAD is detached. Check out a branch before uploading.\n' >&2
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  printf 'Error: Git remote "origin" is not configured.\n' >&2
  exit 1
fi

if [ "$#" -gt 0 ]; then
  COMMIT_MESSAGE=$*
else
  COMMIT_MESSAGE="Update project $(date '+%Y-%m-%d %H:%M:%S')"
fi

git add -A

if ! git diff --cached --quiet; then
  SUSPICIOUS_PATHS=$(git diff --cached --name-only | grep -E '(^|/)\.env($|\.)|\.pem$|\.key$|id_rsa|credentials|secret' || true)
  if [ -n "$SUSPICIOUS_PATHS" ]; then
    printf 'Error: suspicious file(s) staged:\n%s\n' "$SUSPICIOUS_PATHS" >&2
    printf 'Review them and unstage them before uploading.\n' >&2
    exit 1
  fi

  git commit -m "$COMMIT_MESSAGE"
else
  printf 'No uncommitted changes to commit; checking for commits to push.\n'
fi

git fetch origin

if git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
  git rebase "origin/$BRANCH"
fi

git push -u origin "$BRANCH"
printf 'Successfully pushed branch "%s" to origin.\n' "$BRANCH"