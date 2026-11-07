import React, { useEffect, useRef } from 'react';
import { drawDragonfly, drawFrog, drawPad, drawReeds, drawSky, drawVines, drawWater, glowDot } from '../../game/render';
import { FROG_H, H, W, WATER_Y, newWorld, type World } from '../../game/world';
import { FROGS } from '../../game/progress';
import { useApp } from '../../context/AppContext';

export type SpriteKind = 'gap' | 'pad' | 'firefly' | 'glowbug' | 'dragonfly' | 'sky';

interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** What to draw for each sprite, and which part of the pond to show. */
const SCENES: Record<SpriteKind, { view: View; draw: (ctx: CanvasRenderingContext2D, t: number, score: number) => void }> = {
  gap: {
    view: { x: 52, y: 170, w: 90, h: 230 },
    draw: (ctx, t) => {
      drawSky(ctx, stub(t, 30), 0);
      drawVines(ctx, 70, 230, t);
      drawReeds(ctx, 70, 372, t);
      glowDot(ctx, 97, 300 + Math.sin(t * 3) * 6, 3, 'rgba(210, 255, 90, 0.85)', 0.6 + 0.4 * Math.sin(t * 6));
    },
  },
  pad: {
    view: { x: 40, y: WATER_Y - 90, w: 180, h: 130 },
    draw: (ctx, t) => {
      drawSky(ctx, stub(t, 30), 0);
      drawWater(ctx, stub(t, 30), t * 10);
      drawPad(ctx, 90, 70, null, 3, t);
      const bounce = Math.abs(Math.sin(t * 2.2));
      drawFrog(ctx, FROGS[0], 108, WATER_Y - FROG_H - 4 - bounce * 46, bounce > 0.5 ? -300 : 200, bounce > 0.8 ? 0.1 : 1, t);
    },
  },
  firefly: {
    view: { x: 60, y: 200, w: 120, h: 100 },
    draw: (ctx, t) => {
      drawSky(ctx, stub(t, 30), 0);
      [0, 1, 2].forEach((i) => glowDot(ctx, 90 + i * 30, 250 + i * 8 + Math.sin(t * 3 + i) * 6, 3.5, 'rgba(210, 255, 90, 0.85)', 0.55 + 0.45 * Math.sin(t * 6 + i)));
    },
  },
  glowbug: {
    view: { x: 60, y: 200, w: 120, h: 100 },
    draw: (ctx, t) => {
      drawSky(ctx, stub(t, 30), 0);
      const y = 250 + Math.sin(t * 3) * 6;
      glowDot(ctx, 120, y, 6, 'rgba(255, 200, 60, 0.9)', 0.9);
      ctx.strokeStyle = 'rgba(255, 220, 110, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(120, y, 12 + Math.sin(t * 5) * 2, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  dragonfly: {
    view: { x: 60, y: 200, w: 120, h: 100 },
    draw: (ctx, t) => {
      drawSky(ctx, stub(t, 30), 0);
      drawDragonfly(ctx, 104 + Math.sin(t * 1.5) * 10, 244 + Math.sin(t * 2.4) * 8, t);
    },
  },
  sky: {
    view: { x: 0, y: 0, w: W, h: H },
    draw: (ctx, t, score) => {
      const w = stub(t, score);
      drawSky(ctx, w, t * 20);
      drawWater(ctx, w, t * 20);
    },
  },
};

function stub(t: number, score: number): World {
  return { ...newWorld(1), t, score };
}

interface PondSpriteProps {
  kind: SpriteKind;
  /** CSS width in pixels; height follows the scene's shape. */
  width: number;
  /** For skies: which score's sky to show. */
  score?: number;
  className?: string;
  label?: string;
  /** Stretch to the container's width instead of a fixed size. */
  fluid?: boolean;
}

/** A small, gently animated piece of the real pond, drawn by the game's own renderer. */
export const PondSprite: React.FC<PondSpriteProps> = ({ kind, width, score = 0, className = '', label, fluid = false }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { settings } = useApp();
  const scene = SCENES[kind];
  const height = Math.round((width * scene.view.h) / scene.view.w);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
    const s = c.width / scene.view.w;
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      ctx.setTransform(s, 0, 0, s, -scene.view.x * s, -scene.view.y * s);
      scene.draw(ctx, (now - start) / 1000 + 2, score);
      if (!settings.reducedMotion) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [scene, width, height, score, settings.reducedMotion]);

  const style = fluid ? { width: '100%', maxWidth: width, aspectRatio: `${scene.view.w} / ${scene.view.h}` } : { width, height };
  return <canvas ref={ref} style={style} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
};
