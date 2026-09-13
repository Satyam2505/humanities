# Project Atlas — Consolidated Spec

*Single source of truth reconciling Action_Plan.md, Complete_Project_Doc.md, Feasibility_and_Blueprint.md, Repo_Analysis.md, meetingwithexpert.pdf, intitial-tech-roadmap.pdf, and tentative-stratergy.pdf. This doc supersedes those for direction/scope questions; they remain useful for implementation detail (dictionary seeds, week-by-week tasks, module breakdowns).*

---

## 1. What This Is

Project Atlas is a **digital wellbeing dashboard, styled like a parental-control app, but built for the young man to use on himself.** He connects or uploads his own social media data (starting with YouTube), and the platform shows him — in plain, non-judgmental language — what kind of masculine ideology content he's being exposed to, using real academic frameworks rather than vague "screen time" numbers.

It is a **research prototype**, not a consumer product. Users are consenting study participants (the team, then a wider participant pool), which simplifies ethics and aligns with an eventual academic publication and possible patent (VIT would own it; students are inventors, per the advisor meeting).

**Primary user:** the young man himself, self-monitoring. Not a parent monitoring a child. This resolves the ambiguity between the "research self-reflection tool" framing (Feasibility doc) and the "Parental Insights" mockup (tech roadmap PDF) — the *tone and UI pattern* is parental-control-style (simple, traffic-light, non-technical), but the *audience* is the person themselves.

**Why parental-control styling for a self-monitoring tool:** it's a familiar, legible UX pattern (exposure levels, clear categories, one actionable recommendation) that doesn't require the user to interpret raw NLP scores. It answers the advisor's own question from the meeting — *"why will a user want to know if he's watching correct content or not?"* — by making the payoff immediately scannable, with deeper detail available for anyone who wants to dig in.

---

## 2. UI Direction: Layered, Not Either/Or

The dashboard should lead with the simple view and let users drill into the detailed view. Two layers, same data:

| Layer | What it shows | Style reference |
|---|---|---|
| **Layer 1 — Overview (default view)** | Traffic-light exposure levels per category (High/Moderate/Low), one Feed Health Score gauge, one plain-language recommendation | "Parental Insights" panel from intitial-tech-roadmap.pdf — simple checklist, no jargon |
| **Layer 2 — Deep Dive (click-through)** | 10 dimension progress bars, XAI evidence cards ("why this score" + exact flagged quote + confidence), per-platform breakdown, trends over time | Complete_Project_Doc.md's fuller dashboard spec (radial gauge, dimension bars, evidence cards) |

Practically: the Home/Overview page is the simple parental-control-style summary card. Every category on it is clickable and expands into the Layer 2 detail (dimension bars + evidence cards) for that category. This avoids maintaining two separate UIs — it's one data model rendered at two levels of density.

---

## 3. Platform Scope & Data Collection (unchanged from prior docs — confirmed, not in question)

| Platform | Status | Method |
|---|---|---|
| YouTube | Build first | Google Takeout upload (historical) + OAuth (subscriptions/liked videos, live) |
| Reddit | Second | Three-method hybrid: username RSS scrape + subreddit checklist (self-reported) + optional data export upload |
| Instagram | Third | User data-download JSON parser only (no scraping — Meta ToS risk) |
| Quora | Dropped | No public API; not worth the effort |

No scraping of any platform. No client-side API keys in production (the Chrome extension's current weakness — flagged in Repo_Analysis.md — must not carry over to the web backend).

---

## 4. Classification Framework (unchanged — confirmed)

Three-layer academic grounding:
- **MCCF (Dr. Krista Fisher et al., 2026):** Cultural Touchpoints (~38% baseline, benign) → Procuring Masculine Status → Degrading Social/Emotional Wellbeing.
- **Connell's Hegemonic Masculinity Theory:** the 10 scoring dimensions (Dominance & Authority, Emotional Stoicism, Aggression & Combativeness, Physical Enhancement, Material & Financial Status, Competition & Grind, Hyper-Independence, Provider/Protector, Cultural Touchpoints, Toxic/Degrading Discourse).
- **Moral Foundations Theory / Gendered Discourse Analysis:** informs sentiment and discourse-marker weighting.

Composite scores: Overall Toxicity ($T$), Feed Health Score ($B$, inverse of toxicity — this is what the Layer 1 gauge shows), Healthy Masculinity Index ($H$).

Dictionary: seed from the expert meeting doc + academic word lists (Gender Decoder, GDCF framework, Ekşi Sözlük repertoires) — 10 categories, 150+ keywords, JSON structure already specified in Action_Plan.md. Literature review team owns validation.

---

## 5. Architecture (unchanged — confirmed)

```
User (self) → Consent screen → Connect YouTube (OAuth) / Upload Takeout
    → Normalization Layer (platform-agnostic internal format)
    → NLP Pipeline (clean → tokenize → dictionary match → sentiment via MeaningCloud)
    → Scoring Engine (10 dimensions + 3 composites)
    → Dashboard: Layer 1 Overview → Layer 2 Deep Dive
```

Stack: Python/FastAPI backend, Streamlit (fastest prototype path) or Next.js frontend, SQLite → Postgres, SpaCy/NLTK + MeaningCloud, Google OAuth for sign-in, Render/Railway hosting. Full detail in Action_Plan.md.

Reused asset: the existing Chrome extension (`Youtube_Context_Analysis_using_API`) already implements the scoring math, dictionary matcher, and XAI evidence extraction client-side — this logic ports to the FastAPI backend rather than being rebuilt from scratch.

---

## 6. Ethics (unchanged — confirmed, non-negotiable per Feasibility_and_Blueprint.md)

Informed consent before data access, no PII stored (hashed IDs only), data minimization, right to delete, neutral/constructive language throughout (no shaming), full score transparency (XAI), IRB/institutional ethics approval before running with real participants beyond the immediate team.

---

## 7. Open Items Before Build Starts

These aren't blocking Phase 0/1 (API keys, repo setup, dictionary v1 can proceed now), but should be settled before Layer 1 UI design locks in:

1. **Exact copy/tone for Layer 1 exposure labels.** "High Exposure: Fitness, Business" reads fine; "High Exposure: Toxic/Degrading" needs careful, non-alarming wording given the no-shaming principle.
2. **Recommendation logic.** What triggers a suggestion (Toxicity > 60 is the number floated in Action_Plan.md) and what the suggestion actually says — needs literature review team input, not just an engineering threshold.
3. **How much of Layer 2 is visible by default vs. gated behind "Show details."** Affects both UI build order and how early you need the XAI evidence-card component.

---

## 8. Immediate Next Steps

Per Action_Plan.md's Phase 0 checklist (still valid, unchanged by this framing decision):
- Get YouTube Data API v3 key + MeaningCloud API key
- Team exports own Google Takeout data as test dataset
- Finalize masculinity dictionary v1
- Set up Git repo, Python project skeleton
- Build text cleaning + dictionary matcher, test on 5–10 sample comments

Milestone: by end of Week 2, upload a Takeout file → see a working Layer 1 Overview card with real scores.
