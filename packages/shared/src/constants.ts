// Job type constants — typed so job processors and enqueues stay in sync
export const JOB_TYPES = {
  TREND_SCRAPE: "TREND_SCRAPE",
  KEYWORD_REFRESH: "KEYWORD_REFRESH",
  IDEA_GENERATION: "IDEA_GENERATION",
  SCRIPT_GENERATION: "SCRIPT_GENERATION",
  TITLE_GENERATION: "TITLE_GENERATION",
  DESCRIPTION_GENERATION: "DESCRIPTION_GENERATION",
  IMAGE_GENERATION: "IMAGE_GENERATION",
  VIDEO_GENERATION: "VIDEO_GENERATION",
  AUDIO_GENERATION: "AUDIO_GENERATION",
  VOICEOVER_GENERATION: "VOICEOVER_GENERATION",
  THUMBNAIL_GENERATION: "THUMBNAIL_GENERATION",
  VIDEO_RENDER: "VIDEO_RENDER",
  CHANNEL_SYNC: "CHANNEL_SYNC",
  ANALYTICS_SYNC: "ANALYTICS_SYNC",
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

// BullMQ queue names
export const QUEUE_NAMES = {
  INTELLIGENCE: "intelligence",
  CONTENT: "content",
  PRODUCTION: "production",
  RENDERING: "rendering",
  SYNC: "sync",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

// Niche tags — matches product target content areas
export const CONTENT_NICHES = [
  "artificial-intelligence",
  "ai-coding-tools",
  "software-development",
  "developer-productivity",
  "programming-tutorials",
  "automation",
  "technology-experiments",
  "developer-tools",
] as const;

export type ContentNiche = (typeof CONTENT_NICHES)[number];

// YouTube API limits
export const YOUTUBE_QUOTA_UNITS_PER_DAY = 10_000;
export const YOUTUBE_MAX_RESULTS = 50;

// Scoring bounds
export const MAX_TREND_SCORE = 100;
export const MAX_OPPORTUNITY_SCORE = 100;
