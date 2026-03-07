"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCard } from "@/components/BadgeCard";
import { loadBadges } from "@/lib/badges";

export function BadgesView() {
  const [badges] = useState(() => loadBadges());
  const unlockedCount = badges.filter((badge) => badge.isUnlocked).length;

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(255,143,177,0.16)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-[var(--color-soft-yellow)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]">
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
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-base font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-soft-lavender)]"
            >
              퀴즈로 돌아가기
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[28px] bg-[var(--color-soft-pink)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">획득 배지</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-text-primary)]">{unlockedCount}</p>
          </div>
          <div className="rounded-[28px] bg-[var(--color-soft-lavender)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">전체 배지</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-text-primary)]">{badges.length}</p>
          </div>
          <div className="rounded-[28px] bg-[var(--color-soft-yellow)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">진행률</p>
            <p className="mt-2 text-4xl font-extrabold text-[var(--color-text-primary)]">
              {badges.length === 0 ? 0 : Math.round((unlockedCount / badges.length) * 100)}%
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">전체 배지 목록</h2>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              조건을 채우면 잠긴 배지가 열리고, 획득 날짜도 함께 남아요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
