import Link from "next/link";
import { DanStatsCard } from "@/components/DanStatsCard";
import { RecommendedDanCard } from "@/components/RecommendedDanCard";
import { MascotBubble } from "@/components/MascotBubble";
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
      <section className="app-shell">
        <div className="orb-pink left-[-72px] top-[-54px] h-44 w-44" aria-hidden="true" />
        <div className="orb-lavender bottom-[-76px] right-[-52px] h-52 w-52" aria-hidden="true" />
        <div className="sparkle-dot left-[11%] top-[10%]" aria-hidden="true" />
        <div className="sparkle-dot right-[14%] top-[15%]" aria-hidden="true" />
        <div className="sparkle-dot bottom-[12%] left-[18%]" aria-hidden="true" />

        <div className="relative mb-8 grid gap-5 xl:grid-cols-[1.2fr_auto] xl:items-start">
          <div className="soft-card-pink relative overflow-hidden">
            <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-white/40 blur-2xl" aria-hidden="true" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl text-left">
                <p className="accent-badge bg-white/75 text-[var(--color-text-secondary)] shadow-[0_10px_24px_rgba(255,143,177,0.12)]">
                  딸기우유 별빛 스터디룸
                </p>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
                  두쫀모찌
                  <br />
                  구구단 연습장
                </h1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
                  오늘은 몇 단을 연습해볼까? 예쁜 카드와 말랑한 버튼으로 가볍게 시작해봐요.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-[var(--color-text-secondary)]">
                  <span className="accent-badge bg-white/75">폭신한 카드</span>
                  <span className="accent-badge bg-white/75">별빛 추천</span>
                  <span className="accent-badge bg-white/75">귀여운 배지</span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-end">
                <SoundToggle soundEnabled={soundEnabled} onToggle={onToggleSound} />
                <MascotBubble message="오늘도 같이 연습해볼까?" tone="pink" />
              </div>
            </div>
          </div>
        </div>

        <div className="soft-card">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">단 선택</p>
              <h2 className="section-title">캔디 카드에서 연습할 단 고르기</h2>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              가장 먼저 마음에 드는 단을 눌러주세요.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="연습할 단 선택">
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
                className={`choice-chip min-h-[76px] text-base font-semibold ${
                  isFullWidth ? "col-span-2 sm:col-span-1" : ""
                } ${
                  isSelected
                    ? "border-[var(--color-brand-primary)] bg-[linear-gradient(180deg,rgba(255,241,246,0.98),rgba(255,255,255,0.98))] text-[var(--color-text-primary)] shadow-[0_14px_32px_rgba(255,143,177,0.24)] ring-2 ring-pink-100"
                    : "border-[var(--color-border)] bg-white/92 text-[var(--color-text-secondary)] hover:border-[var(--color-brand-secondary)] hover:bg-[var(--color-soft-lavender)]"
                }`}
              >
                <span className="block text-lg font-extrabold">{getDanLabel(dan)}</span>
                <span className="mt-1 block text-sm font-medium text-[var(--color-text-muted)]">
                  {dan === "all" ? "여러 단을 섞어서 연습해요" : `${dan}단 감각을 익혀봐요`}
                </span>
              </button>
            );
          })}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="soft-card-lavender">
            <p className="section-kicker">풀이 방식</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">어떤 방식으로 풀까?</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {ANSWER_MODES.map((mode) => {
              const isSelected = answerMode === mode.value;

              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => onSelectAnswerMode(mode.value)}
                  className={`choice-chip ${
                    isSelected
                      ? "border-[var(--color-brand-secondary)] bg-white text-[var(--color-text-primary)] shadow-[0_12px_28px_rgba(201,182,255,0.16)] ring-2 ring-violet-100"
                      : "border-transparent bg-white/60 text-[var(--color-text-secondary)]"
                  }`}
                >
                  <p className="text-base font-bold">{mode.label}</p>
                  <p className="mt-1 text-sm">{mode.description}</p>
                </button>
              );
            })}
          </div>
          </div>

          <div className="soft-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker">타이머</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">조금 더 집중해서 풀기</h2>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  문제마다 제한 시간을 두고 리듬감 있게 연습해요.
                </p>
              </div>

              <button
                type="button"
                onClick={onToggleTimerMode}
                aria-pressed={isTimerMode}
                className={`mini-button min-w-[88px] ${
                  isTimerMode
                    ? "border-transparent bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-strong)] text-white"
                    : "bg-[var(--color-disabled)] text-[var(--color-text-secondary)] shadow-none"
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
                        className={`choice-chip rounded-[22px] text-center text-base font-bold ${
                          isSelected
                            ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)] ring-2 ring-pink-100"
                            : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {seconds}초
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[24px] bg-[var(--color-soft-peach)] px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)]">
                타이머를 켜면 말랑한 캡슐 타이머 UI가 함께 보여요.
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-sm font-medium text-[var(--color-text-secondary)]" aria-live="polite">
          {selectedDan === null
            ? "먼저 연습할 단을 골라주세요."
            : `${getDanLabel(selectedDan)} 연습을 시작할 준비가 됐어요.`}
        </p>

        <button
          type="button"
          onClick={onStart}
          disabled={selectedDan === null}
          className="primary-button mt-8 w-full"
        >
          반짝 연습 시작하기
        </button>

        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <Link
            href="/all-dan"
            className="secondary-button w-full hover:bg-[var(--color-soft-lavender)]"
          >
            전체 구구단 보러 가기
          </Link>
          <Link
            href="/wrong-note"
            className="secondary-button w-full hover:bg-[var(--color-soft-yellow)]"
          >
            오답노트 보기
          </Link>
          <Link
            href="/badges"
            className="secondary-button w-full hover:bg-[var(--color-soft-pink)]"
          >
            배지 보기
          </Link>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="soft-card-lavender">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-kicker">오늘의 추천</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">다시 보면 좋은 단</h2>
              </div>

              <Link href="/dashboard" className="mini-button">
                전체 보기
              </Link>
            </div>

            <div className="mt-4 grid gap-4">
              {recommendedDans.length > 0 ? (
                recommendedDans
                  .slice(0, 2)
                  .map((recommendation) => (
                    <RecommendedDanCard
                      key={`${recommendation.reason}-${recommendation.dan}`}
                      recommendation={recommendation}
                    />
                  ))
              ) : (
                <div className="rounded-[24px] bg-white/80 px-5 py-6 text-center">
                  <p className="text-lg font-extrabold text-[var(--color-text-primary)]">추천 단을 준비 중이에요</p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    첫 연습을 시작하면 맞춤 추천이 여기에 반짝 나타나요.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="soft-card-pink">
            <p className="section-kicker">학습 요약</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">남아 있는 복습 한눈에 보기</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              많이 풀지 못한 단과 남아 있는 오답을 가볍게 확인해보세요.
            </p>

            <div className="mt-4 grid gap-3">
              <div className="stat-tile bg-white/90">
                <p className="text-sm font-semibold text-[var(--color-text-secondary)]">남아 있는 오답노트</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">
                  {unresolvedWrongNoteCount}
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">복습할 문제가 차곡차곡 모여 있어요.</p>
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
