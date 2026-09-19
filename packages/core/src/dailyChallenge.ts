import { DailyChallenge } from './types';

// Simple string hash to 32-bit integer
export function hashDateString(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Mulberry32 32-bit seeded PRNG
export function createSeededRandom(seed: number): () => number {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateDailyChallenge(
  dateStr = getTodayDateString(),
  existingCompleted = false,
  existingBest = 0
): DailyChallenge {
  const seed = hashDateString(dateStr);
  const rng = createSeededRandom(seed);

  // Target score deterministically calculated between 20 and 35
  const targetScore = 20 + Math.floor(rng() * 16);

  return {
    date: dateStr,
    targetScore,
    seed,
    completed: existingCompleted,
    bestScore: existingBest
  };
}

