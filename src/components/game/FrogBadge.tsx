import React, { useEffect, useRef } from 'react';
import { drawFrog } from '../../game/render';
import { FROG_H, FROG_W } from '../../game/world';
import type { FrogSkin } from '../../game/progress';

/** A frog portrait, drawn with the same code as the game. */
export const FrogBadge: React.FC<{ skin: FrogSkin; size?: number; className?: string }> = ({ skin, size = 48, className = '' }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = size * dpr;
    c.height = size * dpr;
    // The frog is about 52 × 40 units including legs and eyes; fit it in the square.
    const scale = (size * dpr) / 56;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, 56, 56);
    drawFrog(ctx, skin, (56 - FROG_W) / 2 + 3, (56 - FROG_H) / 2 + 2, 0, 1, 0);
  }, [skin, size]);
  return <canvas ref={ref} style={{ width: size, height: size }} className={className} aria-hidden="true" />;
};
