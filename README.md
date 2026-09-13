# Project Atlas

A digital wellbeing dashboard, styled like a parental-control app but built for a young man to use on **himself**. It connects to (or ingests exports from) his own social media accounts and shows — in plain, non-judgmental language — what kind of masculine ideology content he's being exposed to, grounded in real academic frameworks rather than raw "screen time" numbers.

This is a **research prototype**, not a consumer product. See [Project_Atlas_Spec.md](Project_Atlas_Spec.md) for the full consolidated spec (single source of truth), and [ARCHITECTURE.md](ARCHITECTURE.md) for the technical breakdown.

## How it works

```
User (self) → Consent screen → Connect YouTube (OAuth) / Upload Takeout
    → Normalization Layer (platform-agnostic internal format)
    → NLP Pipeline (clean → tokenize → dictionary match → sentiment)
    → Scoring Engine (10 dimensions + 3 composite scores)
    → Dashboard: Layer 1 Overview → Layer 2 Deep Dive
```

The dashboard has two layers over the same data: a simple traffic-light overview (exposure levels per category, one Feed Health Score) that drills into a detailed view (dimension progress bars, XAI evidence cards showing exactly why content was flagged, per-platform breakdowns, trends over time).

Classification is grounded in three academic frameworks: the MCCF model (Cultural Touchpoints → Procuring Masculine Status → Degrading Social/Emotional Wellbeing), Connell's Hegemonic Masculinity Theory (the 10 scoring dimensions), and Moral Foundations Theory / Gendered Discourse Analysis for sentiment weighting.

## Platform scope

| Platform | Status | Method |
|---|---|---|
| YouTube | Build first | Google Takeout upload (historical) + OAuth (live) |
| Reddit | Second | Username RSS scrape + subreddit checklist + optional data export |
| Instagram | Third | User data-download JSON parser only (no scraping) |

No scraping. No PII stored (hashed IDs only). Informed consent required before any data access.

## Repo layout

- [frontend/](frontend/) — Next.js dashboard (App Router, TypeScript, Tailwind)
- [Project_Atlas_Spec.md](Project_Atlas_Spec.md) — consolidated project spec (source of truth)
- [ARCHITECTURE.md](ARCHITECTURE.md) — technical architecture
- [Action_Plan.md](Action_Plan.md) — week-by-week implementation plan
- [Complete_Project_Doc.md](Complete_Project_Doc.md), [Feasibility_and_Blueprint.md](Feasibility_and_Blueprint.md), [Repo_Analysis.md](Repo_Analysis.md) — supporting research/planning docs
- [HANDOFF.md](HANDOFF.md) — handoff notes

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). See [frontend/README.md](frontend/README.md) for framework-level details.

## Ethics

Informed consent before data access, no PII stored, data minimization, right to delete, neutral/constructive language throughout (no shaming), full score transparency, IRB/institutional ethics approval required before running with real participants beyond the immediate team.
