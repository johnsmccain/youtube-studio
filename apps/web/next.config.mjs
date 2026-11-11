// @ts-check

// Fail fast at build time if the API URL is not set.
// This prevents a silently broken deployment.
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not set. Add it to .env.local before starting the dev server.",
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Three.js is an ESM package — transpile it so Next.js can tree-shake it correctly.
  transpilePackages: ["three"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js requires unsafe-inline for scripts in dev.
              // TODO: replace with nonce-based CSP before production deployment.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              `connect-src 'self' ${apiUrl}`,
              // Google avatar images for future profile display
              "img-src 'self' data: blob: https://lh3.googleusercontent.com",
              // Three.js may use blob workers with OffscreenCanvas
              "worker-src blob:",
              // next/font/google self-hosts fonts — this covers the font file loading
              "font-src 'self' https://fonts.gstatic.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
