export type Screen = "start" | "quiz" | "result";

export type DanOption = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "all";

export type AnswerMode = "multiple-choice" | "input";

export type Question = {
  id: string;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  choices: number[];
};

export type QuestionResult = {
  questionId: string;
  dan: number;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean;
  reason: "correct" | "wrong-answer" | "timeout";
  answeredAt: string;
};

export type WrongAnswer = {
  questionId: string;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  userAnswer: number | null;
  reason?: "wrong-answer" | "timeout";
};

export type StudyRecord = {
  id: string;
  playedAt: string;
  selectedDan: DanOption;
  answerMode: AnswerMode;
  isTimerMode: boolean;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  bestStreak: number;
  timeoutCount?: number;
  questionResults?: QuestionResult[];
};

export type DanStats = {
  dan: number;
  totalSolved: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  timeoutCount: number;
  bestStreak: number;
  lastPlayedAt: string | null;
  statusLabel: "시작 전" | "다시 연습 필요" | "연습 중" | "잘하고 있어요" | "거의 마스터";
};

export type RecommendedDan = {
  dan: number;
  reason: "low-accuracy" | "many-wrongs" | "many-timeouts" | "not-practiced-recently";
  label: string;
};

export type WrongNoteItem = {
  id: string;
  dan: number;
  multiplicand: number;
  multiplier: number;
  correctAnswer: number;
  lastUserAnswer: number | null;
  reason: "wrong-answer" | "timeout";
  wrongCount: number;
  resolvedCount: number;
  isMastered: boolean;
  lastWrongAt: string;
  lastResolvedAt: string | null;
};

export type BadgeId =
  | "first-start"
  | "first-session-complete"
  | "first-wrong-note-clear"
  | "dan-2-start"
  | "dan-master"
  | "all-dan-tried"
  | "perfect-score"
  | "five-streak"
  | "no-timeout-clear"
  | "three-day-streak"
  | "five-sessions"
  | "fifty-solved";

export type Badge = {
  id: BadgeId;
  title: string;
  description: string;
  unlockedAt: string | null;
  isUnlocked: boolean;
};
