type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--color-text-secondary)]">
        <span>진행률</span>
        <span>{progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[var(--color-soft-lavender)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-brand-primary),var(--color-brand-secondary))] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
