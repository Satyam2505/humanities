# Repo Analysis: YouTube Context Analysis Chrome Extension

**Repo:** [Youtube_Context_Analysis_using_API](https://github.com/Rishpraveen/Youtube_Context_Analysis_using_API)
**Type:** Chrome Extension (Manifest V3)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│              YOUTUBE PAGE (DOM)                           │
│  Video Title, Channel, Description, Comments, Transcript │
└─────────────────────────┬────────────────────────────────┘
                          │ DOM Scraping / MutationObserver
                          ▼
┌──────────────────────────────────────────────────────────┐
│              CONTENT SCRIPT (content.js)                  │
│  Extracts Video ID, Title, Description, Comments         │
│  Injects in-page analysis badges                         │
└──────────────┬───────────────────────────┬───────────────┘
               │ chrome.runtime messages   │
               ▼                           ▼
┌──────────────────────────────────────────────────────────┐
│          BACKGROUND SERVICE WORKER (background.js)        │
│  • YouTube Data API v3 calls (metadata + comments)       │
│  • MeaningCloud API (sentiment)                          │
│  • Google Cloud NLP (entity detection)                   │
│  • Local masculinity dictionary regex matching           │
│  • Scoring engine (0–100 across 10 dimensions)           │
│  • chrome.storage.local caching                          │
└──────────────┬───────────────────────────┬───────────────┘
               ▼                           ▼
┌──────────────────────────┐ ┌─────────────────────────────┐
│   POPUP UI (popup.html)  │ │   OPTIONS UI (options.html) │
│  • Score gauge (0–100)   │ │  • API key config           │
│  • Dimension meters      │ │  • Dictionary editor        │
│  • XAI evidence cards    │ │  • Weight tuning sliders    │
│  • Sentiment badges      │ │  • CSV/JSON data export     │
└──────────────────────────┘ └─────────────────────────────┘
```

---

## File-by-File Breakdown

| File | Size | Role |
|------|------|------|
| **manifest.json** | 1.2 KB | Extension config — permissions for `storage`, `activeTab`, `tabs`, `scripting`, `declarativeNetRequest`; host permissions for YouTube, googleapis, MeaningCloud |
| **background.js** | 109 KB | Central orchestrator — API calls, dictionary matching, scoring engine, caching, message routing |
| **content.js** | 27 KB | DOM scraper — extracts video ID, title, description, comments, transcript from YouTube pages; handles SPA navigation via MutationObserver |
| **popup.js** | 39 KB | Popup controller — triggers analysis, renders score gauges, dimension meters, XAI evidence cards, word cloud tags |
| **popup.html** | 3.6 KB | Dark-mode popup UI with circular score gauge, metric bars, evidence cards, action buttons |
| **popup.css** | 16.7 KB | Styling for the popup (dark theme, emerald/amber/rose accents) |
| **options.js** | 33 KB | Settings controller — API key management, custom dictionary editing, weight sliders, CSV/JSON export, cache management |
| **options.html** | 19 KB | Settings UI — credential inputs, dictionary editor, weight tuners, data export panel |
| **options.css** | 8.2 KB | Settings page styling |
| **rules.json** | 358 B | Declarative net request rules for CORS/header handling |
| **Contributing.md** | 10.7 KB | Contribution guidelines, dictionary expansion protocols, ethical guidelines |
| **README.md** | 3.9 KB | Setup guide, architecture overview, research grounding |

---

## Masculinity Classification Engine

### 10 Scoring Categories

| Code | Category | Example Keywords |
|------|----------|-----------------|
| `DOM_AUTH` | Dominance & Authority | alpha, sigma, boss, command, control, superior |
| `COMP_GRIND` | Competition & Hustle | grind, hustle, conquer, outwork, champion |
| `INDEP_AUT` | Hyper-Independence | lone wolf, trust nobody, self-reliant, own lane |
| `EMOT_STOIC` | Emotional Stoicism | man up, don't cry, suppress, tough it out |
| `AGGR_FORCE` | Aggression & Combativeness | warrior, destroy, smash, obliterate, enemy |
| `PROV_PROT` | Provider / Protector | breadwinner, duty, obligation, honor, guardian |
| `PHYS_APPEAR` | Physical Enhancement | looksmaxxing, jawline, hypertrophy, ripped |
| `STAT_MATER` | Material & Financial Status | bugatti, escaped the matrix, crypto, millionaire |
| `CULT_TOUCH` | Cultural Touchpoints | sports, gaming, fitness, cars, tech |
| `TOXIC_HOST` | Degrading & Hostile | red pill, black pill, body count, hypergamy |

### Scoring Formulas

**Category Score** (each dimension, 0–100):
$$S_k = \min\left(100, \; \frac{\sum \text{Freq}(w_{i,k}) \times \text{Weight}(w_{i,k})}{\text{Total Tokens}} \times \gamma_k \right)$$

**Toxicity Composite:**
$$T = \alpha \cdot S_{\text{TOXIC}} + \beta \cdot S_{\text{AGGR}} + \delta \cdot \text{SentimentNegativity}$$

**Feed Balancer Score** (overall health, higher = better):
$$B = 100 - (0.35 \cdot S_{\text{TOXIC}} + 0.25 \cdot S_{\text{STOIC}} + 0.20 \cdot S_{\text{DOM}} + 0.20 \cdot \max(0, S_{\text{AGGR}} - S_{\text{PROT}}))$$

**Healthy Masculinity Index:**
$$H = \frac{S_{\text{PROT}} + S_{\text{COMP}} \cdot (1 - \text{ToxicityRatio}) + S_{\text{CULT}}}{3}$$

---

## Key Features

| Feature | How It Works |
|---------|-------------|
| **Real-time video analysis** | DOM scraping + YouTube Data API for metadata/comments |
| **10-dimension scoring** | Dictionary regex matching → weighted 0–100 scores per category |
| **Explainable AI (XAI)** | Evidence cards showing *exact* flagged phrases + category + confidence |
| **Multi-provider NLP** | Toggle between MeaningCloud, Google Cloud NLP, or custom LLM |
| **Custom dictionary editor** | Researchers can add slang, hashtags, language variants (JSON) |
| **Weight tuning** | Sliders to adjust category weights for different research contexts |
| **Research data export** | CSV/JSON export of anonymized analysis history |
| **YouTube Shorts support** | Handles both `/watch?v=` and `/shorts/` URLs |
| **Caching** | chrome.storage.local to avoid redundant API calls |

---

## Limitations & Gaps

| Issue | Impact |
|-------|--------|
| **YouTube API quota** | 10,000 units/day free; comment fetching costs 5 units/page — burns through quickly |
| **Client-side API key storage** | Keys in `chrome.storage.local` are exposed; needs a proxy backend for production |
| **Keyword-only matching** | No semantic understanding — sarcasm, irony, polysemy cause false positives (e.g., fitness content flagged as "Dominance") |
| **SPA navigation races** | YouTube's Polymer SPA doesn't fire page reloads; MutationObserver can have race conditions |
| **No transcript API** | Official API requires OAuth owner auth for captions; relies on DOM scraping which fails if captions are disabled |
| **Desktop only** | Chrome extensions don't work on mobile — where most Shorts/Reels consumption happens |
| **No Reddit integration yet** | Architecture docs mention Reddit but the extension only covers YouTube currently |

---

## How It Maps to Your Project Documents

| Project Document | Repo Implementation |
|-----------------|-------------------|
| **Prototype Meeting Notes** → YouTube API dashboard | ✅ Built as Chrome Extension with popup dashboard |
| **Tech Roadmap** → Scoring Engine (Safety, Toxicity, Dominance, etc.) | ✅ 10-dimension scoring with composite formulas |
| **Expert Meeting** → MCCF categories + seed dictionary | ✅ 10-category dictionary with regex matching |
| **Tentative Strategy** → Explainability Engine (Module 8) | ✅ XAI evidence cards with flagged phrases |
| **Tentative Strategy** → MeaningCloud + Google Cloud NLP | ✅ Both integrated as configurable providers |
| **Tentative Strategy** → Next.js + FastAPI backend | ❌ Not yet — currently all client-side in the extension |
| **Tentative Strategy** → PostgreSQL storage | ❌ Uses chrome.storage.local instead |
| **Tentative Strategy** → Redis + Celery queues | ❌ No background job queue — synchronous API calls |
