// Load and validate env vars before anything else
import "./lib/env";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./lib/env";
import { logger } from "./lib/logger";
import { errorHandler } from "./lib/errors";

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: "RATE_LIMITED", message: "Too many requests" } },
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: env.NODE_ENV });
});

// ── Module routers — registered as each phase is implemented ──────────────────
// Phase 2: import { channelRouter } from "./modules/intelligence/channel";
//           app.use("/api/v1/channels", channelRouter);
// Phase 3: app.use("/api/v1/trends", trendRouter);
// Phase 4: app.use("/api/v1/keywords", keywordRouter);
// Phase 5: app.use("/api/v1/ideas", ideaRouter);
// Phase 6: app.use("/api/v1/content", contentRouter);
// Phase 7+: app.use("/api/v1/production", productionRouter);

// ── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(env.PORT, () => {
  logger.info(`API server started`, { port: env.PORT, env: env.NODE_ENV });
});

export default app;
