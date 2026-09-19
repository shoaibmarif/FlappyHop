import React, { useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Rule D: Ensure noindex, follow to protect homepage authority and avoid cannibalization
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;

    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
      created = true;
    }
    metaRobots.content = 'noindex, follow';

    document.title = 'Privacy Policy — Flappy Hop';

    return () => {
      if (metaRobots) {
        if (created) {
          metaRobots.remove();
        } else {
          metaRobots.content = 'index, follow';
        }
      }
      document.title = 'Flappy Hop — Play Free Retro Arcade Game Online';
    };
  }, []);

  return (
    <article className="prose dark:prose-invert max-w-3xl mx-auto py-8 text-slate-800 dark:text-zinc-200">
      <div className="mb-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Game</span>
        </a>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black m-0 text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 m-0">
            Last Updated: September 19, 2026
          </p>
        </div>
      </div>

      <p className="lead text-base text-slate-600 dark:text-zinc-300">
        Your privacy is paramount. <strong>Flappy Hop</strong> operates as a 100% client-side web application and Chrome extension. We do not collect, store, transmit, or monetize any personal data.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4">1. Information Collection and Storage</h2>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
        All gameplay elements—including your high scores, personal achievements, unlocked skins, lifetime statistics, and audio preferences—are stored exclusively on your device using your browser's local storage (<code>localStorage</code>) and the Chrome Extension local storage API (<code>chrome.storage.local</code>).
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4">2. Zero Server Transmission</h2>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
        This game does not communicate with any external backend servers or third-party APIs during gameplay. No personal telemetry, cookies, or tracking fingerprints are ever generated or transmitted.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4">3. Chrome Extension Permissions</h2>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
        Our Chrome extension requests only minimal permissions necessary to function:
      </p>
      <ul className="text-sm space-y-1.5 text-slate-600 dark:text-zinc-400">
        <li><code>storage</code>: To persist high scores and settings locally.</li>
        <li><code>contextMenus</code>: To provide a right-click launcher shortcut.</li>
        <li><code>clipboardWrite</code>: To enable score sharing when the user explicitly clicks the Share button.</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-4">4. Children's Privacy (COPPA Compliance)</h2>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
        Because we do not collect any personal data whatsoever, Flappy Hop is safe and fully compliant with the Children's Online Privacy Protection Act (COPPA).
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4">5. Contact</h2>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
        If you have any questions or feedback regarding this policy, please reach out via our official GitHub repository.
      </p>
    </article>
  );
};

