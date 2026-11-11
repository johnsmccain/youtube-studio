-- CreateEnum
CREATE TYPE "TrendSource" AS ENUM ('YOUTUBE_TRENDING', 'YOUTUBE_SEARCH', 'GOOGLE_TRENDS', 'MANUAL');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VideoFormat" AS ENUM ('LONG_FORM', 'SHORT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'IN_PRODUCTION', 'READY_TO_PUBLISH', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('THUMBNAIL', 'IMAGE', 'VIDEO_CLIP', 'AUDIO', 'VOICEOVER', 'RENDERED_VIDEO');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('PENDING', 'GENERATING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('TREND_SCRAPE', 'KEYWORD_REFRESH', 'IDEA_GENERATION', 'SCRIPT_GENERATION', 'TITLE_GENERATION', 'DESCRIPTION_GENERATION', 'IMAGE_GENERATION', 'VIDEO_GENERATION', 'AUDIO_GENERATION', 'VOICEOVER_GENERATION', 'THUMBNAIL_GENERATION', 'VIDEO_RENDER', 'CHANNEL_SYNC', 'ANALYTICS_SYNC');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "handle" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "subscriberCount" INTEGER,
    "videoCount" INTEGER,
    "viewCount" BIGINT,
    "country" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "scopes" TEXT[],
    "syncedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_videos" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "thumbnailUrl" TEXT,
    "duration" TEXT,
    "viewCount" BIGINT,
    "likeCount" BIGINT,
    "commentCount" BIGINT,
    "tags" TEXT[],
    "categoryId" TEXT,
    "isShort" BOOLEAN NOT NULL DEFAULT false,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trend_topics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "niche" TEXT NOT NULL,
    "source" "TrendSource" NOT NULL,
    "sourceId" TEXT,
    "sourceUrl" TEXT,
    "trendScore" DOUBLE PRECISION NOT NULL,
    "viewVelocity" DOUBLE PRECISION,
    "searchVolume" DOUBLE PRECISION,
    "recencyScore" DOUBLE PRECISION,
    "relevanceScore" DOUBLE PRECISION,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "trend_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trend_keywords" (
    "id" TEXT NOT NULL,
    "trendTopicId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trend_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keywords" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "searchVolumeEst" DOUBLE PRECISION,
    "competitionScore" DOUBLE PRECISION,
    "cpcEst" DOUBLE PRECISION,
    "relatedTerms" TEXT[],
    "source" TEXT NOT NULL,
    "refreshedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trendTopicId" TEXT,
    "title" TEXT NOT NULL,
    "hook" TEXT,
    "angle" TEXT,
    "format" "VideoFormat" NOT NULL,
    "estimatedLength" INTEGER,
    "opportunityScore" DOUBLE PRECISION NOT NULL,
    "status" "IdeaStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_keywords" (
    "ideaId" TEXT NOT NULL,
    "keywordId" TEXT NOT NULL,

    CONSTRAINT "idea_keywords_pkey" PRIMARY KEY ("ideaId","keywordId")
);

-- CreateTable
CREATE TABLE "content_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT,
    "ideaId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "format" "VideoFormat" NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "targetDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scripts" (
    "id" TEXT NOT NULL,
    "contentProjectId" TEXT NOT NULL,
    "fullText" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "aiModel" TEXT NOT NULL,
    "promptVersion" TEXT,
    "wordCount" INTEGER,
    "estimatedDuration" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "title_variants" (
    "id" TEXT NOT NULL,
    "contentProjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ctrScore" DOUBLE PRECISION,
    "aiModel" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "title_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_descriptions" (
    "id" TEXT NOT NULL,
    "contentProjectId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "chapters" JSONB,
    "aiModel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "contentProjectId" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "provider" TEXT NOT NULL,
    "aiModel" TEXT,
    "prompt" TEXT,
    "storageKey" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT,
    "durationMs" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "metadata" JSONB,
    "status" "AssetStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobId" TEXT,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentProjectId" TEXT,
    "bullmqJobId" TEXT,
    "type" "JobType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "payload" JSONB,
    "result" JSONB,
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_snapshots" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "youtubeVideoId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "views" BIGINT,
    "watchTimeMinutes" BIGINT,
    "subscribers" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "impressions" BIGINT,
    "ctr" DOUBLE PRECISION,
    "avgViewDuration" INTEGER,
    "revenue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "channels_youtubeId_key" ON "channels"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "channel_videos_youtubeVideoId_key" ON "channel_videos"("youtubeVideoId");

-- CreateIndex
CREATE INDEX "trend_topics_niche_trendScore_idx" ON "trend_topics"("niche", "trendScore");

-- CreateIndex
CREATE INDEX "trend_topics_capturedAt_idx" ON "trend_topics"("capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "keywords_term_key" ON "keywords"("term");

-- CreateIndex
CREATE INDEX "keywords_niche_searchVolumeEst_idx" ON "keywords"("niche", "searchVolumeEst");

-- CreateIndex
CREATE INDEX "ideas_userId_status_idx" ON "ideas"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "content_projects_ideaId_key" ON "content_projects"("ideaId");

-- CreateIndex
CREATE INDEX "content_projects_userId_status_idx" ON "content_projects"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "scripts_contentProjectId_key" ON "scripts"("contentProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "video_descriptions_contentProjectId_key" ON "video_descriptions"("contentProjectId");

-- CreateIndex
CREATE INDEX "assets_contentProjectId_type_idx" ON "assets"("contentProjectId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_bullmqJobId_key" ON "jobs"("bullmqJobId");

-- CreateIndex
CREATE INDEX "jobs_userId_status_idx" ON "jobs"("userId", "status");

-- CreateIndex
CREATE INDEX "jobs_type_status_idx" ON "jobs"("type", "status");

-- CreateIndex
CREATE INDEX "analytics_snapshots_channelId_date_idx" ON "analytics_snapshots"("channelId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_snapshots_channelId_youtubeVideoId_date_key" ON "analytics_snapshots"("channelId", "youtubeVideoId", "date");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_videos" ADD CONSTRAINT "channel_videos_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trend_keywords" ADD CONSTRAINT "trend_keywords_trendTopicId_fkey" FOREIGN KEY ("trendTopicId") REFERENCES "trend_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_trendTopicId_fkey" FOREIGN KEY ("trendTopicId") REFERENCES "trend_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_keywords" ADD CONSTRAINT "idea_keywords_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_keywords" ADD CONSTRAINT "idea_keywords_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "keywords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_projects" ADD CONSTRAINT "content_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_projects" ADD CONSTRAINT "content_projects_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_projects" ADD CONSTRAINT "content_projects_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_contentProjectId_fkey" FOREIGN KEY ("contentProjectId") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "title_variants" ADD CONSTRAINT "title_variants_contentProjectId_fkey" FOREIGN KEY ("contentProjectId") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_descriptions" ADD CONSTRAINT "video_descriptions_contentProjectId_fkey" FOREIGN KEY ("contentProjectId") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_contentProjectId_fkey" FOREIGN KEY ("contentProjectId") REFERENCES "content_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_contentProjectId_fkey" FOREIGN KEY ("contentProjectId") REFERENCES "content_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_snapshots" ADD CONSTRAINT "analytics_snapshots_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
