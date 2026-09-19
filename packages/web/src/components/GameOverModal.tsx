import React from 'react';
import { RotateCcw, Home, Award } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  isNewBest,
  onPlayAgain,
  onHome
}) => {
  // Medal determination
  let medalName = 'None';
  let medalColor = 'text-slate-400';
  let medalBg = 'bg-slate-800/40 border-slate-700';

  if (score >= 100) {
    medalName = 'Platinum Aviator';
    medalColor = 'text-cyan-400';
    medalBg = 'bg-cyan-500/20 border-cyan-400/50';
  } else if (score >= 50) {
    medalName = 'Gold Medal';
    medalColor = 'text-amber-400';
    medalBg = 'bg-amber-500/20 border-amber-400/50';
  } else if (score >= 25) {
    medalName = 'Silver Medal';
    medalColor = 'text-slate-200';
    medalBg = 'bg-slate-300/20 border-slate-300/50';
  } else if (score >= 10) {
    medalName = 'Bronze Medal';
    medalColor = 'text-amber-600';
    medalBg = 'bg-amber-700/20 border-amber-600/50';
  }

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-30 select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl text-center">
        {/* Title */}
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          GAME OVER
        </h2>

        {isNewBest && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-4 animate-bounce">
            <span>🎉 NEW HIGH SCORE!</span>
          </div>
        )}

        {/* Score Card */}
        <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800/80 mb-5">
          <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200 dark:divide-zinc-800">
            <div>
              <div className="text-xs uppercase font-bold text-slate-500 dark:text-zinc-500 mb-1">
                Score
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white">
                {score}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-500 dark:text-zinc-500 mb-1">
                Best
              </div>
              <div className="text-4xl font-black text-amber-500">
                {bestScore}
              </div>
            </div>
          </div>

          {/* Medal achieved */}
          {score >= 10 && (
            <div className={`mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-center gap-2 text-xs font-bold ${medalColor}`}>
              <div className={`p-1.5 rounded-lg border ${medalBg}`}>
                <Award className="w-4 h-4" />
              </div>
              <span>{medalName} Earned</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-700 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

