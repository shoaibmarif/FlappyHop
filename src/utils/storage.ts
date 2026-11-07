import { EMPTY_STATS, FROGS, type FrogId, type Stats } from '../game/progress';

const STATS_KEY = 'flappyhop_stats_v2';
const SETTINGS_KEY = 'flappyhop_settings_v2';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Settings {
  theme: ThemeMode;
  sound: boolean;
  reducedMotion: boolean;
  frog: FrogId;
}

export const DEFAULT_SETTINGS: Settings = { theme: 'dark', sound: true, reducedMotion: false, frog: 'pond' };

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: progress lasts for this visit only
  }
}

export function loadSettings(): Settings {
  const saved = read<Partial<Settings>>(SETTINGS_KEY);
  if (saved) {
    const s = { ...DEFAULT_SETTINGS, ...saved };
    return FROGS.some((f) => f.id === s.frog) ? s : { ...s, frog: 'pond' };
  }
  // Carry over choices from the first version of the site.
  let theme: ThemeMode = 'dark';
  let sound = true;
  try {
    const t = localStorage.getItem('flappy_color_theme');
    if (t === 'light' || t === 'dark') theme = t;
    sound = localStorage.getItem('flappy_muted') !== 'true';
  } catch {
    // storage blocked
  }
  return { ...DEFAULT_SETTINGS, theme, sound };
}

export const saveSettings = (s: Settings) => write(SETTINGS_KEY, s);

export function loadStats(): Stats {
  const saved = read<Partial<Stats>>(STATS_KEY);
  if (saved) return { ...EMPTY_STATS, ...saved, causes: { ...EMPTY_STATS.causes, ...saved.causes }, daily: { ...EMPTY_STATS.daily, ...saved.daily } };
  // Bring over the best score and totals from the first version.
  const old = read<{ bestScore?: number; totalGames?: number; totalPipesPassed?: number }>('flappy_stats');
  const oldBest = Number(read<number>('flappy_best_score') ?? 0) || 0;
  return {
    ...EMPTY_STATS,
    best: Math.max(oldBest, old?.bestScore ?? 0),
    games: old?.totalGames ?? 0,
    totalGates: old?.totalPipesPassed ?? 0,
  };
}

export const saveStats = (s: Stats) => write(STATS_KEY, s);
export const resetStats = () => write(STATS_KEY, EMPTY_STATS);
