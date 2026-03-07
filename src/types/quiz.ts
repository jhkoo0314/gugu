export type Screen = "start" | "quiz" | "result";

export type DanOption = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "all";

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
  userAnswer: number;
};
