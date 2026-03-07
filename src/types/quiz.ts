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
};
