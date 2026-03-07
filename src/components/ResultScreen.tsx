import type { AnswerMode, DanOption, StudyRecord, WrongAnswer } from "@/types/quiz";

type ResultScreenProps = {
  score: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  accuracy: number;
  isRetryMode: boolean;
  answerMode: AnswerMode;
  bestStreak: number;
  isTimerMode: boolean;
  timeoutCount: number;
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
  answerMode,
  bestStreak,
  isTimerMode,
  timeoutCount,
  studyRecords,
  onRetryWrongAnswers,
  onGoHome
}: ResultScreenProps) {
  const wrongCount = wrongAnswers.length;
  const resultMessage = getResultMessage(score, totalQuestions, wrongCount);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-xl rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(255,143,177,0.2)] backdrop-blur sm:p-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-soft-yellow)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]">
            <span>반짝 결과</span>
            <span>{isRetryMode ? "다시 풀기 완료" : "오늘의 결과"}</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
            {resultMessage}
          </h1>
          <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
            총 {totalQuestions}문제 중 {score}문제를 맞혔어요.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] bg-[linear-gradient(180deg,rgba(255,241,246,0.9),rgba(255,255,255,0.96))] p-5 shadow-[0_18px_50px_rgba(255,143,177,0.16)]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-[var(--color-success-soft)] p-4 text-center">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">정답</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">{score}</p>
            </div>
            <div className="rounded-[24px] bg-[var(--color-error-soft)] p-4 text-center">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">오답</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">{wrongCount}</p>
            </div>
            <div className="col-span-2 rounded-[24px] bg-[var(--color-soft-lavender)] p-4 text-center sm:col-span-1">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">정답률</p>
              <p className="mt-2 text-3xl font-extrabold text-[var(--color-text-primary)]">{accuracy}%</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/70 bg-white/90 p-4">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">최고 연속 정답</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
                {bestStreak}문제
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/90 p-4">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">학습 모드</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
                {getAnswerModeLabel(answerMode)}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/90 p-4">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">세션 방식</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
                {isTimerMode ? "타이머" : "일반"}
              </p>
            </div>
          </div>

          {isTimerMode ? (
            <div className="mt-3 rounded-[24px] border border-white/70 bg-white/90 p-4 text-center">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">시간 초과</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
                {timeoutCount}번
              </p>
            </div>
          ) : null}
        </div>

        {wrongAnswers.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">다시 보면 좋은 문제</h2>
            <div className="mt-4 space-y-3">
              {wrongAnswers.map((wrongAnswer) => (
                <div
                  key={wrongAnswer.questionId}
                  className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-error-soft)] px-4 py-4"
                >
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {wrongAnswer.multiplicand} × {wrongAnswer.multiplier} = {wrongAnswer.correctAnswer}
                  </p>
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
          <div className="mt-8">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">최근 학습 기록</h2>
            <div className="mt-4 space-y-3">
              {studyRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="rounded-[24px] border border-[var(--color-border)] bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                      {formatPlayedAt(record.playedAt)}
                    </p>
                    <p className="rounded-full bg-[var(--color-soft-yellow)] px-3 py-1 text-xs font-bold text-[var(--color-text-primary)]">
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
              className="min-h-[56px] w-full rounded-full bg-[var(--color-brand-primary)] px-6 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(255,143,177,0.28)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              오답 다시 풀기
            </button>
          ) : null}

          <button
            type="button"
            onClick={onGoHome}
            className="min-h-[56px] w-full rounded-full border border-[var(--color-border)] bg-white px-6 py-4 text-lg font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-soft-lavender)]"
          >
            처음으로 가기
          </button>
        </div>
      </section>
    </main>
  );
}
