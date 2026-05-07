# GitHub Profile README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `github.com/afk1997/afk1997` profile README — a single Markdown file with a `GTM_OS` themed banner, four real shipped repos, activity widgets, and three contact links — and push it live.

**Architecture:** Single `README.md` file at the repo root. All visual richness comes from third-party SVG generators referenced by URL (no images in repo). One GitHub Actions workflow regenerates the snake-eats-contributions SVG daily and writes it to an `output` branch. A local `scripts/check-readme.sh` script greps for required substrings to provide TDD-style red/green for each section.

**Tech Stack:**
- Markdown (the README itself)
- Third-party SVG services: `capsule-render.vercel.app` (banner), `readme-typing-svg.demolab.com` (typing), `github-readme-activity-graph.vercel.app` (skyline), `github-readme-stats.vercel.app` (stats), `img.shields.io` (badges)
- GitHub Actions: `Platane/snk@v3` for snake animation, `crazy-max/ghaction-github-pages@v3` for branch deploy
- `gh` CLI for repo creation and push
- Bash + `grep` for content verification

**Color palette (tokyonight-style):**
- Background: `1a1b26`
- Accent: `7aa2f7`
- Text: `a9b1d6`
- Theme name (where supported by service): `tokyonight`

---

### Task 1: Project bootstrap

**Files:**
- Create: `~/afk1997-profile/.gitignore`
- Create: `~/afk1997-profile/scripts/check-readme.sh`

The verification script greps for required substrings — each subsequent task adds a check, and the script fails red until that section is implemented.

- [ ] **Step 1: Write the verification script (will be empty / pass-by-default at this point)**

Create `scripts/check-readme.sh`:

```bash
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

echo "All checks passed."
```

- [ ] **Step 2: Create .gitignore**

Create `.gitignore`:

```
.DS_Store
node_modules/
*.log
```

