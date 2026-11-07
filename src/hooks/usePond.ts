import { useCallback, useEffect, useRef, useState } from 'react';
import { H, W, hop, newWorld, step, type World, type WorldEvent } from '../game/world';
import { render } from '../game/render';
import { frogById, type FrogId } from '../game/progress';
import { sound } from '../utils/sound';

export interface Pop {
  id: number;
  text: string;
  tone: 'fly' | 'pad' | 'shield' | 'gate';
}

interface UsePondOptions {
  frog: FrogId;
  seed?: number;
  /** Called once when a run ends. */
  onOver: (w: World, seconds: number) => void;
}

/**
 * Runs the game loop on a canvas: input, fixed-size logical world scaled to
 * the screen, sounds, and a little HUD state for React.
 */
export function usePond({ frog, seed, onOver }: UsePondOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World>(newWorld(seed));
  const pausedRef = useRef(false);
  const startedAt = useRef(0);
  const onOverRef = useRef(onOver);
  onOverRef.current = onOver;
  const frogRef = useRef(frog);
  frogRef.current = frog;

  const [hud, setHud] = useState({ status: worldRef.current.status, score: 0, flies: 0, combo: 0, shield: false });
  const [paused, setPaused] = useState(false);
  const [pops, setPops] = useState<Pop[]>([]);
  const popId = useRef(0);

  const addPop = (text: string, tone: Pop['tone']) => {
    const id = ++popId.current;
    setPops((p) => [...p.slice(-4), { id, text, tone }]);
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
  };

  const handle = useCallback((events: WorldEvent[]) => {
    for (const e of events) {
      switch (e.type) {
        case 'hop':
          sound.hop();
          break;
        case 'gate':
          sound.gate();
          break;
        case 'fly':
          sound.fly(e.combo);
          addPop(e.combo > 1 ? `×${e.combo}` : '+1', 'fly');
          break;
        case 'glowbug':
          sound.glowbug();
          addPop('Glow shield!', 'shield');
          break;
        case 'pad':
          sound.pad();
          addPop('Boing!', 'pad');
          break;
        case 'shield-used':
          sound.shield();
          addPop('Saved!', 'shield');
          break;
        case 'over':
          if (e.cause === 'splash') sound.splash();
          else sound.bonk();
          onOverRef.current(worldRef.current, (performance.now() - startedAt.current) / 1000);
          break;
      }
    }
  }, []);

  const syncHud = (w: World) =>
    setHud((h) =>
      h.status === w.status && h.score === w.score && h.flies === w.fliesCaught && h.combo === w.combo && h.shield === w.shield
        ? h
        : { status: w.status, score: w.score, flies: w.fliesCaught, combo: w.combo, shield: w.shield }
    );

  const tap = useCallback(() => {
    if (pausedRef.current) return;
    const w = worldRef.current;
    if (w.status === 'over') return;
    if (w.status === 'ready') startedAt.current = performance.now();
    const r = hop(w);
    worldRef.current = r.world;
    handle(r.events);
    syncHud(r.world);
  }, [handle]);

  const restart = useCallback(() => {
    worldRef.current = newWorld(seed);
    pausedRef.current = false;
    setPaused(false);
    setPops([]);
    syncHud(worldRef.current);
  }, [seed]);

  const setPause = useCallback((p: boolean) => {
    if (p && worldRef.current.status !== 'playing') return;
    pausedRef.current = p;
    setPaused(p);
  }, []);

  // A new seed (daily pond) means a new course.
  useEffect(() => {
    restart();
  }, [restart]);

  // The animation loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      // Keep the canvas sharp on high-density screens.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth;
      if (cssW && canvas.width !== Math.round(cssW * dpr)) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round((cssW * H * dpr) / W);
      }
      if (!pausedRef.current) {
        const r = step(worldRef.current, dt);
        worldRef.current = r.world;
        if (r.events.length) handle(r.events);
        syncHud(r.world);
      }
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      render(ctx, worldRef.current, frogById(frogRef.current));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [handle]);

  // Keyboard: Space, Up or W to hop; P or Escape to pause.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        // Don't let Space press a focused button or scroll the page.
        if (target?.closest('a, button') && e.code === 'Space' && worldRef.current.status !== 'playing') return;
        e.preventDefault();
        if (!e.repeat) tap();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        setPause(!pausedRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tap, setPause]);

  // Pause when the tab is hidden.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) setPause(true);
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [setPause]);

  return { canvasRef, hud, paused, pops, tap, restart, setPause, world: worldRef };
}
