import type { DanStats } from "@/types/quiz";

type DanStatsCardProps = {
  stats: DanStats;
};

function formatLastPlayedAt(lastPlayedAt: string | null): string {
  if (lastPlayedAt === null) {
    return "아직 학습 전";
  }

  const date = new Date(lastPlayedAt);

  if (Number.isNaN(date.getTime())) {
    return lastPlayedAt;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getStatusClassName(statusLabel: DanStats["statusLabel"]): string {
  switch (statusLabel) {
    case "거의 마스터":
      return "bg-[var(--color-success-soft)] text-[var(--color-text-primary)]";
    case "잘하고 있어요":
      return "bg-[var(--color-soft-yellow)] text-[var(--color-text-primary)]";
    case "연습 중":
      return "bg-[var(--color-soft-lavender)] text-[var(--color-text-primary)]";
    case "다시 연습 필요":
      return "bg-[var(--color-error-soft)] text-[var(--color-text-primary)]";
    default:
      return "bg-white text-[var(--color-text-secondary)]";
  }
}

export function DanStatsCard({ stats }: DanStatsCardProps) {
  return (
    <article className="soft-card relative overflow-hidden">
      <div className="absolute right-[-12px] top-[-18px] h-20 w-20 rounded-full bg-[rgba(201,182,255,0.12)] blur-2xl" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">{stats.dan}단</p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            최근 학습 {formatLastPlayedAt(stats.lastPlayedAt)}
          </p>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClassName(stats.statusLabel)}`}>
          {stats.statusLabel}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="stat-tile bg-[var(--color-soft-pink)]">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">정답률</p>
          <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{stats.accuracy}%</p>
        </div>
        <div className="stat-tile bg-[var(--color-soft-lavender)]">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">총 풀이</p>
          <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{stats.totalSolved}</p>
        </div>
        <div className="stat-tile bg-[var(--color-error-soft)]">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">오답</p>
          <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">{stats.wrongCount}</p>
        </div>
        <div className="stat-tile bg-[var(--color-success-soft)]">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">최고 streak</p>
          <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">{stats.bestStreak}</p>
        </div>
      </div>
    </article>
  );
}
