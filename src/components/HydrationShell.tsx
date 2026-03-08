type HydrationShellProps = {
  title: string;
  description: string;
};

export function HydrationShell({ title, description }: HydrationShellProps) {
  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="app-shell">
          <div className="soft-card-pink">
            <p className="accent-badge bg-white/75 text-[var(--color-text-secondary)]">화면 준비 중</p>
            <h1 className="mt-4 text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
              {description}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="stat-tile h-24 animate-pulse bg-white/80" />
              <div className="stat-tile h-24 animate-pulse bg-white/70" />
              <div className="stat-tile h-24 animate-pulse bg-white/80" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
