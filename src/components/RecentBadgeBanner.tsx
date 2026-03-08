import Link from "next/link";
import { MascotBubble } from "@/components/MascotBubble";
import type { Badge } from "@/types/quiz";

type RecentBadgeBannerProps = {
  badges: Badge[];
};

export function RecentBadgeBanner({ badges }: RecentBadgeBannerProps) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="soft-card mt-8 bg-[linear-gradient(135deg,rgba(255,243,204,0.95),rgba(255,255,255,0.96))] text-left">
      <p className="section-kicker">새 배지 획득</p>
      <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">오늘 얻은 반짝 보상</h2>
      <div className="mt-4">
        <MascotBubble message="새 배지를 얻었어!" tone="yellow" align="left" />
      </div>
      <div className="mt-3 grid gap-3">
        {badges.map((badge) => (
          <div key={badge.id} className="rounded-[22px] bg-white/90 px-4 py-4 shadow-[0_10px_24px_rgba(91,85,102,0.06)]">
            <p className="text-lg font-extrabold text-[var(--color-text-primary)]">{badge.title}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{badge.description}</p>
          </div>
        ))}
      </div>
      <Link
        href="/badges"
        className="mini-button mt-4"
      >
        전체 배지 보기
      </Link>
    </div>
  );
}
