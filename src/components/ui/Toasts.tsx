import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/** Achievement and rank-up notifications. */
export const Toasts: React.FC = () => {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed right-3 top-20 z-[90] flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="lily animate-rise-in pointer-events-auto flex items-center gap-3 !rounded-2xl p-3 pr-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-firefly-glow to-water-glow text-2xl" aria-hidden="true">
            {t.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="eyebrow block">{t.title}</span>
            <span className="block truncate font-bold">{t.body}</span>
          </span>
          <button type="button" onClick={() => dismissToast(t.id)} className="rounded-full p-1.5 text-muted hover:text-ink" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
