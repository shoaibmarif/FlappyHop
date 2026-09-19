import React from 'react';
import { X, CheckCircle2, Lock } from 'lucide-react';
import { ACHIEVEMENTS, Achievement } from '@flappy-bird/core';

interface AchievementsModalProps {
  isOpen: boolean;
  unlockedAchievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  unlockedAchievements,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedMap = new Map<string, Achievement>(
    unlockedAchievements.map(a => [a.id, a])
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Achievements
              </h3>
              <div className="text-xs text-slate-500 dark:text-zinc-400">
                {unlockedAchievements.length} of {ACHIEVEMENTS.length} Unlocked
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlockedMap.has(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
                    : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 opacity-60'
                }`}
              >
                <div className="text-2xl w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shrink-0">
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {ach.title}
                    </div>
                    {isUnlocked && (
                      <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-md">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                    {ach.description}
                  </div>
                </div>

                <div className="shrink-0">
                  {isUnlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 font-bold text-sm text-slate-800 dark:text-zinc-200 transition-colors mt-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

