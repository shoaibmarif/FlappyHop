import {
  Bird,
  Pipe,
  ThemeId,
  SkinDefinition,
  THEME_CONFIGS,
  GAME_CONSTANTS
} from '@flappy-bird/core';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export class GameRenderer {
  private groundOffset = 0;
  private clouds = [
    { x: 30, y: 80, scale: 0.8, speed: 12 },
    { x: 220, y: 130, scale: 1.1, speed: 18 },
    { x: 380, y: 70, scale: 0.9, speed: 15 }
  ];
  private particles: Particle[] = [];

  public spawnScoreParticles(x: number, y: number, color = '#facc15') {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5);
      const speed = 60 + Math.random() * 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3
      });
    }
  }

  public spawnFlapFeathers(x: number, y: number, color = '#ffffff') {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x - 10,
        y: y + 10,
        vx: -30 - Math.random() * 40,
        vy: 10 + Math.random() * 30,
        size: 2 + Math.random() * 2,
        color,
        alpha: 0.8,
        life: 0,
        maxLife: 0.4
      });
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bird: Bird,
    pipes: Pipe[],
    themeId: ThemeId,
    skin: SkinDefinition,
    dt: number,
    speed: number,
    isMoving: boolean
  ) {
    const theme = THEME_CONFIGS[themeId] || THEME_CONFIGS.day;
    const groundHeight = GAME_CONSTANTS.GROUND_HEIGHT;
    const playableFloor = height - groundHeight;

    // Update ground & cloud positions when running
    if (isMoving) {
      this.groundOffset = (this.groundOffset + speed * dt) % 24;
      for (const cloud of this.clouds) {
        cloud.x -= cloud.speed * dt;
        if (cloud.x < -120) {
          cloud.x = width + 50;
        }
      }
    }

    // 1. Draw Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, playableFloor);
    skyGrad.addColorStop(0, theme.skyTop);
    skyGrad.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Stars in space/night themes
    if (themeId === 'space' || themeId === 'night') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 35; i++) {
        const sx = ((i * 73 + 19) % width);
        const sy = ((i * 47 + 13) % (playableFloor - 60));
        const r = (i % 3 === 0) ? 1.5 : 1.0;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Draw Clouds
    ctx.fillStyle = theme.cloudColor;
    for (const cloud of this.clouds) {
      this.drawCloud(ctx, cloud.x, cloud.y, cloud.scale);
    }

    // 3. Draw Pipes
    for (const pipe of pipes) {
      this.drawPipe(ctx, pipe, theme.pipeColor, theme.pipeBorder);
    }

    // 4. Draw Particles
    this.updateAndDrawParticles(ctx, dt);

    // 5. Draw Bird
    this.drawBird(ctx, bird, skin);

    // 6. Draw Ground
    this.drawGround(ctx, width, height, playableFloor, groundHeight, theme.groundTop, theme.groundBase);
  }

  private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(20, -10, 25, 0, Math.PI * 2);
    ctx.arc(45, -5, 20, 0, Math.PI * 2);
    ctx.arc(60, 5, 18, 0, Math.PI * 2);
    ctx.arc(25, 10, 22, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawPipe(ctx: CanvasRenderingContext2D, pipe: Pipe, bodyColor: string, borderColor: string) {
    const capHeight = 24;
    const capOverhang = 5;
    const capWidth = pipe.width + capOverhang * 2;
    const capX = pipe.x - capOverhang;

    ctx.save();

    // Upper Pipe Body
    if (pipe.topHeight > capHeight) {
      const topBodyHeight = pipe.topHeight - capHeight;
      const topBodyGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
      topBodyGrad.addColorStop(0, borderColor);
      topBodyGrad.addColorStop(0.2, bodyColor);
      topBodyGrad.addColorStop(0.5, '#ffffff33');
      topBodyGrad.addColorStop(0.8, bodyColor);
      topBodyGrad.addColorStop(1, borderColor);

      ctx.fillStyle = topBodyGrad;
      ctx.fillRect(pipe.x, 0, pipe.width, topBodyHeight);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, pipe.width, topBodyHeight);
    }

    // Upper Pipe Cap (at bottom of top pipe)
    const topCapY = pipe.topHeight - capHeight;
    ctx.fillStyle = bodyColor;
    ctx.fillRect(capX, topCapY, capWidth, capHeight);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(capX, topCapY, capWidth, capHeight);

    // Bottom Pipe Cap (at top of bottom pipe)
    const bottomCapY = pipe.bottomY;
    ctx.fillStyle = bodyColor;
    ctx.fillRect(capX, bottomCapY, capWidth, capHeight);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(capX, bottomCapY, capWidth, capHeight);

    // Bottom Pipe Body
    const bottomBodyY = pipe.bottomY + capHeight;
    const bottomBodyHeight = pipe.bottomHeight - capHeight;
    if (bottomBodyHeight > 0) {
      const btmBodyGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
      btmBodyGrad.addColorStop(0, borderColor);
      btmBodyGrad.addColorStop(0.2, bodyColor);
      btmBodyGrad.addColorStop(0.5, '#ffffff33');
      btmBodyGrad.addColorStop(0.8, bodyColor);
      btmBodyGrad.addColorStop(1, borderColor);

      ctx.fillStyle = btmBodyGrad;
      ctx.fillRect(pipe.x, bottomBodyY, pipe.width, bottomBodyHeight);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, bottomBodyY, pipe.width, bottomBodyHeight);
    }

    ctx.restore();
  }

  private drawBird(ctx: CanvasRenderingContext2D, bird: Bird, skin: SkinDefinition) {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotation);

    const halfW = bird.width / 2;
    const halfH = bird.height / 2;

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, halfW, halfH, 0, 0, Math.PI * 2);
    const bodyGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, halfW);
    bodyGrad.addColorStop(0, skin.primaryColor);
    bodyGrad.addColorStop(1, skin.secondaryColor);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Eye
    const eyeX = halfW * 0.45;
    const eyeY = -halfH * 0.35;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
    ctx.fillStyle = skin.eyeColor;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pupil & Glint
    ctx.beginPath();
    ctx.arc(eyeX + 1.2, eyeY, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#090d16';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeX + 2, eyeY - 1, 0.9, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Beak
    ctx.beginPath();
    ctx.moveTo(halfW * 0.7, -2);
    ctx.lineTo(halfW + 9, 3);
    ctx.lineTo(halfW * 0.65, 8);
    ctx.closePath();
    ctx.fillStyle = skin.beakColor;
    ctx.fill();
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wing based on flapFrame (0: up, 1: neutral, 2: down)
    const wingY = (bird.flapFrame === 0 ? -6 : bird.flapFrame === 2 ? 5 : 0);
    ctx.beginPath();
    ctx.ellipse(-halfW * 0.35, wingY, halfW * 0.55, halfH * 0.38, (bird.flapFrame - 1) * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = skin.wingColor;
    ctx.fill();
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  private drawGround(
    ctx: CanvasRenderingContext2D,
    width: number,
    _height: number,
    floorY: number,
    groundH: number,
    topColor: string,
    baseColor: string
  ) {
    ctx.save();
    // Grass/Trim top
    const trimHeight = 16;
    ctx.fillStyle = topColor;
    ctx.fillRect(0, floorY, width, trimHeight);

    // Underground soil
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, floorY + trimHeight, width, groundH - trimHeight);

    // Diagonal grass stripes
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    const stripeWidth = 14;
    for (let x = -stripeWidth * 2 - this.groundOffset; x < width + stripeWidth * 2; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x + stripeWidth, floorY);
      ctx.lineTo(x + stripeWidth - 8, floorY + trimHeight);
      ctx.lineTo(x - 8, floorY + trimHeight);
      ctx.closePath();
      ctx.fill();
    }

    // Border line between playfield and ground
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(width, floorY);
    ctx.stroke();

    ctx.restore();
  }

  private updateAndDrawParticles(ctx: CanvasRenderingContext2D, dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // slight gravity on particles
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
