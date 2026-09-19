import React, { useRef, useEffect } from 'react';
import { GameRenderer } from '../canvas/renderer';
import { GameHUD } from './GameHUD';
import { StartScreen } from './StartScreen';
import { GameOverModal } from './GameOverModal';
import { useGame } from '../hooks/useGame';
import { GAME_CONSTANTS, BIRD_SKINS, getDifficulty } from '@flappy-bird/core';

interface GameCanvasProps {
  game: ReturnType<typeof useGame>;
  onOpenSkins: () => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ game }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer>(new GameRenderer());

  const {
    gameState,
    score,
    bestScore,
    isNewBest,
    themeId,
    skinId,
    isDailyMode,
    dailyChallenge,
    toastMessage,
    birdRef,
    pipesRef,
    lastTimeRef,
    flap,
    startGame,
    restart,
    togglePause,
    stepGame
  } = game;

  // Render & Physics Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Update game physics & pipes
      stepGame(time, dt);

      // Render frame
      const skin = BIRD_SKINS[skinId] || BIRD_SKINS.classic;
      const diff = getDifficulty(score);
      const isMoving = gameState === 'PLAYING';

      rendererRef.current.render(
        ctx,
        GAME_CONSTANTS.CANVAS_WIDTH,
        GAME_CONSTANTS.CANVAS_HEIGHT,
        birdRef.current,
        pipesRef.current,
        themeId,
        skin,
        dt,
        diff.speed,
        isMoving
      );

      animId = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [stepGame, gameState, skinId, themeId, score, birdRef, pipesRef, lastTimeRef]);

  // Touch & Click Interaction
  const handleInteraction = () => {
    if (gameState === 'READY') {
      startGame(isDailyMode);
    } else if (gameState === 'PLAYING') {
      flap();
    }
  };

  return (
    <div className="relative w-full max-w-[400px] aspect-[2/3] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-300 dark:border-zinc-800 bg-slate-900 select-none">
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={GAME_CONSTANTS.CANVAS_WIDTH}
        height={GAME_CONSTANTS.CANVAS_HEIGHT}
        className="w-full h-full block cursor-pointer"
        onMouseDown={handleInteraction}
        onTouchStart={e => {
          e.preventDefault(); // Prevent accidental scroll/zoom
          handleInteraction();
        }}
      />

      {/* Floating HUD */}
      <GameHUD
        score={score}
        gameState={gameState}
        isDailyMode={isDailyMode}
        dailyTarget={dailyChallenge.targetScore}
        onTogglePause={togglePause}
      />

      {/* Start Screen Overlay */}
      {gameState === 'READY' && (
        <StartScreen
          bestScore={bestScore}
          dailyChallenge={dailyChallenge}
          onStartNormal={() => startGame(false)}
          onStartDaily={() => startGame(true)}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          score={score}
          bestScore={bestScore}
          isNewBest={isNewBest}
          onPlayAgain={() => startGame(isDailyMode)}
          onHome={() => restart(false)}
        />
      )}

      {/* Pause Banner */}
      {gameState === 'PAUSED' && (
        <div
          onClick={togglePause}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-30 cursor-pointer"
        >
          <div className="text-5xl mb-2">⏸️</div>
          <h2 className="text-3xl font-black text-white tracking-wider mb-2">PAUSED</h2>
          <p className="text-white/80 text-sm">Tap or press P to resume</p>
        </div>
      )}

      {/* Milestone / Achievement Toast */}
      {toastMessage && (
        <div className="absolute top-20 inset-x-4 flex justify-center z-40 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-amber-500 text-zinc-950 font-black px-4 py-2 rounded-2xl shadow-xl text-xs sm:text-sm border-2 border-white flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
