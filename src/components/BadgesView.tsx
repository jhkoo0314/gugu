"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCard } from "@/components/BadgeCard";
import { MascotBubble } from "@/components/MascotBubble";
import { loadBadges } from "@/lib/badges";
import { useHydrated } from "@/lib/useHydrated";

export function BadgesView() {
  const isHydrated = useHydrated();
  const [badges] = useState(() => loadBadges());
  const unlockedCount = badges.filter((badge) => badge.isUnlocked).length;

  if (!isHydrated) {
    return null;
  }

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="app-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="accent-badge bg-[var(--color-soft-yellow)] text-[var(--color-text-secondary)]">
                작은 성취 모음
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
                배지 컬렉션
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                지금까지 모은 배지와 앞으로 열 수 있는 배지를 한 번에 볼 수 있어요.
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

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="stat-tile bg-[var(--color-soft-pink)]">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">획득 배지</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-text-primary)]">{unlockedCount}</p>
          </div>
          <div className="stat-tile bg-[var(--color-soft-lavender)]">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">전체 배지</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-text-primary)]">{badges.length}</p>
          </div>
          <div className="stat-tile bg-[var(--color-soft-yellow)]">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">진행률</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-text-primary)]">
              {badges.length === 0 ? 0 : Math.round((unlockedCount / badges.length) * 100)}%
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="section-kicker">전체 배지 목록</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">스티커북처럼 모아보기</h2>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              조건을 채우면 잠긴 배지가 열리고, 획득 날짜도 함께 남아요.
            </p>
          </div>

          {badges.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <div className="soft-card-pink text-center">
              <div className="flex justify-center">
                <MascotBubble message="첫 배지를 같이 모아보자!" tone="yellow" align="left" />
              </div>
              <p className="mt-3 text-lg font-bold text-[var(--color-text-primary)]">첫 배지를 모아볼까?</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                문제를 풀면 배지를 받을 수 있어요.
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
