import { getDanStats } from "@/lib/getDanStats";
import type { Badge, BadgeId, DanOption, StudyRecord, WrongNoteItem } from "@/types/quiz";

const STORAGE_KEY = "gugu-badges";

const BADGE_DEFINITIONS: Record<BadgeId, Pick<Badge, "title" | "description">> = {
  "first-start": {
    title: "첫 걸음 배지",
    description: "처음으로 퀴즈를 시작했어요."
  },
  "first-session-complete": {
    title: "완주 배지",
    description: "첫 세션을 끝까지 완료했어요."
  },
  "first-wrong-note-clear": {
    title: "복습 성공 배지",
    description: "오답노트 문제를 처음 해결했어요."
  },
  "dan-2-start": {
    title: "2단 출발 배지",
    description: "2단 연습을 시작했어요."
  },
  "dan-master": {
    title: "단 마스터 배지",
    description: "어느 한 단에서 높은 정확도로 충분히 연습했어요."
  },
  "all-dan-tried": {
    title: "전 단 도전 배지",
    description: "2단부터 9단까지 모두 한 번 이상 풀었어요."
  },
  "perfect-score": {
    title: "퍼펙트 배지",
    description: "세션을 전부 맞혔어요."
  },
  "five-streak": {
    title: "5연속 배지",
    description: "한 세션에서 5연속 정답을 만들었어요."
  },
  "no-timeout-clear": {
    title: "침착함 배지",
    description: "타이머 모드에서 시간 초과 없이 끝냈어요."
  },
  "three-day-streak": {
    title: "3일 꾸준함 배지",
    description: "3일 연속 학습했어요."
  },
  "five-sessions": {
    title: "5세션 배지",
    description: "누적 5세션을 달성했어요."
  },
  "fifty-solved": {
    title: "50문제 배지",
    description: "누적 50문제를 풀었어요."
  }
};

function createDefaultBadges(): Badge[] {
  return Object.entries(BADGE_DEFINITIONS).map(([id, badge]) => ({
    id: id as BadgeId,
    title: badge.title,
    description: badge.description,
    unlockedAt: null,
    isUnlocked: false
  }));
}

function isBadgeArray(value: unknown): value is Badge[] {
  return Array.isArray(value);
}

function mergeWithDefaults(badges: Badge[]): Badge[] {
  const defaults = createDefaultBadges();

  return defaults.map((defaultBadge) => badges.find((badge) => badge.id === defaultBadge.id) ?? defaultBadge);
}

