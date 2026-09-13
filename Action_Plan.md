# Action Plan — How to Build This Project

> Quora dropped. Platforms: **YouTube, Reddit, Instagram** (in that priority order).

---

## Phase 0: Do This TODAY / This Week

These are non-technical tasks that unblock everything else.

| # | Task | Who | Time |
|---|------|-----|------|
| 1 | **Get YouTube Data API v3 key** — Go to [console.cloud.google.com](https://console.cloud.google.com), create project, enable YouTube Data API v3, generate API key + OAuth 2.0 credentials | Dev team | 30 min |
| 2 | **Get MeaningCloud API key** — Sign up at [meaningcloud.com](https://www.meaningcloud.com/developer/create-account), free tier = 20K API calls/month | Dev team | 10 min |
| 3 | **Everyone: export your own Google Takeout data** — Go to [takeout.google.com](https://takeout.google.com), select "YouTube and YouTube Music", download JSON. This becomes your test dataset | Everyone | 15 min |
| 4 | **Everyone: export your Instagram data** — Instagram → Settings → Your Activity → Download Your Information → JSON format. Takes 24-48hrs to receive | Everyone | 5 min (then wait) |
| 5 | **Lit review team: finalize masculinity dictionary v1** — Use seed dictionary from expert meeting doc. Minimum 15 words per category, 10 categories = 150+ keywords | Lit review team | 3-5 days |
| 6 | **Decide your tech stack** — See recommendations below | Full team | 1 meeting |
| 7 | **Set up Git repo** — New private repo for the web platform (Chrome extension repo stays separate) | Dev team | 15 min |

---

## Tech Stack Recommendation

| Layer | Tool | Why |
|-------|------|-----|
| **Frontend** | React (Next.js) or Streamlit (Python) | Next.js if team knows React. **Streamlit is fastest for research prototype** — zero frontend code needed |
| **Backend** | Python (Flask or FastAPI) | NLP pipeline, dictionary, scoring engine are all Python-native |
| **Database** | SQLite (prototype) → PostgreSQL (later) | SQLite = zero setup, good enough for <100 users |
| **NLP** | NLTK + SpaCy + MeaningCloud API | Already planned in your docs |
| **Charts** | Chart.js or Plotly | Chart.js for web, Plotly for Streamlit |
| **Auth** | Google OAuth 2.0 (Firebase Auth is easiest) | Your users are engineers — they all have Google accounts |
| **Hosting** | Render.com or Railway (free tier) | Zero config deployment |

> [!TIP]
> **Fastest path to a working demo:** Use **Streamlit** (Python). It gives you web UI, charts, file uploads, and interactive widgets with zero frontend code. Rebuild in React later if needed.

---

## Phase 1: Foundation (Week 1–2)

**Goal:** Project skeleton running. Upload a Google Takeout file → see scores.

### Week 1 — Backend Skeleton + Dictionary

| # | Task | Details |
|---|------|---------|
| 1 | **Set up project structure** | Folders: `/backend`, `/frontend`, `/data`, `/dictionary`, `/tests` |
| 2 | **Build masculinity dictionary as JSON** | Convert seed dictionary from expert meeting into structured JSON |
| 3 | **Build text cleaning pipeline** | Python: lowercase → remove URLs → remove emojis → strip HTML → normalize |
| 4 | **Build tokenizer** | SpaCy/NLTK: split sentences → lemmatize → extract tokens |
| 5 | **Build dictionary matcher** | Regex `\bword\b` per category → count frequencies → extract matching sentences |
| 6 | **Test on sample data** | Run pipeline on 5-10 manually copied YouTube comments |

**Dictionary JSON structure:**
```json
{
  "dominance_authority": {
    "keywords": ["alpha", "sigma", "dominant", "boss", "command", "control", "leader"],
    "weight": 1.0,
    "mccf_category": "procuring_status"
  },
  "emotional_stoicism": {
    "keywords": ["man up", "dont cry", "no emotion", "tough", "suppress", "stone cold"],
    "weight": 1.0,
    "mccf_category": "degrading_wellbeing"
  }
}
```

### Week 2 — Scoring Engine + Takeout Parser

| # | Task | Details |
|---|------|---------|
| 7 | **Build Google Takeout parser** | Parse `watch-history.json`: extract video titles, channel names, timestamps |
| 8 | **Build scoring engine** | 0–100 formulas: category scores, toxicity composite, feed health score |
| 9 | **Build evidence extractor** | Capture surrounding sentence when keyword matches (for XAI cards) |
| 10 | **Build basic web UI** | File upload → processing → scores as numbers/bars |
| 11 | **Integrate MeaningCloud** | Send text → get sentiment polarity → factor into scores |
| 12 | **First working demo** | Upload Takeout → see scores + evidence → screenshot for advisor |

> [!IMPORTANT]
> **Milestone:** By end of Week 2, upload a Google Takeout file → see scores + evidence on screen. **Show this to your advisor.**

---

## Phase 2: YouTube Module (Week 3–4)

**Goal:** Full YouTube analysis with OAuth, live data, and dashboard.

### Week 3 — YouTube OAuth + API

| # | Task | Details |
|---|------|---------|
| 13 | **Implement Google OAuth login** | "Sign in with Google" → get access token for YouTube API |
| 14 | **Fetch user's subscriptions** | `GET /youtube/v3/subscriptions?mine=true` → channels they follow |
| 15 | **Fetch user's liked videos** | `GET /youtube/v3/videos?myRating=like` → videos they've liked |
| 16 | **Classify subscribed channels** | Build channel classification DB: map popular channels to MCCF categories |
| 17 | **Fetch video metadata** | Get title, description, tags for liked videos → run through NLP pipeline |
| 18 | **Merge Takeout + OAuth** | Combine historical + live data into unified analysis |

### Week 4 — YouTube Dashboard

| # | Task | Details |
|---|------|---------|
| 19 | **Build comment fetcher** | `commentThreads.list` → top 100 comments per video |
| 20 | **Analyze comments** | Dictionary + sentiment pipeline on comment text |
| 21 | **Build YouTube dashboard** | Subscription breakdown pie chart, liked video analysis, comment toxicity, top influencers |
| 22 | **Build main score gauge** | Big circular 0–100 Feed Health Score (green/amber/red) |
| 23 | **Build dimension progress bars** | 10 bars: Stoicism, Dominance, Aggression, etc. |
| 24 | **Build XAI evidence cards** | `[Stoicism] Score: 72 — "just man up bro, feelings are for the weak"` |

> [!IMPORTANT]
> **Milestone:** By end of Week 4, you have a working YouTube dashboard. **This alone is a solid prototype.**

---

## Phase 3: Reddit Module (Week 5–6)

**Goal:** Add Reddit as second platform.

### Week 5 — Reddit Data Collection

| # | Task | Details |
|---|------|---------|
| 25 | **Apply for Reddit API access** | Developer portal, academic/non-commercial. **Start this in Week 1** — takes weeks |
| 26 | **Build Reddit export parser** | Parse Reddit data download JSON: subreddits, comments, posts |
| 27 | **Build subreddit classification DB** | Manually categorize 200–500 relevant subreddits |
| 28 | **Analyze subscriptions** | Map user's subs against classification DB → instant category breakdown |

**Example subreddit classifications:**
```
Cultural Touchpoints:   r/fitness, r/gaming, r/sports, r/cars
Procuring Status:       r/entrepreneur, r/seduction, r/dating_advice
Healthy Masculinity:    r/MensLib, r/bropill, r/malementalhealth
Toxic/Degrading:        r/TheRedPill, r/MGTOW, r/pussypassdenied
```

### Week 6 — Reddit Dashboard

| # | Task | Details |
|---|------|---------|
| 29 | **Analyze Reddit comments/posts** | Run user's comment history through NLP + dictionary pipeline |
| 30 | **Build Reddit dashboard page** | Subreddit pie chart, comment sentiment timeline, community health scores |
| 31 | **Merge cross-platform scoring** | Combined YouTube + Reddit overall scores |
| 32 | **Build Overview/Home page** | Unified view: overall feed health, per-platform breakdown, risk alerts |

---

## Phase 4: Instagram + Polish (Week 7–8)

**Goal:** Add Instagram, polish everything, prepare for demo.

### Week 7 — Instagram Module

| # | Task | Details |
|---|------|---------|
| 33 | **Build Instagram export parser** | Parse Instagram JSON: followed accounts, liked posts, search history |
| 34 | **Build account classifier** | Categorize followed accounts by bio/description |
| 35 | **Analyze liked content** | Extract text from liked post captions → run through pipeline |
| 36 | **Build Instagram dashboard** | Followed accounts breakdown, liked content themes |

### Week 8 — Polish & Demo

| # | Task | Details |
|---|------|---------|
| 37 | **Recommendations engine** | If Toxicity > 60, suggest healthier content in same interest area |
| 38 | **Trends/Timeline page** | Exposure changes over time (from Takeout timestamps) |
| 39 | **Research Export page** | One-click CSV/JSON download of anonymized data |
| 40 | **PDF report generation** | Downloadable summary per user |
| 41 | **Test with real data** | Run 5-10 team members' data through system. Fix bugs. Tune dictionary. |
| 42 | **Deploy** | Push to Render.com/Railway. Get public URL. |
| 43 | **Advisor demo** | Screenshots, walkthrough, talking points |

---

## Team Work Split

| Role | Responsibilities |
|------|-----------------|
| **Dev Lead** | Backend architecture, API integrations, scoring engine, deployment |
| **Frontend Dev** | Dashboard UI, charts, gauges, evidence cards |
| **NLP / Data Pipeline** | Text cleaning, tokenization, dictionary matching, sentiment |
| **Literature Review Team** | Dictionary creation + validation, subreddit/channel classification DB, academic grounding |
| **Everyone** | Test with own data, bug reports, dictionary refinement |

---

## The "Start Right Now" Checklist

```
□ Get YouTube Data API key (30 min)
□ Get MeaningCloud API key (10 min)
□ Everyone: export Google Takeout YouTube data (15 min)
□ Everyone: request Instagram data download (5 min)
□ Apply for Reddit API access (do this NOW — takes weeks)
□ Create new Git repo for web platform
□ Set up Python project with Flask/FastAPI
□ Convert expert meeting seed dictionary into JSON
□ Build text cleaning function
□ Build dictionary matcher function
□ Test on 5 manually copied YouTube comments
```

**Once these are done, you're off and running.**
