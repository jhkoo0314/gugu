"use client";

import Link from "next/link";
import { useState } from "react";

const DAN_RANGE = [2, 3, 4, 5, 6, 7, 8, 9] as const;
const MULTIPLIER_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type PracticeState = {
  dan: number;
  multiplier: number;
};

type TableCardProps = {
  dan: number;
  isExpanded: boolean;
  onExpand: (dan: number) => void;
};

function TableCard({ dan, isExpanded, onExpand }: TableCardProps) {
  return (
    <button
      type="button"
      onClick={() => onExpand(dan)}
      aria-expanded={isExpanded}
      className={`w-full rounded-[28px] border p-5 text-left shadow-[0_18px_50px_rgba(255,143,177,0.14)] transition-all duration-200 ${
        isExpanded
          ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] shadow-[0_24px_60px_rgba(255,143,177,0.22)]"
          : "border-white/70 bg-white/90 hover:-translate-y-0.5 hover:border-[var(--color-brand-secondary)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className={`${isExpanded ? "text-3xl" : "text-2xl"} font-extrabold text-[var(--color-text-primary)]`}>
          {dan}단
        </h2>
        <span className="accent-badge bg-white/80 px-3 py-1 text-sm font-semibold text-[var(--color-text-secondary)]">
          {isExpanded ? "크게 보는 중" : "눌러서 확대"}
        </span>
      </div>

      <ul className={`mt-4 ${isExpanded ? "space-y-3" : "space-y-2"}`}>
        {MULTIPLIER_RANGE.map((multiplier) => (
          <li
            key={`${dan}-${multiplier}`}
            className={`flex items-center justify-between rounded-[18px] px-4 py-3 font-semibold text-[var(--color-text-primary)] ${
              isExpanded
                ? "bg-white text-lg shadow-sm"
                : "bg-[var(--color-soft-pink)] text-base"
            }`}
          >
            <span>
              {dan} × {multiplier}
            </span>
            <span>{dan * multiplier}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

export function AllDanPractice() {
  const [practiceState, setPracticeState] = useState<PracticeState>({ dan: 2, multiplier: 1 });
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [expandedDan, setExpandedDan] = useState<number>(2);

  const currentAnswer = practiceState.dan * practiceState.multiplier;

  function handleSelectDan(dan: number): void {
    setPracticeState((prevState) => ({ ...prevState, dan }));
    setExpandedDan(dan);
    setIsAnswerVisible(false);
  }

  function handleSelectMultiplier(multiplier: number): void {
    setPracticeState((prevState) => ({ ...prevState, multiplier }));
    setIsAnswerVisible(false);
  }

  function handleExpandDan(dan: number): void {
    setExpandedDan(dan);
    setPracticeState((prevState) => ({ ...prevState, dan }));
    setIsAnswerVisible(false);
  }

  return (
    <main className="px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="app-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="accent-badge bg-[var(--color-soft-yellow)] text-[var(--color-text-secondary)]">
                2단부터 9단까지 한눈에 보기
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
                전체 구구단 연습 공간
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                아래에서 전체 구구단을 쭉 보고, 위쪽 연습판에서 하나씩 눌러 답을 떠올려볼 수 있어요.
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

        <section className="soft-card-pink">
          <div className="flex flex-col gap-5">
            <div>
              <p className="section-kicker">눌러서 연습해봐요</p>
              <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">한 문제씩 떠올려보기</h2>
              <p className="mt-2 text-base text-[var(--color-text-secondary)]">
                단과 숫자를 고른 뒤, 답을 생각해보고 확인 버튼을 눌러보세요.
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">단 선택</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {DAN_RANGE.map((dan) => {
                  const isSelected = practiceState.dan === dan;

                  return (
                    <button
                      key={dan}
                      type="button"
                      onClick={() => handleSelectDan(dan)}
                      className={`choice-chip min-h-[60px] rounded-[22px] text-center text-base font-bold ${
                        isSelected
                          ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)] shadow-[0_14px_32px_rgba(255,143,177,0.22)] ring-2 ring-pink-100"
                          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-soft-lavender)]"
                      }`}
                    >
                      {dan}단
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">곱하는 수 선택</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-9">
                {MULTIPLIER_RANGE.map((multiplier) => {
                  const isSelected = practiceState.multiplier === multiplier;

                  return (
                    <button
                      key={multiplier}
                      type="button"
                      onClick={() => handleSelectMultiplier(multiplier)}
                      className={`choice-chip min-h-[60px] rounded-[22px] text-center text-base font-bold ${
                        isSelected
                          ? "border-[var(--color-brand-secondary)] bg-[var(--color-soft-lavender)] text-[var(--color-text-primary)] shadow-[0_14px_32px_rgba(201,182,255,0.22)] ring-2 ring-violet-100"
                          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-soft-pink)]"
                      }`}
                    >
                      × {multiplier}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="soft-card text-center sm:p-6">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">지금 연습할 문제</p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-6xl">
                {practiceState.dan} × {practiceState.multiplier}
              </p>
              <p className="mt-2 inline-flex rounded-full bg-[var(--color-soft-lavender)] px-5 py-2 text-3xl font-bold text-[var(--color-brand-secondary)]">= ?</p>

              <button
                type="button"
                onClick={() => setIsAnswerVisible((prevState) => !prevState)}
                className="primary-button mt-6"
              >
                {isAnswerVisible ? "답 다시 가리기" : "정답 확인하기"}
              </button>

              <div
                aria-live="polite"
                className={`mt-4 rounded-[24px] px-5 py-4 text-lg font-semibold ${
                  isAnswerVisible
                    ? "bg-[var(--color-success-soft)] text-[var(--color-text-primary)]"
                    : "bg-[var(--color-soft-yellow)] text-[var(--color-text-secondary)]"
                }`}
              >
                {isAnswerVisible
                  ? `정답은 ${currentAnswer}이에요!`
                  : "먼저 답을 생각한 뒤 확인 버튼을 눌러보세요."}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="section-kicker">전체 구구단 보기</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">원하는 단을 크게 펼쳐보기</h2>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              아래 카드에서 원하는 단을 누르면 그 카드가 더 크게 펼쳐져요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {DAN_RANGE.map((dan) => (
              <div
                key={dan}
                className={
                  expandedDan === dan ? "md:col-span-2 xl:col-span-2" : "md:col-span-1 xl:col-span-1"
                }
              >
                <TableCard dan={dan} isExpanded={expandedDan === dan} onExpand={handleExpandDan} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
