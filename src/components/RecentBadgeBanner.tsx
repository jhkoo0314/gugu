import Link from "next/link";
import type { Badge } from "@/types/quiz";

type RecentBadgeBannerProps = {
  badges: Badge[];
};

export function RecentBadgeBanner({ badges }: RecentBadgeBannerProps) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,243,204,0.95),rgba(255,255,255,0.96))] p-5 text-left shadow-[0_18px_50px_rgba(255,143,177,0.12)]">
      <p className="text-sm font-semibold text-[var(--color-text-secondary)]">새 배지 획득</p>
      <div className="mt-3 grid gap-3">
        {badges.map((badge) => (
          <div key={badge.id} className="rounded-[22px] bg-white/90 px-4 py-4">
            <p className="text-lg font-extrabold text-[var(--color-text-primary)]">{badge.title}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{badge.description}</p>
          </div>
        ))}
      </div>
      <Link
        href="/badges"
        className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] transition-transform duration-200 hover:-translate-y-0.5"
      >
        전체 배지 보기
      </Link>
    </div>
  );
}
