import { createQuestionId } from "@/lib/createQuestionId";
import { generateChoices } from "@/lib/generateChoices";
import { shuffleArray } from "@/lib/shuffleArray";
import type { Question, WrongAnswer } from "@/types/quiz";

export function buildRetryQuestions(wrongAnswers: WrongAnswer[]): Question[] {
  const questions = wrongAnswers.map((wrongAnswer) => ({
    id: createQuestionId(wrongAnswer.multiplicand, wrongAnswer.multiplier),
    multiplicand: wrongAnswer.multiplicand,
    multiplier: wrongAnswer.multiplier,
    correctAnswer: wrongAnswer.correctAnswer,
    choices: generateChoices(wrongAnswer.correctAnswer)
  }));

  return shuffleArray(questions);
}
