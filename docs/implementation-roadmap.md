# Implementation Roadmap

## Sequencing Rationale

The content recommendation engine depends on channel data and research sources.
Build data collection and storage before generation features.
Build generation features before editing and publishing features.

YouTube Data API provides video and channel metadata only.
YouTube Analytics API provides authorized channel performance data only.
Search volume estimates, keyword difficulty, and cross-platform trends
require additional data sources (Google Trends, third-party APIs) or
must be explicitly labelled as estimates in the UI.

---

## Phase 1 — Project Foundation and Database (Critical)

What gets built:
- Monorepo tooling (pnpm workspaces, Turbo, ESLint, Prettier, Vitest)
- PostgreSQL database with full Prisma schema covering all domains
- Database migrations baseline
- Shared types package (`@repo/shared`)
- Environment variable validation at startup
- Docker Compose for local Postgres + Redis
- Express API skeleton with error handling, logging, auth middleware stubs

Why first:
Every other phase reads from and writes to this foundation.
Getting the schema right here avoids costly migrations later.

---

## Phase 2 — YouTube Channel Integration (Critical)

What gets built:
- Google OAuth 2.0 flow via Better Auth
- YouTube channel connection and token storage (encrypted at rest)
- Channel metadata sync (name, subscribers, video count, thumbnails)
- `@repo/youtube-client` — typed wrapper over YouTube Data API v3
- Channel management UI (connect, disconnect, view status)

Why second:
Trend intelligence, keyword research, and analytics all require
an authenticated channel connection and stored tokens.

---

## Phase 3 — Trend Intelligence (Critical)

What gets built:
- YouTube Data API trending video scraper
- Google Trends integration (pytrends via subprocess or direct HTTP)
- Topic scoring algorithm (views, velocity, recency, niche relevance)
- Trend storage and scheduled refresh (BullMQ cron job)
- Trend dashboard UI

Why third:
Idea recommendations (Phase 5) are ranked using trend signals.
Keyword research (Phase 4) is seeded from trending topics.

---

## Phase 4 — Keyword Research (Critical)

What gets built:
- YouTube search suggestion scraper (autocomplete API)
- Keyword clustering and deduplication
- Competition scoring using YouTube search results metadata
- Search volume estimates (clearly labelled — not official data)
- Keyword storage and UI

Why fourth:
Keyword data feeds directly into idea scoring and script/title generation.

---

## Phase 5 — AI Video Idea Recommendations (Critical)

What gets built:
- Idea generation using trend + keyword signals via OpenAI
- Opportunity scoring (trend score × keyword score × channel gap analysis)
- Idea approval workflow (approve / reject / save for later)
- Ideas dashboard with ranked list and score breakdown

Why fifth:
Approved ideas become the input for all content generation phases.

---

## Phase 6 — Title, Description, and Script Generation (High)

What gets built:
- CTR-optimized title variants (OpenAI)
- SEO-optimized video description generator
- Full script writer with section-by-section editing
- Script templates for long-form and Shorts
- Content saved against approved idea records

---

## Phase 7 — Thumbnail Generation (High)

What gets built:
- AI image generation via OpenAI DALL-E 3
- Thumbnail composition (image + text overlay + layout)
- Thumbnail variants and A/B testing hooks
- Asset storage in R2, linked to video project

---

## Phase 8 — AI Audio and Voice Generation (High)

What gets built:
- Voiceover generation via ElevenLabs API
- Background music / audio generation
- Audio asset storage and project linking
- BullMQ job processor for async generation

---

## Phase 9 — AI Video Generation (High)

What gets built:
- AI video clip generation via Runway API
- Provider abstraction in `@repo/ai-providers`
- BullMQ job processor for async video generation
- Generated clip management and preview UI

---

## Phase 10 — Video Editing and Rendering (High)

What gets built:
- Remotion composition builder (timeline, clips, audio, text)
- FFmpeg rendering pipeline
- BullMQ rendering job with progress tracking
- Export to MP4, optimized for YouTube upload specs
- Download and YouTube upload integration

---

## Phase 11 — Advanced Analytics (High)

What gets built:
- YouTube Analytics API integration (views, watch time, CTR, revenue)
- Performance dashboard per video and channel
- Content gap analysis (what topics are underperforming)
- Trend correlation (did a recommended topic perform as predicted?)

---

## Phase 12 — Automated Content Workflows (Later)

What gets built:
- Saved workflow templates (research → script → thumbnail → render)
- Scheduled idea generation runs
- Batch processing for content calendar
- Notification system for completed jobs

---

## Cross-cutting concerns (built incrementally, not deferred)

- Error handling and structured logging: Phase 1
- Auth middleware: Phase 2
- SSE job status streaming: Phase 8 (first async media job)
- Rate limiting and API key rotation: Phase 2
- R2 asset storage abstraction: Phase 7 (first binary asset)
