import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Trophy, BarChart2, Palette } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  isDark: boolean;
  onThemeToggle: () => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  onOpenStats?: () => void;
  onOpenAchievements?: () => void;
  onOpenSkins?: () => void;
  isHome?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onThemeToggle,
  isMuted = false,
  onMuteToggle = () => {},
  onOpenStats = () => {},
  onOpenAchievements = () => {},
  onOpenSkins = () => {},
  isHome = true
}) => {
  return (
    <header className="w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-amber-400 dark:bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🐦</span>
          </div>
          <div>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              FLAPPY HOP
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              ARCADE
            </span>
          </div>
        </a>

        {/* Action Controls - Only shown on homepage */}
        {isHome && (
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Skins */}
            <button
              onClick={onOpenSkins}
              className="p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Bird Skins"
              aria-label="Bird Skins"
            >
              <Palette className="w-5 h-5" />
            </button>

            {/* Stats */}
            <button
              onClick={onOpenStats}
              className="p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Statistics"
              aria-label="Statistics"
            >
              <BarChart2 className="w-5 h-5" />
            </button>

            {/* Achievements */}
            <button
              onClick={onOpenAchievements}
              className="p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Achievements"
              aria-label="Achievements"
            >
              <Trophy className="w-5 h-5" />
            </button>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-zinc-800 mx-1" />

            {/* Sound Toggle */}
            <button
              onClick={onMuteToggle}
              className="p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-emerald-500" />}
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Color Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
