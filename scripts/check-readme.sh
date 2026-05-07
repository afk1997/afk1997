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

# Task 4: What I do — modules
check "module: outbound"           "/outbound"
check "module: revops"             "/revops"
check "module: inbound"            "/inbound"
check "module: agents"             "/agents"

# Task 5: Shipped repos
check "repo: trove"                "github.com/afk1997/trove"
check "repo: voice-skill"          "github.com/afk1997/voice-skill-file-twitter-x"
check "repo: reddit-exporter"      "github.com/afk1997/reddit-thread-exporter"
check "repo: quiz-arena"           "github.com/afk1997/Quiz-Arena"

# Task 6: Activity widgets
check "widget: activity graph"     "github-readme-activity-graph.vercel.app"
check "widget: snake"              "github-snake-dark.svg"
check "widget: stats card"         "github-readme-stats.vercel.app"

# Task 7: Connect
check "connect: linkedin"          "linkedin.com/in/sparkinlife"
check "connect: email"             "kaivandoshi1997@gmail.com"
check "connect: x"                 "x.com/0xStonks"

echo "All checks passed."
