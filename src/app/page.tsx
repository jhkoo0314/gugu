"use client";

import { useState } from "react";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { StartScreen } from "@/components/StartScreen";
import { buildRetryQuestions } from "@/lib/buildRetryQuestions";
import { calculateAccuracy } from "@/lib/calculateAccuracy";
import { generateQuestions } from "@/lib/generateQuestions";
import { playCorrectSound, playWrongSound } from "@/lib/playQuizSound";
import type { DanOption, Question, Screen, WrongAnswer } from "@/types/quiz";

const QUIZ_LENGTH = 10;
const CORRECT_FEEDBACK_MESSAGES = ["정답이에요!", "잘했어요!", "멋져요!", "맞았어요!"];

function getRandomFeedbackMessage(messages: string[]): string {
  const randomIndex = Math.floor(Math.random() * messages.length);

  return messages[randomIndex];
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [selectedDan, setSelectedDan] = useState<DanOption | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isRetryMode, setIsRetryMode] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;
  const wrongCount = wrongAnswers.length;
  const accuracy = calculateAccuracy(score, totalQuestions);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  function resetCurrentQuestionState(): void {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedbackMessage("");
  }

  function handleSelectDan(dan: DanOption): void {
    setSelectedDan(dan);
  }

  function handleStartQuiz(): void {
    if (selectedDan === null) {
      return;
    }

    setQuestions(generateQuestions(selectedDan, QUIZ_LENGTH));
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers([]);
    resetCurrentQuestionState();
    setIsRetryMode(false);
    setScreen("quiz");
  }

  function handleAnswerSelect(answer: number): void {
    if (currentQuestion === null || isAnswered) {
      return;
    }

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setFeedbackMessage(getRandomFeedbackMessage(CORRECT_FEEDBACK_MESSAGES));
      playCorrectSound();
      return;
    }

    setWrongAnswers((prevWrongAnswers) => [
      ...prevWrongAnswers,
      {
        questionId: currentQuestion.id,
        multiplicand: currentQuestion.multiplicand,
        multiplier: currentQuestion.multiplier,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer: answer
      }
    ]);
    setFeedbackMessage(`괜찮아요, 다시 해봐요! 정답은 ${currentQuestion.correctAnswer}예요!`);
    playWrongSound();
  }

  function handleNextQuestion(): void {
    if (!isAnswered) {
      return;
    }

    if (isLastQuestion) {
      setScreen("result");
      return;
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
    resetCurrentQuestionState();
  }

  function handleRetryWrongAnswers(): void {
    if (wrongAnswers.length === 0) {
      return;
    }

    setQuestions(buildRetryQuestions(wrongAnswers));
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers([]);
    resetCurrentQuestionState();
    setIsRetryMode(true);
    setScreen("quiz");
  }

  function handleGoHome(): void {
    setScreen("start");
    setSelectedDan(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers([]);
    resetCurrentQuestionState();
    setIsRetryMode(false);
  }

  if (screen === "start") {
    return (
      <StartScreen selectedDan={selectedDan} onSelectDan={handleSelectDan} onStart={handleStartQuiz} />
    );
  }

  if (screen === "quiz" && currentQuestion !== null) {
    return (
      <QuizScreen
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        score={score}
        wrongCount={wrongCount}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        feedbackMessage={feedbackMessage}
        isRetryMode={isRetryMode}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNextQuestion}
      />
    );
  }

  return (
    <ResultScreen
      score={score}
      totalQuestions={totalQuestions}
      wrongAnswers={wrongAnswers}
      accuracy={accuracy}
      isRetryMode={isRetryMode}
      onRetryWrongAnswers={handleRetryWrongAnswers}
      onGoHome={handleGoHome}
    />
  );
}
