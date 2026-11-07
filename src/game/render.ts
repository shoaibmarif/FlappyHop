/**
 * Draws a World onto a canvas. Everything is drawn in code, so there are no
 * image files to load and it stays sharp on any screen.
 */
import { FROG_H, FROG_W, FROG_X, GATE_W, H, W, WATER_Y, dragonflyY, flyY, skyAt, type SkyPhase, type World } from './world';
import type { FrogSkin } from './progress';

const SKIES: Record<SkyPhase, { top: string; mid: string; low: string; stars: number; moon: string }> = {
  dusk: { top: '#2b1d52', mid: '#7a3f78', low: '#f0906a', stars: 0.25, moon: '#fff1c9' },
  twilight: { top: '#14163d', mid: '#3c2d6e', low: '#a8678f', stars: 0.6, moon: '#fff4d6' },
  night: { top: '#050817', mid: '#0d1a3a', low: '#1d3557', stars: 1, moon: '#fffbe8' },
  aurora: { top: '#03071a', mid: '#0a1d33', low: '#123f4a', stars: 1, moon: '#f2fff8' },
};

// Fixed star field so it doesn't shimmer between frames.
const STARS = Array.from({ length: 70 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.678;
  return { x: (a - Math.floor(a)) * W, y: (b - Math.floor(b)) * 300, r: (i % 3) * 0.4 + 0.5, tw: i * 0.7 };
});

