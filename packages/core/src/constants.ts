import { Achievement, SkinDefinition, ThemeId } from './types';

export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,
  GROUND_HEIGHT: 80,
  CEILING_Y: 0,
  
  // Bird physics
  BIRD_X: 90,
  BIRD_START_Y: 260,
  BIRD_WIDTH: 36,
  BIRD_HEIGHT: 26,
  GRAVITY: 980, // px / s^2
  FLAP_VELOCITY: -340, // px / s
  TERMINAL_VELOCITY: 620, // px / s
  ROTATION_LERP_FACTOR: 8.0,
  
  // Pipes
  PIPE_WIDTH: 58,
  MIN_PIPE_TOP_HEIGHT: 60,
  PIPE_SPAWN_DISTANCE: 220, // distance between pipes in px
  
  // Difficulty levels
  DIFFICULTY: [
    { minScore: 0, speed: 155, gap: 145 },
    { minScore: 10, speed: 175, gap: 135 },
    { minScore: 25, speed: 195, gap: 125 },
    { minScore: 50, speed: 220, gap: 115 },
    { minScore: 100, speed: 240, gap: 110 }
  ]
} as const;

export const BIRD_SKINS: Record<string, SkinDefinition> = {
  classic: {
    id: 'classic',
    name: 'Classic Flyer',
    description: 'The legendary golden arcade bird.',
    requiredScore: 0,
    primaryColor: '#facc15',
    secondaryColor: '#eab308',
    beakColor: '#f97316',
    eyeColor: '#ffffff',
    wingColor: '#ffffff'
  },
  eagle: {
    id: 'eagle',
    name: 'Thunder Eagle',
    description: 'Fierce and razor-sharp raptor.',
    requiredScore: 0,
    primaryColor: '#854d0e',
    secondaryColor: '#713f12',
    beakColor: '#f59e0b',
    eyeColor: '#fef08a',
    wingColor: '#fef08a'
  },
  yellow: {
    id: 'yellow',
    name: 'Neon Canary',
    description: 'Vibrant electric plumage.',
    requiredScore: 0,
    primaryColor: '#a3e635',
    secondaryColor: '#65a30d',
    beakColor: '#ea580c',
    eyeColor: '#ffffff',
    wingColor: '#d9f99d'
  },
  penguin: {
    id: 'penguin',
    name: 'Sky Penguin',
    description: 'Defying physics with style.',
    requiredScore: 0,
    primaryColor: '#0f172a',
    secondaryColor: '#1e293b',
    beakColor: '#fb923c',
    eyeColor: '#ffffff',
    wingColor: '#f8fafc'
  },
  rocket: {
    id: 'rocket',
    name: 'Astro Rocket',
    description: 'Powered by pure arcade adrenaline.',
    requiredScore: 0,
    primaryColor: '#ef4444',
    secondaryColor: '#b91c1c',
    beakColor: '#93c5fd',
    eyeColor: '#60a5fa',
    wingColor: '#f59e0b'
  },
  pixel: {
    id: 'pixel',
    name: 'Cyber 8-Bit',
    description: 'Retro phosphor scanline veteran.',
    requiredScore: 0,
    primaryColor: '#06b6d4',
    secondaryColor: '#0891b2',
    beakColor: '#ec4899',
    eyeColor: '#a855f7',
    wingColor: '#f43f5e'
  }
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_flight',
    title: 'First Flight',
    description: 'Score 10 points in a single run.',
    icon: '🐣',
    requiredScore: 10
  },
  {
    id: 'getting_good',
    title: 'Getting Good',
    description: 'Score 25 points in a single run.',
    icon: '🔥',
    requiredScore: 25
  },
  {
    id: 'pro_pilot',
    title: 'Pro Pilot',
    description: 'Score 50 points in a single run.',
    icon: '⚡',
    requiredScore: 50
  },
  {
    id: 'master_pilot',
    title: 'Master Pilot',
    description: 'Score 100 points in a single run.',
    icon: '👑',
    requiredScore: 100
  },
  {
    id: 'daily_champion',
    title: 'Daily Conqueror',
    description: 'Complete a Daily Challenge.',
    icon: '🎯',
    isDaily: true
  },
  {
    id: 'centurion',
    title: 'Pipe Buster',
    description: 'Pass 200 total pipes across all games.',
    icon: '🛠️',
    requiredPipes: 200
  },
  {
    id: 'devoted',
    title: 'Persistent Aviator',
    description: 'Play 25 complete games.',
    icon: '🎮',
    requiredGames: 25
  }
];

export const THEME_CONFIGS: Record<ThemeId, {
  name: string;
  skyTop: string;
  skyBottom: string;
  cloudColor: string;
  pipeColor: string;
  pipeBorder: string;
  groundTop: string;
  groundBase: string;
}> = {
  day: {
    name: 'Daylight Sky',
    skyTop: '#38bdf8',
    skyBottom: '#bae6fd',
    cloudColor: 'rgba(255, 255, 255, 0.75)',
    pipeColor: '#22c55e',
    pipeBorder: '#15803d',
    groundTop: '#84cc16',
    groundBase: '#a16207'
  },
  sunset: {
    name: 'Golden Sunset',
    skyTop: '#f97316',
    skyBottom: '#fde047',
    cloudColor: 'rgba(254, 215, 170, 0.6)',
    pipeColor: '#ea580c',
    pipeBorder: '#9a3412',
    groundTop: '#b45309',
    groundBase: '#78350f'
  },
  night: {
    name: 'Midnight Blue',
    skyTop: '#0f172a',
    skyBottom: '#1e293b',
    cloudColor: 'rgba(71, 85, 105, 0.4)',
    pipeColor: '#0284c7',
    pipeBorder: '#0369a1',
    groundTop: '#334155',
    groundBase: '#1e293b'
  },
  neon: {
    name: 'Cyber Neon',
    skyTop: '#180033',
    skyBottom: '#3b0764',
    cloudColor: 'rgba(192, 132, 252, 0.25)',
    pipeColor: '#d946ef',
    pipeBorder: '#a21caf',
    groundTop: '#06b6d4',
    groundBase: '#0891b2'
  },
  space: {
    name: 'Deep Space',
    skyTop: '#020617',
    skyBottom: '#090d16',
    cloudColor: 'rgba(56, 189, 248, 0.15)',
    pipeColor: '#8b5cf6',
    pipeBorder: '#6d28d9',
    groundTop: '#475569',
    groundBase: '#0f172a'
  }
};

