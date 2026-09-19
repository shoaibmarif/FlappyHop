import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Trophy, BarChart2, Palette } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  isDark: boolean;
  onThemeToggle: () => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenSkins: () => void;
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
  isMuted,
  onMuteToggle,
  onOpenStats,
  onOpenAchievements,
  onOpenSkins
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
              FLAPPY BIRD
              FLAPPY HOP
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              ARCADE
            </span>
          </div>
        </a>

        {/* Action Controls */}
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

          {/* GitHub Profile */}
          <a
            href="https://github.com/shoaibmarif"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Shoaib M. Arif GitHub"
            aria-label="Shoaib M. Arif GitHub"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
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

