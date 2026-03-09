"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HydrationShell } from "@/components/HydrationShell";
import { MascotBubble } from "@/components/MascotBubble";
import { useHydrated } from "@/lib/useHydrated";
import { loadWrongNotes } from "@/lib/wrongNotes";
import type { WrongNoteItem } from "@/types/quiz";

type FilterMode = "all" | "pending" | "resolved";

const DAN_FILTERS = [2, 3, 4, 5, 6, 7, 8, 9] as const;

function formatDate(value: string | null): string {
  if (value === null) {
    return "없음";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getStatusLabel(item: WrongNoteItem): string {
  if (item.isMastered) {
    return "해결 완료";
  }

  if (item.wrongCount >= 3) {
    return "자주 틀림";
  }

  return "복습 필요";
}

function buildReviewHref(items: WrongNoteItem[]): string {
  const ids = items.map((item) => item.id).join(",");

  return `/?wrongNoteIds=${ids}&autostart=1&source=wrong-note`;
}

export function WrongNoteView() {
  const isHydrated = useHydrated();
  const [wrongNotes] = useState(() => loadWrongNotes());
  const [selectedDan, setSelectedDan] = useState<number | "all">("all");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const filteredWrongNotes = useMemo(() => {
    return wrongNotes.filter((item) => {
      if (selectedDan !== "all" && item.dan !== selectedDan) {
        return false;
      }

      if (filterMode === "pending" && item.isMastered) {
        return false;
      }

      if (filterMode === "resolved" && !item.isMastered) {
        return false;
      }

      return true;
    });
  }, [filterMode, selectedDan, wrongNotes]);

  const pendingCount = wrongNotes.filter((item) => !item.isMastered).length;

  if (!isHydrated) {
    return (
      <HydrationShell
        title="오답노트"
        description="복습할 문제를 불러오는 중이에요. 모바일에서도 먼저 화면이 보이도록 준비 상태를 표시합니다."
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
                누적 오답 모음
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
                오답노트
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                틀린 문제를 모아두고, 다시 풀면서 해결 상태를 관리할 수 있어요.
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

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="soft-card-pink">
            <p className="section-kicker">요약</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">복습 노트 한눈에 보기</h2>
            <div className="mt-5 grid gap-3">
              <div className="stat-tile bg-[var(--color-error-soft)]">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">총 오답 문제</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{wrongNotes.length}</p>
              </div>
              <div className="stat-tile bg-[var(--color-soft-yellow)]">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">아직 해결 전</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{pendingCount}</p>
              </div>
              {filteredWrongNotes.length > 0 ? (
                <Link
                  href={buildReviewHref(filteredWrongNotes)}
                  className="primary-button"
                >
                  현재 필터로 복습 시작
                </Link>
              ) : null}
            </div>
          </div>

          <div className="soft-card-lavender">
            <p className="section-kicker">필터</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">원하는 문제만 골라보기</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">단 선택</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDan("all")}
                    className={`choice-chip rounded-[20px] px-4 py-3 text-center text-sm font-bold ${
                      selectedDan === "all"
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)] ring-2 ring-pink-100"
                        : "border-transparent bg-white/70 text-[var(--color-text-secondary)]"
                    }`}
                  >
                    전체
                  </button>
                  {DAN_FILTERS.map((dan) => (
                    <button
                      key={dan}
                      type="button"
                      onClick={() => setSelectedDan(dan)}
                      className={`choice-chip rounded-[20px] px-4 py-3 text-center text-sm font-bold ${
                        selectedDan === dan
                          ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)] ring-2 ring-pink-100"
                          : "border-transparent bg-white/70 text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {dan}단
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">상태</p>
                <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                  {[
                    { value: "all", label: "전체" },
                    { value: "pending", label: "해결 전" },
                    { value: "resolved", label: "해결 완료" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilterMode(option.value as FilterMode)}
                      className={`choice-chip rounded-[20px] px-4 py-3 text-center text-sm font-bold ${
                        filterMode === option.value
                          ? "border-[var(--color-brand-secondary)] bg-[var(--color-soft-lavender)] text-[var(--color-text-primary)] ring-2 ring-violet-100"
                          : "border-transparent bg-white/70 text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-kicker">오답 목록</p>
              <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">문제별 해결 상태</h2>
              <p className="mt-2 text-base text-[var(--color-text-secondary)]">
                문제별로 마지막 오답과 해결 상태를 확인할 수 있어요.
              </p>
            </div>

            {wrongNotes.length > 0 ? (
              <Link href={buildReviewHref(wrongNotes)} className="mini-button">
                전체 복습
              </Link>
            ) : null}
          </div>

          <div className="grid gap-4">
            {filteredWrongNotes.length > 0 ? (
              filteredWrongNotes.map((item) => (
                <article
                  key={item.id}
                  className={`soft-card ${item.isMastered ? "opacity-75" : ""}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">
                          {item.multiplicand} × {item.multiplier} = {item.correctAnswer}
                        </p>
                        <span className="accent-badge bg-[var(--color-soft-yellow)] px-3 py-1 text-xs font-bold text-[var(--color-text-primary)]">
                          {item.dan}단
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-[var(--color-text-secondary)]">
                        마지막 오답: {item.lastUserAnswer ?? "시간 초과"} · 오답 {item.wrongCount}회 · 해결 {item.resolvedCount}회
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
                        최근 오답 {formatDate(item.lastWrongAt)} · 최근 해결 {formatDate(item.lastResolvedAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <span
                        className={`accent-badge px-3 py-1 text-xs font-bold ${
                          item.isMastered
                            ? "bg-[var(--color-success-soft)] text-[var(--color-text-primary)]"
                            : "bg-[var(--color-error-soft)] text-[var(--color-text-primary)]"
                        }`}
                      >
                        {getStatusLabel(item)}
                      </span>
                      <Link
                        href={buildReviewHref([item])}
                        className="mini-button border-transparent bg-gradient-to-r from-[var(--color-brand-secondary)] to-[var(--color-brand-secondary-strong)] text-white"
                      >
                        이 문제 다시 풀기
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="soft-card-pink text-center">
                <div className="flex justify-center">
                  <MascotBubble
                    message={wrongNotes.length === 0 ? "오답노트가 비어 있어!" : "다른 조건으로 다시 찾아볼까?"}
                    tone="pink"
                    align="left"
                  />
                </div>
                <p className="mt-3 text-lg font-bold text-[var(--color-text-primary)]">
                  {wrongNotes.length === 0 ? "오답노트가 비어 있어요!" : "조건에 맞는 오답이 없어요."}
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {wrongNotes.length === 0
                    ? "정말 잘하고 있어요. 새로운 퀴즈를 시작해볼까요?"
                    : "다른 필터를 선택하거나 새로 연습해보세요."}
                </p>
                <Link href="/" className="primary-button mt-5">
                  새로운 퀴즈 시작하기
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

