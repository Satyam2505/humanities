# Project Atlas — Handoff to Claude Code

*Paste this whole document as the opening message in a new Claude Code session to start building. It's self-contained — everything needed to start is here, with pointers to deeper-detail docs if you want them (they'll be in the same project folder: Project_Atlas_Spec.md, ARCHITECTURE.md, Action_Plan.md, Feasibility_and_Blueprint.md, Complete_Project_Doc.md, Repo_Analysis.md).*

---

## What we're building

**Project Atlas** is a research-prototype web dashboard that lets a young man see what masculine-ideology content he's being exposed to in his own social media feeds (starting with YouTube, then Reddit, then Instagram). It's styled like a parental-control app — simple, scannable, traffic-light exposure levels — but the person using it is monitoring himself, not being monitored by someone else. It's grounded in real academic frameworks (a Masculinity Content Classification Framework, Connell's Hegemonic Masculinity Theory), not vague screen-time numbers, and every score comes with an explainable-AI evidence trail (the exact text that triggered it).

**Non-negotiable tone constraint:** the whole point of this tool is that it's *constructive, not shaming*. No alarmist copy, no red-alert styling on ordinary content. This affects UI copy, color usage, and any recommendation logic you write.

**Decisions already made — do not relitigate these:**
- Primary user: the young man himself, self-monitoring.
- UI approach: layered. A simple "Overview" summary (parental-control-style: exposure levels, one headline score) is the default view; clicking into any category reveals the fuller detail (dimension score, evidence quote, confidence) underneath. One data model, two densities — not two separate UIs.
- Platform priority: YouTube first (has the best API access), then Reddit, then Instagram. Quora was evaluated and dropped (no API).
- Stack: **Next.js 14 (App Router) + TypeScript + Tailwind CSS** frontend, **Python/FastAPI** backend (built later), SQLite → Postgres.

---

## Build order — start here

1. **Scaffold the Next.js frontend** using the folder structure below.
2. **Build the Overview page** (`app/page.tsx`) reading from a local mock JSON file (provided below) — no backend needed yet. This should visually match the component breakdown and design tokens in this doc.
3. Stop and check in before starting the backend — the frontend is the thing to get right first.
4. *(Later phases, not now)*: FastAPI backend exposing `/api/v1/overview` in the exact same shape as the mock JSON, then a YouTube analyzer module (Google Takeout parser first, OAuth second), then the NLP + scoring pipeline, then Reddit and Instagram analyzers plugged into the same pipeline. Full detail on all of this is in `ARCHITECTURE.md` in the project folder if you get there.

---

## Repository structure (frontend, build this first)

```
atlas/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                 Root layout, Google Font imports, theme setup
│   │   ├── globals.css                Design tokens (below) + base styles
│   │   ├── page.tsx                   "/" — Overview dashboard (build this first)
│   │   ├── youtube/page.tsx           stub — "coming soon"
│   │   ├── reddit/page.tsx            stub — "coming soon"
│   │   ├── instagram/page.tsx         stub — "coming soon"
│   │   ├── trends/page.tsx            stub — later phase
│   │   ├── recommendations/page.tsx   stub — later phase
│   │   └── settings/page.tsx          stub — later phase
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── FeedHealthGauge.tsx    SVG ring gauge — animated score fill, color by band
│   │   │   ├── PlatformChips.tsx      Connected/coming-soon platform pills
│   │   │   ├── TierSection.tsx        One MCCF tier heading + its dimension cards
│   │   │   ├── DimensionCard.tsx      Expandable card: level pill + bar collapsed, evidence on open
│   │   │   ├── EvidenceBlock.tsx      Quote + source + confidence %, or a low-confidence note
│   │   │   └── RecommendationBanner.tsx
│   │   └── ui/                        Shared primitives (Pill, Chip, Card, ProgressBar)
│   ├── lib/
│   │   ├── types.ts                   TS types mirroring the JSON shape below
│   │   └── mock/overview.json         The mock data (provided below — save it here)
│   ├── public/
│   ├── tailwind.config.ts
│   └── package.json
└── docs/                              (other project docs live here if provided)
```

---

## Design tokens — use these exactly

Paste into `frontend/app/globals.css`, then wire into `tailwind.config.ts` under `theme.extend.colors` pointing at these CSS variables (e.g. `accent: 'var(--accent)'`).

