/**
 * FlappyHop's rules as a pure step function. A frog hops through a moonlit
 * pond: willow vines hang from above, reeds grow from the water, lily pads
 * drift on the surface and fireflies glow in the gaps.
 *
 * step(world, dt) returns a new world plus the events that happened, so the
 * renderer, sounds and stats can react without knowing the rules.
 */

export const W = 400;
export const H = 600;
/** The pond's surface. Below this is water. */
export const WATER_Y = 528;

export const FROG_X = 96;
export const FROG_W = 34;
export const FROG_H = 28;
export const GRAVITY = 1000;
export const HOP_VY = -350;
export const PAD_BOUNCE_VY = -440;
export const TERMINAL_VY = 640;

export const GATE_W = 54;
export const GATE_SPACING = 230;
const MIN_OPENING_TOP = 56;
/** Biggest change in height between one opening and the next. */
const MAX_SHIFT = 170;

const COMBO_WINDOW = 2.2;
const INVULNERABLE_SECONDS = 1.1;

/** Speed and opening size by score. */
export const DIFFICULTY = [
  { from: 0, speed: 150, gap: 152 },
  { from: 10, speed: 168, gap: 142 },
  { from: 25, speed: 186, gap: 132 },
  { from: 50, speed: 205, gap: 122 },
  { from: 100, speed: 225, gap: 114 },
] as const;

export function difficultyAt(score: number) {
  let level: (typeof DIFFICULTY)[number] = DIFFICULTY[0];
  for (const d of DIFFICULTY) if (score >= d.from) level = d;
  return level;
}

/** Sky changes the further you get. */
export type SkyPhase = 'dusk' | 'twilight' | 'night' | 'aurora';
export function skyAt(score: number): SkyPhase {
  if (score >= 50) return 'aurora';
  if (score >= 25) return 'night';
  if (score >= 10) return 'twilight';
  return 'dusk';
}

export interface Frog {
  y: number;
  vy: number;
  /** Seconds since the last hop, for the leg animation. */
  sinceHop: number;
}

/** A pair of obstacles: vines from the top down to `top`, reeds from `top + gap` to the water. */
export interface Gate {
  id: number;
  x: number;
  top: number;
  gap: number;
  passed: boolean;
}

export interface Pad {
  id: number;
  x: number;
  w: number;
  /** Seconds since it was used as a springboard, or null if still fresh. */
  sunk: number | null;
}

export interface Fly {
  id: number;
  x: number;
  baseY: number;
  phase: number;
  kind: 'firefly' | 'glowbug';
  caught: boolean;
}

export interface Dragonfly {
  id: number;
  x: number;
  baseY: number;
  phase: number;
}

export type Status = 'ready' | 'playing' | 'over';
export type Cause = 'splash' | 'reeds' | 'vines' | 'dragonfly';

export type WorldEvent =
  | { type: 'hop' }
  | { type: 'gate'; score: number }
  | { type: 'fly'; combo: number }
  | { type: 'glowbug' }
  | { type: 'pad' }
  | { type: 'shield-used' }
  | { type: 'over'; cause: Cause };

export interface World {
  status: Status;
  t: number;
  frog: Frog;
  gates: Gate[];
  pads: Pad[];
  flies: Fly[];
  dragonflies: Dragonfly[];
  score: number;
  fliesCaught: number;
  combo: number;
  bestCombo: number;
  lastFlyAt: number;
  padBounces: number;
  shield: boolean;
  shieldsUsed: number;
  invulnerable: number;
  cause: Cause | null;
  /** Seconds since the run ended (for the splash animation). */
  overFor: number;
  /** How far the pond has scrolled, for parallax backgrounds. */
  distance: number;
  nextId: number;
  rng: number;
}

// ── Random numbers ─────────────────────────────────────────────────────

/** Mulberry32 step. Returns the next state and a number in [0, 1). */
function rand(state: number): [number, number] {
  const s = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return [s, ((t ^ (t >>> 14)) >>> 0) / 4294967296];
}

export function newWorld(seed: number = Math.floor(Math.random() * 2 ** 31)): World {
  return {
    status: 'ready',
    t: 0,
    frog: { y: 250, vy: 0, sinceHop: 1 },
    gates: [],
    pads: [],
    flies: [],
    dragonflies: [],
    score: 0,
    fliesCaught: 0,
    combo: 0,
    bestCombo: 0,
    lastFlyAt: -10,
    padBounces: 0,
    shield: false,
    shieldsUsed: 0,
    invulnerable: 0,
    cause: null,
    overFor: 0,
    distance: 0,
    nextId: 1,
    rng: seed | 0,
  };
}

