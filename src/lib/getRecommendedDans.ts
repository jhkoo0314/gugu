import type { DanStats, RecommendedDan, WrongNoteItem } from "@/types/quiz";

function getInactivityScore(lastPlayedAt: string | null): number {
  if (lastPlayedAt === null) {
    return 20;
  }

  const diffMs = Date.now() - new Date(lastPlayedAt).getTime();
  const diffDays = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);

  return Math.min(diffDays, 14);
}

export function getRecommendedDans(
  danStats: DanStats[],
  wrongNotes: WrongNoteItem[],
  limit = 3
): RecommendedDan[] {
  return [...danStats]
    .map((stats) => {
      const unresolvedWrongCount = wrongNotes.filter(
        (wrongNote) => wrongNote.dan === stats.dan && !wrongNote.isMastered
      ).length;
      const inactivityScore = getInactivityScore(stats.lastPlayedAt);
      const score = (100 - stats.accuracy) * 0.5 + unresolvedWrongCount * 8 + stats.timeoutCount * 4 + inactivityScore;

      let reason: RecommendedDan["reason"] = "low-accuracy";
      let label = `최근 ${stats.dan}단 정답률이 낮아요. 다시 연습해볼까요?`;

      if (unresolvedWrongCount > 0 && unresolvedWrongCount >= Math.max(1, stats.timeoutCount)) {
        reason = "many-wrongs";
        label = `${stats.dan}단 오답이 ${unresolvedWrongCount}개 쌓였어요. 다시 보기 좋아요.`;
      } else if (stats.timeoutCount > 0) {
        reason = "many-timeouts";
        label = `${stats.dan}단에서 시간 초과가 있었어요. 천천히 다시 풀어봐요.`;
      } else if (stats.lastPlayedAt === null || inactivityScore >= 7) {
        reason = "not-practiced-recently";
        label = `${stats.dan}단을 한동안 연습하지 않았어요. 다시 꺼내볼까요?`;
      }

      return {
        dan: stats.dan,
        reason,
        label,
        score
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ dan, reason, label }) => ({ dan, reason, label }));
}
