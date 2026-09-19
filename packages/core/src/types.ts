export type GameState = 'READY' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Bird {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  rotation: number; // in radians
  flapFrame: number; // 0, 1, 2 for wing up, neutral, down
  flapTimer: number;
}

export interface Pipe {
  id: number;
  x: number;
  topHeight: number;
  bottomY: number;
  bottomHeight: number;
  gap: number;
  width: number;
  passed: boolean;
}

export type ThemeId = 'day' | 'night' | 'sunset' | 'neon' | 'space';

export type SkinId = 'classic' | 'eagle' | 'yellow' | 'penguin' | 'rocket' | 'pixel';

export interface SkinDefinition {
  id: SkinId;
  name: string;
  description: string;
  requiredScore: number;
  primaryColor: string;
  secondaryColor: string;
  beakColor: string;
  eyeColor: string;
  wingColor: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredScore?: number;
  requiredGames?: number;
  requiredPipes?: number;
  isDaily?: boolean;
  unlockedAt?: string | null;
}

export interface GameStats {
  bestScore: number;
  totalGames: number;
  totalPipesPassed: number;
  highestStreak: number;
  averageScore: number;
  totalPlayTimeSeconds: number;
  dailyChallengeStreak: number;
  lastDailyDate: string | null;
}

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  targetScore: number;
  seed: number;
  completed: boolean;
  bestScore: number;
}