/** A tap: starts the run, or hops. */
export function hop(w: World): { world: World; events: WorldEvent[] } {
  if (w.status === 'over') return { world: w, events: [] };
  return {
    world: { ...w, status: 'playing', frog: { ...w.frog, vy: HOP_VY, sinceHop: 0 } },
    events: [{ type: 'hop' }],
  };
}

/** Where the frog's hitbox is, slightly forgiving. */
export function frogBox(y: number) {
  return { left: FROG_X + 5, right: FROG_X + FROG_W - 5, top: y + 4, bottom: y + FROG_H - 3 };
}

export const flyY = (f: Fly, t: number) => f.baseY + Math.sin(t * 3 + f.phase) * 8;
export const dragonflyY = (d: Dragonfly, t: number) => d.baseY + Math.sin(t * 2.4 + d.phase) * 34;

/** Spawns a gate and, sometimes, a lily pad, fireflies, a glow bug or a dragonfly after it. */
function spawn(w: World, x: number) {
  let r: number;
  let rng = w.rng;
  const next = () => {
    [rng, r] = rand(rng);
    return r;
  };
  const { gap } = difficultyAt(w.score);
  const maxTop = WATER_Y - gap - 46;
  // Keep consecutive openings within reach: never more than MAX_SHIFT apart.
  const prev = w.gates[w.gates.length - 1];
  const lo = prev ? Math.max(MIN_OPENING_TOP, prev.top - MAX_SHIFT) : MIN_OPENING_TOP;
  const hi = prev ? Math.min(maxTop, prev.top + MAX_SHIFT) : maxTop;
  const top = Math.round(lo + next() * (hi - lo));
  const gates = [...w.gates, { id: w.nextId++, x, top, gap, passed: false }];
  const pads = [...w.pads];
  const flies = [...w.flies];
  const dragonflies = [...w.dragonflies];
  const mid = x + GATE_SPACING / 2;

  // A firefly in most openings.
  if (next() < 0.7) flies.push({ id: w.nextId++, x: x + GATE_W / 2 - 4, baseY: top + gap / 2, phase: next() * 6, kind: 'firefly', caught: false });
  // Sometimes a little trail between gates.
  if (next() < 0.35) {
    const y = 140 + next() * 280;
    for (let i = 0; i < 3; i++) flies.push({ id: w.nextId++, x: mid - 30 + i * 30, baseY: y + i * 14, phase: i, kind: 'firefly', caught: false });
  }
  // Lily pads drift between gates.
  if (next() < 0.5) pads.push({ id: w.nextId++, x: mid - 30 + next() * 20, w: 62, sunk: null });
  // A rare glow bug that shields you from one hit.
  if (w.score >= 3 && !w.shield && next() < 0.09) flies.push({ id: w.nextId++, x: x + GATE_W / 2 - 4, baseY: top + gap / 2 - 26, phase: 0, kind: 'glowbug', caught: false });
  // Dragonflies join later in the run.
  if (w.score >= 15 && next() < 0.28) dragonflies.push({ id: w.nextId++, x: mid + 40, baseY: 150 + next() * 240, phase: next() * 6 });

  return { gates, pads, flies, dragonflies, rng };
}

