/**
 * Dashboard stub — Phase 2 target.
 *
 * This page exists so the redirect from `/` (when authenticated) resolves
 * to a valid route instead of a 404. Full implementation in Phase 2.
 */
export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-bg text-brand-text">
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <p className="text-brand-muted">
        Channel integration coming in Phase 2.
      </p>
    </main>
  );
}