```css
:root {
  --ground: #f7f8fc;
  --surface: #ffffff;
  --surface-raised: #eef0fa;
  --ink: #12141c;
  --ink-soft: #4a4f60;
  --muted: #8890a3;
  --border: #e5e7f2;

  --accent: #4c4cff;
  --accent-2: #ff5f6d;
  --accent-soft: #ebebff;

  --good: #14c793;
  --good-soft: #e0faf1;
  --warn: #ffab1a;
  --warn-soft: #fff2dc;
  --critical: #ff4d6d;
  --critical-soft: #ffe4ea;

  --t-touch: #14c793;
  --t-status: #4c4cff;
  --t-wellbeing: #ff3d8f;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --ground: #0d0f16;
    --surface: #161926;
    --surface-raised: #1e2233;
    --ink: #f2f3f9;
    --ink-soft: #c7cbdc;
    --muted: #838aa3;
    --border: #2a2e42;
    --accent: #8686ff;
    --accent-2: #ff8189;
    --accent-soft: #23253f;
    --good: #35e0ac;
    --good-soft: #0f2c26;
    --warn: #ffc24d;
    --warn-soft: #332510;
    --critical: #ff7891;
    --critical-soft: #351726;
    --t-touch: #35e0ac;
    --t-status: #8686ff;
    --t-wellbeing: #ff62a8;
  }
}

:root[data-theme="dark"] {
  /* same values as the dark media block above */
}
```

**Fonts (Google Fonts):**
- `Bricolage Grotesque` — display: page headline, the big gauge number, card headings inside evidence
- `Plus Jakarta Sans` — body/UI text everywhere else
- `IBM Plex Mono` — anything numeric/tabular: scores, confidence percentages

