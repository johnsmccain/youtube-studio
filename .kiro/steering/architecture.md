# Architecture Steering

## Architectural Pattern
Modular Monolith — clean module boundaries without microservice deployment complexity.
When a module needs to scale independently, it can be extracted into a worker or service without rewiring the rest of the system.

## System Diagram

```
                 AI YOUTUBE CONTENT STUDIO
                            |
                 NEXT.JS FRONTEND (apps/web)
                            |
                 BACKEND API (apps/api) — Express + TypeScript
                            |
        +-------------------+-------------------+
        |                   |                   |
   INTELLIGENCE          CONTENT             PRODUCTION
      ENGINE              ENGINE               ENGINE
  (modules/intelligence) (modules/content)  (modules/production)
        |                   |                   |
   Trend Research       Script Writer       AI Image Generator
   Keyword Research     Title Generator      AI Video Generator
   Competitor Analysis  Description Writer   AI Audio Generator
   Idea Recommendations SEO Optimizer        Voiceover Generator
   Channel Analytics    Content Planner      Thumbnail Studio
        |                   |                   |
        +-------------------+-------------------+
                            |
                      JOB PROCESSOR
                      Redis + BullMQ
                            |
                 VIDEO RENDERING ENGINE
                    Remotion + FFmpeg
                            |
                      FILE STORAGE
                   S3-compatible (R2)
                            |
                      YOUTUBE API
```

## Monorepo Layout

```
youtube-content-studio/
├── apps/
│   ├── web/              # Next.js 14 frontend (App Router)
│   └── api/              # Express + Node.js backend
│       └── src/
│           ├── modules/
│           │   ├── intelligence/   # Trend, keyword, competitor, analytics
│           │   ├── content/        # Script, title, description, SEO, planner
│           │   └── production/     # Image, video, audio, voiceover, thumbnail
│           ├── jobs/               # BullMQ job definitions + processors
│           ├── rendering/          # Remotion + FFmpeg pipeline
│           └── storage/            # S3/R2 client abstraction
├── packages/
│   ├── database/         # Prisma schema + migrations + typed client
│   ├── shared/           # Types, constants, utils shared across apps
│   ├── ai-providers/     # Abstraction: OpenAI, Runway, ElevenLabs
│   └── youtube-client/   # YouTube Data API v3 + Analytics API client
└── infrastructure/       # Docker Compose, deployment configs
```

## Tech Stack

| Component        | Technology                              |
|------------------|-----------------------------------------|
| Frontend         | Next.js 14 + TypeScript                 |
| UI               | Tailwind CSS + shadcn/ui                |
| Backend          | Node.js + Express + TypeScript          |
| Database         | PostgreSQL                              |
| ORM              | Prisma                                  |
| Background jobs  | Redis + BullMQ                          |
| AI — text        | OpenAI API (GPT-4o)                     |
| AI — images      | OpenAI image generation (DALL-E 3)      |
| AI — video       | Runway API (provider-abstracted)        |
| AI — audio/voice | ElevenLabs API                          |
| Trend discovery  | YouTube Data API, Google Trends         |
| Channel analytics| YouTube Analytics API                   |
| Video editing    | Remotion + FFmpeg                       |
| Authentication   | Better Auth                             |
| Storage          | S3-compatible (Cloudflare R2)           |
| Testing          | Vitest + Playwright                     |
| Deployment       | Ubuntu Linux                            |

## Module Boundaries

### Intelligence Engine
Responsible for all research and discovery:
- `trend-research` — scrape + score trending topics via YouTube Data API + Google Trends
- `keyword-research` — keyword discovery, search volume, competition scoring
- `competitor-analysis` — channel and video competitive benchmarking
- `idea-recommendations` — ranked video idea generation using trend + keyword signals
- `channel-analytics` — YouTube Analytics API integration, performance tracking

### Content Engine
Responsible for all written content generation:
- `script-writer` — full script generation with AI, section-by-section editing
- `title-generator` — CTR-optimized title variants
- `description-writer` — SEO-optimized video descriptions
- `seo-optimizer` — tag, chapter, and metadata optimization
- `content-planner` — multi-video calendar planning

### Production Engine
Responsible for all media asset generation:
- `image-generator` — AI image generation via OpenAI / DALL-E 3
- `video-generator` — AI video clip generation via Runway API
- `audio-generator` — AI audio/music generation
- `voiceover-generator` — text-to-speech via ElevenLabs API
- `thumbnail-studio` — thumbnail composition (AI image + layout + text)

## Job Processing
- All heavy/async tasks (media generation, rendering, trend scraping) run as BullMQ jobs
- Jobs defined in `apps/api/src/jobs/`
- Each job processor corresponds to a module operation
- Job status exposed via REST polling + SSE push

## Data Flow
1. User connects YouTube channel → `youtube-client` stores encrypted tokens in DB
2. `trend-worker` job polls YouTube + Google Trends, scores topics, writes to DB
3. Frontend requests intelligence data from API → Intelligence Engine reads from DB
4. Content generation requests hit API → Content Engine calls `ai-providers` → streams back via SSE
5. Media generation jobs enqueued → Production Engine processors call Runway/ElevenLabs/OpenAI
6. Rendered assets uploaded to R2 → signed URLs returned to frontend
7. Final video rendering runs Remotion + FFmpeg pipeline as a BullMQ job

## API Design
- RESTful resources under `/api/v1/`
- All inputs validated with Zod
- Errors: `{ error: { code: string, message: string } }`
- Paginated lists: `{ data: T[], meta: { total, page, pageSize } }`
- Streaming AI responses via Server-Sent Events
- Job status updates via SSE (`/api/v1/jobs/:id/status`)

## Key Constraints
- All AI SDK calls go through `packages/ai-providers` only — never import OpenAI/Runway/ElevenLabs directly in apps
- Database access only through `packages/database` exports
- Shared types live in `packages/shared` — no duplication
- YouTube API calls only through `packages/youtube-client`
- Each module in `apps/api/src/modules/` is self-contained: its own routes, service, and types


Requirements:

- Use TypeScript throughout.
- Keep business logic out of route handlers.
- Use dependency injection for external services.
- Use interfaces for AI provider integrations.
- Validate API requests.
- Centralize error handling.
- Use structured logging.
- Never expose API keys to the frontend.
- Keep long-running tasks out of HTTP requests.
- Use background workers for video generation
  and rendering.
- Store generated assets with project references.
- Use database migrations.
- Write automated tests for business logic.
- Document all API endpoints.