- [ ] **Step 3: Make the script executable and run it (should fail because README.md doesn't exist yet)**

```bash
cd ~/afk1997-profile
chmod +x scripts/check-readme.sh
./scripts/check-readme.sh
```

Expected output:
```
FAIL: README.md does not exist
```
(Exit code 1 — this is the "red" baseline.)

- [ ] **Step 4: Create an empty README.md so future tasks have a target**

```bash
touch ~/afk1997-profile/README.md
```

- [ ] **Step 5: Re-run the script to confirm it now passes (no checks defined yet)**

```bash
./scripts/check-readme.sh
```

Expected output:
```
Checking README.md...
All checks passed.
```

- [ ] **Step 6: Commit**

```bash
cd ~/afk1997-profile
git add .gitignore scripts/check-readme.sh README.md
git commit -m "chore: bootstrap profile readme project (verification script + empty README)"
```

---

### Task 2: Banner section (capsule-render + typing animation)

**Files:**
- Modify: `~/afk1997-profile/README.md` (append banner block)
- Modify: `~/afk1997-profile/scripts/check-readme.sh` (add 2 checks)

The banner uses `capsule-render.vercel.app` with a wave-style gradient header titled `GTM_OS`. Below it sits an animated typing SVG cycling through three lines.

- [ ] **Step 1: Add failing checks to verification script**

Edit `scripts/check-readme.sh`. Replace the `# === Section checks added per task ===` line with:

```bash
# === Section checks added per task ===

# Task 2: Banner
check "banner: capsule-render"     "capsule-render.vercel.app/api"
check "banner: typing svg"         "readme-typing-svg.demolab.com"
```

- [ ] **Step 2: Run the script to confirm it fails**

```bash
cd ~/afk1997-profile
./scripts/check-readme.sh
```

Expected output (exits 1):
```
Checking README.md...
  ✗  banner: capsule-render   (missing: capsule-render.vercel.app/api)
```

- [ ] **Step 3: Add the banner block to README.md**

Append to `README.md`:

```markdown
<!-- BANNER -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1b26,100:7aa2f7&height=220&section=header&text=GTM_OS&fontSize=80&fontColor=a9b1d6&fontAlignY=38&desc=::%20by%20afk1997%20%20%E2%80%A2%20%20kernel%20loaded%20%E2%80%A2%20%20vibecoding%2024/7&descAlignY=58&descSize=16&animation=fadeIn" alt="GTM_OS banner" />
</p>

<p align="center">
  <a href="https://github.com/afk1997">
    <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=22&duration=2800&pause=600&color=7AA2F7&center=true&vCenter=true&width=620&lines=GTM+Engineer;ships+systems+%C2%B7+vibecoded;building+from+India" alt="typing animation" />
  </a>
</p>
```

- [ ] **Step 4: Run the script to confirm both banner checks pass**

```bash
./scripts/check-readme.sh
```

Expected output (exits 0):
```
Checking README.md...
  ✓  banner: capsule-render
  ✓  banner: typing svg
All checks passed.
```

- [ ] **Step 5: Commit**

```bash
git add README.md scripts/check-readme.sh
git commit -m "feat: add banner + typing animation"
```

---

### Task 3: Status pills (open_to_work + open_to_collab)

**Files:**
- Modify: `~/afk1997-profile/README.md`
- Modify: `~/afk1997-profile/scripts/check-readme.sh`

Two `img.shields.io` static badges, dark-themed, dot-prefixed text.

- [ ] **Step 1: Add failing checks**

Append to `scripts/check-readme.sh` (after the existing checks, before `echo "All checks passed."`):

```bash
# Task 3: Status pills
check "status: open_to_work"       "open__to__work"
check "status: open_to_collab"     "open__to__collab"
```

(Note: shields.io encodes a single underscore as `__` in static badges. The check matches the encoded form.)

- [ ] **Step 2: Run script — expect FAIL on the new checks**

```bash
./scripts/check-readme.sh
```

Expected: fails on `status: open_to_work`.

- [ ] **Step 3: Append the status pill block to README.md**

```markdown
<!-- STATUS -->
<p align="center">
  <img src="https://img.shields.io/badge/%E2%97%8F%20open__to__work-1a1b26?style=for-the-badge&labelColor=1a1b26&color=7aa2f7" alt="open to work" />
  &nbsp;
  <img src="https://img.shields.io/badge/%E2%97%8F%20open__to__collab-1a1b26?style=for-the-badge&labelColor=1a1b26&color=9ece6a" alt="open to collab" />
</p>
```

- [ ] **Step 4: Run script — expect PASS**

```bash
./scripts/check-readme.sh
```

Expected: all checks pass.

- [ ] **Step 5: Commit**

```bash
git add README.md scripts/check-readme.sh
git commit -m "feat: add open_to_work + open_to_collab status pills"
```

---

### Task 4: "What I do" modules (GTM_OS metaphor)

**Files:**
- Modify: `~/afk1997-profile/README.md`
- Modify: `~/afk1997-profile/scripts/check-readme.sh`

A four-line monospace module listing, inside a fenced code block so GitHub preserves the alignment.

- [ ] **Step 1: Add failing checks**

Append to `scripts/check-readme.sh`:

```bash
# Task 4: What I do — modules
check "module: outbound"           "/outbound"
check "module: revops"             "/revops"
check "module: inbound"            "/inbound"
check "module: agents"             "/agents"
```

- [ ] **Step 2: Run script — expect FAIL**

```bash
./scripts/check-readme.sh
```

Expected: fails on `module: outbound`.

- [ ] **Step 3: Append the modules block to README.md**

````markdown
<!-- WHAT I DO -->
<h3 align="center">═══ what i do ═══</h3>

```text
/outbound    AI-personalized outbound · WhatsApp dispatchers
/revops      pipeline data · feedback funnels · CRM hygiene
/inbound     landing pages · lifecycle · launch films
/agents      AI agents that do GTM work end-to-end
```
````

**Important:** The block above shows a literal triple-backtick `text` fence (with four `/module` lines inside) that should appear in `README.md`. The outer fence in this plan uses **four** backticks so the inner three-backtick fence renders correctly.

- [ ] **Step 4: Run script — expect PASS**

```bash
./scripts/check-readme.sh
```

- [ ] **Step 5: Commit**

```bash
git add README.md scripts/check-readme.sh
git commit -m "feat: add 'what i do' GTM modules section"
```

---

### Task 5: "Shipped (recent)" featured repos

**Files:**
- Modify: `~/afk1997-profile/README.md`
- Modify: `~/afk1997-profile/scripts/check-readme.sh`

Four featured repos with one-line descriptions in lowercase declarative voice (matching afk1997's existing README style). Each row: emoji, repo link, star count if ≥1, description.

- [ ] **Step 1: Add failing checks**

Append to `scripts/check-readme.sh`:

```bash
# Task 5: Shipped repos
check "repo: trove"                "github.com/afk1997/trove"
check "repo: voice-skill"          "github.com/afk1997/voice-skill-file-twitter-x"
check "repo: reddit-exporter"      "github.com/afk1997/reddit-thread-exporter"
check "repo: quiz-arena"           "github.com/afk1997/Quiz-Arena"
```

- [ ] **Step 2: Run script — expect FAIL**

```bash
./scripts/check-readme.sh
```

- [ ] **Step 3: Append the shipped section to README.md**

```markdown
<!-- SHIPPED -->
<h3 align="center">═══ shipped (recent) ═══</h3>

#### 🐦 [trove](https://github.com/afk1997/trove)  ·  17⭐
> a saving machine for the modern web. paste a link, get the file, transcribe it, edit the transcript like a doc. all local. yt-dlp + ffmpeg + whisper.cpp.

#### 🎙 [voice-skill-file-twitter-x](https://github.com/afk1997/voice-skill-file-twitter-x)
> voice intelligence studio. turn a brand's X archive into a Skill File → generate, score, revise tweets that sound native. not a prompt. an evidence pipeline.

#### 📥 [reddit-thread-exporter](https://github.com/afk1997/reddit-thread-exporter)
> chrome extension. one click → clean Reddit threads as JSON, Markdown, or rich-clipboard. bulk extract from search pages, full reply trees, research-intelligence workspace.

#### ⚔️ [quiz-arena](https://github.com/afk1997/Quiz-Arena)
> real-time PvP quiz arena. 1v1 duels, PIN rooms, daily challenges, creator studio. Express + WS + Drizzle + Postgres + Redis + Vite.
```

- [ ] **Step 4: Run script — expect PASS**

```bash
./scripts/check-readme.sh
```

- [ ] **Step 5: Commit**

```bash
git add README.md scripts/check-readme.sh
git commit -m "feat: add shipped repos section (trove, voice-skill, reddit-exporter, quiz-arena)"
```

---

### Task 6: Activity widgets (skyline + snake + stats)

**Files:**
- Modify: `~/afk1997-profile/README.md`
- Modify: `~/afk1997-profile/scripts/check-readme.sh`

Three side-by-side widgets:
1. Activity / contribution graph (3D-ish dark theme via `github-readme-activity-graph.vercel.app`)
2. Snake graph (referenced from the `output` branch — workflow added in Task 8 will populate it)
3. GitHub stats card (`github-readme-stats.vercel.app` with `tokyonight` theme)

The snake image will 404 until Task 8's workflow has run at least once on GitHub. That is fine for local commits — only Task 10 (push + live verification) requires the workflow to have completed.

- [ ] **Step 1: Add failing checks**

Append to `scripts/check-readme.sh`:

```bash
# Task 6: Activity widgets
check "widget: activity graph"     "github-readme-activity-graph.vercel.app"
check "widget: snake"              "github-snake-dark.svg"
check "widget: stats card"         "github-readme-stats.vercel.app"
```

- [ ] **Step 2: Run script — expect FAIL**

```bash
./scripts/check-readme.sh
```

- [ ] **Step 3: Append the activity block to README.md**

```markdown
<!-- ACTIVITY -->
<h3 align="center">═══ activity ═══</h3>

<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=afk1997&bg_color=1a1b26&color=a9b1d6&line=7aa2f7&point=9ece6a&area=true&hide_border=true" alt="contribution graph" width="98%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/afk1997/afk1997/output/github-snake-dark.svg" alt="snake eating my contributions" width="98%" />
</p>

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=afk1997&show_icons=true&theme=tokyonight&hide_border=true&bg_color=1a1b26&include_all_commits=true&count_private=true" alt="github stats" />
  &nbsp;
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=afk1997&layout=compact&theme=tokyonight&hide_border=true&bg_color=1a1b26&langs_count=8" alt="top languages" />
</p>
```

Note: the "top languages" card is included because GitHub's auto-detected language stats are real on his repos (lots of TypeScript, some Python, JavaScript, MDX, HTML) and add visual density. Easy to drop later if he wants it removed.

- [ ] **Step 4: Run script — expect PASS**

```bash
./scripts/check-readme.sh
```

- [ ] **Step 5: Commit**

```bash
git add README.md scripts/check-readme.sh
git commit -m "feat: add activity widgets (graph + snake + stats + top-langs)"
```

---

### Task 7: Connect section (LinkedIn + email + X)

**Files:**
- Modify: `~/afk1997-profile/README.md`
- Modify: `~/afk1997-profile/scripts/check-readme.sh`

Three shields.io social-style badges with custom colors. LinkedIn first (recruiter-primary), then email, then X.

- [ ] **Step 1: Add failing checks**

Append to `scripts/check-readme.sh`:

```bash
# Task 7: Connect
check "connect: linkedin"          "linkedin.com/in/sparkinlife"
check "connect: email"             "kaivandoshi1997@gmail.com"
check "connect: x"                 "x.com/0xStonks"
```

- [ ] **Step 2: Run script — expect FAIL**

```bash
./scripts/check-readme.sh
```

- [ ] **Step 3: Append the connect block to README.md**

```markdown
<!-- CONNECT -->
<h3 align="center">═══ connect ═══</h3>

<p align="center">
  <a href="https://linkedin.com/in/sparkinlife">
    <img src="https://img.shields.io/badge/LinkedIn-1a1b26?style=for-the-badge&logo=linkedin&logoColor=7aa2f7" alt="LinkedIn" />
  </a>
  &nbsp;
  <a href="mailto:kaivandoshi1997@gmail.com">
    <img src="https://img.shields.io/badge/Email-1a1b26?style=for-the-badge&logo=gmail&logoColor=f7768e" alt="Email" />
  </a>
  &nbsp;
  <a href="https://x.com/0xStonks">
    <img src="https://img.shields.io/badge/X-1a1b26?style=for-the-badge&logo=x&logoColor=a9b1d6" alt="X / Twitter" />
  </a>
</p>

<p align="center">
  <sub>vibecoded · india · 2026</sub>
</p>
```

- [ ] **Step 4: Run script — expect PASS**

```bash
./scripts/check-readme.sh
```

- [ ] **Step 5: Commit**

```bash
git add README.md scripts/check-readme.sh
git commit -m "feat: add connect section (LinkedIn + email + X)"
```

---

### Task 8: Snake GitHub Action workflow

**Files:**
- Create: `~/afk1997-profile/.github/workflows/snake.yml`

This workflow runs once a day (and on manual dispatch). It uses `Platane/snk@v3` to generate two SVG files (`github-snake.svg` for light mode, `github-snake-dark.svg` for dark) and pushes them to a branch named `output`. The README's snake image URL points to that branch.

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/snake.yml`:

```yaml
name: generate snake animation

on:
  schedule:
    - cron: "0 */24 * * *"
  workflow_dispatch:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: generate github-contribution-grid-snake.svg
        uses: Platane/snk@v3
        id: snake-gif
        with:
          github_user_name: afk1997
          outputs: |
            dist/github-snake.svg
            dist/github-snake-dark.svg?palette=github-dark&color_snake=#7aa2f7&color_dots=#1a1b26,#3b4261,#414868,#7aa2f7,#9ece6a

      - name: push github-snake.svg to the output branch
        uses: crazy-max/ghaction-github-pages@v3
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Verify the file was written correctly**

```bash
cd ~/afk1997-profile
test -f .github/workflows/snake.yml && echo "WORKFLOW PRESENT" || echo "MISSING"
grep -q "Platane/snk" .github/workflows/snake.yml && echo "SNK ACTION PRESENT" || echo "MISSING"
```

Expected:
```
WORKFLOW PRESENT
SNK ACTION PRESENT
```

- [ ] **Step 3: Run the readme verification one more time (still green)**

```bash
./scripts/check-readme.sh
```

Expected: all checks pass.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/snake.yml
git commit -m "ci: add snake-eats-contributions workflow (Platane/snk to output branch)"
```

---

### Task 9: Final local preview

**Files:** (none modified)

Sanity-check the rendered README locally before pushing. `gh` CLI ships a Markdown previewer.

- [ ] **Step 1: Inspect the rendered structure of README.md**

```bash
cd ~/afk1997-profile
cat README.md | head -120
```

(Optional, if `glow` or `bat` is installed: `glow README.md` or `bat README.md`.)

Expected: the section structure (banner block, status pills, "what i do" modules, shipped repos, activity widgets, connect) is visible in order.

- [ ] **Step 2: Run the verification script one final time**

```bash
./scripts/check-readme.sh
```

Expected: all checks pass.

- [ ] **Step 3: Confirm git log shows clean history**

```bash
git log --oneline
```

Expected: the spec commit at the bottom, then one commit per task (bootstrap, banner, status, modules, shipped, activity, connect, snake workflow). 9 commits total counting the original spec commit.

---

### Task 10: Push to GitHub and verify live render

**Files:** (none modified)

This is the only task that touches GitHub. The user (Kaivan) should be the one to authorize the repo creation and push. If `gh auth status` shows the wrong account, stop and surface that to the user before creating the repo.

- [ ] **Step 1: Verify gh auth is pointing at afk1997**

```bash
gh auth status 2>&1 | head -5
gh api user -q '.login'
```

Expected: the second command prints `afk1997`. If it prints anything else, **STOP** and ask the user to run `gh auth login` as `afk1997` before continuing.

- [ ] **Step 2: Check whether the special profile repo already exists**

```bash
gh repo view afk1997/afk1997 --json name 2>&1 | head -5
```

If the repo already exists with content, **STOP** and ask the user how to proceed (overwrite vs. merge). If it does not exist, the command prints an error like "Could not resolve to a Repository" — proceed to step 3.

- [ ] **Step 3: Create the special profile repo (public, no template)**

```bash
cd ~/afk1997-profile
gh repo create afk1997/afk1997 --public --source=. --remote=origin --description "github profile readme" --push
```

The `--push` flag pushes the current branch (which should be `main` or `master`) on creation.

- [ ] **Step 4: If the local branch is `master`, rename to `main` for consistency**

```bash
cd ~/afk1997-profile
current_branch=$(git branch --show-current)
if [ "$current_branch" = "master" ]; then
  git branch -M main
  git push -u origin main
fi
```

- [ ] **Step 5: Manually trigger the snake workflow so the snake image exists immediately**

```bash
gh workflow run snake.yml --repo afk1997/afk1997
echo "Waiting 30 seconds for workflow to start..."
sleep 30
gh run list --repo afk1997/afk1997 --workflow=snake.yml --limit 1
```

If the workflow shows status `in_progress` or `queued`, that's fine. If it shows `failure`, run `gh run view <run-id> --repo afk1997/afk1997 --log` to debug.

- [ ] **Step 6: Open the live profile page and visually verify**

```bash
open "https://github.com/afk1997"
```

(macOS — `open` will launch the default browser.)

Visually check:
- Banner renders with `GTM_OS` text and waving gradient
- Typing animation cycles through 3 lines
- Two status pills show (`open_to_work` + `open_to_collab`)
- "what i do" code block shows 4 modules aligned
- Four shipped repos render with descriptions and the trove ⭐ count
- Activity graph + stats + top-langs cards load (snake may be a 404 broken image until the workflow finishes — that's expected on first push)
- LinkedIn / email / X badges link correctly

- [ ] **Step 7: After ~3-5 minutes, refresh and verify the snake widget loaded**

```bash
gh run list --repo afk1997/afk1997 --workflow=snake.yml --limit 1
```

When the latest run shows `completed` + `success`, refresh `github.com/afk1997` in the browser. The snake should now render.

- [ ] **Step 8: If anything is off, fix locally and push**

Examples:
- Banner looks too generic → escalate to a custom SVG (out of scope for v1; capture as a follow-up issue).
- A widget URL returns a broken image → check the URL parameters in `README.md` and adjust.

For each fix:
```bash
# edit README.md as needed
./scripts/check-readme.sh
git add README.md
git commit -m "fix: <short description>"
git push
```

- [ ] **Step 9: Report back to the user**

Tell the user:
1. Live URL: `https://github.com/afk1997`
2. Snake workflow status (passed / pending / failed)
3. Any visual issues you saw and how you addressed them
4. Any open follow-ups (e.g., custom banner, additional widgets)

---

## Spec coverage check

Each spec section maps to at least one task:

- Spec §3.1 Banner / hero → Task 2
- Spec §3.2 Status pills → Task 3
- Spec §3.3 "What I do" modules → Task 4
- Spec §3.4 Shipped featured repos → Task 5
- Spec §3.5 Activity widgets → Task 6
- Spec §3.6 Connect → Task 7
- Spec §4 File structure (`.github/workflows/snake.yml`) → Task 8
- Spec §5 Visual styling (dark theme, monospace, voice) → embedded in Tasks 2-7
- Spec §6 Out of scope → respected by omission across all tasks
- Spec §7 Open implementation decisions → resolved:
  - Banner source: third-party `capsule-render` (per spec default)
  - Activity widgets: `github-readme-activity-graph.vercel.app` + `Platane/snk` + `github-readme-stats.vercel.app` (proven, free, no auth)
  - Color palette: tokyonight (`#1a1b26 / #7aa2f7 / #a9b1d6`) per spec default
  - GitHub Action `output` branch: created automatically by `crazy-max/ghaction-github-pages@v3` on first run
- Spec §8 Success criteria → Task 10 (live verification)

No gaps.
