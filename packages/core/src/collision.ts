import { Bird, Pipe } from './types';
import { GAME_CONSTANTS } from './constants';

export interface CollisionResult {
  hasCollided: boolean;
  type?: 'ground' | 'ceiling' | 'pipe';
}

export function checkCollision(
  bird: Bird,
  pipes: Pipe[],
  canvasHeight: number = GAME_CONSTANTS.CANVAS_HEIGHT,
  groundHeight: number = GAME_CONSTANTS.GROUND_HEIGHT
): CollisionResult {
  const playableFloor = canvasHeight - groundHeight;

  // 1. Ceiling collision (only if bird somehow penetrates strictly above top boundary)
  if (bird.y < GAME_CONSTANTS.CEILING_Y) {
    return { hasCollided: true, type: 'ceiling' };
  }

  // 2. Ground collision (with bird bottom)
  if (bird.y + bird.height >= playableFloor) {
    return { hasCollided: true, type: 'ground' };
  }

  // 3. Pipe collision with player-friendly hitbox inset (padding)
  const paddingX = 4;
  const paddingY = 3;

  const birdLeft = bird.x + paddingX;
  const birdRight = bird.x + bird.width - paddingX;
  const birdTop = bird.y + paddingY;
  const birdBottom = bird.y + bird.height - paddingY;

  for (const pipe of pipes) {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + pipe.width;

    // Check horizontal overlap
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      // Check top pipe collision
      if (birdTop < pipe.topHeight) {
        return { hasCollided: true, type: 'pipe' };
      }

      // Check bottom pipe collision
      if (birdBottom > pipe.bottomY) {
        return { hasCollided: true, type: 'pipe' };
      }
    }
  }

  return { hasCollided: false };
}
