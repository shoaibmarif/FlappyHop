import React from 'react';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center select-none">
      <span className="text-7xl mb-4">🪶</span>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        404 - Lost in the Clouds
      </h1>
      <p className="text-slate-500 dark:text-zinc-400 max-w-sm text-sm mb-6">
        The page you are searching for flew away or does not exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all no-underline"
      >
        <Home className="w-4 h-4" />
        <span>Return to Game</span>
      </a>
    </div>
  );
};

