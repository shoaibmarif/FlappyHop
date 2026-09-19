import React from 'react';
import { X, Trophy, Flame, Target, Timer, BarChart3 } from 'lucide-react';
import { GameStats } from '@flappy-bird/core';

interface StatsModalProps {
  isOpen: boolean;
  stats: GameStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, stats, onClose }) => {
  if (!isOpen) return null;

  const minutes = Math.floor(stats.totalPlayTimeSeconds / 60);
  const seconds = stats.totalPlayTimeSeconds % 60;
  const formattedTime = `${minutes}m ${seconds}s`;

  const statItems = [
    {
      label: 'Personal Best',
      value: stats.bestScore,
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      sub: 'Single run high'
    },
    {
      label: 'Total Games',
      value: stats.totalGames,
      icon: <Target className="w-5 h-5 text-blue-500" />,
      sub: 'All-time runs'
    },
    {
      label: 'Pipes Passed',
      value: stats.totalPipesPassed,
      icon: <BarChart3 className="w-5 h-5 text-emerald-500" />,
      sub: 'Obstacles cleared'
    },
    {
      label: 'Average Score',
      value: stats.averageScore,
      icon: <BarChart3 className="w-5 h-5 text-indigo-500" />,
      sub: 'Per run average'
    },
    {
      label: 'Daily Streak',
      value: `${stats.dailyChallengeStreak}d`,
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      sub: 'Consecutive days'
    },
    {
      label: 'Time In Flight',
      value: formattedTime,
      icon: <Timer className="w-5 h-5 text-purple-500" />,
      sub: 'Total playtime'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Lifetime Statistics
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {statItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  {item.label}
                </span>
                {item.icon}
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {item.value}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 font-bold text-sm text-slate-800 dark:text-zinc-200 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

