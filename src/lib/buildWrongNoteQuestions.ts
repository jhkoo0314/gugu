import { createQuestionId } from "@/lib/createQuestionId";
import { generateChoices } from "@/lib/generateChoices";
import { shuffleArray } from "@/lib/shuffleArray";
import type { Question, WrongNoteItem } from "@/types/quiz";

export function buildWrongNoteQuestions(wrongNotes: WrongNoteItem[]): Question[] {
  const questions = wrongNotes.map((wrongNote) => ({
    id: createQuestionId(wrongNote.multiplicand, wrongNote.multiplier),
    multiplicand: wrongNote.multiplicand,
    multiplier: wrongNote.multiplier,
    correctAnswer: wrongNote.correctAnswer,
    choices: generateChoices(wrongNote.correctAnswer)
  }));

  return shuffleArray(questions);
}
