import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, liveStreak } from '../game/progress';

const CAUSE_NAMES = { splash: 'Splashes', reeds: 'Reed bumps', vines: 'Vine tangles', dragonfly: 'Dragonflies' } as const;

const formatTime = (s: number) => (s < 3600 ? `${Math.round(s / 60)} min` : `${(s / 3600).toFixed(1)} h`);

export const StatsPage: React.FC = () => {
  const { stats } = useApp();
  const tiles: [string, string, string][] = [
    ['Best run', String(stats.best), 'bg-firefly/15'],
    ['Runs', stats.games.toLocaleString('en-US'), 'bg-water/15'],
    ['Gaps passed', stats.totalGates.toLocaleString('en-US'), 'bg-reed/15'],
    ['Fireflies', stats.totalFlies.toLocaleString('en-US'), 'bg-moon/20'],
    ['Best combo', `×${stats.bestCombo}`, 'bg-lotus/15'],
    ['Pad bounces', stats.padBounces.toLocaleString('en-US'), 'bg-reed/15'],
    ['Daily streak', String(liveStreak(stats)), 'bg-ember/15'],
    ['Time hopping', formatTime(stats.seconds), 'bg-water/15'],
  ];
  const totalEnds = Object.values(stats.causes).reduce((a, b) => a + b, 0);
  const unlocked = ACHIEVEMENTS.filter((a) => stats.achievements[a.id]).length;

  return (
    <ContentPage path="/stats" eyebrow="Saved on this device" wide>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map(([k, v, tint]) => (
          <div key={k} className={`rounded-[24px] p-4 ${tint}`}>
            <dt className="text-sm font-bold text-ink-2">{k}</dt>
            <dd className="mt-1 font-display text-3xl font-bold">{v}</dd>
          </div>
        ))}
      </dl>

      {totalEnds > 0 && (
        <section className="mt-12" aria-labelledby="ends-heading">
          <h2 id="ends-heading" className="text-2xl font-semibold">
            How your runs end
          </h2>
          <ul className="mt-4 space-y-2">
            {(Object.keys(CAUSE_NAMES) as (keyof typeof CAUSE_NAMES)[]).map((c) => {
              const share = stats.causes[c] / totalEnds;
              return (
                <li key={c} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm font-bold">{CAUSE_NAMES[c]}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full bg-pond-2">
                    <div className="flex h-full items-center justify-end rounded-full bg-water pr-2 text-xs font-bold text-white" style={{ width: `${Math.max(8, share * 100)}%` }}>
                      {Math.round(share * 100)}%
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm text-muted">
            Lots of splashes? Remember that a lily pad below you is a free bounce. More in <Link to="/tips" className="font-bold text-water underline">tips</Link>.
          </p>
        </section>
      )}

      <section className="mt-12" aria-labelledby="ach-heading">
        <div className="flex items-baseline justify-between">
          <h2 id="ach-heading" className="text-2xl font-semibold">
            Achievements
          </h2>
          <span className="text-sm font-bold text-muted">
            {unlocked}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const at = stats.achievements[a.id];
            return (
              <li key={a.id} className={`lily flex items-center gap-3 p-3 ${at ? '' : 'opacity-50 grayscale'}`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pond-2 text-2xl" aria-hidden="true">
                  {a.icon}
                </span>
                <span>
                  <span className="block font-display font-semibold">{a.title}</span>
                  <span className="block text-xs leading-5 text-ink-2">{a.description}</span>
                </span>
                <span className="sr-only">{at ? 'Unlocked' : 'Locked'}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-2xl font-semibold">
          Recent runs
        </h2>
        {stats.history.length === 0 ? (
          <p className="mt-4 text-ink-2">
            No runs yet. <Link to="/" className="font-bold text-water underline underline-offset-2">Go for a hop</Link>.
          </p>
        ) : (
          <ul className="lily mt-4 divide-y divide-rim">
            {stats.history.slice(0, 12).map((r) => (
              <li key={r.at} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                <span className="font-display text-lg font-bold">{r.score}</span>
                <span className="text-ink-2">✨ {r.flies}</span>
                {r.daily && <span className="chip !h-6">Daily</span>}
                <span className="ml-auto text-muted">{new Date(r.at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </ContentPage>
  );
};
