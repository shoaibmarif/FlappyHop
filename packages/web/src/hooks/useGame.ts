import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  GameState,
  Bird,
  Pipe,
  ThemeId,
  SkinId,
  GameStats,
  DailyChallenge,
  Achievement,
  createInitialBird,
  updateBirdPhysics,
  updateIdleBird,
  checkCollision,
  updatePipes,
  getDifficulty,
  generateDailyChallenge,
  getTodayDateString,
  evaluateAchievements,
  recordGameResult,
  createInitialStats,
  BIRD_SKINS,
  GAME_CONSTANTS
} from '@flappy-bird/core';
import { sound } from '../audio/soundEngine';

export function useGame() {
  // Game states
  const [gameState, setGameState] = useState<GameState>('READY');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [themeId, setThemeId] = useState<ThemeId>('day');
  const [skinId, setSkinId] = useState<SkinId>('classic');
  const [isDailyMode, setIsDailyMode] = useState(false);

  // Stats & Achievements
  const [stats, setStats] = useState<GameStats>(createInitialStats());
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(() =>
    generateDailyChallenge(getTodayDateString())
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // References for high performance 60/120fps RAF loop
  const birdRef = useRef<Bird>(createInitialBird());
  const pipesRef = useRef<Pipe[]>([]);
  const gameStateRef = useRef<GameState>('READY');
  const scoreRef = useRef<number>(0);
  const nextPipeIdRef = useRef<number>(1);
  const lastTimeRef = useRef<number>(performance.now());
  const gameStartTimeRef = useRef<number>(performance.now());
  const flapRequestedRef = useRef<boolean>(false);
  const isDailyModeRef = useRef<boolean>(false);
  const animFrameIdRef = useRef<number | null>(null);
  const gameOverTimeRef = useRef<number>(0);

  // Sync refs with state
  gameStateRef.current = gameState;
  scoreRef.current = score;
  isDailyModeRef.current = isDailyMode;

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedBest = localStorage.getItem('flappy_best_score');
      if (savedBest) setBestScore(parseInt(savedBest, 10) || 0);

      const savedStats = localStorage.getItem('flappy_stats');
      if (savedStats) setStats(JSON.parse(savedStats));

      const savedMute = localStorage.getItem('flappy_muted');
      if (savedMute !== null) {
        const muted = savedMute === 'true';
        setIsMuted(muted);
        sound.setMuted(muted);
      }

      const savedSkin = localStorage.getItem('flappy_skin') as SkinId;
      if (savedSkin && BIRD_SKINS[savedSkin]) setSkinId(savedSkin);

      const savedTheme = localStorage.getItem('flappy_world_theme') as ThemeId;
      if (savedTheme) setThemeId(savedTheme);

      const savedAchievements = localStorage.getItem('flappy_achievements');
      if (savedAchievements) setUnlockedAchievements(JSON.parse(savedAchievements));

      const today = getTodayDateString();
      const savedDaily = localStorage.getItem(`flappy_daily_${today}`);
      if (savedDaily) {
        setDailyChallenge(JSON.parse(savedDaily));
      } else {
        setDailyChallenge(generateDailyChallenge(today));
      }
    } catch {
      // Storage fallback
    }
  }, []);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Flap trigger function
  const flap = useCallback(() => {
    if (gameStateRef.current === 'READY') {
      sound.playFlap();
      flapRequestedRef.current = true;
      setGameState('PLAYING');
      gameStartTimeRef.current = performance.now();
      return;
    }

    if (gameStateRef.current === 'PLAYING') {
      sound.playFlap();
      flapRequestedRef.current = true;
    }
  }, []);

  // Start game directly into PLAYING
  const startGame = useCallback((asDaily = false) => {
    sound.playFlap();
    birdRef.current = createInitialBird();
    pipesRef.current = [];
    nextPipeIdRef.current = 1;
    flapRequestedRef.current = true;
    setScore(0);
    scoreRef.current = 0;
    setIsNewBest(false);
    setIsDailyMode(asDaily);
    isDailyModeRef.current = asDaily;
    gameStartTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();
    setGameState('PLAYING');
  }, []);

  // Restart game back to READY
  const restart = useCallback((asDaily = false) => {
    sound.playClick();
    birdRef.current = createInitialBird();
    pipesRef.current = [];
    nextPipeIdRef.current = 1;
    flapRequestedRef.current = false;
    setScore(0);
    scoreRef.current = 0;
    setIsNewBest(false);
    setIsDailyMode(asDaily);
    isDailyModeRef.current = asDaily;
    setGameState('READY');
  }, []);

  // Toggle Pause
  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      sound.playClick();
      setGameState('PAUSED');
    } else if (gameStateRef.current === 'PAUSED') {
      sound.playClick();
      lastTimeRef.current = performance.now();
      setGameState('PLAYING');
    }
  }, []);

  // Explicit Pause (e.g. when modal opens or tab changes)
  const pauseGame = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      setGameState('PAUSED');
    }
  }, []);

  // Auto-pause when tab changes or window loses focus
  useEffect(() => {
    const handleVisibilityOrBlur = () => {
      if (document.hidden || !document.hasFocus()) {
        if (gameStateRef.current === 'PLAYING') {
          setGameState('PAUSED');
        }
      }
    };

    window.addEventListener('blur', handleVisibilityOrBlur);
    document.addEventListener('visibilitychange', handleVisibilityOrBlur);

    return () => {
      window.removeEventListener('blur', handleVisibilityOrBlur);
      document.removeEventListener('visibilitychange', handleVisibilityOrBlur);
    };
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      sound.setMuted(next);
      localStorage.setItem('flappy_muted', String(next));
      return next;
    });
  }, []);

  // Switch Theme & Skin
  const selectTheme = useCallback((id: ThemeId) => {
    sound.playClick();
    setThemeId(id);
    localStorage.setItem('flappy_world_theme', id);
  }, []);

  const selectSkin = useCallback((id: SkinId) => {
    sound.playClick();
    setSkinId(id);
    localStorage.setItem('flappy_skin', id);
  }, []);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault(); // Prevent scrolling page
        if (gameStateRef.current === 'GAME_OVER') {
          // 400ms cooldown so rapid flap presses do not accidentally restart
          if (performance.now() - gameOverTimeRef.current < 400) {
            return;
          }
          startGame(isDailyModeRef.current);
        } else if (gameStateRef.current === 'READY') {
          startGame(isDailyModeRef.current);
        } else {
          flap();
        }
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap, restart, togglePause]);

  // Main Game Loop Callback
  const stepGame = useCallback(
    (time: number, dt: number) => {
      const currentStatus = gameStateRef.current;

      if (currentStatus === 'READY') {
        birdRef.current = updateIdleBird(birdRef.current, time / 1000);
        return;
      }

      if (currentStatus !== 'PLAYING') {
        return;
      }

      // 1. Update bird physics
      const isFlapping = flapRequestedRef.current;
      flapRequestedRef.current = false;
      birdRef.current = updateBirdPhysics(birdRef.current, dt, isFlapping);

      // 2. Determine current difficulty speed
      const diff = getDifficulty(scoreRef.current);

      // 3. Update pipes & check for score increment
      const pipeUpdate = updatePipes(
        pipesRef.current,
        dt,
        diff.speed,
        birdRef.current.x,
        GAME_CONSTANTS.CANVAS_WIDTH,
        GAME_CONSTANTS.CANVAS_HEIGHT,
        GAME_CONSTANTS.GROUND_HEIGHT,
        scoreRef.current,
        nextPipeIdRef.current
      );

      pipesRef.current = pipeUpdate.pipes;
      nextPipeIdRef.current = pipeUpdate.nextPipeId;

      if (pipeUpdate.scoredPoints > 0) {
        sound.playScore();
        const newScore = scoreRef.current + pipeUpdate.scoredPoints;
        scoreRef.current = newScore;
        setScore(newScore);

        // Check if high score surpassed
        setBestScore(prevBest => {
          if (newScore > prevBest) {
            if (!isNewBest) {
              setIsNewBest(true);
              sound.playNewBest();
              confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
            }
            localStorage.setItem('flappy_best_score', String(newScore));
            return newScore;
          }
          return prevBest;
        });

        // Check milestone celebration (every 25 points)
        if (newScore > 0 && newScore % 25 === 0) {
          triggerToast(`🎉 Awesome! ${newScore} Points Milestone!`);
        }
      }

      // 4. Collision check
      const col = checkCollision(
        birdRef.current,
        pipesRef.current,
        GAME_CONSTANTS.CANVAS_HEIGHT,
        GAME_CONSTANTS.GROUND_HEIGHT
      );

      if (col.hasCollided) {
        sound.playHit();
        gameOverTimeRef.current = performance.now();
        setGameState('GAME_OVER');

        const finalScore = scoreRef.current;
        const durationSec = (performance.now() - gameStartTimeRef.current) / 1000;
        const today = getTodayDateString();

        // Check Daily Challenge
        let dailyCompleted = false;
        if (isDailyModeRef.current) {
          setDailyChallenge(prevDaily => {
            const completed = prevDaily.completed || finalScore >= prevDaily.targetScore;
            const updated = {
              ...prevDaily,
              completed,
              bestScore: Math.max(prevDaily.bestScore, finalScore)
            };
            localStorage.setItem(`flappy_daily_${today}`, JSON.stringify(updated));
            if (!prevDaily.completed && completed) {
              dailyCompleted = true;
              triggerToast('🏆 Daily Challenge Completed!');
              confetti({ particleCount: 100, spread: 80 });
            }
            return updated;
          });
        }

        // Record Stats
        setStats(prevStats => {
          const updated = recordGameResult(
            prevStats,
            finalScore,
            finalScore,
            durationSec,
            isDailyModeRef.current,
            dailyCompleted,
            today
          );
          localStorage.setItem('flappy_stats', JSON.stringify(updated));

          // Evaluate Achievements
          setUnlockedAchievements(prevAch => {
            const unlockedSet = new Set(prevAch.map(a => a.id));
            const newUnlocks = evaluateAchievements(unlockedSet, updated, finalScore, dailyCompleted);

            if (newUnlocks.length > 0) {
              for (const u of newUnlocks) {
                triggerToast(`🏅 Achievement Unlocked: ${u.title}!`);
              }
              const allAch = [...prevAch, ...newUnlocks];
              localStorage.setItem('flappy_achievements', JSON.stringify(allAch));
              return allAch;
            }
            return prevAch;
          });

          return updated;
        });
      }
    },
    [isNewBest, triggerToast]
  );

  return {
    gameState,
    score,
    bestScore,
    isNewBest,
    isMuted,
    themeId,
    skinId,
    isDailyMode,
    stats,
    dailyChallenge,
    unlockedAchievements,
    toastMessage,
    birdRef,
    pipesRef,
    animFrameIdRef,
    lastTimeRef,
    flap,
    startGame,
    restart,
    togglePause,
    pauseGame,
    toggleMute,
    selectTheme,
    selectSkin,
    stepGame
  };
}

