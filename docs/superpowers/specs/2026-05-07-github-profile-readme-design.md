# GitHub Profile README — Design Spec

**Date:** 2026-05-07
**Owner:** Kaivan Doshi (`afk1997`)
**Repo target:** `github.com/afk1997/afk1997` (special profile repo, README renders on `github.com/afk1997`)
**Audience:** Recruiters and GTM teams hiring
**Aesthetic direction:** Animated / playful 3D, themed as `GTM_OS` (a fake operating system)
**Implementation philosophy:** 100% vibecoded — README is a single Markdown file with embedded SVGs and third-party widget URLs. No build step.

---

## 1. Goal

Build a GitHub profile README that:

1. Immediately signals "GTM Engineer" identity to a recruiter scanning fast.
2. Stands out visually via animated 3D elements (banner, contribution skyline, snake graph).
3. Showcases real shipped side projects with concrete descriptions (no generic placeholders).
4. Surfaces an `open_to_work` / `open_to_collab` status prominently.
5. Routes interested visitors to LinkedIn, email, or X.

Non-goals:

- No "languages I know" / tech-skill badges. The user is a vibecoder; the stack is whatever the AI uses on a given day. Featuring a static stack misrepresents how he works.
- No fabricated metrics or wins. The user explicitly opted out of stats placeholders.

## 2. Visitor flow

A recruiter lands on the README, scans top-to-bottom, and decides in ~10 seconds whether to engage. The layout is ordered by what they need first:

1. **Banner** — instant identity signal (GTM_OS / vibecoded GTM Engineer).
2. **Status pills** — `open_to_work` is unmissable.
3. **What I do** — four-line summary of the GTM Engineer's day-job pillars.
4. **Shipped (recent)** — proof of velocity via real recent repos with one-line descriptions.
5. **Activity** — third-party widgets that show "this person actually ships."
6. **Connect** — clear CTAs for the recruiter who's now interested.

## 3. Content sections

### 3.1 Banner / hero

- Animated SVG header (with depth/parallax effects suggesting 3D — not literal 3D rendering) titled `GTM_OS :: by afk1997`, with a "boot screen" / kernel-loaded aesthetic.
- Below the banner: a typing-animation SVG (e.g., `readme-typing-svg.demolab.com`) cycling through:
  - `GTM Engineer`
  - `ships systems · vibecoded`
  - `building from India`
- Use a third-party banner generator (e.g., `capsule-render.vercel.app`) with a wave/animated style and dark theme, OR a custom SVG hosted in the repo's `assets/` folder if a richer 3D look is needed.
- Width: full-bleed (1200px+ rendered width).

### 3.2 Status pills

A single line of two pills (rendered as shields.io badges or inline SVG):

- `● open_to_work` (green dot)
- `● open_to_collab` (blue dot)

Visually unmistakable — these are the recruiter's primary signal.

### 3.3 "What I do" — module list (the GTM_OS metaphor)

A four-line ASCII-styled module table (Markdown code block, monospace) describing the four GTM pillars the user works in. This is the **role description**, not a list of repos:

```
/outbound    AI-personalized outbound · WhatsApp dispatchers
/revops      pipeline data · feedback funnels · CRM hygiene
/inbound     landing pages · lifecycle · launch films
/agents      AI agents that do GTM work end-to-end
```

Rendered inside a fenced code block so the alignment is preserved on GitHub.

### 3.4 "Shipped (recent)" — featured repos

Four featured repos. Each entry: emoji icon, repo name (linked to GitHub), star count if ≥ 1, and a 1-3 line description in the user's voice.

Repos to feature (locked in by the user):

1. **🐦 trove** — 17⭐
   - "a saving machine for the modern web. paste a link, get the file, transcribe it, edit the transcript like a doc. all local. yt-dlp + ffmpeg + whisper.cpp."
   - Link: `github.com/afk1997/trove`

2. **🎙 voice-skill-file-twitter-x**
   - "voice intelligence studio. turn a brand's X archive into a Skill File → generate, score, revise tweets that sound native. not a prompt. an evidence pipeline."
   - Link: `github.com/afk1997/voice-skill-file-twitter-x`

3. **📥 reddit-thread-exporter**
   - "chrome extension. one click → clean Reddit threads as JSON, Markdown, or rich-clipboard. bulk extract from search pages, full reply trees, research-intelligence workspace."
   - Link: `github.com/afk1997/reddit-thread-exporter`

4. **⚔️ quiz-arena**
   - "real-time PvP quiz arena. 1v1 duels, PIN rooms, daily challenges, creator studio. Express + WS + Drizzle + Postgres + Redis + Vite."
   - Link: `github.com/afk1997/Quiz-Arena`

