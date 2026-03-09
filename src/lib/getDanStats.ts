import type { DanStats, QuestionResult, StudyRecord, WrongNoteItem } from "@/types/quiz";

const DAN_RANGE = [2, 3, 4, 5, 6, 7, 8, 9] as const;

function getStatusLabel(totalSolved: number, accuracy: number): DanStats["statusLabel"] {
  if (totalSolved === 0) {
    return "시작 전";
  }

  if (accuracy < 60) {
    return "다시 연습 필요";
  }

  if (accuracy < 80) {
    return "연습 중";
  }

  if (accuracy >= 95 && totalSolved >= 10) {
    return "거의 마스터";
  }

  return "잘하고 있어요";
}

function getBestStreak(questionResults: QuestionResult[]): number {
  let currentStreak = 0;
  let bestStreak = 0;

  for (const questionResult of questionResults) {
    if (questionResult.isCorrect) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
      continue;
    }

    currentStreak = 0;
  }

  return bestStreak;
}

export function getDanStats(studyRecords: StudyRecord[], wrongNotes: WrongNoteItem[]): DanStats[] {
  return DAN_RANGE.map((dan) => {
    const questionResults = studyRecords.reduce<QuestionResult[]>((results, studyRecord) => {
      const matchingResults = (studyRecord.questionResults ?? []).filter(
        (questionResult) => questionResult.dan === dan
      );

      return [...results, ...matchingResults];
    }, []);
    const totalSolved = questionResults.length;
    const correctCount = questionResults.filter((questionResult) => questionResult.isCorrect).length;
    const wrongCount = totalSolved - correctCount;
    const timeoutCount = questionResults.filter((questionResult) => questionResult.reason === "timeout").length;
    const accuracy = totalSolved === 0 ? 0 : Math.round((correctCount / totalSolved) * 100);
    const bestStreak = getBestStreak(questionResults);
    const lastPlayedAt =
      questionResults.length > 0
        ? questionResults.reduce((latest, questionResult) =>
            latest === null || questionResult.answeredAt > latest ? questionResult.answeredAt : latest
          , null as string | null)
        : null;
    const unresolvedWrongCount = wrongNotes.filter((wrongNote) => wrongNote.dan === dan && !wrongNote.isMastered).length;
    const adjustedWrongCount = Math.max(wrongCount, unresolvedWrongCount);

    return {
      dan,
      totalSolved,
      correctCount,
      wrongCount: adjustedWrongCount,
      accuracy,
      timeoutCount,
      bestStreak,
      lastPlayedAt,
      statusLabel: getStatusLabel(totalSolved, accuracy)
    };
  });
}
