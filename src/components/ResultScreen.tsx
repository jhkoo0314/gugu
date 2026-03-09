import Link from "next/link";
import { MascotBubble } from "@/components/MascotBubble";
import { RecentBadgeBanner } from "@/components/RecentBadgeBanner";
import type { AnswerMode, Badge, DanOption, StudyRecord, WrongAnswer } from "@/types/quiz";

type ResultScreenProps = {
  score: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  accuracy: number;
  isRetryMode: boolean;
  isWrongNoteMode: boolean;
  answerMode: AnswerMode;
  bestStreak: number;
  isTimerMode: boolean;
  timeoutCount: number;
  newlyUnlockedBadges: Badge[];
  studyRecords: StudyRecord[];
  onRetryWrongAnswers: () => void;
  onGoHome: () => void;
};

function getResultMessage(score: number, totalQuestions: number, wrongCount: number): string {
  if (totalQuestions > 0 && score === totalQuestions) {
    return "두쫀모찌 모두 맞았어요! 정말 대단해요!";
  }

  if (wrongCount === 0) {
    return "끝까지 풀어서 정말 멋져요!";
  }

  if (score >= Math.ceil(totalQuestions / 2)) {
    return "두쫀모찌 오늘도 열심히 잘했어!";
  }

  return "다시 도전하면 더 잘할 수 있어요!";
}

function getDanLabel(selectedDan: DanOption): string {
  return selectedDan === "all" ? "전체 섞기" : `${selectedDan}단`;
}

function getAnswerModeLabel(answerMode: AnswerMode): string {
  return answerMode === "multiple-choice" ? "객관식" : "직접 입력";
}

