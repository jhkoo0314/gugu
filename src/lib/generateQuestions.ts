import { createQuestionId } from "@/lib/createQuestionId";
import { generateChoices } from "@/lib/generateChoices";
import { getRandomInt } from "@/lib/getRandomInt";
import { shuffleArray } from "@/lib/shuffleArray";
import type { DanOption, Question } from "@/types/quiz";

const DEFAULT_MIN_DAN = 2;
const DEFAULT_MAX_DAN = 9;
const DEFAULT_MIN_MULTIPLIER = 1;
const DEFAULT_MAX_MULTIPLIER = 9;

function buildQuestion(multiplicand: number, multiplier: number): Question {
  const correctAnswer = multiplicand * multiplier;

  return {
    id: createQuestionId(multiplicand, multiplier),
    multiplicand,
    multiplier,
    correctAnswer,
    choices: generateChoices(correctAnswer)
  };
}

function getMultiplicand(dan: DanOption): number {
  if (dan === "all") {
    return getRandomInt(DEFAULT_MIN_DAN, DEFAULT_MAX_DAN);
  }

  return dan;
}

function getQuestionKey(multiplicand: number, multiplier: number): string {
  return `${multiplicand}x${multiplier}`;
}

export function generateQuestions(dan: DanOption, count: number): Question[] {
  const questionKeys = new Set<string>();
  const questions: Question[] = [];
  const maxUniqueQuestionCount =
    dan === "all" ? (DEFAULT_MAX_DAN - DEFAULT_MIN_DAN + 1) * DEFAULT_MAX_MULTIPLIER : DEFAULT_MAX_MULTIPLIER;

  while (questions.length < count) {
    const multiplicand = getMultiplicand(dan);
    const multiplier = getRandomInt(DEFAULT_MIN_MULTIPLIER, DEFAULT_MAX_MULTIPLIER);
    const questionKey = getQuestionKey(multiplicand, multiplier);

    if (questionKeys.has(questionKey) && questionKeys.size < maxUniqueQuestionCount) {
      continue;
    }

    questionKeys.add(questionKey);
    questions.push(buildQuestion(multiplicand, multiplier));
  }

  return shuffleArray(questions);
}
