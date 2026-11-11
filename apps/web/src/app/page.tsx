import { redirect } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { getAuthErrorMessage } from "@/lib/auth-errors";

/**
 * Landing page — root route `/`.
 *
 * Server Component. Responsibilities:
 * 1. Check session → redirect authenticated users to /dashboard. (stubbed
 *    until Phase 2 wires Better Auth server config)
 * 2. Read ?error= query param and map it to a human-readable message.
 * 3. Render the landing page with Hero, Features, Footer.
 */
export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ── Session check (stubbed — Phase 2 will replace this) ──────────────────────
  // When Better Auth server is configured, this becomes:
  //   const session = await auth.api.getSession({ headers: await headers() });
  //   if (session) redirect("/dashboard");
  const session = null; // placeholder
  if (session) redirect("/dashboard");

  // ── OAuth error handling ─────────────────────────────────────────────────────
  // The ?error= param is set by Better Auth on OAuth callback failure.
  // We resolve it server-side so it's available on first render.
  const resolvedParams = await searchParams;
  const rawError = resolvedParams["error"];
  const errorCode = Array.isArray(rawError) ? rawError[0] : rawError;

  // getAuthErrorMessage validates against a known allowlist — safe to render
  const authError = errorCode ? getAuthErrorMessage(errorCode) : undefined;

  // ── Sign-in URL ───────────────────────────────────────────────────────────────
  // Constructed server-side so NEXT_PUBLIC_API_URL is never required in layout.
  // The env var is public (browser-safe) but we build the URL here for clarity.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  const signInUrl = `${apiUrl}/api/auth/signin/google`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-bg">
      {/* Hero — full viewport, Three.js canvas background + GSAP entrance */}
      <Hero signInUrl={signInUrl} authError={authError} />

      {/* Features — scroll-triggered cards */}
      <Features />

      {/* Footer */}
      <Footer />
    </main>
  );
}
