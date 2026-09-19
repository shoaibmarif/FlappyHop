import { Bird } from './types';
import { GAME_CONSTANTS } from './constants';

export function createInitialBird(): Bird {
  return {
    x: GAME_CONSTANTS.BIRD_X,
    y: GAME_CONSTANTS.BIRD_START_Y,
    vy: 0,
    width: GAME_CONSTANTS.BIRD_WIDTH,
    height: GAME_CONSTANTS.BIRD_HEIGHT,
    rotation: 0,
    flapFrame: 1,
    flapTimer: 0
  };
}

export function updateBirdPhysics(
  bird: Bird,
  dt: number,
  isFlapping: boolean
): Bird {
  // Clamp dt to avoid physics jumps on background tab resume
  const clampedDt = Math.min(dt, 0.05);

  let newVy = bird.vy;
  if (isFlapping) {
    newVy = GAME_CONSTANTS.FLAP_VELOCITY;
  } else {
    newVy = Math.min(
      bird.vy + GAME_CONSTANTS.GRAVITY * clampedDt,
      GAME_CONSTANTS.TERMINAL_VELOCITY
    );
  }

  let newY = bird.y + newVy * clampedDt;
  // Solid ceiling roof: prevent bird from flying outside the top of the screen
  if (newY < 0) {
    newY = 0;
    if (newVy < 0) {
      newVy = 0; // stop upward velocity at ceiling
    }
  }

  // Rotation target calculation based on vertical speed
  // Upward velocity -> tilt up (up to -25 deg / -0.44 rad)
  // Downward velocity -> dive down (up to 75 deg / 1.3 rad)
  let targetRotation = 0;
  if (newVy < 0) {
    targetRotation = -0.45;
  } else {
    // Dive angle accelerates as bird drops faster
    targetRotation = Math.min(1.3, (newVy / GAME_CONSTANTS.TERMINAL_VELOCITY) * 1.5);
  }

  // Smooth rotation interpolation
  const rotation =
    bird.rotation + (targetRotation - bird.rotation) * Math.min(1, clampedDt * GAME_CONSTANTS.ROTATION_LERP_FACTOR);

  // Wing flapping animation
  let flapTimer = bird.flapTimer + clampedDt;
  let flapFrame = bird.flapFrame;
  const flapSpeed = newVy < 0 ? 0.08 : 0.15;

  if (flapTimer >= flapSpeed) {
    flapTimer = 0;
    flapFrame = (bird.flapFrame + 1) % 3;
  }

  return {
    ...bird,
    y: newY,
    vy: newVy,
    rotation,
    flapFrame,
    flapTimer
  };
}

export function updateIdleBird(bird: Bird, elapsedTime: number): Bird {
  // Gentle hovering sinusoidal motion on the start screen
  const hoverOffset = Math.sin(elapsedTime * 4) * 0.75;
  const flapFrame = Math.floor((elapsedTime * 6) % 3);

  return {
    ...bird,
    y: GAME_CONSTANTS.BIRD_START_Y + hoverOffset,
    vy: 0,
    rotation: 0,
    flapFrame,
    flapTimer: 0
  };
}