Implementation note: each repo's description is in lowercase, declarative, written in the user's existing README voice (sampled from his actual repo READMEs). Do not paraphrase into a more formal tone — the lowercase style is intentional voice.

### 3.5 Activity widgets

A row of three third-party widgets (free, no auth required), each linked to an image URL hosted by the widget service:

1. **3D contribution skyline / contribution graph** — e.g., `github-readme-activity-graph.vercel.app` with a 3D / dark theme variant, OR `skyline.github.com/afk1997/2026` embedded as a screenshot link.
2. **Snake eats contributions** — generated via the `Platane/snk` GitHub Action that writes an SVG to a branch, then embedded in the README.
3. **GitHub stats card** — `github-readme-stats.vercel.app` with a dark theme matching the OS aesthetic.

All three should use a consistent dark color palette so the section reads as one block, not three different cards.

### 3.6 Connect

A single line of three links (rendered as shields.io social badges or styled as terminal-prompt entries):

- LinkedIn → `https://linkedin.com/in/sparkinlife`
- Email → `kaivandoshi1997@gmail.com` (mailto link)
- X → `https://x.com/0xStonks`

Order: LinkedIn first (recruiter-primary channel), then email, then X.

## 4. File / asset structure

This is a single-file project with optional supporting assets:

```
afk1997-profile/                      (local working dir — pushed to github.com/afk1997/afk1997)
├── README.md                         (the actual profile README — rendered on github.com/afk1997)
├── .github/
│   └── workflows/
│       └── snake.yml                 (GitHub Action that regenerates the snake-eats-contributions SVG daily)
├── assets/                           (optional: custom SVG banner if third-party generators don't deliver enough)
│   └── banner.svg
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-07-github-profile-readme-design.md   (this file)
```

The `.github/workflows/snake.yml` runs `Platane/snk` to write `output/github-snake.svg` to a `output` branch, which the README references via raw URL.

## 5. Visual / styling principles

- **Dark theme everywhere.** All third-party widgets configured with a dark-mode theme (e.g., `tokyonight`, `dracula`, or a custom hex palette). GitHub's auto theme detection means dark-mode users see this; light-mode users see a desaturated equivalent.
- **Monospace for the OS metaphor.** Anything inside the GTM_OS theme (modules, status pills, banner text) renders in monospace, which on GitHub means inside fenced code blocks or as SVG-rendered text.
- **No emoji explosion.** One emoji per featured repo (4 total in "Shipped"). No emojis in section headers — the OS metaphor is the personality, emojis would dilute it.
- **Voice = lowercase, declarative.** Match the user's existing README writing style (sampled from `trove`, `voice-skill-file-twitter-x`). No marketing-speak, no superlatives.

## 6. Out of scope (explicit YAGNI)

- ❌ "Languages I know" badges. Vibecoder identity makes this misleading.
- ❌ "GitHub trophies" widget. Common but feels gamified for a recruiter audience.
- ❌ Calendly / "book a call" link. User did not select this contact channel.
- ❌ A blog/writing section. The blog URL on the user's GitHub profile (`https://savedial.orrg`) was not verified live during planning. If the user wants a blog link, confirm the working URL during implementation.
- ❌ Profile views counter. Vanity metric without recruiter value.
- ❌ Spotify "now playing" widget or other personality widgets. The OS metaphor is the personality.

## 7. Open implementation decisions (for the planning phase)

The following will be decided in the implementation plan, not now:

1. **Banner source:** third-party generator (faster) vs. custom SVG hosted in repo (richer 3D, more work). Default: try third-party first, escalate to custom only if it looks generic.
2. **Activity widget exact services:** several services exist for each widget type; pick during implementation by visual quality with afk1997's actual contribution data.
3. **Color palette specifics:** exact hex codes for the dark theme. Default: tokyonight-style (`#1a1b26` background, `#7aa2f7` accent, `#a9b1d6` text).
4. **GitHub Action setup:** the snake workflow needs the `output` branch to exist; first commit may need a manual seed.

## 8. Success criteria

The README is "done" when:

1. It renders correctly on `github.com/afk1997` (verified by visiting after first push).
2. The banner, typing animation, contribution skyline, and snake graph all load and animate.
3. All four featured repo links resolve to the correct repos.
4. LinkedIn, email, and X links resolve correctly.
5. Both light-mode and dark-mode GitHub viewers see a coherent visual (not broken styling in one mode).
6. Page weight stays reasonable — no widget service that takes 5+ seconds to render.
7. The user (Kaivan) approves the live rendered version.
