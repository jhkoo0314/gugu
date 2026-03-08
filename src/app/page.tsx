"use client";

import { Suspense, useEffect, useEffectEvent, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { StartScreen } from "@/components/StartScreen";
import { evaluateSessionBadges, evaluateStartBadges, evaluateWrongNoteBadges, loadBadges, saveBadges } from "@/lib/badges";
import { buildRetryQuestions } from "@/lib/buildRetryQuestions";
import { buildWrongNoteQuestions } from "@/lib/buildWrongNoteQuestions";
import { calculateAccuracy } from "@/lib/calculateAccuracy";
import { getDanStats } from "@/lib/getDanStats";
import { getRecommendedDans } from "@/lib/getRecommendedDans";
import { generateQuestions } from "@/lib/generateQuestions";
import { loadWrongNotes, markWrongNoteResolved, saveWrongNoteItem } from "@/lib/wrongNotes";
import { playCorrectSound, playWrongSound } from "@/lib/playQuizSound";
import { loadStudyRecords, saveStudyRecord } from "@/lib/studyRecords";
import type {
  AnswerMode,
  Badge,
  DanStats,
  DanOption,
  Question,
  QuestionResult,
  RecommendedDan,
  Screen,
  StudyRecord,
  WrongNoteItem,
  WrongAnswer
} from "@/types/quiz";

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

function parseDanParam(value: string | null): DanOption | null {
  const parsedDan = Number(value);

  return [2, 3, 4, 5, 6, 7, 8, 9].includes(parsedDan) ? (parsedDan as DanOption) : null;
}

function parseWrongNoteIds(value: string | null): string[] {
  if (value === null || value.trim() === "") {
    return [];
  }

  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function HomeContent() {
  const searchParams = useSearchParams();
  const requestedDan = parseDanParam(searchParams.get("dan"));
  const requestedWrongNoteIds = parseWrongNoteIds(searchParams.get("wrongNoteIds"));
  const requestedSource = searchParams.get("source");
  const initialWrongNotes = loadWrongNotes();
  const initialWrongNoteQuestions =
    requestedWrongNoteIds.length > 0
      ? buildWrongNoteQuestions(
          initialWrongNotes.filter((wrongNote) => requestedWrongNoteIds.includes(wrongNote.id))
        )
      : [];
  const shouldAutoStart =
    searchParams.get("autostart") === "1" &&
    ((requestedDan !== null && requestedWrongNoteIds.length === 0) || initialWrongNoteQuestions.length > 0);
  const [screen, setScreen] = useState<Screen>(shouldAutoStart ? "quiz" : "start");
  const [selectedDan, setSelectedDan] = useState<DanOption | null>(
    requestedDan ?? (initialWrongNoteQuestions[0]?.multiplicand as DanOption | undefined) ?? null
  );
  const [answerMode, setAnswerMode] = useState<AnswerMode>("multiple-choice");
  const [inputAnswer, setInputAnswer] = useState("");
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState(DEFAULT_TIME_PER_QUESTION);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_PER_QUESTION);
  const [questions, setQuestions] = useState<Question[]>(
    shouldAutoStart
      ? requestedWrongNoteIds.length > 0
        ? initialWrongNoteQuestions
        : requestedDan !== null
          ? generateQuestions(requestedDan, QUIZ_LENGTH)
          : []
      : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [isWrongNoteMode, setIsWrongNoteMode] = useState(shouldAutoStart && requestedSource === "wrong-note");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streakCount, setStreakCount] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [badges, setBadges] = useState<Badge[]>(() => loadBadges());
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>(() => loadStudyRecords());
  const [wrongNotes, setWrongNotes] = useState<WrongNoteItem[]>(initialWrongNotes);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [sessionQuestionResults, setSessionQuestionResults] = useState<QuestionResult[]>([]);
  const timeLeftRef = useRef(timePerQuestion);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;
  const wrongCount = wrongAnswers.length;
  const accuracy = calculateAccuracy(score, totalQuestions);
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const timeoutCount = wrongAnswers.filter((wrongAnswer) => wrongAnswer.reason === "timeout").length;
  const danStats: DanStats[] = getDanStats(studyRecords, wrongNotes);
  const recommendedDans: RecommendedDan[] = getRecommendedDans(danStats, wrongNotes);
  const unresolvedWrongNoteCount = wrongNotes.filter((wrongNote) => !wrongNote.isMastered).length;

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

  function startQuizSession(dan: DanOption): void {
    const startedAt = new Date().toISOString();
    const startBadgeResult = evaluateStartBadges(badges, dan, startedAt);

    setBadges(saveBadges(startBadgeResult.badges));
    setNewlyUnlockedBadges(startBadgeResult.newlyUnlockedBadges);
    setSelectedDan(dan);
    setQuestions(generateQuestions(dan, QUIZ_LENGTH));
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers([]);
    resetCurrentQuestionState();
    setIsRetryMode(false);
    setIsWrongNoteMode(false);
    setStreakCount(0);
    setBestStreak(0);
    setTimeLeft(timePerQuestion);
    setSessionSaved(false);
    setSessionQuestionResults([]);
    setScreen("quiz");
  }

  function handleStartQuiz(): void {
    if (selectedDan === null) {
      return;
    }

    startQuizSession(selectedDan);
  }

  function saveCurrentStudyRecord(): void {
    if (sessionSaved || selectedDan === null || totalQuestions === 0) {
      return;
    }

    const playedAt = new Date().toISOString();
    const record: StudyRecord = {
      id: createStudyRecordId(),
      playedAt,
      selectedDan,
      answerMode,
      isTimerMode,
      totalQuestions,
      correctCount: score,
      wrongCount,
      accuracy,
      bestStreak,
      timeoutCount: isTimerMode ? timeoutCount : 0,
      questionResults: sessionQuestionResults
    };

    const nextStudyRecords = saveStudyRecord(record);
    const sessionBadgeResult = evaluateSessionBadges(badges, {
      accuracy,
      bestStreak,
      isTimerMode,
      timeoutCount,
      studyRecords: nextStudyRecords,
      wrongNotes,
      playedAt
    });

    setStudyRecords(nextStudyRecords);
    setBadges(saveBadges(sessionBadgeResult.badges));
    setNewlyUnlockedBadges((prevBadges) => [...prevBadges, ...sessionBadgeResult.newlyUnlockedBadges]);
    setSessionSaved(true);
  }

  function handleEvaluateAnswer(answer: number | null, reason: "correct" | "wrong-answer" | "timeout"): void {
    if (currentQuestion === null || isAnswered) {
      return;
    }

    const answeredAt = new Date().toISOString();
    const questionResult: QuestionResult = {
      questionId: currentQuestion.id,
      dan: currentQuestion.multiplicand,
      multiplicand: currentQuestion.multiplicand,
      multiplier: currentQuestion.multiplier,
      correctAnswer: currentQuestion.correctAnswer,
      userAnswer: answer,
      isCorrect: reason === "correct",
      reason,
      answeredAt
    };

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setSessionQuestionResults((prevQuestionResults) => [...prevQuestionResults, questionResult]);

    if (reason === "correct") {
      const nextStreak = streakCount + 1;
      const nextWrongNotes = markWrongNoteResolved(questionResult);
      const wrongNoteBadgeResult = evaluateWrongNoteBadges(badges, nextWrongNotes, answeredAt);

      setScore((prevScore) => prevScore + 1);
      setStreakCount(nextStreak);
      setBestStreak((prevBestStreak) => Math.max(prevBestStreak, nextStreak));
      setFeedbackMessage(getRandomFeedbackMessage(CORRECT_FEEDBACK_MESSAGES));
      setWrongNotes(nextWrongNotes);
      setBadges(saveBadges(wrongNoteBadgeResult.badges));
      if (wrongNoteBadgeResult.newlyUnlockedBadges.length > 0) {
        setNewlyUnlockedBadges((prevBadges) => [...prevBadges, ...wrongNoteBadgeResult.newlyUnlockedBadges]);
      }
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
    setWrongNotes(saveWrongNoteItem(questionResult));
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

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

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
      const nextTimeLeft = timeLeftRef.current - 1;

      if (nextTimeLeft <= 0) {
        timeLeftRef.current = 0;
        window.clearInterval(timerId);
        setTimeLeft(0);
        onTimeout();
        return;
      }

      timeLeftRef.current = nextTimeLeft;
      setTimeLeft(nextTimeLeft);
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
    setIsWrongNoteMode(false);
    setStreakCount(0);
    setBestStreak(0);
    setSessionSaved(false);
    setSessionQuestionResults([]);
    setNewlyUnlockedBadges([]);
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
    setIsWrongNoteMode(false);
    setStreakCount(0);
    setBestStreak(0);
    setSessionSaved(false);
    setSessionQuestionResults([]);
    setNewlyUnlockedBadges([]);
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
        danStats={danStats}
        recommendedDans={recommendedDans}
        unresolvedWrongNoteCount={unresolvedWrongNoteCount}
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
        isWrongNoteMode={isWrongNoteMode}
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
      isWrongNoteMode={isWrongNoteMode}
      answerMode={answerMode}
      bestStreak={bestStreak}
      isTimerMode={isTimerMode}
      timeoutCount={timeoutCount}
      newlyUnlockedBadges={newlyUnlockedBadges}
      studyRecords={studyRecords}
      onRetryWrongAnswers={handleRetryWrongAnswers}
      onGoHome={handleGoHome}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
