#!/usr/bin/env bash
# Verifies that README.md contains all required content sections.
# Each task adds a `check` line. Exit 0 = all green. Exit 1 = something missing.

set -e

README="$(dirname "$0")/../README.md"

if [ ! -f "$README" ]; then
  echo "FAIL: README.md does not exist"
  exit 1
fi

check() {
  local label="$1"
  local pattern="$2"
  if grep -qF -- "$pattern" "$README"; then
    echo "  ✓  $label"
  else
    echo "  ✗  $label   (missing: $pattern)"
    exit 1
  fi
}

echo "Checking README.md..."

# === Section checks added per task ===

# Task 2: Banner
check "banner: capsule-render"     "capsule-render.vercel.app/api"
check "banner: typing svg"         "readme-typing-svg.demolab.com"

# Task 3: Status pills
check "status: open_to_work"       "open__to__work"
check "status: open_to_collab"     "open__to__collab"

echo "All checks passed."
