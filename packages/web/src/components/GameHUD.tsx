import React from 'react';
import { Pause, Play } from 'lucide-react';
import { GameState } from '@flappy-bird/core';

interface GameHUDProps {
  score: number;
  gameState: GameState;
  isDailyMode: boolean;
  dailyTarget?: number;
  onTogglePause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  gameState,
  isDailyMode,
  dailyTarget,
  onTogglePause
}) => {
  if (gameState !== 'PLAYING' && gameState !== 'PAUSED') {
    return null;
  }

  return (
    <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
      {/* Daily Mode Badge */}
      <div className="pointer-events-auto">
        {isDailyMode && (
          <div className="bg-amber-500/90 backdrop-blur-sm text-zinc-950 font-black px-3 py-1 rounded-full text-xs shadow-lg flex items-center gap-1.5 border border-amber-300">
            <span>🎯</span>
            <span>TARGET: {dailyTarget}</span>
          </div>
        )}
      </div>

      {/* Main Big Score */}
      <div className="flex flex-col items-center select-none">
        <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] tracking-tight">
          {score}
        </span>
      </div>

      {/* Pause Button */}
      <div className="pointer-events-auto">
        <button
          onClick={onTogglePause}
          className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 transition-transform active:scale-95 shadow-md"
          title={gameState === 'PAUSED' ? 'Resume (P)' : 'Pause (P)'}
        >
          {gameState === 'PAUSED' ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
        </button>
      </div>
    </div>
  );
};

