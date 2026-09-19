import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GameCanvas } from './components/GameCanvas';
import { LandingContent } from './components/LandingContent';
import { StatsModal } from './components/StatsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SkinsModal } from './components/SkinsModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { NotFound } from './components/NotFound';
import { useTheme } from './hooks/useTheme';
import { useGame } from './hooks/useGame';

export const App: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const game = useGame();

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSkinsOpen, setIsSkinsOpen] = useState(false);

  // Automatically pause the game when any modal is opened
  useEffect(() => {
    if (isStatsOpen || isAchievementsOpen || isSkinsOpen) {
      game.pauseGame();
    }
  }, [isStatsOpen, isAchievementsOpen, isSkinsOpen, game]);

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isPrivacyRoute =
    pathname === '/privacy' || pathname === '/privacy/' || pathname === '/privacy.html';
  const isKnownRoute = pathname === '/' || pathname === '' || isPrivacyRoute;

  // 404 Route
  if (!isKnownRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col">
        <Header
          theme={theme}
          isDark={isDark}
          onThemeToggle={toggleTheme}
          isMuted={game.isMuted}
          onMuteToggle={game.toggleMute}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenSkins={() => setIsSkinsOpen(true)}
        />
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
          <NotFound />
        </main>
      </div>
    );
  }

  // Privacy Policy Route (noindex, follow)
  if (isPrivacyRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col">
        <Header
          theme={theme}
          isDark={isDark}
          onThemeToggle={toggleTheme}
          isMuted={game.isMuted}
          onMuteToggle={game.toggleMute}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenSkins={() => setIsSkinsOpen(true)}
        />
        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full">
          <PrivacyPolicy />
        </main>
      </div>
    );
  }

  // Main Game Application & SEO Landing Page
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col">
      <Header
        theme={theme}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        isMuted={game.isMuted}
        onMuteToggle={game.toggleMute}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenSkins={() => setIsSkinsOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 flex-1 w-full flex flex-col items-center">
        {/* Game Area */}
        <div className="w-full flex flex-col items-center">
          <GameCanvas
            game={game}
            onOpenSkins={() => setIsSkinsOpen(true)}
            onOpenStats={() => setIsStatsOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
          />
        </div>

        {/* Semantic SEO & Information Sections */}
        <LandingContent
          currentTheme={game.themeId}
          onSelectTheme={game.selectTheme}
        />
      </main>

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        stats={game.stats}
        onClose={() => setIsStatsOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        unlockedAchievements={game.unlockedAchievements}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <SkinsModal
        isOpen={isSkinsOpen}
        currentSkinId={game.skinId}
        bestScore={game.bestScore}
        onSelectSkin={game.selectSkin}
        onClose={() => setIsSkinsOpen(false)}
      />
    </div>
  );
};

