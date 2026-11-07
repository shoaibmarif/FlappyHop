import type { Cause, World } from './world';

// ── Frogs ───────────────────────────────────────────────────────────────

export type FrogId = 'pond' | 'tree' | 'dart' | 'sunset' | 'glass' | 'golden' | 'galaxy';

export interface FrogSkin {
  id: FrogId;
  name: string;
  blurb: string;
  /** Fireflies caught in total to unlock. */
  cost: number;
  body: string;
  belly: string;
  spots: string;
  eye: string;
}

export const FROGS: FrogSkin[] = [
  { id: 'pond', name: 'Pip', blurb: 'An ordinary pond frog with extraordinary legs.', cost: 0, body: '#4cc768', belly: '#c8f7a6', spots: '#2f9c4c', eye: '#1b2a1f' },
  { id: 'tree', name: 'Lime', blurb: 'Bright green with famous red eyes.', cost: 40, body: '#7be04a', belly: '#e8ffd2', spots: '#57b832', eye: '#e8333a' },
  { id: 'dart', name: 'Azul', blurb: 'Electric blue, very fancy.', cost: 120, body: '#2f7fe8', belly: '#9cd2ff', spots: '#0e1d4a', eye: '#0e1d4a' },
  { id: 'sunset', name: 'Ember', blurb: 'Orange as the last light over the pond.', cost: 250, body: '#ff8a3d', belly: '#ffd9a8', spots: '#d4561c', eye: '#2b1408' },
  { id: 'glass', name: 'Glim', blurb: 'So pale you can almost see through it.', cost: 450, body: '#b9f5d8', belly: '#ffffff', spots: '#7fd8b0', eye: '#1b3a2f' },
  { id: 'golden', name: 'Auric', blurb: 'Shines like a glow bug. Rare.', cost: 800, body: '#f6c945', belly: '#fff3c4', spots: '#d79a14', eye: '#3a2a05' },
  { id: 'galaxy', name: 'Nova', blurb: 'Speckled with tiny stars.', cost: 1500, body: '#5b3ed6', belly: '#c9b8ff', spots: '#f3e9ff', eye: '#0c0620' },
];

export const frogById = (id: string) => FROGS.find((f) => f.id === id) ?? FROGS[0];

// ── Stats ───────────────────────────────────────────────────────────────

export interface RunRecord {
  at: string;
  score: number;
  flies: number;
  bestCombo: number;
  padBounces: number;
  shieldsUsed: number;
  seconds: number;
  cause: Cause | null;
  daily?: string;
}

export interface Stats {
  best: number;
  games: number;
  totalGates: number;
  /** All-time fireflies caught. Unlocks frogs. */
  totalFlies: number;
  bestCombo: number;
  padBounces: number;
  seconds: number;
  causes: Record<Cause, number>;
  history: RunRecord[];
  achievements: Record<string, string>;
  daily: {
    /** Best score per day, keyed YYYY-MM-DD. */
    best: Record<string, number>;
    streak: number;
    bestStreak: number;
    lastDone: string | null;
  };
}

export const EMPTY_STATS: Stats = {
  best: 0,
  games: 0,
  totalGates: 0,
  totalFlies: 0,
  bestCombo: 0,
  padBounces: 0,
  seconds: 0,
  causes: { splash: 0, reeds: 0, vines: 0, dragonfly: 0 },
  history: [],
  achievements: {},
  daily: { best: {}, streak: 0, bestStreak: 0, lastDone: null },
};

// ── Daily pond ──────────────────────────────────────────────────────────

const LAUNCH = Date.UTC(2026, 10, 7);

export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export interface DailyPond {
  key: string;
  number: number;
  seed: number;
  /** Gates to pass to complete the day. */
  goal: number;
}

/** Same course for everyone on the same date, with a goal between 8 and 20 gates. */
export function dailyPond(date: Date = new Date()): DailyPond {
  const key = dayKey(date);
  const seed = hash(`flappyhop-${key}`);
  return {
    key,
    number: Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - LAUNCH) / 86_400_000) + 1,
    seed: seed & 0x7fffffff,
    goal: 8 + (seed % 13),
  };
}

export function msUntilTomorrow(now: Date = new Date()): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
}

export function formatCountdown(ms: number): string {
  const t = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60].map((n) => String(n).padStart(2, '0')).join(':');
}

/** The daily streak as it stands today: a missed day breaks it. */
export function liveStreak(s: Stats, today: string = dayKey()): number {
  const last = s.daily.lastDone;
  if (!last) return 0;
  return last === today || last === previousDay(today) ? s.daily.streak : 0;
}

