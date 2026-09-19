import { Achievement, GameStats } from './types';
import { ACHIEVEMENTS } from './constants';

export function evaluateAchievements(
  unlockedIds: Set<string>,
  stats: GameStats,
  currentScore: number,
  isDailyChallengeCompleted: boolean
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const nowISO = new Date().toISOString();

  for (const ach of ACHIEVEMENTS) {
    if (unlockedIds.has(ach.id)) {
      continue;
    }

    let isMet = false;

    if (ach.requiredScore && (currentScore >= ach.requiredScore || stats.bestScore >= ach.requiredScore)) {
      isMet = true;
    } else if (ach.requiredPipes && stats.totalPipesPassed >= ach.requiredPipes) {
      isMet = true;
    } else if (ach.requiredGames && stats.totalGames >= ach.requiredGames) {
      isMet = true;
    } else if (ach.isDaily && isDailyChallengeCompleted) {
      isMet = true;
    }

    if (isMet) {
      newlyUnlocked.push({
        ...ach,
        unlockedAt: nowISO
      });
    }
  }

  return newlyUnlocked;
}