export function loadBadges(): Badge[] {
  if (typeof window === "undefined") {
    return createDefaultBadges();
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (storedValue === null) {
      return createDefaultBadges();
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    return isBadgeArray(parsedValue) ? mergeWithDefaults(parsedValue) : createDefaultBadges();
  } catch {
    return createDefaultBadges();
  }
}

export function saveBadges(badges: Badge[]): Badge[] {
  if (typeof window === "undefined") {
    return badges;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
    return badges;
  } catch {
    return loadBadges();
  }
}

export function unlockBadge(badges: Badge[], badgeId: BadgeId, unlockedAt: string): { badges: Badge[]; unlockedBadge: Badge | null } {
  let unlockedBadge: Badge | null = null;

  const nextBadges = badges.map((badge) => {
    if (badge.id !== badgeId || badge.isUnlocked) {
      return badge;
    }

    unlockedBadge = {
      ...badge,
      isUnlocked: true,
      unlockedAt
    };

    return unlockedBadge;
  });

  return { badges: nextBadges, unlockedBadge };
}

function getSolvedQuestionCount(studyRecords: StudyRecord[]): number {
  return studyRecords.reduce((sum, record) => sum + record.totalQuestions, 0);
}

function getDistinctPlayedDays(studyRecords: StudyRecord[]): string[] {
  return Array.from(
    new Set(
      studyRecords
        .map((record) => record.playedAt.slice(0, 10))
        .filter((value) => value.length === 10)
    )
  ).sort();
}

function hasThreeDayStreak(studyRecords: StudyRecord[]): boolean {
  const days = getDistinctPlayedDays(studyRecords);

  if (days.length < 3) {
    return false;
  }

  let currentStreak = 1;

  for (let index = 1; index < days.length; index += 1) {
    const previousDate = new Date(days[index - 1]);
    const currentDate = new Date(days[index]);
    const diffDays = Math.round((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak += 1;
      if (currentStreak >= 3) {
        return true;
      }
    } else {
      currentStreak = 1;
    }
  }

  return false;
}

type SessionBadgeInput = {
  accuracy: number;
  bestStreak: number;
  isTimerMode: boolean;
  timeoutCount: number;
  studyRecords: StudyRecord[];
  wrongNotes: WrongNoteItem[];
  playedAt: string;
};

export function evaluateStartBadges(
  badges: Badge[],
  selectedDan: DanOption | null,
  startedAt: string
): { badges: Badge[]; newlyUnlockedBadges: Badge[] } {
  let nextBadges = badges;
  const newlyUnlockedBadges: Badge[] = [];

  for (const badgeId of ["first-start", selectedDan === 2 ? "dan-2-start" : null] as const) {
    if (badgeId === null) {
      continue;
    }

    const result = unlockBadge(nextBadges, badgeId, startedAt);
    nextBadges = result.badges;
    if (result.unlockedBadge !== null) {
      newlyUnlockedBadges.push(result.unlockedBadge);
    }
  }

  return { badges: nextBadges, newlyUnlockedBadges };
}

export function evaluateSessionBadges(
  badges: Badge[],
  input: SessionBadgeInput
): { badges: Badge[]; newlyUnlockedBadges: Badge[] } {
  let nextBadges = badges;
  const newlyUnlockedBadges: Badge[] = [];
  const danStats = getDanStats(input.studyRecords, input.wrongNotes);
  const triedAllDans = danStats.every((stats) => stats.totalSolved > 0);
  const hasDanMaster = danStats.some((stats) => stats.totalSolved >= 10 && stats.accuracy >= 90);
  const sessionCount = input.studyRecords.length;
  const solvedQuestionCount = getSolvedQuestionCount(input.studyRecords);

  const candidates: Array<BadgeId | null> = [
    "first-session-complete",
    input.accuracy === 100 ? "perfect-score" : null,
    input.bestStreak >= 5 ? "five-streak" : null,
    input.isTimerMode && input.timeoutCount === 0 ? "no-timeout-clear" : null,
    hasDanMaster ? "dan-master" : null,
    triedAllDans ? "all-dan-tried" : null,
    sessionCount >= 5 ? "five-sessions" : null,
    solvedQuestionCount >= 50 ? "fifty-solved" : null,
    hasThreeDayStreak(input.studyRecords) ? "three-day-streak" : null
  ];

  for (const badgeId of candidates) {
    if (badgeId === null) {
      continue;
    }

    const result = unlockBadge(nextBadges, badgeId, input.playedAt);
    nextBadges = result.badges;
    if (result.unlockedBadge !== null) {
      newlyUnlockedBadges.push(result.unlockedBadge);
    }
  }

  return { badges: nextBadges, newlyUnlockedBadges };
}

export function evaluateWrongNoteBadges(
  badges: Badge[],
  wrongNotes: WrongNoteItem[],
  resolvedAt: string
): { badges: Badge[]; newlyUnlockedBadges: Badge[] } {
  const hasResolvedWrongNote = wrongNotes.some((wrongNote) => wrongNote.isMastered);

  if (!hasResolvedWrongNote) {
    return { badges, newlyUnlockedBadges: [] };
  }

  const result = unlockBadge(badges, "first-wrong-note-clear", resolvedAt);

  return {
    badges: result.badges,
    newlyUnlockedBadges: result.unlockedBadge !== null ? [result.unlockedBadge] : []
  };
}
