type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="soft-card-lavender p-4">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--color-text-secondary)]">
        <span>진행률</span>
        <span>{current} / {total}</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-white/80 shadow-[inset_0_2px_6px_rgba(91,85,102,0.08)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-brand-primary),var(--color-brand-secondary))] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-right text-xs font-semibold text-[var(--color-text-muted)]">{progress}% 완료</p>
    </div>
  );
}
