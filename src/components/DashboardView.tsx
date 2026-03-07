"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DanStatsCard } from "@/components/DanStatsCard";
import { RecommendedDanCard } from "@/components/RecommendedDanCard";
import { getDanStats } from "@/lib/getDanStats";
import { getRecommendedDans } from "@/lib/getRecommendedDans";
import { loadStudyRecords } from "@/lib/studyRecords";
import { loadWrongNotes } from "@/lib/wrongNotes";

export function DashboardView() {
  const [studyRecords] = useState(() => loadStudyRecords());
  const [wrongNotes] = useState(() => loadWrongNotes());

  const danStats = useMemo(() => getDanStats(studyRecords, wrongNotes), [studyRecords, wrongNotes]);
  const recommendedDans = useMemo(
    () => getRecommendedDans(danStats, wrongNotes),
    [danStats, wrongNotes]
  );
  const unresolvedWrongCount = wrongNotes.filter((wrongNote) => !wrongNote.isMastered).length;

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(255,143,177,0.16)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-[var(--color-soft-pink)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]">
                기록으로 보는 구구단
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
                학습 대시보드
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                단별 성취도와 오늘 다시 보면 좋은 단을 한눈에 확인할 수 있어요.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-base font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-soft-lavender)]"
            >
              퀴즈로 돌아가기
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(201,182,255,0.18)] backdrop-blur sm:p-6">
            <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">오늘의 추천</h2>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              지금 다시 풀면 좋은 단을 골라봤어요.
            </p>

            <div className="mt-5 grid gap-4">
              {recommendedDans.map((recommendation) => (
                <RecommendedDanCard key={`${recommendation.reason}-${recommendation.dan}`} recommendation={recommendation} />
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(255,143,177,0.16)] backdrop-blur sm:p-6">
            <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">요약</h2>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[24px] bg-[var(--color-soft-yellow)] p-4">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">누적 세션</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{studyRecords.length}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--color-error-soft)] p-4">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">남아 있는 오답노트</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">
                  {unresolvedWrongCount}
                </p>
              </div>
              <p className="rounded-[24px] bg-white/90 p-4 text-sm font-medium text-[var(--color-text-secondary)]">
                오답노트 상세 페이지는 다음 단계에서 추가됩니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">단별 성취도</h2>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              2단부터 9단까지 얼마나 풀었고, 얼마나 정확했는지 확인해보세요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {danStats.map((stats) => (
              <DanStatsCard key={stats.dan} stats={stats} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
