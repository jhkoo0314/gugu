import Link from "next/link";
import { DanStatsCard } from "@/components/DanStatsCard";
import { RecommendedDanCard } from "@/components/RecommendedDanCard";
import type { AnswerMode, DanStats, DanOption, RecommendedDan } from "@/types/quiz";
import { SoundToggle } from "./SoundToggle";

type StartScreenProps = {
  selectedDan: DanOption | null;
  answerMode: AnswerMode;
  isTimerMode: boolean;
  timePerQuestion: number;
  soundEnabled: boolean;
  danStats: DanStats[];
  recommendedDans: RecommendedDan[];
  unresolvedWrongNoteCount: number;
  onSelectDan: (dan: DanOption) => void;
  onSelectAnswerMode: (mode: AnswerMode) => void;
  onToggleTimerMode: () => void;
  onSelectTimePerQuestion: (seconds: number) => void;
  onStart: () => void;
  onToggleSound: () => void;
};

const DAN_OPTIONS: DanOption[] = [2, 3, 4, 5, 6, 7, 8, 9, "all"];
const ANSWER_MODES: Array<{ value: AnswerMode; label: string; description: string }> = [
  { value: "multiple-choice", label: "객관식", description: "보기 4개 중에서 답 고르기" },
  { value: "input", label: "직접 입력", description: "숫자를 직접 입력해서 답 맞히기" }
];
const TIME_OPTIONS = [10, 15] as const;

function getDanLabel(dan: DanOption): string {
  return dan === "all" ? "전체 섞기" : `${dan}단`;
}

export function StartScreen({
  selectedDan,
  answerMode,
  isTimerMode,
  timePerQuestion,
  soundEnabled,
  danStats,
  recommendedDans,
  unresolvedWrongNoteCount,
  onSelectDan,
  onSelectAnswerMode,
  onToggleTimerMode,
  onSelectTimePerQuestion,
  onStart,
  onToggleSound
}: StartScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-5xl rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(255,143,177,0.2)] backdrop-blur sm:p-6">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="text-left sm:text-center">
              <p className="mb-3 inline-flex rounded-full bg-[var(--color-soft-pink)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]">
                두쫀모찌 구구단 시간
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                구구단 연습장
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-[var(--color-text-secondary)]">
                오늘은 몇 단을 연습해볼까?
              </p>
            </div>

            <SoundToggle soundEnabled={soundEnabled} onToggle={onToggleSound} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="연습할 단 선택">
          {DAN_OPTIONS.map((dan) => {
            const isSelected = selectedDan === dan;
            const isFullWidth = dan === "all";

            return (
              <button
                key={dan}
                type="button"
                onClick={() => onSelectDan(dan)}
                role="radio"
                aria-checked={isSelected}
                className={`min-h-[72px] rounded-[24px] border px-4 py-3 text-base font-semibold transition-transform duration-200 ${
                  isFullWidth ? "col-span-2 sm:col-span-1" : ""
                } ${
                  isSelected
                    ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)] shadow-[0_14px_32px_rgba(255,143,177,0.24)]"
                    : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:-translate-y-0.5 hover:border-[var(--color-brand-secondary)] hover:bg-[var(--color-soft-lavender)]"
                }`}
              >
                {getDanLabel(dan)}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[28px] bg-[var(--color-soft-lavender)]/70 p-4">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">풀이 방식</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {ANSWER_MODES.map((mode) => {
              const isSelected = answerMode === mode.value;

              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => onSelectAnswerMode(mode.value)}
                  className={`rounded-[24px] border px-4 py-4 text-left transition-transform duration-200 ${
                    isSelected
                      ? "border-[var(--color-brand-secondary)] bg-white text-[var(--color-text-primary)] shadow-sm"
                      : "border-transparent bg-white/60 text-[var(--color-text-secondary)] hover:-translate-y-0.5"
                  }`}
                >
                  <p className="text-base font-bold">{mode.label}</p>
                  <p className="mt-1 text-sm">{mode.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-[28px] border border-[var(--color-border)] bg-white/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-bold text-[var(--color-text-primary)]">타이머 모드</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                문제마다 제한 시간을 두고 풀어요.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleTimerMode}
              aria-pressed={isTimerMode}
              className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5 ${
                isTimerMode
                  ? "bg-[var(--color-brand-primary)] text-white"
                  : "bg-[var(--color-disabled)] text-[var(--color-text-secondary)]"
              }`}
            >
              {isTimerMode ? "켜짐" : "꺼짐"}
            </button>
          </div>

          {isTimerMode ? (
            <div className="mt-4">
              <p className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">문제당 제한 시간</p>
              <div className="grid grid-cols-2 gap-3">
                {TIME_OPTIONS.map((seconds) => {
                  const isSelected = timePerQuestion === seconds;

                  return (
                    <button
                      key={seconds}
                      type="button"
                      onClick={() => onSelectTimePerQuestion(seconds)}
                      className={`rounded-[22px] border px-4 py-3 text-base font-bold transition-transform duration-200 ${
                        isSelected
                          ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)]"
                          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:-translate-y-0.5"
                      }`}
                    >
                      {seconds}초
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-center text-sm font-medium text-[var(--color-text-secondary)]" aria-live="polite">
          {selectedDan === null
            ? "먼저 연습할 단을 골라주세요."
            : `${getDanLabel(selectedDan)} 연습을 시작할 준비가 됐어요.`}
        </p>

        <button
          type="button"
          onClick={onStart}
          disabled={selectedDan === null}
          className="mt-8 min-h-[56px] w-full rounded-full bg-[var(--color-brand-primary)] px-6 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(255,143,177,0.28)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] disabled:text-[var(--color-text-muted)] disabled:shadow-none"
        >
          시작하기
        </button>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Link
            href="/all-dan"
            className="flex min-h-[56px] w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-4 text-lg font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-soft-lavender)]"
          >
            전체 구구단 보러 가기
          </Link>
          <Link
            href="/wrong-note"
            className="flex min-h-[56px] w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-4 text-lg font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-soft-yellow)]"
          >
            오답노트 보기
          </Link>
          <Link
            href="/badges"
            className="flex min-h-[56px] w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-4 text-lg font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-soft-pink)]"
          >
            배지 보기
          </Link>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] bg-[var(--color-soft-lavender)]/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">오늘의 추천</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">
                  다시 보면 좋은 단
                </h2>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                전체 보기
              </Link>
            </div>

            <div className="mt-4 grid gap-4">
              {recommendedDans.slice(0, 2).map((recommendation) => (
                <RecommendedDanCard key={`${recommendation.reason}-${recommendation.dan}`} recommendation={recommendation} />
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-[var(--color-soft-pink)]/55 p-4">
            <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">학습 요약</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              많이 풀지 못한 단과 남아 있는 오답을 가볍게 확인해보세요.
            </p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-[22px] bg-white/90 p-4">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">남아 있는 오답노트</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">
                  {unresolvedWrongNoteCount}
                </p>
              </div>
              {danStats
                .filter((stats) => stats.totalSolved > 0)
                .sort((left, right) => left.accuracy - right.accuracy)
                .slice(0, 2)
                .map((stats) => (
                  <DanStatsCard key={stats.dan} stats={stats} />
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
