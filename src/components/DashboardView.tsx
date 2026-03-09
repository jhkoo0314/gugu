"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DanStatsCard } from "@/components/DanStatsCard";
import { HydrationShell } from "@/components/HydrationShell";
import { MascotBubble } from "@/components/MascotBubble";
import { RecommendedDanCard } from "@/components/RecommendedDanCard";
import { getDanStats } from "@/lib/getDanStats";
import { getRecommendedDans } from "@/lib/getRecommendedDans";
import { loadStudyRecords } from "@/lib/studyRecords";
import { useHydrated } from "@/lib/useHydrated";
import { loadWrongNotes } from "@/lib/wrongNotes";

export function DashboardView() {
  const isHydrated = useHydrated();
  const [studyRecords] = useState(() => loadStudyRecords());
  const [wrongNotes] = useState(() => loadWrongNotes());

  const danStats = useMemo(() => getDanStats(studyRecords, wrongNotes), [studyRecords, wrongNotes]);
  const recommendedDans = useMemo(
    () => getRecommendedDans(danStats, wrongNotes),
    [danStats, wrongNotes]
  );
  const unresolvedWrongCount = wrongNotes.filter((wrongNote) => !wrongNote.isMastered).length;

  if (!isHydrated) {
    return (
      <HydrationShell
        title="학습 대시보드"
        description="기록을 불러오고 있어요. 모바일에서는 첫 화면이 빈 것처럼 보이지 않도록 바로 안내 화면을 보여드릴게요."
      />
    );
  }

  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="app-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="accent-badge bg-[var(--color-soft-pink)] text-[var(--color-text-secondary)]">
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
              className="secondary-button"
            >
              퀴즈로 돌아가기
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="soft-card-lavender">
            <p className="section-kicker">오늘의 추천</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">지금 다시 풀면 좋은 단</h2>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              지금 다시 풀면 좋은 단을 골라봤어요.
            </p>

            <div className="mt-5 grid gap-4">
              {recommendedDans.length > 0 ? (
                recommendedDans.map((recommendation) => (
                  <RecommendedDanCard
                    key={`${recommendation.reason}-${recommendation.dan}`}
                    recommendation={recommendation}
                  />
                ))
              ) : (
                <div className="rounded-[24px] bg-white/82 px-5 py-8 text-center">
                  <p className="text-lg font-extrabold text-[var(--color-text-primary)]">추천할 단이 아직 없어요</p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    몇 번 연습을 시작하면 여기에 맞춤 추천이 나타나요.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="soft-card-pink">
            <p className="section-kicker">요약</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">오늘의 스터디룸 메모</h2>
            <div className="mt-5 grid gap-3">
              <div className="stat-tile bg-[var(--color-soft-yellow)]">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">누적 세션</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{studyRecords.length}</p>
              </div>
              <div className="stat-tile bg-[var(--color-error-soft)]">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">남아 있는 오답노트</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">
                  {unresolvedWrongCount}
                </p>
              </div>
              <Link href="/wrong-note" className="secondary-button w-full hover:bg-[var(--color-soft-lavender)]">
                오답노트 보러 가기
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="section-kicker">단별 성취도</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">스티커북처럼 보는 실력 변화</h2>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              2단부터 9단까지 얼마나 풀었고, 얼마나 정확했는지 확인해보세요.
            </p>
          </div>

          {danStats.some((stats) => stats.totalSolved > 0) ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {danStats.map((stats) => (
                <DanStatsCard key={stats.dan} stats={stats} />
              ))}
            </div>
          ) : (
            <div className="soft-card-pink text-center">
              <div className="flex justify-center">
                <MascotBubble message="첫 기록을 만들어볼까?" tone="pink" align="left" />
              </div>
              <p className="text-lg font-extrabold text-[var(--color-text-primary)]">첫 기록을 만들어볼까?</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                오늘의 연습을 시작하면 단별 성취도가 여기에 쌓여요.
              </p>
              <Link href="/" className="primary-button mt-5">
                퀴즈 시작하기
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

