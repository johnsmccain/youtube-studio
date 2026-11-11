export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-brand-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-brand-muted sm:flex-row">
        <span className="font-medium text-brand-text">
          AI YouTube Content Studio
        </span>
        <span>© {year} John Danlami. Personal workspace.</span>
      </div>
    </footer>
  );
}
