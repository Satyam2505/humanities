# Project Atlas — Dashboard Architecture & Build Spec

*Hand this file to Claude Code (or any dev agent) to scaffold the real application. It translates the approved UI direction (see the published mockup) and Project_Atlas_Spec.md into a concrete, buildable structure. Build order: frontend dashboard against mock data first, then backend API, then the platform-specific analyzers as separate pluggable modules.*

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js 14 (App Router) + TypeScript + Tailwind CSS** | Matches the team's existing recommendation; component model maps cleanly onto the mockup's card/tier structure; Tailwind can consume the design tokens below directly as CSS variables. |
| Backend | **Python + FastAPI** | NLP stack (SpaCy/NLTK) is Python-native; async-friendly for OAuth + external API calls. |
| Database | **SQLite (prototype) → PostgreSQL (later)** | Zero setup now, clean migration path later. |
| NLP | **SpaCy/NLTK + MeaningCloud API** | Already decided; see Project_Atlas_Spec.md §4. |
| Auth | **Google OAuth 2.0** | Users already have Google accounts; also required for YouTube API access. |
| Hosting | **Render / Railway (free tier)** | Zero-config deploy for a prototype. |

Frontend and backend are separate deployables that talk over a versioned REST API (`/api/v1/...`), so the dashboard can be built and demoed against mock data before the backend exists — matching the "dashboard first" build order.

---

## 2. Repository Structure

```
atlas/
├── frontend/                          Next.js app
│   ├── app/
│   │   ├── layout.tsx                 Root layout, font imports, theme setup
│   │   ├── globals.css                Design tokens (§5) + base styles
│   │   ├── page.tsx                   "/" — Overview dashboard (the mockup, live)
│   │   ├── youtube/page.tsx           Platform deep-dive — Phase 2
│   │   ├── reddit/page.tsx            Platform deep-dive — Phase 3 (stub: "coming soon")
│   │   ├── instagram/page.tsx         Platform deep-dive — Phase 4 (stub: "coming soon")
│   │   ├── trends/page.tsx            Exposure-over-time — later phase
│   │   ├── recommendations/page.tsx   Full recommendations list — later phase
│   │   └── settings/page.tsx          Connected accounts, consent, data export
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── FeedHealthGauge.tsx    SVG ring gauge (score, band color, animated)
│   │   │   ├── PlatformChips.tsx      Connected/coming-soon platform pills
│   │   │   ├── TierSection.tsx        One MCCF tier + its dimension cards
│   │   │   ├── DimensionCard.tsx      Expandable card (level pill, bar, evidence on open)
│   │   │   ├── EvidenceBlock.tsx      Quote + source + confidence, or low-confidence note
│   │   │   └── RecommendationBanner.tsx
│   │   └── ui/                        Shared primitives: Pill, Chip, Card, ProgressBar
│   ├── lib/
│   │   ├── api.ts                     fetch wrapper — swap base URL to point at real backend
│   │   ├── types.ts                   TS types mirroring the backend schema (§4)
│   │   └── mock/overview.json         Static mock matching the real API contract exactly
│   ├── public/
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                           FastAPI app — build after frontend is approved
│   ├── app/
│   │   ├── main.py
│   │   ├── api/routes/
│   │   │   ├── auth.py                Google OAuth handshake, consent gate
│   │   │   ├── overview.py            GET /api/v1/overview — feeds the dashboard directly
│   │   │   ├── platforms.py           Connect/disconnect, Takeout/export upload
│   │   │   └── export.py              CSV/JSON/PDF research export
│   │   ├── core/config.py             Env vars, secrets (never client-side)
│   │   ├── db/models.py               SQLAlchemy models (§4)
│   │   ├── normalization/schema.py    The Normalization Layer — unified content object
│   │   ├── analyzers/                 ⬅ "separate social media analysis tools" — one per platform, same interface
│   │   │   ├── base.py                BaseAnalyzer: fetch() → normalize() → list[ContentItem]
│   │   │   ├── youtube/
│   │   │   │   ├── oauth.py           Subscriptions + liked videos via OAuth
│   │   │   │   ├── takeout_parser.py  watch-history.json parser
│   │   │   │   └── comments.py        commentThreads.list wrapper
│   │   │   ├── reddit/
│   │   │   │   ├── rss_scraper.py     Method 1 — username RSS
│   │   │   │   ├── checklist.py       Method 2 — subreddit checklist mapping
│   │   │   │   └── export_parser.py   Method 3 — data export ZIP/CSV
│   │   │   └── instagram/
│   │   │       └── export_parser.py   Data download JSON parser
│   │   ├── nlp/
│   │   │   ├── cleaning.py            Lowercase, strip URLs/emoji/HTML
│   │   │   ├── tokenizer.py           SpaCy tokenize + lemmatize
│   │   │   ├── dictionary_matcher.py  Regex \bword\b matcher against masculinity_dictionary.json
│   │   │   ├── sentiment.py           MeaningCloud wrapper
│   │   │   └── evidence_extractor.py  Sentence-boundary quote capture for XAI cards
│   │   ├── scoring/
│   │   │   ├── engine.py              S_k, T (toxicity), B (feed health), H (healthy index) — formulas from Repo_Analysis.md
│   │   │   └── dictionary/masculinity_dictionary.json
│   │   └── tests/
│   ├── requirements.txt
│   └── .env.example
│
└── docs/
    ├── Project_Atlas_Spec.md          (existing — vision, ethics, platform strategy)
    └── ARCHITECTURE.md                (this file)
```

