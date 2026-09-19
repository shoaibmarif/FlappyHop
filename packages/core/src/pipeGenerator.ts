import { Pipe } from './types';
import { GAME_CONSTANTS } from './constants';

export function getDifficulty(score: number) {
  const levels = GAME_CONSTANTS.DIFFICULTY;
  let currentLevel: (typeof levels)[number] = levels[0];

  for (const level of levels) {
    if (score >= level.minScore) {
      currentLevel = level;
    }
  }

  return currentLevel;
}

export function createPipe(
  id: number,
  startX: number,
  score: number,
  canvasHeight: number = GAME_CONSTANTS.CANVAS_HEIGHT,
  groundHeight: number = GAME_CONSTANTS.GROUND_HEIGHT,
  randomFn: () => number = Math.random
): Pipe {
  const { gap } = getDifficulty(score);
  const playableFloor = canvasHeight - groundHeight;
  const minTopHeight = GAME_CONSTANTS.MIN_PIPE_TOP_HEIGHT;
  const maxTopHeight = playableFloor - gap - minTopHeight;

  // Generate top pipe height within safe vertical bounds
  const topHeight = Math.floor(minTopHeight + randomFn() * (maxTopHeight - minTopHeight));
  const bottomY = topHeight + gap;
  const bottomHeight = playableFloor - bottomY;

  return {
    id,
    x: startX,
    topHeight,
    bottomY,
    bottomHeight,
    gap,
    width: GAME_CONSTANTS.PIPE_WIDTH,
    passed: false
  };
}

export interface PipeUpdateResult {
  pipes: Pipe[];
  scoredPoints: number;
}

export function updatePipes(
  pipes: Pipe[],
  dt: number,
  speed: number,
  birdX: number,
  canvasWidth: number = GAME_CONSTANTS.CANVAS_WIDTH,
  canvasHeight: number = GAME_CONSTANTS.CANVAS_HEIGHT,
  groundHeight: number = GAME_CONSTANTS.GROUND_HEIGHT,
  currentScore = 0,
  nextPipeId = 1,
  randomFn: () => number = Math.random
): PipeUpdateResult & { nextPipeId: number } {
  const clampedDt = Math.min(dt, 0.05);
  const distanceMoved = speed * clampedDt;

  let scoredPoints = 0;
  const updatedPipes: Pipe[] = [];

  for (const pipe of pipes) {
    const newX = pipe.x - distanceMoved;

    // Filter out pipes that have left the screen
    if (newX + pipe.width < 0) {
      continue;
    }

    let passed = pipe.passed;
    // Check if bird has safely cleared the pipe
    if (!passed && birdX > newX + pipe.width / 2) {
      passed = true;
      scoredPoints += 1;
    }

    updatedPipes.push({
      ...pipe,
      x: newX,
      passed
    });
  }

  // Check if we need to spawn a new pipe
  let updatedNextId = nextPipeId;
  const lastPipe = updatedPipes[updatedPipes.length - 1];

  if (!lastPipe || lastPipe.x <= canvasWidth - GAME_CONSTANTS.PIPE_SPAWN_DISTANCE) {
    const spawnX = lastPipe
      ? lastPipe.x + GAME_CONSTANTS.PIPE_SPAWN_DISTANCE
      : canvasWidth + 100;

    const newPipe = createPipe(
      updatedNextId++,
      spawnX,
      currentScore + scoredPoints,
      canvasHeight,
      groundHeight,
      randomFn
    );
    updatedPipes.push(newPipe);
  }

  return {
    pipes: updatedPipes,
    scoredPoints,
    nextPipeId: updatedNextId
  };
}
