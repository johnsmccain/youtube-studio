# YouTube Content Studio

An AI-powered platform for YouTube creators — research trends, generate ideas, write scripts, produce thumbnails, and track performance in one workflow.

## Monorepo Structure

```
youtube-content-studio/
├── apps/
│   ├── web/                  # Next.js 14 frontend (App Router)
│   └── api/                  # Hono API server
├── packages/
│   ├── database/             # Prisma schema + client
│   ├── shared/               # Shared types, utils, constants
│   ├── ai-providers/         # AI SDK abstraction layer
│   ├── youtube-integration/  # YouTube Data API v3 client
│   └── media-engine/         # Media processing utilities
├── workers/
│   ├── trend-worker/         # Trend scraping + scoring jobs
│   ├── media-worker/         # AI media generation queue
│   └── rendering-worker/     # Video rendering pipeline
└── infrastructure/           # Docker, Terraform, CI/CD
```

## Prerequisites

- Node.js >= 20 LTS
- pnpm >= 9
- Docker + Docker Compose (for local Postgres + Redis)

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Start infrastructure (Postgres + Redis)
docker compose up -d

# Run database migrations
pnpm --filter @repo/database db:migrate

# Start all apps in dev mode
pnpm dev
```

## Apps

| App | URL | Description |
|-----|-----|-------------|
| `web` | http://localhost:3000 | Next.js creator dashboard |
| `api` | http://localhost:3001 | Hono REST API |

## Key Commands

```bash
pnpm build         # Build all packages and apps
pnpm dev           # Start all in watch/dev mode
pnpm lint          # Lint all packages
pnpm typecheck     # Type-check all packages
pnpm test          # Run all tests
pnpm format        # Format with Prettier
```

## Feature Specs

Detailed specs for each feature area live in `.kiro/specs/`:

- `channel-integration/` — YouTube OAuth + channel management
- `trend-intelligence/` — Trend detection and scoring
- `keyword-research/` — SEO keyword discovery
- `idea-recommendations/` — AI video idea generation
- `script-studio/` — Script writing + AI assistance
- `thumbnail-studio/` — Thumbnail generation + design
- `media-generation/` — AI image/video asset generation
- `video-editor/` — In-browser video editing
- `analytics/` — Performance tracking + insights

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **API**: Hono, Zod
- **Database**: PostgreSQL, Prisma
- **Queue**: Redis, BullMQ
- **Auth**: NextAuth.js (Google OAuth)
- **AI**: OpenAI GPT-4o, Anthropic Claude, Replicate
- **Storage**: Cloudflare R2
