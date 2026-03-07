import type { QuestionResult, WrongNoteItem } from "@/types/quiz";

const STORAGE_KEY = "gugu-wrong-note";

function isWrongNoteArray(value: unknown): value is WrongNoteItem[] {
  return Array.isArray(value);
}

export function createWrongNoteId(multiplicand: number, multiplier: number): string {
  return `${multiplicand}x${multiplier}`;
}

export function loadWrongNotes(): WrongNoteItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (storedValue === null) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    return isWrongNoteArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function saveWrongNotes(items: WrongNoteItem[]): WrongNoteItem[] {
  if (typeof window === "undefined") {
    return items;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items;
  } catch {
    return loadWrongNotes();
  }
}

export function saveWrongNoteItem(questionResult: QuestionResult): WrongNoteItem[] {
  if (questionResult.isCorrect || questionResult.reason === "correct") {
    return loadWrongNotes();
  }

  const wrongReason: WrongNoteItem["reason"] = questionResult.reason;
  const wrongNotes = loadWrongNotes();
  const itemId = createWrongNoteId(questionResult.multiplicand, questionResult.multiplier);
  const existingItem = wrongNotes.find((item) => item.id === itemId);

  if (existingItem === undefined) {
    return saveWrongNotes([
      {
        id: itemId,
        dan: questionResult.dan,
        multiplicand: questionResult.multiplicand,
        multiplier: questionResult.multiplier,
        correctAnswer: questionResult.correctAnswer,
        lastUserAnswer: questionResult.userAnswer,
        reason: wrongReason,
        wrongCount: 1,
        resolvedCount: 0,
        isMastered: false,
        lastWrongAt: questionResult.answeredAt,
        lastResolvedAt: null
      },
      ...wrongNotes
    ]);
  }

  const nextWrongNotes = wrongNotes.map((item) =>
    item.id === itemId
      ? {
          ...item,
          lastUserAnswer: questionResult.userAnswer,
          reason: wrongReason,
          wrongCount: item.wrongCount + 1,
          isMastered: false,
          lastWrongAt: questionResult.answeredAt
        }
      : item
  );

  return saveWrongNotes(nextWrongNotes);
}

export function markWrongNoteResolved(questionResult: QuestionResult): WrongNoteItem[] {
  if (!questionResult.isCorrect) {
    return loadWrongNotes();
  }

  const wrongNotes = loadWrongNotes();
  const itemId = createWrongNoteId(questionResult.multiplicand, questionResult.multiplier);
  const existingItem = wrongNotes.find((item) => item.id === itemId);

  if (existingItem === undefined) {
    return wrongNotes;
  }

  const nextWrongNotes = wrongNotes.map((item) =>
    item.id === itemId
      ? {
          ...item,
          resolvedCount: item.resolvedCount + 1,
          isMastered: true,
          lastResolvedAt: questionResult.answeredAt
        }
      : item
  );

  return saveWrongNotes(nextWrongNotes);
}

export function clearWrongNotes(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
