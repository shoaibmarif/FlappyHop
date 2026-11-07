import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import { ContentPage } from '../components/layout/ContentPage';
import { FrogBadge } from '../components/game/FrogBadge';
import { FROGS } from '../game/progress';
import { useApp } from '../context/AppContext';

export const Frogs: React.FC = () => {
  const { stats, settings, updateSettings } = useApp();
  return (
    <ContentPage
      path="/frogs"
     
      intro="Every firefly you catch is saved. Collect enough and a new frog joins the pond. They all hop the same way, so pick whichever one makes you smile."
      wide
    >
      <p className="mb-6 font-display text-lg">
        You have caught <span className="glow-text font-bold">{stats.totalFlies.toLocaleString('en-US')}</span> fireflies so far.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FROGS.map((f) => {
          const unlocked = stats.totalFlies >= f.cost;
          const active = settings.frog === f.id;
          const progress = f.cost === 0 ? 1 : Math.min(1, stats.totalFlies / f.cost);
          return (
            <li key={f.id} className={`lily flex flex-col p-5 ${active ? '!border-firefly' : ''}`}>
              <div className="flex items-center gap-4">
                <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px] bg-pond-2">
                  <FrogBadge skin={f} size={84} className={unlocked ? 'animate-bob' : 'opacity-50 grayscale'} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold">{f.name}</h2>
                  <p className="text-sm leading-6 text-ink-2">{f.blurb}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                {unlocked ? (
                  <button
                    type="button"
                    onClick={() => updateSettings({ frog: f.id })}
                    disabled={active}
                    className={`btn btn-sm ${active ? 'btn-ghost' : 'btn-glow'}`}
                  >
                    {active ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" /> Hopping now
                      </>
                    ) : (
                      'Choose'
                    )}
                  </button>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" aria-hidden="true" /> {f.cost.toLocaleString('en-US')} fireflies
                      </span>
                      <span>{Math.round(progress * 100)}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-pond-2">
                      <div className="h-full rounded-full bg-firefly-glow" style={{ width: `${progress * 100}%` }} />
                    </div>
                  </div>
                )}
                {f.cost === 0 && <span className="text-sm text-muted">Free</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="prose-pond mt-12 max-w-3xl">
        <h2>Catching more fireflies</h2>
        <p>
          Most gaps have a firefly glowing right in the middle, so a run of 20 gaps can easily be worth 15 or more. Little trails of three often
          float between the gaps too, and they’re easy to chain into a combo. There are more ideas on the <Link to="/tips">tips page</Link>.
        </p>
      </div>
    </ContentPage>
  );
};
