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
  isWrongNoteMode: boolean;
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
  onGoHome: () => void;
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
  isWrongNoteMode,
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
  onGoHome,
  onToggleSound
}: QuizScreenProps) {
  const accuracy = calculateAccuracy(score, currentIndex + (isAnswered ? 1 : 0));
  const currentNumber = currentIndex + 1;
  const isCorrectAnswer = selectedAnswer === currentQuestion.correctAnswer;
  const streakMessage = isAnswered && isCorrectAnswer ? getStreakMessage(streakCount) : "";
  const timerRatio = isTimerMode ? Math.max((timeLeft / timePerQuestion) * 100, 0) : 0;
  const timerAccentClassName =
    timeLeft <= 3
      ? "bg-[var(--color-soft-peach)] text-[var(--color-text-primary)]"
      : "bg-[var(--color-soft-pink)] text-[var(--color-text-primary)]";

  return (
    <main className="page-shell page-shell-center">
      <section className="app-shell max-w-2xl">
        <div className="orb-pink left-[-62px] top-[-58px] h-36 w-36" aria-hidden="true" />
        <div className="orb-lavender bottom-[-72px] right-[-48px] h-44 w-44" aria-hidden="true" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="accent-badge bg-[var(--color-soft-lavender)] text-[var(--color-text-secondary)]">
              {isWrongNoteMode ? "오답노트 복습" : isRetryMode ? "오답 다시 풀기" : "일반 연습"}
            </p>
            <h1 className="mt-3 text-2xl font-extrabold text-[var(--color-text-primary)] sm:text-3xl">
              {currentNumber} / {totalQuestions} 문제
            </h1>
          </div>

          <div className="flex flex-col items-end gap-2">
            <SoundToggle soundEnabled={soundEnabled} onToggle={onToggleSound} />
            <button type="button" onClick={onGoHome} className="mini-button">
              홈으로 가기
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <ProgressBar current={currentNumber} total={totalQuestions} />
          <ScoreBoard correctCount={score} wrongCount={wrongCount} accuracy={accuracy} />
          {isTimerMode ? (
            <div className={`rounded-[28px] border border-white/70 px-5 py-4 shadow-[0_12px_28px_rgba(91,85,102,0.08)] ${timerAccentClassName}`}>
              <div className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>남은 시간</span>
                <span className="rounded-full bg-white/70 px-3 py-1 text-base">{timeLeft}초</span>
              </div>
              <div className="mt-3 h-4 rounded-full bg-white/75 shadow-[inset_0_2px_6px_rgba(91,85,102,0.08)]">
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ${
                    timeLeft <= 3
                      ? "bg-[linear-gradient(90deg,#ffc9a9,#ff8fb1)]"
                      : "bg-[linear-gradient(90deg,var(--color-brand-primary),var(--color-brand-secondary))]"
                  }`}
                  style={{ width: `${timerRatio}%` }}
                />
              </div>
            </div>
          ) : null}
          {streakCount > 0 ? (
            <div className="ribbon-glow rounded-[24px] bg-[linear-gradient(90deg,rgba(255,217,106,0.95),rgba(255,241,246,0.95))] px-5 py-4 text-sm font-bold text-[var(--color-text-primary)] shadow-[0_12px_28px_rgba(255,217,106,0.18)]">
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
            <div className="soft-card-lavender p-4">
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
                className="mt-3 min-h-[64px] w-full rounded-[24px] border border-[var(--color-border)] bg-white px-5 text-center text-3xl font-extrabold text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-brand-secondary)] focus:ring-2 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={onSubmitInputAnswer}
                disabled={isAnswered || inputAnswer.trim() === ""}
                className="primary-button mt-3 w-full"
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
                : "bg-[var(--color-soft-lavender)] text-[var(--color-text-secondary)]"
            }`}
          >
            {isAnswered ? feedbackMessage : "답을 하나 고르면 바로 알려줄게요!"}
          </div>
          {streakMessage ? (
            <div className="rounded-[24px] bg-[var(--color-success-soft)] px-5 py-4 text-base font-bold text-[var(--color-text-primary)] shadow-[0_12px_28px_rgba(126,214,167,0.16)]">
              {streakMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onNext}
            disabled={!isAnswered}
            aria-disabled={!isAnswered}
            className="primary-button w-full bg-gradient-to-r from-[var(--color-brand-secondary)] to-[var(--color-brand-secondary-strong)] shadow-[0_18px_40px_rgba(201,182,255,0.24)]"
          >
            {currentNumber === totalQuestions ? "결과 보기" : "다음 문제"}
          </button>
        </div>
      </section>
    </main>
  );
}
