import { calculateAccuracy } from "@/lib/calculateAccuracy";
import type { Question } from "@/types/quiz";
import { ChoiceButton } from "./ChoiceButton";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ScoreBoard } from "./ScoreBoard";

type QuizScreenProps = {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  wrongCount: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  feedbackMessage: string;
  isRetryMode: boolean;
  onAnswerSelect: (answer: number) => void;
  onNext: () => void;
};

export function QuizScreen({
  currentQuestion,
  currentIndex,
  totalQuestions,
  score,
  wrongCount,
  selectedAnswer,
  isAnswered,
  feedbackMessage,
  isRetryMode,
  onAnswerSelect,
  onNext
}: QuizScreenProps) {
  const accuracy = calculateAccuracy(score, currentIndex + (isAnswered ? 1 : 0));
  const currentNumber = currentIndex + 1;
  const isCorrectAnswer = selectedAnswer === currentQuestion.correctAnswer;

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
        </div>

        <div className="space-y-5">
          <ProgressBar current={currentNumber} total={totalQuestions} />
          <ScoreBoard correctCount={score} wrongCount={wrongCount} accuracy={accuracy} />
          <QuestionCard
            multiplicand={currentQuestion.multiplicand}
            multiplier={currentQuestion.multiplier}
          />

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