**Key design decision:** `analyzers/` holds one self-contained module per platform, each implementing the same `BaseAnalyzer` interface (`fetch()` → `normalize()` → returns a list of unified `ContentItem`s). This is what makes them "separate social media analysis tools" — YouTube can be built and shipped alone; Reddit and Instagram slot in later without touching the NLP pipeline, scoring engine, or frontend.

---

## 3. Build Order

1. **Frontend dashboard against `lib/mock/overview.json`** (current phase). No backend needed — ship the Overview page pixel-matching the approved mockup, wired to the API contract below so nothing changes when real data arrives.
2. **Backend skeleton + `/api/v1/overview`** returning the same shape from a real (initially hand-seeded) database — swap the frontend's data source from mock JSON to the live endpoint.
3. **YouTube analyzer module** (Takeout parser first — no API quota needed — then OAuth for subscriptions/liked videos).
4. **NLP pipeline + scoring engine**, wired to the YouTube analyzer's output.
5. **Reddit analyzer**, then **Instagram analyzer** — same pattern, plugged into the same normalization/NLP/scoring pipeline untouched.

This mirrors Action_Plan.md's phased plan but reorders step 1 to be UI-first per your direction.

---

## 4. Data Model & API Contract

### Core entities (backend)

| Entity | Key fields |
|---|---|
| `User` | id (hashed UUID), consent_status, created_at — no plaintext PII |
| `PlatformConnection` | user_id, platform, oauth_token (encrypted), connected_at |
| `ContentItem` (normalized) | id, user_id, platform, type (video/comment/post), raw_text, title, timestamp, source_url |
| `DimensionScore` | user_id, dimension_code, score, level, week_start |
| `Evidence` | dimension_code, quote, source_ref, confidence |
| `FeedHealthSnapshot` | user_id, week_start, overall_score, toxicity, healthy_index |

### `GET /api/v1/overview?range=7d`

This is the one endpoint the current dashboard needs. Its shape is taken directly from the mockup's internal data model, so the frontend component code doesn't change when this goes live:

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
    }
  ],
  "recommendation": "Your feed leans heavy on stoicism and hustle-culture framing this week..."
}
```

`level` is one of `low | moderate | high | common` (`common` is reserved for Cultural Touchpoints, which is baseline/benign and shouldn't read as a warning). Other endpoints (`/platforms`, `/export`, `/auth/*`) follow once the backend phase starts — not needed for the current dashboard build.

---

## 5. Design Tokens (carry over exactly from the approved mockup)

Paste directly into `frontend/app/globals.css` as CSS custom properties, then reference from Tailwind via `theme.extend.colors` pointing at `var(--token-name)`.

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

**Type:** `Bricolage Grotesque` (display — headings, the big gauge number), `Plus Jakarta Sans` (body/UI text), `IBM Plex Mono` (scores, confidence %, anything numeric/tabular). All three load from Google Fonts.

**Semantic color rule:** `--good` / `--warn` / `--critical` are level indicators, not brand color — never repurpose them for anything but exposure level. `--accent` / `--accent-2` are the brand identity (gauge, buttons, gradients). Tier colors (`--t-touch` / `--t-status` / `--t-wellbeing`) mark section identity and are distinct from both.

---

## 6. What NOT to Change Without Checking Back

- The three MCCF tier groupings and their order (Cultural Touchpoints → Procuring Status → Wellbeing) — this is the academic framework, not a UI choice.
- The non-shaming copy tone (see Project_Atlas_Spec.md §7 and the Ethics section) — no alarmist language, no red-alert styling on benign content.
- The low-confidence/false-positive note pattern on evidence cards — this is a deliberate transparency feature, not a bug to clean up.

Everything else — exact spacing, animation, icon choices — is fair game to iterate on once it's in code.
