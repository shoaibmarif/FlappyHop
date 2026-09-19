import { GameStats } from './types';

export function createInitialStats(): GameStats {
  return {
    bestScore: 0,
    totalGames: 0,
    totalPipesPassed: 0,
    highestStreak: 0,
    averageScore: 0,
    totalPlayTimeSeconds: 0,
    dailyChallengeStreak: 0,
    lastDailyDate: null
  };
}

export function recordGameResult(
  prevStats: GameStats,
  score: number,
  pipesPassedInRun: number,
  durationSeconds: number,
  isDailyRun = false,
  dailyCompleted = false,
  todayDateStr = ''
): GameStats {
  const newTotalGames = prevStats.totalGames + 1;
  const newBestScore = Math.max(prevStats.bestScore, score);
  const newTotalPipes = prevStats.totalPipesPassed + pipesPassedInRun;
  const newHighestStreak = Math.max(prevStats.highestStreak, score);
  const newPlayTime = prevStats.totalPlayTimeSeconds + Math.round(durationSeconds);

  // Recalculate rolling average
  const totalScoreHistorical = prevStats.averageScore * prevStats.totalGames + score;
  const newAverageScore = Math.round((totalScoreHistorical / newTotalGames) * 10) / 10;

  // Daily streak calculations
  let dailyStreak = prevStats.dailyChallengeStreak;
  let lastDailyDate = prevStats.lastDailyDate;

  if (isDailyRun && dailyCompleted && lastDailyDate !== todayDateStr) {
    dailyStreak += 1;
    lastDailyDate = todayDateStr;
  }

  return {
    bestScore: newBestScore,
    totalGames: newTotalGames,
    totalPipesPassed: newTotalPipes,
    highestStreak: newHighestStreak,
    averageScore: newAverageScore,
    totalPlayTimeSeconds: newPlayTime,
    dailyChallengeStreak: dailyStreak,
    lastDailyDate
  };
}