export function drawSky(ctx: CanvasRenderingContext2D, w: World, travel: number) {
  const phase = skyAt(w.score);
  const sky = SKIES[phase];
  const g = ctx.createLinearGradient(0, 0, 0, WATER_Y);
  g.addColorStop(0, sky.top);
  g.addColorStop(0.55, sky.mid);
  g.addColorStop(1, sky.low);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, WATER_Y);

  for (const s of STARS) {
    ctx.globalAlpha = sky.stars * (0.55 + 0.45 * Math.sin(w.t * 2 + s.tw));
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc((s.x - travel * 0.02 + W) % W, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (phase === 'aurora') {
    for (let band = 0; band < 3; band++) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 10) {
        const y = 90 + band * 34 + Math.sin(x / 60 + w.t * 0.8 + band) * 18;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = band === 1 ? 'rgba(160, 110, 255, 0.28)' : 'rgba(80, 255, 170, 0.25)';
      ctx.lineWidth = 26;
      ctx.stroke();
    }
  }

  // The moon and its glow.
  const mx = 300;
  const my = 92;
  const glow = ctx.createRadialGradient(mx, my, 10, mx, my, 90);
  glow.addColorStop(0, 'rgba(255, 245, 210, 0.35)');
  glow.addColorStop(1, 'rgba(255, 245, 210, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(mx - 90, my - 90, 180, 180);
  ctx.fillStyle = sky.moon;
  ctx.beginPath();
  ctx.arc(mx, my, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.arc(mx - 8, my - 6, 6, 0, Math.PI * 2);
  ctx.arc(mx + 9, my + 8, 4, 0, Math.PI * 2);
  ctx.fill();

  // Far treeline, scrolling slowly.
  ctx.fillStyle = 'rgba(8, 20, 28, 0.55)';
  ctx.beginPath();
  ctx.moveTo(0, WATER_Y);
  for (let x = 0; x <= W + 20; x += 20) {
    const k = x + (travel * 0.15) % 40;
    const y = WATER_Y - 46 - Math.abs(Math.sin(k / 37)) * 30 - Math.abs(Math.sin(k / 13)) * 10;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, WATER_Y);
  ctx.closePath();
  ctx.fill();
}

export function drawWater(ctx: CanvasRenderingContext2D, w: World, travel: number) {
  const g = ctx.createLinearGradient(0, WATER_Y, 0, H);
  g.addColorStop(0, '#16465a');
  g.addColorStop(1, '#071a26');
  ctx.fillStyle = g;
  ctx.fillRect(0, WATER_Y, W, H - WATER_Y);
  // Moon reflection.
  ctx.fillStyle = 'rgba(255, 245, 210, 0.18)';
  for (let i = 0; i < 5; i++) {
    const wobble = Math.sin(w.t * 2 + i) * 6;
    ctx.fillRect(282 + wobble - i * 2, WATER_Y + 8 + i * 12, 36 + i * 4, 3);
  }
  // Ripples.
  ctx.strokeStyle = 'rgba(160, 230, 235, 0.22)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 9; i++) {
    const x = ((i * 61 - travel * 0.9) % (W + 60) + W + 60) % (W + 60) - 30;
    const y = WATER_Y + 14 + (i % 4) * 14;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 12, y - 3, x + 24, y);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(190, 240, 240, 0.35)';
  ctx.fillRect(0, WATER_Y - 1, W, 2);
}

export function drawVines(ctx: CanvasRenderingContext2D, x: number, bottom: number, t: number) {
  // Dark trunk band at the top, then hanging strands with leaves.
  ctx.fillStyle = '#123321';
  ctx.fillRect(x - 6, -4, GATE_W + 12, 16);
  for (let i = 0; i < 5; i++) {
    const sx = x + 5 + i * ((GATE_W - 10) / 4);
    const sway = Math.sin(t * 1.5 + i) * 2;
    ctx.strokeStyle = i % 2 ? '#2f7a43' : '#3f9a52';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.quadraticCurveTo(sx + sway * 2, bottom / 2, sx + sway, bottom - (i % 2) * 8);
    ctx.stroke();
    for (let ly = 18 + (i % 3) * 7; ly < bottom - 6; ly += 22) {
      ctx.fillStyle = i % 2 ? '#56b866' : '#6fcf72';
      ctx.beginPath();
      ctx.ellipse(sx + sway * (ly / bottom) + (ly % 44 === 0 ? 4 : -4), ly, 5, 3, ly % 44 === 0 ? 0.6 : -0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Drooping leaf tips mark the edge of the opening.
  ctx.fillStyle = '#8fe08a';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(x + 8 + i * 13, bottom - 3 - (i % 2) * 6, 4, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawReeds(ctx: CanvasRenderingContext2D, x: number, top: number, t: number) {
  const heights = [0, 14, 4, 20, 8];
  for (let i = 0; i < 5; i++) {
    const sx = x + 4 + i * ((GATE_W - 8) / 4);
    const tipY = top + heights[i];
    const sway = Math.sin(t * 1.3 + i * 0.8) * 2;
    ctx.strokeStyle = i % 2 ? '#3d7f3a' : '#4f9a45';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sx, WATER_Y + 4);
    ctx.quadraticCurveTo(sx, (tipY + WATER_Y) / 2, sx + sway, tipY + 4);
    ctx.stroke();
    // Cattail heads on some stalks.
    if (i % 2 === 0) {
      ctx.fillStyle = '#7a4a2a';
      ctx.beginPath();
      ctx.roundRect(sx + sway - 4, tipY + 4, 8, 22, 4);
      ctx.fill();
      ctx.strokeStyle = '#4f9a45';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + sway, tipY + 4);
      ctx.lineTo(sx + sway, tipY - 4);
      ctx.stroke();
    } else {
      // Long leaf.
      ctx.fillStyle = '#5fae4a';
      ctx.beginPath();
      ctx.ellipse(sx + sway + 5, tipY + 26, 3, 18, 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function drawPad(ctx: CanvasRenderingContext2D, x: number, w: number, sunk: number | null, id: number, t: number) {
  const depth = sunk === null ? 0 : Math.min(1, sunk / 1.2);
  ctx.globalAlpha = 1 - depth * 0.8;
  const y = WATER_Y + 2 + depth * 8 + Math.sin(t * 2 + id) * 1.2;
  ctx.fillStyle = '#2f8f4e';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y, w / 2, 7, 0, 0.25, Math.PI * 2 - 0.25);
  ctx.lineTo(x + w / 2, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4fbf6a';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y - 1, w / 2 - 5, 4, 0, 0.3, Math.PI * 2 - 0.3);
  ctx.lineTo(x + w / 2, y - 1);
  ctx.closePath();
  ctx.fill();
  if (id % 3 === 0) {
    // A little lotus flower.
    ctx.fillStyle = '#ff9cc2';
    for (let p = 0; p < 5; p++) {
      ctx.beginPath();
      ctx.ellipse(x + w * 0.7 + Math.cos(p * 1.25) * 4, y - 5 + Math.sin(p * 1.25) * 2, 4, 2.5, p * 1.25, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffe28a';
    ctx.beginPath();
    ctx.arc(x + w * 0.7, y - 5, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function glowDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fffbe0';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function drawDragonfly(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const flutter = Math.sin(t * 40) * 3;
  ctx.fillStyle = 'rgba(190, 240, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(x + 14, y + 4 - flutter, 10, 3, -0.4, 0, Math.PI * 2);
  ctx.ellipse(x + 14, y + 12 + flutter, 10, 3, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8334f';
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 7, 28, 4, 2);
  ctx.fill();
  ctx.fillStyle = '#ff7a8f';
  ctx.beginPath();
  ctx.arc(x + 4, y + 9, 4, 0, Math.PI * 2);
  ctx.fill();
}

export function drawFrog(ctx: CanvasRenderingContext2D, skin: FrogSkin, x: number, y: number, vy: number, sinceHop: number, t: number, shield = false) {
  const tilt = Math.max(-0.4, Math.min(0.7, vy / 700));
  const stretch = sinceHop < 0.22;
  ctx.save();
  ctx.translate(x + FROG_W / 2, y + FROG_H / 2);
  ctx.rotate(tilt);

  // Back legs: stretched out just after a hop, tucked in otherwise.
  ctx.fillStyle = skin.spots;
  if (stretch) {
    ctx.beginPath();
    ctx.ellipse(-20, 8, 11, 4, 0.5, 0, Math.PI * 2);
    ctx.ellipse(-16, 12, 10, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(-11, 8, 8, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Body.
  ctx.fillStyle = skin.body;
  ctx.beginPath();
  ctx.ellipse(0, 2, 17, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = skin.belly;
  ctx.beginPath();
  ctx.ellipse(3, 7, 11, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Spots.
  ctx.fillStyle = skin.spots;
  ctx.beginPath();
  ctx.arc(-7, -3, 2.5, 0, Math.PI * 2);
  ctx.arc(-1, -6, 1.8, 0, Math.PI * 2);
  ctx.arc(-11, 3, 1.6, 0, Math.PI * 2);
  ctx.fill();
  // Front leg.
  ctx.fillStyle = skin.body;
  ctx.beginPath();
  ctx.ellipse(10, 11, 5, 3, stretch ? -0.6 : 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Eyes on top, blinking now and then.
  const blink = Math.sin(t * 0.9) > 0.985;
  for (const ex of [4, 12]) {
    ctx.fillStyle = skin.body;
    ctx.beginPath();
    ctx.arc(ex, -9, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex + 1, -10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = skin.eye;
    if (blink) ctx.fillRect(ex - 2, -10.5, 6, 1.5);
    else {
      ctx.beginPath();
      ctx.arc(ex + 2, -10, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Smile.
  ctx.strokeStyle = skin.spots;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(11, 1, 5, 0.2, 1.2);
  ctx.stroke();
  // Cheek.
  ctx.fillStyle = 'rgba(255, 140, 170, 0.45)';
  ctx.beginPath();
  ctx.arc(8, 3, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (shield) {
    ctx.strokeStyle = `rgba(255, 220, 110, ${0.55 + Math.sin(t * 6) * 0.2})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x + FROG_W / 2, y + FROG_H / 2, 26, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** How far the pond has scrolled, for parallax. */
export function travelOf(w: World) {
  return w.distance;
}

export function render(ctx: CanvasRenderingContext2D, w: World, skin: FrogSkin) {
  const travel = travelOf(w);
  ctx.clearRect(0, 0, W, H);
  drawSky(ctx, w, travel);

  for (const g of w.gates) {
    drawVines(ctx, g.x, g.top, w.t);
    drawReeds(ctx, g.x, g.top + g.gap, w.t);
  }

  drawWater(ctx, w, travel);
  for (const p of w.pads) drawPad(ctx, p.x, p.w, p.sunk, p.id, w.t);

  for (const f of w.flies) {
    const y = flyY(f, w.t);
    if (f.kind === 'glowbug') {
      glowDot(ctx, f.x + 4, y, 5, 'rgba(255, 200, 60, 0.9)', 0.9);
      ctx.strokeStyle = 'rgba(255, 220, 110, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(f.x + 4, y, 10 + Math.sin(w.t * 5) * 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      glowDot(ctx, f.x + 4, y, 3, 'rgba(210, 255, 90, 0.85)', 0.55 + 0.45 * Math.sin(w.t * 6 + f.phase));
    }
  }
  for (const d of w.dragonflies) drawDragonfly(ctx, d.x, dragonflyY(d, w.t), w.t);

  const flicker = w.invulnerable > 0 && Math.floor(w.t * 16) % 2 === 0;
  if (!flicker) drawFrog(ctx, skin, FROG_X, w.frog.y, w.status === 'ready' ? 0 : w.frog.vy, w.frog.sinceHop, w.t, w.shield);

  // Splash rings when the run ends in the water.
  if (w.status === 'over' && w.cause === 'splash') {
    for (let i = 0; i < 3; i++) {
      const r = (w.overFor * 60 + i * 12) % 60;
      ctx.strokeStyle = `rgba(200, 245, 255, ${Math.max(0, 0.7 - r / 60)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(FROG_X + FROG_W / 2, WATER_Y + 2, r, r / 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
