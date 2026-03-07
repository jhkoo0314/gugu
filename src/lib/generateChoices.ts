import { shuffleArray } from "@/lib/shuffleArray";

const CHOICE_COUNT = 4;
const OFFSETS = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function generateChoices(correctAnswer: number): number[] {
  const choiceSet = new Set<number>([correctAnswer]);

  for (const offset of OFFSETS) {
    if (choiceSet.size >= CHOICE_COUNT) {
      break;
    }

    const candidate = correctAnswer + offset;

    if (candidate > 0) {
      choiceSet.add(candidate);
    }
  }

  let fallbackOffset = 11;

  while (choiceSet.size < CHOICE_COUNT) {
    choiceSet.add(correctAnswer + fallbackOffset);
    fallbackOffset += 1;
  }

  return shuffleArray(Array.from(choiceSet));
}
