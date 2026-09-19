import { describe, it, expect } from 'vitest';
import {
  createInitialBird,
  updateBirdPhysics,
  updateIdleBird,
  checkCollision,
  createPipe,
  updatePipes,
  getDifficulty,
  hashDateString,
  createSeededRandom,
  generateDailyChallenge,
  evaluateAchievements,
  recordGameResult,
  createInitialStats,
  GAME_CONSTANTS,
  Pipe
} from '../src';

describe('Flappy Bird Core Engine', () => {
  describe('Bird Physics', () => {
    it('creates a valid initial bird', () => {
      const bird = createInitialBird();
      expect(bird.x).toBe(GAME_CONSTANTS.BIRD_X);
      expect(bird.y).toBe(GAME_CONSTANTS.BIRD_START_Y);
      expect(bird.vy).toBe(0);
      expect(bird.width).toBe(GAME_CONSTANTS.BIRD_WIDTH);
      expect(bird.height).toBe(GAME_CONSTANTS.BIRD_HEIGHT);
    });

    it('accelerates downward under gravity when not flapping', () => {
      const bird = createInitialBird();
      const updated = updateBirdPhysics(bird, 0.016, false);
      expect(updated.vy).toBeGreaterThan(0);
      expect(updated.y).toBeGreaterThan(bird.y);
    });

    it('applies instantaneous upward velocity when flap is triggered', () => {
      const fallingBird = { ...createInitialBird(), vy: 300 };
      const flapped = updateBirdPhysics(fallingBird, 0.016, true);
      expect(flapped.vy).toBe(GAME_CONSTANTS.FLAP_VELOCITY);
      expect(flapped.vy).toBeLessThan(0);
    });

    it('caps falling speed at terminal velocity', () => {
      const fastBird = { ...createInitialBird(), vy: 800 };
      const clamped = updateBirdPhysics(fastBird, 0.1, false);
      expect(clamped.vy).toBeLessThanOrEqual(GAME_CONSTANTS.TERMINAL_VELOCITY);
    });

    it('smoothly floats during idle mode', () => {
      const bird = createInitialBird();
      const idle1 = updateIdleBird(bird, 0);
      const idle2 = updateIdleBird(bird, 0.5);
      expect(idle1.y).not.toBeNaN();
      expect(idle2.y).not.toBeNaN();
    });
  });

  describe('Collision Detection', () => {
    const canvasHeight = 600;
    const groundHeight = 80;
    const floorY = canvasHeight - groundHeight;

    it('detects ground collision when bird reaches floor', () => {
      const bird = { ...createInitialBird(), y: floorY - 10 }; // bottom is floorY - 10 + height (26) = floorY + 16 > floorY
      const res = checkCollision(bird, [], canvasHeight, groundHeight);
      expect(res.hasCollided).toBe(true);
      expect(res.type).toBe('ground');
    });

    it('detects ceiling collision when bird flies too high', () => {
      const bird = { ...createInitialBird(), y: -2 };
      const res = checkCollision(bird, [], canvasHeight, groundHeight);
      expect(res.hasCollided).toBe(true);
      expect(res.type).toBe('ceiling');
    });

    it('detects pipe collision on top pipe', () => {
      const bird = { ...createInitialBird(), x: 100, y: 50 };
      const pipes: Pipe[] = [
        {
          id: 1,
          x: 95,
          topHeight: 120, // bird y is 50, within 0-120
          bottomY: 260,
          bottomHeight: 260,
          gap: 140,
          width: 58,
          passed: false
        }
      ];
      const res = checkCollision(bird, pipes, canvasHeight, groundHeight);
      expect(res.hasCollided).toBe(true);
      expect(res.type).toBe('pipe');
    });

    it('detects pipe collision on bottom pipe', () => {
      const bird = { ...createInitialBird(), x: 100, y: 350 };
      const pipes: Pipe[] = [
        {
          id: 1,
          x: 95,
          topHeight: 100,
          bottomY: 240,
          bottomHeight: 280, // bird y is 350, bottom is 376 > 240
          gap: 140,
          width: 58,
          passed: false
        }
      ];
      const res = checkCollision(bird, pipes, canvasHeight, groundHeight);
      expect(res.hasCollided).toBe(true);
      expect(res.type).toBe('pipe');
    });

    it('allows clean passage through pipe gap', () => {
      const bird = { ...createInitialBird(), x: 100, y: 180 };
      const pipes: Pipe[] = [
        {
          id: 1,
          x: 95,
          topHeight: 120,
          bottomY: 260, // bird is between 180 and 206, gap is 120 - 260
          bottomHeight: 260,
          gap: 140,
          width: 58,
          passed: false
        }
      ];
      const res = checkCollision(bird, pipes, canvasHeight, groundHeight);
      expect(res.hasCollided).toBe(false);
    });
  });

  describe('Pipe Generation & Progression', () => {
    it('scales speed and reduces gap as score increases', () => {
      const easy = getDifficulty(0);
      const hard = getDifficulty(60);
      expect(hard.speed).toBeGreaterThan(easy.speed);
      expect(hard.gap).toBeLessThan(easy.gap);
    });

    it('creates a pipe within playable screen bounds', () => {
      const pipe = createPipe(1, 400, 5, 600, 80, () => 0.5);
      expect(pipe.topHeight).toBeGreaterThanOrEqual(GAME_CONSTANTS.MIN_PIPE_TOP_HEIGHT);
      expect(pipe.bottomY).toBe(pipe.topHeight + pipe.gap);
      expect(pipe.bottomY + pipe.bottomHeight).toBe(600 - 80);
    });

    it('moves pipes leftward and increments score upon passing bird', () => {
      const birdX = 100;
      const initialPipes: Pipe[] = [
        {
          id: 1,
          x: 105,
          topHeight: 100,
          bottomY: 250,
          bottomHeight: 270,
          gap: 150,
          width: 58,
          passed: false
        }
      ];

      // Move pipe sufficiently left so bird clears its center:
      // dt = 0.05, speed = 800 => moved = 40 => newX = 65, center = 65 + 29 = 94. birdX(100) > 94
      const result = updatePipes(initialPipes, 0.05, 800, birdX, 400, 600, 80, 0, 2);
      expect(result.pipes[0].x).toBeLessThan(105);
      expect(result.pipes[0].passed).toBe(true);
      expect(result.scoredPoints).toBe(1);
    });
  });

  describe('Deterministic Daily Challenge', () => {
    it('produces identical seeds for the same date', () => {
      const dateStr = '2026-09-19';
      const c1 = generateDailyChallenge(dateStr);
      const c2 = generateDailyChallenge(dateStr);
      expect(c1.seed).toBe(c2.seed);
      expect(c1.targetScore).toBe(c2.targetScore);
    });

    it('produces deterministic pseudo-random sequences', () => {
      const seed = hashDateString('2026-09-19');
      const rng1 = createSeededRandom(seed);
      const rng2 = createSeededRandom(seed);

      const seq1 = [rng1(), rng1(), rng1()];
      const seq2 = [rng2(), rng2(), rng2()];
      expect(seq1).toEqual(seq2);
    });
  });

  describe('Achievements & Stats', () => {
    it('evaluates score milestones correctly', () => {
      const stats = createInitialStats();
      const unlocked = new Set<string>();
      const newlyUnlocked = evaluateAchievements(unlocked, stats, 10, false);
      expect(newlyUnlocked.some(a => a.id === 'first_flight')).toBe(true);
    });

    it('records game stats and updates rolling averages', () => {
      const stats = createInitialStats();
      const afterGame1 = recordGameResult(stats, 10, 10, 15);
      expect(afterGame1.totalGames).toBe(1);
      expect(afterGame1.bestScore).toBe(10);
      expect(afterGame1.averageScore).toBe(10);

      const afterGame2 = recordGameResult(afterGame1, 20, 20, 25);
      expect(afterGame2.totalGames).toBe(2);
      expect(afterGame2.bestScore).toBe(20);
      expect(afterGame2.averageScore).toBe(15);
      expect(afterGame2.totalPipesPassed).toBe(30);
    });
  });
});