// ── Achievements ────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  test: (s: Stats, r: RunRecord) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_gate', title: 'First hop', description: 'Make it through your first gap.', icon: '🐸', test: (_s, r) => r.score >= 1 },
  { id: 'score_10', title: 'Lily walker', description: 'Pass 10 gaps in one run.', icon: '🪷', test: (_s, r) => r.score >= 10 },
  { id: 'score_25', title: 'Night owl', description: 'Pass 25 gaps and see the night sky.', icon: '🌙', test: (_s, r) => r.score >= 25 },
  { id: 'score_50', title: 'Northern lights', description: 'Pass 50 gaps and reach the aurora.', icon: '🌌', test: (_s, r) => r.score >= 50 },
  { id: 'score_100', title: 'Pond legend', description: 'Pass 100 gaps in one run.', icon: '👑', test: (_s, r) => r.score >= 100 },
  { id: 'flies_10', title: 'Lantern', description: 'Catch 10 fireflies in one run.', icon: '✨', test: (_s, r) => r.flies >= 10 },
  { id: 'combo_5', title: 'Glow chain', description: 'Catch 5 fireflies in a row without a long gap.', icon: '🔗', test: (_s, r) => r.bestCombo >= 5 },
  { id: 'pads_3', title: 'Springboard', description: 'Bounce off 3 lily pads in one run.', icon: '🍃', test: (_s, r) => r.padBounces >= 3 },
  { id: 'shield', title: 'Saved by the glow', description: 'Let a glow bug save you from a hit.', icon: '🛡️', test: (_s, r) => r.shieldsUsed >= 1 },
  { id: 'daily', title: 'Daily dip', description: 'Reach the goal on a daily pond.', icon: '📅', test: (s, r) => Boolean(r.daily && r.score >= dailyGoalFor(r.daily)) && s.daily.streak >= 1 },
  { id: 'daily_7', title: 'Week of ponds', description: 'Reach the daily goal seven days in a row.', icon: '🗓️', test: (s) => s.daily.streak >= 7 },
  { id: 'games_25', title: 'Regular', description: 'Play 25 runs.', icon: '🎮', test: (s) => s.games >= 25 },
  { id: 'all_frogs', title: 'Frog collector', description: 'Unlock every frog.', icon: '🏆', test: (s) => s.totalFlies >= FROGS[FROGS.length - 1].cost },
];

function dailyGoalFor(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return dailyPond(new Date(y, m - 1, d)).goal;
}

// ── Recording a run ─────────────────────────────────────────────────────

export function makeRun(w: World, seconds: number, daily?: string): RunRecord {
  return {
    at: new Date().toISOString(),
    score: w.score,
    flies: w.fliesCaught,
    bestCombo: w.bestCombo,
    padBounces: w.padBounces,
    shieldsUsed: w.shieldsUsed,
    seconds: Math.round(seconds),
    cause: w.cause,
    daily,
  };
}

export interface RunOutcome {
  stats: Stats;
  newBest: boolean;
  unlocked: Achievement[];
  newFrogs: FrogSkin[];
  dailyDone: boolean;
}

export function recordRun(prev: Stats, r: RunRecord): RunOutcome {
  const causes = { ...prev.causes };
  if (r.cause) causes[r.cause] += 1;
  let daily = prev.daily;
  let dailyDone = false;
  if (r.daily) {
    const best = { ...prev.daily.best, [r.daily]: Math.max(prev.daily.best[r.daily] ?? 0, r.score) };
    daily = { ...prev.daily, best };
    if (r.score >= dailyGoalFor(r.daily) && prev.daily.lastDone !== r.daily) {
      const streak = prev.daily.lastDone === previousDay(r.daily) ? prev.daily.streak + 1 : 1;
      daily = { best, streak, bestStreak: Math.max(prev.daily.bestStreak, streak), lastDone: r.daily };
      dailyDone = true;
    }
  }
  const stats: Stats = {
    ...prev,
    best: Math.max(prev.best, r.score),
    games: prev.games + 1,
    totalGates: prev.totalGates + r.score,
    totalFlies: prev.totalFlies + r.flies,
    bestCombo: Math.max(prev.bestCombo, r.bestCombo),
    padBounces: prev.padBounces + r.padBounces,
    seconds: prev.seconds + r.seconds,
    causes,
    history: [r, ...prev.history].slice(0, 30),
    daily,
  };
  const unlocked = ACHIEVEMENTS.filter((a) => !stats.achievements[a.id] && a.test(stats, r));
  if (unlocked.length) {
    stats.achievements = { ...stats.achievements };
    for (const a of unlocked) stats.achievements[a.id] = r.at;
  }
  const newFrogs = FROGS.filter((f) => f.cost > prev.totalFlies && f.cost <= stats.totalFlies);
  return { stats, newBest: r.score > prev.best, unlocked, newFrogs, dailyDone };
}
