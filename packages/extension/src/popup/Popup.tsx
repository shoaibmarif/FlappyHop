import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, ExternalLink, RotateCcw, Trophy, Play } from 'lucide-react';
import {
  Bird,
  Pipe,
  GameState,
  createInitialBird,
  updateBirdPhysics,
  updateIdleBird,
  checkCollision,
  updatePipes,
  getDifficulty,
  BIRD_SKINS
} from '@flappy-bird/core';

export const Popup: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>('READY');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const birdRef = useRef<Bird>(createInitialBird());
  const pipesRef = useRef<Pipe[]>([]);
  const gameStateRef = useRef<GameState>('READY');
  const scoreRef = useRef<number>(0);
  const nextPipeIdRef = useRef<number>(1);
  const lastTimeRef = useRef<number>(performance.now());
  const flapRequestedRef = useRef<boolean>(false);

  gameStateRef.current = gameState;
  scoreRef.current = score;

  // Sound generator
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playBeep = useCallback((freq: number, dur: number) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {
      // Audio fallback
    }
  }, [isMuted]);

  // Load best score from storage
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['flappy_best_score'], res => {
        if (res.flappy_best_score) setBestScore(res.flappy_best_score);
      });
    } else {
      const saved = localStorage.getItem('flappy_best_score');
      if (saved) setBestScore(parseInt(saved, 10) || 0);
    }
  }, []);

  const saveBestScore = (newScore: number) => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ flappy_best_score: newScore });
    } else {
      localStorage.setItem('flappy_best_score', String(newScore));
    }
  };

  const flap = useCallback(() => {
    if (gameStateRef.current === 'READY') {
      playBeep(440, 0.1);
      flapRequestedRef.current = true;
      setGameState('PLAYING');
      return;
    }
    if (gameStateRef.current === 'PLAYING') {
      playBeep(440, 0.1);
      flapRequestedRef.current = true;
    }
  }, [playBeep]);

  const restart = useCallback(() => {
    playBeep(330, 0.08);
    birdRef.current = createInitialBird();
    pipesRef.current = [];
    nextPipeIdRef.current = 1;
    flapRequestedRef.current = false;
    setScore(0);
    scoreRef.current = 0;
    setGameState('READY');
  }, [playBeep]);

  // Key controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameStateRef.current === 'GAME_OVER') {
          restart();
        } else {
          flap();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap, restart]);

  // Auto-pause on blur or tab/visibility change
  useEffect(() => {
    const handleBlur = () => {
      if (document.hidden || !document.hasFocus()) {
        if (gameStateRef.current === 'PLAYING') {
          setGameState('PAUSED');
        }
      }
    };
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleBlur);
    };
  }, []);

  // Game loop & canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const state = gameStateRef.current;

      if (state === 'READY') {
        birdRef.current = updateIdleBird(birdRef.current, time / 1000);
      } else if (state === 'PLAYING') {
        // Physics
        const isFlap = flapRequestedRef.current;
        flapRequestedRef.current = false;
        birdRef.current = updateBirdPhysics(birdRef.current, dt, isFlap);

        const diff = getDifficulty(scoreRef.current);
        const update = updatePipes(
          pipesRef.current,
          dt,
          diff.speed,
          birdRef.current.x,
          360,
          460,
          60,
          scoreRef.current,
          nextPipeIdRef.current
        );

        pipesRef.current = update.pipes;
        nextPipeIdRef.current = update.nextPipeId;

        if (update.scoredPoints > 0) {
          playBeep(880, 0.15);
          const newScore = scoreRef.current + update.scoredPoints;
          scoreRef.current = newScore;
          setScore(newScore);

          setBestScore(prev => {
            if (newScore > prev) {
              saveBestScore(newScore);
              return newScore;
            }
            return prev;
          });
        }

        // Collision check
        const col = checkCollision(birdRef.current, pipesRef.current, 460, 60);
        if (col.hasCollided) {
          playBeep(180, 0.25);
          setGameState('GAME_OVER');
        }
      }

      // Render
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 0, 360, 460);

      // Pipes
      for (const pipe of pipesRef.current) {
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2.5;

        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
        ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
      }

      // Ground
      ctx.fillStyle = '#84cc16';
      ctx.fillRect(0, 400, 360, 12);
      ctx.fillStyle = '#a16207';
      ctx.fillRect(0, 412, 360, 48);

      // Bird
      const b = birdRef.current;
      const skin = BIRD_SKINS.classic;
      ctx.save();
      ctx.translate(b.x + b.width / 2, b.y + b.height / 2);
      ctx.rotate(b.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, b.width / 2, b.height / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = skin.primaryColor;
      ctx.fill();
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Eye
      ctx.beginPath();
      ctx.arc(b.width * 0.2, -b.height * 0.15, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(b.width * 0.22, -b.height * 0.15, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // Beak
      ctx.beginPath();
      ctx.moveTo(b.width * 0.35, -2);
      ctx.lineTo(b.width * 0.5 + 6, 2);
      ctx.lineTo(b.width * 0.35, 6);
      ctx.closePath();
      ctx.fillStyle = skin.beakColor;
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [playBeep]);

  const openFullscreen = () => {
    chrome.tabs.create({ url: 'https://flappyhop.netlify.app/' });
  };

  return (
    <div className="w-[360px] h-[520px] flex flex-col bg-[#090d16] text-white select-none">
      {/* Header */}
      <div className="h-12 px-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐦</span>
          <span className="font-black text-sm text-amber-400">FLAPPY HOP</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMuted(m => !m)}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={openFullscreen}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400"
            title="Open Fullscreen Web App"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className="relative w-[360px] h-[460px] cursor-pointer"
        onMouseDown={flap}
        onTouchStart={e => {
          e.preventDefault();
          flap();
        }}
      >
        <canvas
          ref={canvasRef}
          width={360}
          height={460}
          className="w-full h-full block"
        />

        {/* Score in Play */}
        {(gameState === 'PLAYING') && (
          <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
            <span className="text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {score}
            </span>
          </div>
        )}

        {/* Start Overlay */}
        {gameState === 'READY' && (
          <div className="absolute inset-0 flex flex-col items-center justify-between p-6 bg-black/30 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 text-xs text-amber-400 font-bold border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5" />
              <span>Best: {bestScore}</span>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-2 animate-bounce">🐦</div>
              <h2 className="text-2xl font-black text-white drop-shadow">FLAPPY BIRD</h2>
              <p className="text-xs text-white/80 mt-1 mb-4">Click or Space to Flap</p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-black text-sm shadow-lg">
                <Play className="w-4 h-4 fill-current" />
                <span>TAP TO FLY</span>
              </div>
            </div>

            <div className="text-[11px] text-white/60">Press Spacebar to Jump</div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/60 z-20">
            <div className="w-full max-w-[280px] bg-zinc-900 border border-zinc-700 rounded-2xl p-5 text-center shadow-2xl">
              <h3 className="text-xl font-black text-white mb-3">GAME OVER</h3>
              <div className="bg-zinc-950 rounded-xl p-3 mb-4 flex justify-around">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Score</div>
                  <div className="text-2xl font-black text-white">{score}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Best</div>
                  <div className="text-2xl font-black text-amber-400">{bestScore}</div>
                </div>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  restart();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="h-3 bg-zinc-950" />
    </div>
  );
};
