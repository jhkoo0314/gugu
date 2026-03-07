import { calculateAccuracy } from "@/lib/calculateAccuracy";
import type { AnswerMode, Question } from "@/types/quiz";
import { ChoiceButton } from "./ChoiceButton";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ScoreBoard } from "./ScoreBoard";
import { SoundToggle } from "./SoundToggle";

type QuizScreenProps = {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  wrongCount: number;
  answerMode: AnswerMode;
  selectedAnswer: number | null;
  isAnswered: boolean;
  feedbackMessage: string;
  isRetryMode: boolean;
  inputAnswer: string;
  isTimerMode: boolean;
  timeLeft: number;
  timePerQuestion: number;
  soundEnabled: boolean;
  streakCount: number;
  onAnswerSelect: (answer: number) => void;
  onInputAnswerChange: (value: string) => void;
  onSubmitInputAnswer: () => void;
  onNext: () => void;
  onToggleSound: () => void;
};

function getStreakMessage(streakCount: number): string {
  if (streakCount >= 5) {
    return `${streakCount}연속 정답! 정말 대단해요!`;
  }

  if (streakCount >= 3) {
    return `${streakCount}연속 정답! 멋져요!`;
  }

  if (streakCount >= 2) {
    return `${streakCount}연속 정답! 좋아요!`;
  }

  return "";
}

export function QuizScreen({
  currentQuestion,
  currentIndex,
  totalQuestions,
  score,
  wrongCount,
  answerMode,
  selectedAnswer,
  isAnswered,
  feedbackMessage,
  isRetryMode,
  inputAnswer,
  isTimerMode,
  timeLeft,
  timePerQuestion,
  soundEnabled,
  streakCount,
  onAnswerSelect,
  onInputAnswerChange,
  onSubmitInputAnswer,
  onNext,
  onToggleSound
}: QuizScreenProps) {
  const accuracy = calculateAccuracy(score, currentIndex + (isAnswered ? 1 : 0));
  const currentNumber = currentIndex + 1;
  const isCorrectAnswer = selectedAnswer === currentQuestion.correctAnswer;
  const streakMessage = isAnswered && isCorrectAnswer ? getStreakMessage(streakCount) : "";
  const timerRatio = isTimerMode ? Math.max((timeLeft / timePerQuestion) * 100, 0) : 0;
  const timerAccentClassName =
    timeLeft <= 3 ? "bg-[var(--color-error-soft)] text-[var(--color-text-primary)]" : "bg-[var(--color-soft-pink)] text-[var(--color-text-primary)]";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-xl rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(201,182,255,0.22)] backdrop-blur sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full bg-[var(--color-soft-lavender)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]">
              {isRetryMode ? "오답 다시 풀기" : "일반 연습"}
            </p>
            <h1 className="mt-3 text-xl font-extrabold text-[var(--color-text-primary)] sm:text-2xl">
              {currentNumber} / {totalQuestions} 문제
            </h1>
          </div>

          <SoundToggle soundEnabled={soundEnabled} onToggle={onToggleSound} />
        </div>

        <div className="space-y-5">
          <ProgressBar current={currentNumber} total={totalQuestions} />
          <ScoreBoard correctCount={score} wrongCount={wrongCount} accuracy={accuracy} />
          {isTimerMode ? (
            <div className={`rounded-[24px] px-5 py-4 ${timerAccentClassName}`}>
              <div className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>남은 시간</span>
                <span>{timeLeft}초</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-white/70">
                <div
                  className="h-full rounded-full bg-[var(--color-brand-primary)] transition-[width] duration-1000"
                  style={{ width: `${timerRatio}%` }}
                />
              </div>
            </div>
          ) : null}
          {streakCount > 0 ? (
            <div className="rounded-[24px] bg-[var(--color-soft-yellow)] px-5 py-4 text-sm font-bold text-[var(--color-text-primary)]">
              지금 {streakCount}문제 연속으로 맞히고 있어요.
            </div>
          ) : null}
          <QuestionCard
            multiplicand={currentQuestion.multiplicand}
            multiplier={currentQuestion.multiplier}
          />

          {answerMode === "multiple-choice" ? (
            <div className="space-y-3">
              {currentQuestion.choices.map((choice) => {
                const isSelected = selectedAnswer === choice;
                const isCorrect = isAnswered && choice === currentQuestion.correctAnswer;
                const isWrong =
                  isAnswered && isSelected && choice !== currentQuestion.correctAnswer;

                return (
                  <ChoiceButton
                    key={choice}
                    value={choice}
                    disabled={isAnswered}
                    isSelected={isSelected}
                    isCorrect={isCorrect}
                    isWrong={isWrong}
                    onClick={() => onAnswerSelect(choice)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] bg-[var(--color-soft-lavender)]/70 p-4">
              <label
                htmlFor="input-answer"
                className="text-sm font-semibold text-[var(--color-text-secondary)]"
              >
                답을 직접 입력해보세요
              </label>
              <input
                id="input-answer"
                type="number"
                min="0"
                inputMode="numeric"
                value={inputAnswer}
                disabled={isAnswered}
                onChange={(event) => onInputAnswerChange(event.target.value)}
                className="mt-3 min-h-[64px] w-full rounded-[24px] border border-[var(--color-border)] bg-white px-5 text-center text-3xl font-extrabold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand-secondary)]"
              />
              <button
                type="button"
                onClick={onSubmitInputAnswer}
                disabled={isAnswered || inputAnswer.trim() === ""}
                className="mt-3 min-h-[56px] w-full rounded-full bg-[var(--color-brand-primary)] px-6 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(255,143,177,0.24)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] disabled:text-[var(--color-text-muted)] disabled:shadow-none"
              >
                확인하기
              </button>
            </div>
          )}

          <div
            aria-live="polite"
            className={`rounded-[24px] px-5 py-4 text-lg font-semibold ${
              isAnswered
                ? isCorrectAnswer
                  ? "bg-[var(--color-success-soft)] text-[var(--color-text-primary)]"
                  : "bg-[var(--color-error-soft)] text-[var(--color-text-primary)]"
                : "bg-[var(--color-soft-pink)] text-[var(--color-text-secondary)]"
            }`}
          >
            {isAnswered ? feedbackMessage : "답을 하나 고르면 바로 알려줄게요!"}
          </div>
          {streakMessage ? (
            <div className="rounded-[24px] bg-[var(--color-success-soft)] px-5 py-4 text-base font-bold text-[var(--color-text-primary)]">
              {streakMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onNext}
            disabled={!isAnswered}
            aria-disabled={!isAnswered}
            className="min-h-[56px] w-full rounded-full bg-[var(--color-brand-secondary)] px-6 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(201,182,255,0.24)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] disabled:text-[var(--color-text-muted)] disabled:shadow-none"
          >
            {currentNumber === totalQuestions ? "결과 보기" : "다음 문제"}
          </button>
        </div>
      </section>
    </main>
  );
}
