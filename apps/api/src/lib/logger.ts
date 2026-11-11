// Structured logger — wraps console with JSON output in production,
// human-readable in development. No external dependency required at this stage.

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV !== "production";

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  if (isDev) {
    const prefix = { debug: "🔍", info: "ℹ️ ", warn: "⚠️ ", error: "❌" }[level];
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console[level === "debug" ? "log" : level](`${prefix} ${message}${metaStr}`);
  } else {
    // JSON lines — structured for log aggregators
    process.stdout.write(JSON.stringify(entry) + "\n");
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
};
