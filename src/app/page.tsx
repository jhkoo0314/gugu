"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { StartScreen } from "@/components/StartScreen";
import { buildRetryQuestions } from "@/lib/buildRetryQuestions";
import { calculateAccuracy } from "@/lib/calculateAccuracy";
import { generateQuestions } from "@/lib/generateQuestions";
import { playCorrectSound, playWrongSound } from "@/lib/playQuizSound";
import { loadStudyRecords, saveStudyRecord } from "@/lib/studyRecords";
import type { AnswerMode, DanOption, Question, Screen, StudyRecord, WrongAnswer } from "@/types/quiz";

const QUIZ_LENGTH = 10;
const CORRECT_FEEDBACK_MESSAGES = ["정답이에요!", "잘했어요!", "멋져요!", "맞았어요!"];
const DEFAULT_TIME_PER_QUESTION = 10;

function getRandomFeedbackMessage(messages: string[]): string {
  const randomIndex = Math.floor(Math.random() * messages.length);

  return messages[randomIndex];
}

function createStudyRecordId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `record-${Date.now()}`;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [selectedDan, setSelectedDan] = useState<DanOption | null>(null);
  const [answerMode, setAnswerMode] = useState<AnswerMode>("multiple-choice");
  const [inputAnswer, setInputAnswer] = useState("");
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState(DEFAULT_TIME_PER_QUESTION);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_PER_QUESTION);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streakCount, setStreakCount] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(() => loadStudyRecords());
  const [sessionSaved, setSessionSaved] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;
  const wrongCount = wrongAnswers.length;
  const accuracy = calculateAccuracy(score, totalQuestions);
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const timeoutCount = wrongAnswers.filter((wrongAnswer) => wrongAnswer.reason === "timeout").length;

  function resetCurrentQuestionState(): void {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedbackMessage("");
    setInputAnswer("");
    setTimeLeft(timePerQuestion);
  }

  function handleSelectDan(dan: DanOption): void {
    setSelectedDan(dan);
  }

  function handleSelectAnswerMode(mode: AnswerMode): void {
    setAnswerMode(mode);
  }

  function handleToggleTimerMode(): void {
    setIsTimerMode((prevTimerMode) => !prevTimerMode);
  }

  function handleSelectTimePerQuestion(nextTimePerQuestion: number): void {
    setTimePerQuestion(nextTimePerQuestion);
    setTimeLeft(nextTimePerQuestion);
  }

  function handleInputAnswerChange(nextValue: string): void {
    if (nextValue === "") {
      setInputAnswer("");
      return;
    }

    if (!/^\d+$/.test(nextValue)) {
      return;
    }

    setInputAnswer(nextValue);
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
    setStreakCount(0);
    setBestStreak(0);
    setTimeLeft(timePerQuestion);
    setSessionSaved(false);
    setScreen("quiz");
  }

  function saveCurrentStudyRecord(): void {
    if (sessionSaved || selectedDan === null || totalQuestions === 0) {
      return;
    }

    const record: StudyRecord = {
      id: createStudyRecordId(),
      playedAt: new Date().toISOString(),
      selectedDan,
      answerMode,
      isTimerMode,
      totalQuestions,
      correctCount: score,
      wrongCount,
      accuracy,
      bestStreak,
      timeoutCount: isTimerMode ? timeoutCount : 0
    };

    setStudyRecords(saveStudyRecord(record));
    setSessionSaved(true);
  }

  function handleEvaluateAnswer(answer: number | null, reason: "correct" | "wrong-answer" | "timeout"): void {
    if (currentQuestion === null || isAnswered) {
      return;
    }

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (reason === "correct") {
      const nextStreak = streakCount + 1;

      setScore((prevScore) => prevScore + 1);
      setStreakCount(nextStreak);
      setBestStreak((prevBestStreak) => Math.max(prevBestStreak, nextStreak));
      setFeedbackMessage(getRandomFeedbackMessage(CORRECT_FEEDBACK_MESSAGES));
      if (soundEnabled) {
        playCorrectSound();
      }
      return;
    }

    setStreakCount(0);
    setWrongAnswers((prevWrongAnswers) => [
      ...prevWrongAnswers,
      {
        questionId: currentQuestion.id,
        multiplicand: currentQuestion.multiplicand,
        multiplier: currentQuestion.multiplier,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer: answer,
        reason
      }
    ]);
    if (reason === "timeout") {
      setFeedbackMessage(`시간이 끝났어요! 정답은 ${currentQuestion.correctAnswer}예요!`);
    } else {
      setFeedbackMessage(`괜찮아요, 다시 해봐요! 정답은 ${currentQuestion.correctAnswer}예요!`);
    }
    if (soundEnabled) {
      playWrongSound();
    }
  }

  const onTimeout = useEffectEvent(() => {
    handleEvaluateAnswer(null, "timeout");
  });

  function handleAnswerSelect(answer: number): void {
    if (currentQuestion === null || isAnswered) {
      return;
    }

    const answerReason = answer === currentQuestion.correctAnswer ? "correct" : "wrong-answer";

    handleEvaluateAnswer(answer, answerReason);
  }

  function handleSubmitInputAnswer(): void {
    if (currentQuestion === null || isAnswered || inputAnswer.trim() === "") {
      return;
    }

    const parsedAnswer = Number(inputAnswer);

    if (!Number.isFinite(parsedAnswer) || parsedAnswer < 0) {
      return;
    }

    const answerReason = parsedAnswer === currentQuestion.correctAnswer ? "correct" : "wrong-answer";

    handleEvaluateAnswer(parsedAnswer, answerReason);
  }

  useEffect(() => {
    if (screen !== "quiz" || !isTimerMode || isAnswered || currentQuestion === null) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          window.clearInterval(timerId);
          onTimeout();
          return 0;
        }

        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [currentIndex, currentQuestion, isAnswered, isTimerMode, screen]);

  function handleNextQuestion(): void {
    if (!isAnswered) {
      return;
    }

    if (isLastQuestion) {
      saveCurrentStudyRecord();
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
    setStreakCount(0);
    setBestStreak(0);
    setSessionSaved(false);
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
    setStreakCount(0);
    setBestStreak(0);
    setSessionSaved(false);
  }

  function handleToggleSound(): void {
    setSoundEnabled((prevSoundEnabled) => !prevSoundEnabled);
  }

  if (screen === "start") {
    return (
      <StartScreen
        selectedDan={selectedDan}
        answerMode={answerMode}
        isTimerMode={isTimerMode}
        timePerQuestion={timePerQuestion}
        soundEnabled={soundEnabled}
        onSelectDan={handleSelectDan}
        onSelectAnswerMode={handleSelectAnswerMode}
        onToggleTimerMode={handleToggleTimerMode}
        onSelectTimePerQuestion={handleSelectTimePerQuestion}
        onStart={handleStartQuiz}
        onToggleSound={handleToggleSound}
      />
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
        answerMode={answerMode}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
        feedbackMessage={feedbackMessage}
        isRetryMode={isRetryMode}
        inputAnswer={inputAnswer}
        isTimerMode={isTimerMode}
        timeLeft={timeLeft}
        timePerQuestion={timePerQuestion}
        soundEnabled={soundEnabled}
        streakCount={streakCount}
        onAnswerSelect={handleAnswerSelect}
        onInputAnswerChange={handleInputAnswerChange}
        onSubmitInputAnswer={handleSubmitInputAnswer}
        onNext={handleNextQuestion}
        onToggleSound={handleToggleSound}
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
      answerMode={answerMode}
      bestStreak={bestStreak}
      isTimerMode={isTimerMode}
      timeoutCount={timeoutCount}
      studyRecords={studyRecords}
      onRetryWrongAnswers={handleRetryWrongAnswers}
      onGoHome={handleGoHome}
    />
  );
}