**Semantic color rule:** `--good` / `--warn` / `--critical` mean exposure level only — never reuse them decoratively. `--accent` / `--accent-2` are brand identity (gauge stroke, buttons, the recommendation banner's gradient). `--t-touch` / `--t-status` / `--t-wellbeing` mark which of the three MCCF tiers a card belongs to (icon badge background, card border-left accent, hover ring) — distinct from both of the above.

> Note: an earlier design pass (muted sage/teal) was published as a throwaway preview artifact and then reworked — these tokens above are the current, approved direction. If you land on an old preview link anywhere, don't treat it as source of truth; this doc is.

---

## Layout spec for the Overview page

**Top bar:** small wordmark ("Atlas", with a gradient-filled icon mark) left; "Sample analysis · YouTube data, last 7 days" meta text right.

**Hero card:** two-column (stacks on mobile). Left: an SVG ring gauge, ~150px, showing `feedHealth` 0–100, stroke colored by band (≥70 good, 40–69 warn, <40 critical), animated fill-in on load, big number centered inside using Bricolage Grotesque. Right: a headline sentence with one highlighted phrase in `--accent` color, one line of supporting copy, and the platform chips row (active platforms in `--good` tinted pill, "coming soon" platforms muted). Give the hero card two soft blurred color blobs (accent + accent-2, low opacity) in the background corners for visual warmth — subtle, not a full gradient hero.

**Tier sections (×3, in this order — do not reorder):** Cultural Touchpoints → Procuring Masculine Status → Social & Emotional Wellbeing. Each has a small color swatch + title + one-line description, then a responsive card grid (`auto-fill, minmax(270px, 1fr)`) of `DimensionCard`s for that tier's dimensions.

**DimensionCard, collapsed state:** icon badge (tier-colored square, 30px, rounded) + dimension name + one-line sub-description, a level pill (Low/Moderate/High, or "Common" for Cultural Touchpoints specifically — never "High" for baseline content), a thin progress bar colored by level, and a numeric score + "Details ⌄" affordance. Use a native `<details>/<summary>` element (or an accessible equivalent) so it's keyboard-operable by default.

**DimensionCard, expanded state:** the evidence block — an italicized/styled quote in Bricolage Grotesque, its source (e.g. "Video watched · FitnessLab"), and a match-confidence percentage in mono type. If `note` is present, render it in a small amber-tinted callout below the evidence — this is used both for "strongest signal" flags and for **low-confidence/false-positive warnings** (e.g. "destroy your leg day" flagged as aggression but actually ordinary fitness language). Keep this pattern — it's a deliberate transparency feature, not something to simplify away.

**Recommendation banner:** full-width card at the bottom, gradient background (`--accent` → `--accent-2`), white text, one heading ("Worth trying") and one paragraph of constructive, specific suggestion text (never generic "reduce screen time" advice — name actual alternative content).

**Footer:** small muted-text disclaimer that this is a research prototype, explains the scoring approach in one sentence, and reassures on consent/privacy.

---

## Mock data — save as `frontend/lib/mock/overview.json`

```json
{
  "feedHealth": 64,
  "platforms": [
    { "id": "youtube", "label": "YouTube", "status": "active" },
    { "id": "reddit", "label": "Reddit", "status": "soon" },
    { "id": "instagram", "label": "Instagram", "status": "soon" }
  ],
  "tiers": [
    {
      "id": "touch",
      "title": "Cultural touchpoints",
      "desc": "Baseline content — expected to make up most of any feed.",
      "color": "var(--t-touch)",
      "dimensions": [
        {
          "code": "CULT_TOUCH",
          "name": "Cultural touchpoints",
          "sub": "Sports, gaming, fitness, general lifestyle",
          "score": 68,
          "level": "common",
          "evidence": { "quote": "Leg day complete — full lower body breakdown", "source": "Video watched · FitnessLab", "confidence": 91 },
          "note": null
        }
      ]
    },
    {
      "id": "status",
      "title": "Procuring masculine status",
      "desc": "Content about achieving or performing masculinity.",
      "color": "var(--t-status)",
      "dimensions": [
        { "code": "DOM_AUTH", "name": "Dominance & authority", "sub": "Alpha framing, hierarchy, control", "score": 42, "level": "moderate", "evidence": { "quote": "The alpha mindset is what separates winners from everyone else in the room", "source": "Video watched · Grindset Daily", "confidence": 77 }, "note": null },
        { "code": "PHYS_APPEAR", "name": "Physical enhancement", "sub": "Appearance, looksmaxxing, gym culture", "score": 55, "level": "moderate", "evidence": { "quote": "3 jawline exercises that actually work (do this daily)", "source": "Video watched · LooksLab", "confidence": 84 }, "note": null },
        { "code": "STAT_MATER", "name": "Material & financial status", "sub": "Hustle culture, wealth signaling", "score": 61, "level": "high", "evidence": { "quote": "How I escaped the matrix and made $10k this month", "source": "Video watched · WealthMindset", "confidence": 88 }, "note": null },
        { "code": "COMP_GRIND", "name": "Competition & grind", "sub": "Win-at-all-costs, outwork everyone", "score": 38, "level": "moderate", "evidence": { "quote": "No days off. Outwork everyone. That's the whole plan.", "source": "Comment on watched video", "confidence": 70 }, "note": null },
        { "code": "INDEP_AUT", "name": "Hyper-independence", "sub": "Lone wolf, self-reliance, distrust", "score": 30, "level": "low", "evidence": { "quote": "Trust no one, rely on yourself, that's lone wolf energy", "source": "Video watched · Solo Mindset", "confidence": 66 }, "note": null },
        { "code": "PROV_PROT", "name": "Provider & protector", "sub": "Traditional duty, guardian role", "score": 22, "level": "low", "evidence": { "quote": "Why showing up for your family is the real flex", "source": "Video watched · Grounded", "confidence": 58 }, "note": null }
      ]
    },
    {
      "id": "wellbeing",
      "title": "Social & emotional wellbeing",
      "desc": "Where harm, if any, tends to concentrate.",
      "color": "var(--t-wellbeing)",
      "dimensions": [
        { "code": "EMOT_STOIC", "name": "Emotional stoicism", "sub": "“Man up” culture, emotional suppression", "score": 71, "level": "high", "evidence": { "quote": "Just man up bro, feelings are for the weak", "source": "Comment on watched video", "confidence": 89 }, "note": "This is the strongest signal in your feed this week — see the recommendation below." },
        { "code": "AGGR_FORCE", "name": "Aggression & combativeness", "sub": "Hostility, conquest, enemy framing", "score": 19, "level": "low", "evidence": { "quote": "Destroy your leg day, obliterate your PR", "source": "Video watched · FitnessLab", "confidence": 41 }, "note": "Low confidence — this looks like ordinary fitness language, not hostility. Flagged for review." },
        { "code": "TOXIC_HOST", "name": "Hostile / degrading discourse", "sub": "Misogyny, red/black pill framing", "score": 12, "level": "low", "evidence": { "quote": "No matching content found this week", "source": "—", "confidence": null }, "note": null }
      ]
    }
  ],
  "recommendation": "Your feed leans heavy on stoicism and hustle-culture framing this week (“man up,” “escape the matrix”). Neither is harmful on its own, but together they crowd out room for content on rest, emotional processing, or asking for help. A couple of channels that cover similar ground — self-improvement, discipline — without the suppression framing: Dr. Mike (health), The Real MVW (mental health for men), HealthyGamerGG."
}
```

`level` is one of `low | moderate | high | common`. `common` is reserved for Cultural Touchpoints only.

---

## Your first concrete task

1. Scaffold the Next.js app (`npx create-next-app@latest frontend --typescript --tailwind --app`).
2. Add the design tokens to `globals.css`, wire fonts in `layout.tsx`.
3. Build `lib/types.ts` from the mock JSON shape.
4. Build the component tree under `components/dashboard/` per the layout spec above.
5. Assemble `app/page.tsx` importing `lib/mock/overview.json` directly (no fetch yet).
6. Get it visually matching this spec, responsive down to ~360px, dark mode working via `prefers-color-scheme`.

Stop there and show the result before touching the backend.
