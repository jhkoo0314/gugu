import type { Badge } from "@/types/quiz";

type BadgeCardProps = {
  badge: Badge;
};

function formatUnlockedAt(value: string | null): string {
  if (value === null) {
    return "아직 잠겨 있어요";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).format(date);
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <article
      className={`rounded-[28px] border p-5 shadow-[0_18px_50px_rgba(255,143,177,0.12)] ${
        badge.isUnlocked
          ? "border-white/70 bg-white/90"
          : "border-[var(--color-border)] bg-white/60 opacity-80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">{badge.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {badge.description}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            badge.isUnlocked
              ? "bg-[var(--color-soft-yellow)] text-[var(--color-text-primary)]"
              : "bg-[var(--color-disabled)] text-[var(--color-text-secondary)]"
          }`}
        >
          {badge.isUnlocked ? "획득" : "잠김"}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-[var(--color-text-secondary)]">
        {formatUnlockedAt(badge.unlockedAt)}
      </p>
    </article>
  );
}
