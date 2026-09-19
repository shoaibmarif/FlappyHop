import React from 'react';
import { Play, Calendar, Trophy, Sparkles } from 'lucide-react';
import { DailyChallenge } from '@flappy-bird/core';

interface StartScreenProps {
  bestScore: number;
  dailyChallenge: DailyChallenge;
  onStartNormal: () => void;
  onStartDaily: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  bestScore,
  dailyChallenge,
  onStartNormal,
  onStartDaily
}) => {
  return (
    <div
      onClick={onStartNormal}
      className="absolute inset-0 flex flex-col items-center justify-between p-6 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/50 select-none cursor-pointer"
    >
      {/* Top Best Score Badge */}
      <div
        onClick={e => e.stopPropagation()}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 text-white text-sm font-semibold shadow-lg"
      >
        <Trophy className="w-4 h-4 text-amber-400" />
        <span>Personal Best:</span>
        <span className="text-amber-400 font-bold">{bestScore}</span>
      </div>

      {/* Center Title & Play Trigger */}
      <div className="flex flex-col items-center text-center max-w-xs">
        <div className="relative mb-2 pointer-events-none">
          <span className="text-6xl animate-bounce inline-block drop-shadow-lg">🐦</span>
          <div className="absolute -top-1 -right-2 bg-amber-400 text-zinc-950 font-black text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            60FPS
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] pointer-events-none">
          FLAPPY HOP
        </h1>
        <p className="text-white/80 text-xs font-medium mt-1 mb-6 drop-shadow pointer-events-none">
          Tap, click, or press Space to fly
        </p>

        {/* Big Start Button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onStartNormal();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-lg shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer border-2 border-amber-300"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>PLAY GAME</span>
        </button>
      </div>

      {/* Daily Challenge Card at Bottom */}
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-white/15 dark:bg-zinc-950/70 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-white shadow-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">Daily Challenge</span>
              {dailyChallenge.completed && (
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-md">
                  DONE ✓
                </span>
              )}
            </div>
            <div className="text-xs text-white/70">
              Target: <strong className="text-amber-400 font-bold">{dailyChallenge.targetScore}</strong> pts
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onStartDaily();
          }}
          className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 border border-white/25 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{dailyChallenge.completed ? 'Replay' : 'Accept'}</span>
        </button>
      </div>
    </div>
  );
};

