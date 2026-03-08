import Link from "next/link";
import type { RecommendedDan } from "@/types/quiz";

type RecommendedDanCardProps = {
  recommendation: RecommendedDan;
};

function getReasonLabel(reason: RecommendedDan["reason"]): string {
  switch (reason) {
    case "many-wrongs":
      return "오답 많음";
    case "many-timeouts":
      return "시간 초과";
    case "not-practiced-recently":
      return "오래 안 함";
    default:
      return "정답률 낮음";
  }
}

export function RecommendedDanCard({ recommendation }: RecommendedDanCardProps) {
  return (
    <article className="soft-card relative overflow-hidden">
      <div className="absolute bottom-[-14px] right-[-16px] h-24 w-24 rounded-full bg-[rgba(255,143,177,0.12)] blur-2xl" aria-hidden="true" />
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)]">{recommendation.dan}단 추천</h3>
        <span className="accent-badge bg-[var(--color-soft-yellow)] px-3 py-1 text-xs font-bold text-[var(--color-text-primary)]">
          {getReasonLabel(recommendation.reason)}
        </span>
      </div>

      <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">{recommendation.label}</p>

      <Link
        href={`/?dan=${recommendation.dan}&autostart=1`}
        className="primary-button mt-5 min-h-[48px] px-5 py-3 text-base"
      >
        {recommendation.dan}단 바로 시작
      </Link>
    </article>
  );
}
