import React from 'react';
import { Gamepad2, Sparkles, Smartphone, ShieldCheck, HelpCircle } from 'lucide-react';
import { ThemeId, THEME_CONFIGS } from '@flappy-bird/core';

interface LandingContentProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const LandingContent: React.FC<LandingContentProps> = ({
  currentTheme,
  onSelectTheme
}) => {
  const themeEntries = Object.entries(THEME_CONFIGS) as [ThemeId, typeof THEME_CONFIGS[ThemeId]][];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-16 text-slate-700 dark:text-zinc-300 pb-16">
      {/* Themes Bar */}
      <section className="bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Arcade World Themes</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
          Personalize your backdrop atmosphere in real-time.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {themeEntries.map(([id, conf]) => (
            <button
              key={id}
              onClick={() => onSelectTheme(id)}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                currentTheme === id
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 font-bold'
                  : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div
                className="w-full h-8 rounded-lg shadow-inner"
                style={{
                  background: `linear-gradient(to bottom, ${conf.skyTop}, ${conf.skyBottom})`
                }}
              />
              <span className="text-xs font-semibold">{conf.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How To Play */}
      <section>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
          <Gamepad2 className="w-6 h-6 text-amber-500" />
          <span>How to Play Flappy Bird</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 font-black flex items-center justify-center mb-3">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">
              Tap or Press Space
            </h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
              Each tap counteracts gravity and propels the bird upward with controlled momentum.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 font-black flex items-center justify-center mb-3">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">
              Navigate Pipe Gaps
            </h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
              Glide safely between the green obstacles. Passing through each pair rewards 1 point.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 font-black flex items-center justify-center mb-3">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">
              Avoid Collisions
            </h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
              Touching any pipe, the ceiling, or the scrolling ground triggers instant game over.
            </p>
          </div>
        </div>
      </section>

      {/* Controls Reference */}
      <section>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
          <Smartphone className="w-6 h-6 text-indigo-500" />
          <span>Platform Controls</span>
        </h2>
        <div className="overflow-hidden bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-950/80 border-b border-slate-200 dark:border-zinc-800 font-bold text-xs uppercase text-slate-500 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3.5">Platform</th>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Shortcut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-xs">
              <tr>
                <td className="px-6 py-3.5 font-semibold">Desktop / Laptop</td>
                <td className="px-6 py-3.5">Flap Wings</td>
                <td className="px-6 py-3.5">
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-300 dark:border-zinc-700 font-mono">
                    Space
                  </kbd>{' '}
                  or{' '}
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-300 dark:border-zinc-700 font-mono">
                    ↑ Arrow
                  </kbd>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3.5 font-semibold">Desktop Mouse</td>
                <td className="px-6 py-3.5">Flap Wings</td>
                <td className="px-6 py-3.5">Left Click anywhere on canvas</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5 font-semibold">Mobile & Tablet</td>
                <td className="px-6 py-3.5">Flap Wings</td>
                <td className="px-6 py-3.5">Tap anywhere on the game screen</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5 font-semibold">Desktop Keyboard</td>
                <td className="px-6 py-3.5">Pause / Resume</td>
                <td className="px-6 py-3.5">
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-300 dark:border-zinc-700 font-mono">
                    P
                  </kbd>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-emerald-500" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-3">
          <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">
              Is this Flappy Bird game 100% free to play?
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Yes, completely free. There are no paywalls, microtransactions, or invasive ads. Everything runs client-side right in your browser.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">
              How does the Daily Challenge work?
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Every day at midnight, our deterministic PRNG algorithm creates a shared obstacle layout and target score. Players worldwide get the same challenge sequence to beat.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">
              Are all bird paints and skins free?
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Yes! All cosmetic styles—including Classic Flyer, Thunder Eagle, Neon Canary, Sky Penguin, Astro Rocket, and Cyber 8-Bit—are 100% free and instantly unlocked. Open the Palette menu to choose your favorite look at any time.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/60 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">
              Is my high score saved across visits?
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Yes! All scores, lifetime statistics, unlocked achievements, and selected skins are saved securely in your browser's localStorage. No login required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span>🐦 Flappy Bird Online</span>
          <span>•</span>
          <span>High Performance Arcade</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            className="hover:text-amber-500 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy</span>
          </a>
          <span>•</span>
          <a
            href="https://github.com/shoaibmarif"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-500 transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