function formatPlayedAt(playedAt: string): string {
  const date = new Date(playedAt);

  if (Number.isNaN(date.getTime())) {
    return playedAt;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function ResultScreen({
  score,
  totalQuestions,
  wrongAnswers,
  accuracy,
  isRetryMode,
  isWrongNoteMode,
  answerMode,
  bestStreak,
  isTimerMode,
  timeoutCount,
  newlyUnlockedBadges,
  studyRecords,
  onRetryWrongAnswers,
  onGoHome
}: ResultScreenProps) {
  const wrongCount = wrongAnswers.length;
  const resultMessage = getResultMessage(score, totalQuestions, wrongCount);

  return (
    <main className="page-shell page-shell-center">
      <section className="app-shell max-w-4xl">
        <div className="orb-pink left-[-64px] top-[-52px] h-40 w-40" aria-hidden="true" />
        <div className="orb-lavender bottom-[-72px] right-[-48px] h-48 w-48" aria-hidden="true" />
        <div className="sparkle-dot left-[9%] top-[12%]" aria-hidden="true" />
        <div className="sparkle-dot right-[17%] top-[18%]" aria-hidden="true" />

        <div className="relative text-center">
          <div className="accent-badge bg-[var(--color-soft-yellow)] text-[var(--color-text-secondary)]">
            <span>반짝 결과</span>
            <span>{isWrongNoteMode ? "오답노트 복습 완료" : isRetryMode ? "다시 풀기 완료" : "오늘의 결과"}</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            {resultMessage}
          </h1>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            총 {totalQuestions}문제 중 {score}문제를 맞혔어요.
          </p>
          <div className="mx-auto mt-5 flex w-full max-w-[320px] items-center gap-3 rounded-[28px] border border-white/70 bg-white/72 px-5 py-3 text-left shadow-[0_14px_32px_rgba(255,143,177,0.12)] sm:w-fit sm:max-w-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-soft-pink)] text-xl font-extrabold text-[var(--color-text-primary)]">
              {accuracy}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">오늘의 반짝 점수</p>
              <p className="text-base font-extrabold text-[var(--color-text-primary)]">정답률 {accuracy}%</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <MascotBubble
            message={wrongCount === 0 ? "정말 잘했어! 반짝 기록이 쌓였어." : "놓친 문제는 다시 보면 더 쉬워져."}
            tone={wrongCount === 0 ? "yellow" : "lavender"}
            align="left"
          />
        </div>

        <RecentBadgeBanner badges={newlyUnlockedBadges} />

        <div className="soft-card-pink mt-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="section-kicker">결과 요약</p>
              <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">가장 뿌듯한 순간을 모아봤어요</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="stat-tile bg-[var(--color-success-soft)] text-center">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">정답</p>
              <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{score}</p>
            </div>
            <div className="stat-tile bg-[var(--color-error-soft)] text-center">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">오답</p>
              <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{wrongCount}</p>
            </div>
            <div className="stat-tile col-span-2 bg-[var(--color-soft-lavender)] text-center sm:col-span-1">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">정답률</p>
              <p className="mt-2 text-4xl font-extrabold text-[var(--color-text-primary)]">{accuracy}%</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <div className="stat-tile bg-white/90">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">최고 연속 정답</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
                {bestStreak}문제
              </p>
            </div>
            <div className="stat-tile bg-white/90">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">학습 모드</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
                {getAnswerModeLabel(answerMode)}
              </p>
            </div>
            <div className="stat-tile bg-white/90">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">세션 방식</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
                {isTimerMode ? "타이머" : "일반"}
              </p>
            </div>
          </div>

          {isTimerMode ? (
            <div className="stat-tile mt-3 bg-[var(--color-soft-peach)] text-center">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">시간 초과</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
                {timeoutCount}번
              </p>
            </div>
          ) : null}
        </div>

        {wrongAnswers.length > 0 ? (
          <div className="soft-card-lavender mt-8">
            <p className="section-kicker">오답 요약</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">다시 보면 좋은 문제</h2>
            <div className="mt-4 space-y-3">
              {wrongAnswers.map((wrongAnswer) => (
                <div
                  key={wrongAnswer.questionId}
                  className="rounded-[24px] border border-[var(--color-border)] bg-white/88 px-4 py-4 shadow-[0_10px_24px_rgba(91,85,102,0.06)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-bold text-[var(--color-text-primary)]">
                      {wrongAnswer.multiplicand} × {wrongAnswer.multiplier} = {wrongAnswer.correctAnswer}
                    </p>
                    <span
                      className={`accent-badge px-3 py-1 text-xs ${
                        wrongAnswer.reason === "timeout"
                          ? "bg-[var(--color-soft-peach)] text-[var(--color-text-primary)]"
                          : "bg-[var(--color-error-soft)] text-[var(--color-text-primary)]"
                      }`}
                    >
                      {wrongAnswer.reason === "timeout" ? "시간 초과" : "다시 복습"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    {wrongAnswer.reason === "timeout"
                      ? "시간이 끝나서 놓친 문제예요."
                      : `내가 고른 답: ${wrongAnswer.userAnswer}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {studyRecords.length > 0 ? (
          <div className="soft-card mt-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="section-kicker">최근 기록</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">방금 전까지의 연습 흐름</h2>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {studyRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="rounded-[24px] border border-[var(--color-border)] bg-white/92 px-4 py-4 shadow-[0_10px_24px_rgba(91,85,102,0.06)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                      {formatPlayedAt(record.playedAt)}
                    </p>
                    <p className="accent-badge bg-[var(--color-soft-yellow)] px-3 py-1 text-xs font-bold text-[var(--color-text-primary)]">
                      {getDanLabel(record.selectedDan)}
                    </p>
                  </div>
                  <p className="mt-3 text-lg font-bold text-[var(--color-text-primary)]">
                    {record.correctCount} / {record.totalQuestions} 정답, 정답률 {record.accuracy}%
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    {getAnswerModeLabel(record.answerMode)} · {record.isTimerMode ? "타이머" : "일반"} · 최고
                    연속 {record.bestStreak}문제
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-3">
          {wrongAnswers.length > 0 ? (
            <button
              type="button"
              onClick={onRetryWrongAnswers}
              className="primary-button w-full"
            >
              오답 다시 풀기
            </button>
          ) : null}

          <Link
            href="/badges"
            className="secondary-button w-full hover:bg-[var(--color-soft-yellow)]"
          >
            배지 보러 가기
          </Link>

          <button
            type="button"
            onClick={onGoHome}
            className="secondary-button w-full hover:bg-[var(--color-soft-lavender)]"
          >
            처음으로 가기
          </button>
        </div>
      </section>
    </main>
  );
}
