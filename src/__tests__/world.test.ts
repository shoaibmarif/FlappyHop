import { describe, it, expect } from 'vitest';
import { FROG_H, FROG_X, GATE_W, WATER_Y, difficultyAt, hop, newWorld, skyAt, step, type World, type WorldEvent } from '../game/world';

const DT = 1 / 60;

/** Hops whenever the frog drops below the middle of the next opening. */
function autopilot(w: World, seconds: number, dodge = true) {
  const events: WorldEvent[] = [];
  ({ world: w } = hop(w));
  for (let i = 0; i < seconds * 60 && w.status === 'playing'; i++) {
    const next = w.gates.find((g) => g.x + GATE_W > FROG_X - 4);
    const target = next ? next.top + next.gap * 0.62 : 300;
    if (w.frog.y + FROG_H / 2 > target && w.frog.vy > -60) ({ world: w } = hop(w));
    // The bot can't dodge dragonflies, so take them out when testing the course itself.
    const r = step(dodge ? { ...w, dragonflies: [] } : w, DT);
    w = r.world;
    events.push(...r.events);
  }
  return { w, events };
}

describe('the pond', () => {
  it('waits for the first hop', () => {
    let w = newWorld(1);
    for (let i = 0; i < 120; i++) w = step(w, DT).world;
    expect(w.status).toBe('ready');
    expect(w.gates).toHaveLength(0);
  });

  it('falling into open water is a splash', () => {
    let w = hop(newWorld(1)).world;
    w = { ...w, pads: [] };
    for (let i = 0; i < 300 && w.status === 'playing'; i++) w = step({ ...w, pads: [] }, DT).world;
    expect(w.status).toBe('over');
    expect(w.cause).toBe('splash');
  });

  it('a lily pad bounces you back up, once', () => {
    let w = hop(newWorld(1)).world;
    w = { ...w, frog: { ...w.frog, y: WATER_Y - FROG_H - 1, vy: 300 }, gates: [{ id: 99, x: 999, top: 100, gap: 150, passed: false }], pads: [{ id: 1, x: FROG_X - 10, w: 62, sunk: null }] };
    const r = step(w, DT);
    expect(r.events.map((e) => e.type)).toContain('pad');
    expect(r.world.frog.vy).toBeLessThan(0);
    expect(r.world.pads[0].sunk).toBe(0);
    expect(r.world.status).toBe('playing');
  });

  it('a skilled frog keeps going: the course is always passable', () => {
    for (const seed of [1, 2, 3, 42, 2026]) {
      const { w } = autopilot(newWorld(seed), 60);
      expect(w.score, `seed ${seed}`).toBeGreaterThanOrEqual(30);
    }
  });

  it('consecutive openings are always within reach', () => {
    const { w } = autopilot(newWorld(9), 60);
    let prev = -1;
    for (const g of w.gates) {
      if (prev >= 0) expect(Math.abs(g.top - prev)).toBeLessThanOrEqual(170);
      prev = g.top;
    }
  });

  it('dragonflies show up later in a run', () => {
    const { w } = autopilot(newWorld(4), 60, false);
    expect(w.score).toBeGreaterThan(0);
    const seen = autopilot(newWorld(4), 60).w;
    expect(seen.score).toBeGreaterThanOrEqual(15);
  });

  it('the same seed gives the same course', () => {
    const a = autopilot(newWorld(7), 20).w;
    const b = autopilot(newWorld(7), 20).w;
    expect(a.gates.map((g) => g.top)).toEqual(b.gates.map((g) => g.top));
    expect(a.score).toBe(b.score);
  });

  it('catches fireflies and builds combos', () => {
    const { w, events } = autopilot(newWorld(3), 40);
    expect(w.fliesCaught).toBeGreaterThan(0);
    expect(events.filter((e) => e.type === 'fly').length).toBe(w.fliesCaught);
    expect(w.bestCombo).toBeGreaterThanOrEqual(1);
  });

  it('a glow bug shield absorbs one hit', () => {
    let w = hop(newWorld(1)).world;
    w = { ...w, shield: true, pads: [], gates: [] };
    let used = false;
    for (let i = 0; i < 300 && w.status === 'playing'; i++) {
      const r = step({ ...w, pads: [] }, DT);
      w = r.world;
      if (r.events.some((e) => e.type === 'shield-used')) used = true;
    }
    expect(used).toBe(true);
    expect(w.shieldsUsed).toBe(1);
    expect(w.status).toBe('over');
  });

  it('gets harder and the sky changes with score', () => {
    expect(difficultyAt(60).gap).toBeLessThan(difficultyAt(0).gap);
    expect(difficultyAt(60).speed).toBeGreaterThan(difficultyAt(0).speed);
    expect([skyAt(0), skyAt(10), skyAt(25), skyAt(50)]).toEqual(['dusk', 'twilight', 'night', 'aurora']);
  });

  it('the ceiling stops the frog instead of ending the run', () => {
    let w = hop(newWorld(1)).world;
    w = { ...w, frog: { ...w.frog, y: 2 } };
    for (let i = 0; i < 10; i++) w = hop(step(w, DT).world).world;
    expect(w.frog.y).toBeGreaterThanOrEqual(0);
    expect(w.status).toBe('playing');
  });
});
