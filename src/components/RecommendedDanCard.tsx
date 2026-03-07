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
    <article className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(255,143,177,0.14)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)]">{recommendation.dan}단 추천</h3>
        <span className="rounded-full bg-[var(--color-soft-yellow)] px-3 py-1 text-xs font-bold text-[var(--color-text-primary)]">
          {getReasonLabel(recommendation.reason)}
        </span>
      </div>

      <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">{recommendation.label}</p>

      <Link
        href={`/?dan=${recommendation.dan}&autostart=1`}
        className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-5 py-3 text-base font-bold text-white shadow-[0_18px_40px_rgba(255,143,177,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
      >
        {recommendation.dan}단 바로 시작
      </Link>
    </article>
  );
}
