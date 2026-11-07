import { describe, it, expect } from 'vitest';
import { EMPTY_STATS, FROGS, dailyPond, liveStreak, recordRun, type RunRecord } from '../game/progress';

const run = (over: Partial<RunRecord> = {}): RunRecord => ({
  at: new Date().toISOString(),
  score: 12,
  flies: 9,
  bestCombo: 3,
  padBounces: 1,
  shieldsUsed: 0,
  seconds: 40,
  cause: 'reeds',
  ...over,
});

describe('stats', () => {
  it('adds up runs and keeps the best', () => {
    let s = recordRun(EMPTY_STATS, run({ score: 12 })).stats;
    const r = recordRun(s, run({ score: 7, cause: 'splash' }));
    s = r.stats;
    expect(s).toMatchObject({ best: 12, games: 2, totalGates: 19, totalFlies: 18 });
    expect(s.causes).toMatchObject({ reeds: 1, splash: 1 });
    expect(r.newBest).toBe(false);
  });

  it('unlocks achievements once', () => {
    const first = recordRun(EMPTY_STATS, run({ score: 10 }));
    expect(first.unlocked.map((a) => a.id)).toEqual(expect.arrayContaining(['first_gate', 'score_10']));
    expect(recordRun(first.stats, run({ score: 10 })).unlocked.map((a) => a.id)).not.toContain('score_10');
  });

  it('unlocks frogs as fireflies add up', () => {
    const r = recordRun({ ...EMPTY_STATS, totalFlies: FROGS[1].cost - 5 }, run({ flies: 10 }));
    expect(r.newFrogs.map((f) => f.id)).toEqual([FROGS[1].id]);
  });

  it('frogs get more expensive in order', () => {
    for (let i = 1; i < FROGS.length; i++) expect(FROGS[i].cost).toBeGreaterThan(FROGS[i - 1].cost);
    expect(FROGS[0].cost).toBe(0);
  });
});

describe('daily pond', () => {
  it('is the same all day, with a goal from 8 to 20', () => {
    const a = dailyPond(new Date(2026, 10, 20, 8));
    const b = dailyPond(new Date(2026, 10, 20, 22));
    expect(a).toEqual(b);
    expect(dailyPond(new Date(2026, 10, 21, 1)).number).toBe(a.number + 1);
    for (let d = 1; d <= 60; d++) {
      const g = dailyPond(new Date(2026, 10, d)).goal;
      expect(g).toBeGreaterThanOrEqual(8);
      expect(g).toBeLessThanOrEqual(20);
    }
    expect(dailyPond(new Date(2026, 10, 7, 12)).number).toBe(1);
  });

  it('builds a streak when the goal is reached on consecutive days', () => {
    const day = (d: number) => `2026-11-${String(d).padStart(2, '0')}`;
    const goal = (d: number) => dailyPond(new Date(2026, 10, d)).goal;
    let s = recordRun(EMPTY_STATS, run({ daily: day(10), score: goal(10) })).stats;
    s = recordRun(s, run({ daily: day(11), score: goal(11) + 3 })).stats;
    expect(s.daily.streak).toBe(2);
    expect(liveStreak(s, day(12))).toBe(2);
    expect(liveStreak(s, day(13))).toBe(0);
    // Reaching the goal again the same day doesn't count twice.
    expect(recordRun(s, run({ daily: day(11), score: 30 })).stats.daily.streak).toBe(2);
    // Falling short doesn't break the streak until the day is missed.
    const short = recordRun(s, run({ daily: day(12), score: 1 })).stats;
    expect(short.daily.best[day(12)]).toBe(1);
    expect(liveStreak(short, day(12))).toBe(2);
  });
});
