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
        <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-[var(--color-text-secondary)]">
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
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(201,182,255,0.22)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-[var(--color-soft-yellow)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]">
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
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-base font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-soft-lavender)]"
            >
              퀴즈로 돌아가기
            </Link>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(255,143,177,0.16)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">눌러서 연습해봐요</h2>
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
                      className={`min-h-[60px] rounded-[22px] border px-4 py-3 text-base font-bold transition-transform duration-200 ${
                        isSelected
                          ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)] shadow-[0_14px_32px_rgba(255,143,177,0.22)]"
                          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:-translate-y-0.5 hover:bg-[var(--color-soft-lavender)]"
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
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
                {MULTIPLIER_RANGE.map((multiplier) => {
                  const isSelected = practiceState.multiplier === multiplier;

                  return (
                    <button
                      key={multiplier}
                      type="button"
                      onClick={() => handleSelectMultiplier(multiplier)}
                      className={`min-h-[60px] rounded-[22px] border px-4 py-3 text-base font-bold transition-transform duration-200 ${
                        isSelected
                          ? "border-[var(--color-brand-secondary)] bg-[var(--color-soft-lavender)] text-[var(--color-text-primary)] shadow-[0_14px_32px_rgba(201,182,255,0.22)]"
                          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:-translate-y-0.5 hover:bg-[var(--color-soft-pink)]"
                      }`}
                    >
                      × {multiplier}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,241,246,0.95),rgba(255,255,255,0.95))] p-5 text-center shadow-[0_18px_50px_rgba(201,182,255,0.18)] sm:p-6">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">지금 연습할 문제</p>
              <p className="mt-4 text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-6xl">
                {practiceState.dan} × {practiceState.multiplier}
              </p>
              <p className="mt-2 text-3xl font-bold text-[var(--color-brand-secondary)]">= ?</p>

              <button
                type="button"
                onClick={() => setIsAnswerVisible((prevState) => !prevState)}
                className="mt-6 min-h-[56px] rounded-full bg-[var(--color-brand-primary)] px-6 py-3 text-lg font-bold text-white shadow-[0_18px_40px_rgba(255,143,177,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
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
            <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">전체 구구단 보기</h2>
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