/** Advance the world by dt seconds. */
export function step(w0: World, dtRaw: number): { world: World; events: WorldEvent[] } {
  const dt = Math.min(dtRaw, 1 / 20);
  const events: WorldEvent[] = [];
  const t = w0.t + dt;

  if (w0.status === 'ready') {
    // Bob gently on the start screen.
    return { world: { ...w0, t, distance: w0.distance + 40 * dt, frog: { ...w0.frog, y: 250 + Math.sin(t * 3) * 6 } }, events };
  }
  if (w0.status === 'over') {
    // Keep sinking for the splash animation.
    const vy = Math.min(w0.frog.vy + GRAVITY * dt, TERMINAL_VY);
    const y = Math.min(w0.frog.y + vy * dt, WATER_Y + 30);
    return { world: { ...w0, t, overFor: w0.overFor + dt, frog: { ...w0.frog, y, vy } }, events };
  }

  const w: World = { ...w0, t };
  const { speed } = difficultyAt(w.score);
  const dx = speed * dt;
  w.distance += dx;

  // Frog physics.
  let vy = Math.min(w.frog.vy + GRAVITY * dt, TERMINAL_VY);
  let y = w.frog.y + vy * dt;
  if (y < 0) {
    y = 0;
    vy = Math.max(vy, 0);
  }
  w.frog = { y, vy, sinceHop: w.frog.sinceHop + dt };
  w.invulnerable = Math.max(0, w.invulnerable - dt);

  // Scroll the pond.
  w.gates = w.gates.map((g) => ({ ...g, x: g.x - dx })).filter((g) => g.x + GATE_W > -10);
  w.pads = w.pads
    .map((p) => ({ ...p, x: p.x - dx, sunk: p.sunk === null ? null : p.sunk + dt }))
    .filter((p) => p.x + p.w > -10 && (p.sunk === null || p.sunk < 1.5));
  w.flies = w.flies.map((f) => ({ ...f, x: f.x - dx })).filter((f) => f.x > -20 && !f.caught);
  w.dragonflies = w.dragonflies.map((d) => ({ ...d, x: d.x - dx - 70 * dt })).filter((d) => d.x > -40);

  // Keep gates coming.
  const last = w.gates[w.gates.length - 1];
  if (!last || last.x <= W - GATE_SPACING) {
    const s = spawn(w, last ? last.x + GATE_SPACING : W + 80);
    Object.assign(w, s);
  }

  // Scoring.
  w.gates = w.gates.map((g) => {
    if (!g.passed && FROG_X > g.x + GATE_W / 2) {
      w.score += 1;
      events.push({ type: 'gate', score: w.score });
      return { ...g, passed: true };
    }
    return g;
  });

  // Catching fireflies and glow bugs.
  const cx = FROG_X + FROG_W / 2;
  const cy = y + FROG_H / 2;
  w.flies = w.flies.map((f) => {
    if (f.caught) return f;
    const fy = flyY(f, t);
    if (Math.hypot(f.x + 4 - cx, fy - cy) > 24) return f;
    if (f.kind === 'glowbug') {
      w.shield = true;
      events.push({ type: 'glowbug' });
    } else {
      w.combo = t - w.lastFlyAt <= COMBO_WINDOW ? w.combo + 1 : 1;
      w.bestCombo = Math.max(w.bestCombo, w.combo);
      w.lastFlyAt = t;
      w.fliesCaught += 1;
      events.push({ type: 'fly', combo: w.combo });
    }
    return { ...f, caught: true };
  });
  if (t - w.lastFlyAt > COMBO_WINDOW) w.combo = 0;

  // Hitting things.
  const box = frogBox(y);
  let hit: Cause | null = null;
  for (const g of w.gates) {
    if (box.right > g.x && box.left < g.x + GATE_W) {
      if (box.top < g.top) hit = 'vines';
      else if (box.bottom > g.top + g.gap) hit = 'reeds';
    }
  }
  for (const d of w.dragonflies) {
    const dy = dragonflyY(d, t);
    if (box.right > d.x + 4 && box.left < d.x + 30 && box.bottom > dy + 4 && box.top < dy + 14) hit = 'dragonfly';
  }

  // The water: a fresh lily pad bounces you back up, otherwise it's a splash.
  if (box.bottom >= WATER_Y) {
    const pad = w.pads.find((p) => p.sunk === null && cx > p.x - 4 && cx < p.x + p.w + 4);
    if (pad) {
      w.pads = w.pads.map((p) => (p.id === pad.id ? { ...p, sunk: 0 } : p));
      w.frog = { y: WATER_Y - FROG_H, vy: PAD_BOUNCE_VY, sinceHop: 0 };
      w.padBounces += 1;
      events.push({ type: 'pad' });
    } else if (!hit) {
      hit = 'splash';
    }
  }

  if (hit && w.invulnerable <= 0) {
    if (w.shield) {
      w.shield = false;
      w.shieldsUsed += 1;
      w.invulnerable = INVULNERABLE_SECONDS;
      // Bounce clear of whatever we hit.
      w.frog = { ...w.frog, vy: hit === 'vines' ? 120 : HOP_VY, y: Math.min(w.frog.y, WATER_Y - FROG_H - 2) };
      events.push({ type: 'shield-used' });
    } else {
      w.status = 'over';
      w.cause = hit;
      w.combo = 0;
      events.push({ type: 'over', cause: hit });
    }
  }

  return { world: w, events };
}
