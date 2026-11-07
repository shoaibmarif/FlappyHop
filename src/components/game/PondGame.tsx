import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Pause, Play, RotateCcw, Share2, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePond } from '../../hooks/usePond';
import { FROGS, dailyPond, frogById, liveStreak, makeRun, type RunOutcome } from '../../game/progress';
import type { Cause, World } from '../../game/world';
import { FrogBadge } from './FrogBadge';
import { trackEvent } from '../../lib/consent';
import { sound } from '../../utils/sound';
import { SITE } from '../../seo/site';

const CAUSES: Record<Cause, string> = {
  splash: 'Splash! No lily pad to land on.',
  reeds: 'Bumped into the reeds.',
  vines: 'Tangled in the willow vines.',
  dragonfly: 'A dragonfly zipped right into you.',
};

interface PondGameProps {
  title: string;
  /** Show today's daily pond goal in the side panel (home page). */
  showDailyLink?: boolean;
  seed?: number;
  daily?: { key: string; number: number; goal: number };
}

interface Result {
  score: number;
  flies: number;
  bestCombo: number;
  pads: number;
  cause: Cause | null;
  outcome: RunOutcome;
}

/** One line about today's daily pond, for the home page. */
const TodayLine: React.FC = () => {
  const { stats } = useApp();
  const today = dailyPond();
  const best = stats.daily.best[today.key] ?? 0;
  const streak = liveStreak(stats, today.key);
  return (
    <Link to="/daily" className="group col-span-2 flex items-center justify-between rounded-2xl bg-pond-2 px-3 py-2.5 text-sm text-ink-2 transition-colors hover:text-ink">
      <span>
        <strong className="text-ink">Daily pond #{today.number}</strong>
        <br />
        {best >= today.goal ? `Goal reached (${best}/${today.goal})` : `Goal: ${today.goal} gaps${best ? `, best so far ${best}` : ''}`}
        {streak > 0 && ` · ${streak}-day streak`}
      </span>
      <span className="font-display font-semibold text-water transition-transform group-hover:translate-x-0.5" aria-hidden="true">
        →
      </span>
    </Link>
  );
};

export const PondGame: React.FC<PondGameProps> = ({ title, seed, daily, showDailyLink = false }) => {
  const { settings, updateSettings, stats, record, pushToast } = useApp();
  const [result, setResult] = useState<Result | null>(null);
  const [note, setNote] = useState('');

  const onOver = useCallback(
    (w: World, seconds: number) => {
      const outcome = record(makeRun(w, seconds, daily?.key));
      window.setTimeout(() => {
        setResult({ score: w.score, flies: w.fliesCaught, bestCombo: w.bestCombo, pads: w.padBounces, cause: w.cause, outcome });
        if (outcome.newBest && w.score > 0) sound.best();
      }, 700);
      trackEvent('run_complete', { score: w.score, fireflies: w.fliesCaught, cause: w.cause, daily: Boolean(daily) });
      outcome.unlocked.forEach((a, i) => window.setTimeout(() => pushToast({ icon: a.icon, title: 'Achievement', body: a.title }), 900 + i * 500));
      outcome.newFrogs.forEach((f, i) => window.setTimeout(() => pushToast({ icon: '🐸', title: 'New frog unlocked', body: `${f.name} can now hop` }), 1200 + i * 500));
    },
    [daily, record, pushToast]
  );

  const { canvasRef, hud, paused, pops, tap, restart, setPause } = usePond({ frog: settings.frog, seed, onOver });

  const again = () => {
    setResult(null);
    restart();
  };

  const share = async () => {
    if (!result) return;
    const text = daily
      ? `FlappyHop · Daily pond #${daily.number}\n🐸 ${result.score} gaps ${result.score >= daily.goal ? '✅' : `(goal ${daily.goal})`} · ✨ ${result.flies} fireflies\n${SITE.url}/daily`
      : `FlappyHop 🐸 I hopped through ${result.score} gaps and caught ${result.flies} fireflies ✨\nCan you beat it? ${SITE.url}`;
    try {
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        await navigator.share({ text });
        setNote('Shared');
      } else {
        await navigator.clipboard.writeText(text);
        setNote('Copied to clipboard');
      }
      trackEvent('share', { content_type: daily ? 'daily' : 'classic' });
    } catch {
      setNote('');
    }
    window.setTimeout(() => setNote(''), 2500);
  };

  const skin = frogById(settings.frog);
  const best = daily ? (stats.daily.best[daily.key] ?? 0) : stats.best;

  return (
    <section aria-labelledby="game-title" className="mx-auto grid w-full max-w-5xl items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <h1 id="game-title" className="sr-only">
        {title}
      </h1>
      <div className="relative mx-auto w-full" style={{ maxWidth: 'min(100%, calc((100dvh - 7.5rem) * 2 / 3))' }}>
        <div className="relative overflow-hidden rounded-[28px] border border-rim shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)]">
          <canvas
            ref={canvasRef}
            className="block aspect-[2/3] w-full touch-none select-none"
            onPointerDown={(e) => {
              e.preventDefault();
              tap();
            }}
            aria-label={`${title}. Tap, click or press Space to hop.`}
            role="img"
          />

          {/* Score */}
          {hud.status !== 'ready' && !result && (
            <div className="pointer-events-none absolute inset-x-0 top-4 flex flex-col items-center">
              <span className="font-display text-5xl font-bold text-white drop-shadow-[0_3px_0_rgb(0_0_0/0.35)]" aria-live="polite">
                {hud.score}
              </span>
              <span className="mt-1 flex items-center gap-2 rounded-full bg-black/25 px-3 py-0.5 text-sm font-bold text-white backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-firefly-glow shadow-[0_0_8px_var(--color-firefly-glow)]" aria-hidden="true" />
                {hud.flies}
                <span className="sr-only">fireflies</span>
                {hud.combo > 1 && <span className="text-firefly-glow">×{hud.combo}</span>}
                {hud.shield && <Shield className="h-4 w-4 text-moon-glow" aria-label="Glow shield active" />}
              </span>
            </div>
          )}

          {pops.map((p) => (
            <span
              key={p.id}
              className={`animate-pop-up pointer-events-none absolute left-[32%] top-[40%] font-display text-xl font-bold drop-shadow ${
                p.tone === 'fly' ? 'text-firefly-glow' : p.tone === 'pad' ? 'text-lotus-glow' : 'text-moon-glow'
              }`}
              aria-hidden="true"
            >
              {p.text}
            </span>
          ))}

          {/* Pause button */}
          {hud.status === 'playing' && !paused && (
            <button
              type="button"
              onClick={() => setPause(true)}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/45"
              aria-label="Pause (P)"
            >
              <Pause className="h-5 w-5" />
            </button>
          )}

          {/* Start */}
          {hud.status === 'ready' && (
            <div className="pointer-events-none absolute inset-x-0 bottom-[22%] flex flex-col items-center text-center text-white">
              <p className="font-display text-3xl font-bold drop-shadow-[0_3px_0_rgb(0_0_0/0.35)] sm:text-4xl" aria-hidden="true">
                {title}
              </p>
              <p className="mt-2 rounded-full bg-black/30 px-4 py-1.5 text-sm font-bold backdrop-blur">Tap, click or press Space to hop</p>
              {daily && <p className="mt-2 text-sm font-bold text-moon-glow drop-shadow">Today’s goal: {daily.goal} gaps</p>}
            </div>
          )}

          {/* Paused */}
          {paused && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#04121a]/60 text-center text-white backdrop-blur-sm">
              <p className="font-display text-3xl font-bold">Paused</p>
              <button type="button" className="btn btn-glow" onClick={() => setPause(false)} autoFocus>
                <Play className="h-4 w-4" aria-hidden="true" /> Keep hopping
              </button>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#04121a]/55 p-4 backdrop-blur-[3px]">
              <div className="lily animate-rise-in w-full max-w-xs p-5 text-center" role="status">
                <p className="text-sm font-bold text-ink-2">{result.cause ? CAUSES[result.cause] : 'Run over'}</p>
                <p className="mt-2 font-display text-6xl font-bold leading-none">{result.score}</p>
                <p className="mt-1 text-sm text-muted">{result.score === 1 ? 'gap' : 'gaps'}</p>
                {result.outcome.newBest && result.score > 0 && (
                  <p className="mt-2 inline-block rounded-full bg-firefly-glow px-3 py-0.5 text-sm font-bold text-[#10302a]">New best!</p>
                )}
                <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  {[
                    ['Best', daily ? (stats.daily.best[daily.key] ?? result.score) : result.outcome.stats.best],
                    ['Fireflies', result.flies],
                    ['Pads', result.pads],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-pond-2 py-2">
                      <dt className="text-xs text-muted">{k}</dt>
                      <dd className="font-display text-lg font-bold">{v}</dd>
                    </div>
                  ))}
                </dl>
                {daily && (
                  <p className={`mt-3 text-sm font-bold ${result.score >= daily.goal ? 'text-reed' : 'text-ember'}`}>
                    {result.score >= daily.goal ? `Goal reached! Daily streak: ${result.outcome.stats.daily.streak}` : `${daily.goal - result.score} short of today’s goal. Try again!`}
                  </p>
                )}
                {result.outcome.newFrogs.map((f) => (
                  <p key={f.id} className="mt-3 text-sm font-bold text-lotus">
                    🐸 {f.name} unlocked! Pick a frog on the right.
                  </p>
                ))}
                <div className="mt-4 flex justify-center gap-2">
                  <button type="button" className="btn btn-glow" onClick={again} autoFocus>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Again
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={share} aria-label="Share your score">
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p aria-live="polite" className="mt-2 h-4 text-xs font-bold text-reed">
                  {note}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side panel */}
      <aside className="space-y-4">
        <div className="lily grid grid-cols-2 gap-3 p-4">
          <div>
            <p className="text-xs font-bold text-muted">{daily ? 'Today’s best' : 'Best'}</p>
            <p className="font-display text-3xl font-bold">{best}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted">Fireflies</p>
            <p className="font-display text-3xl font-bold">{stats.totalFlies.toLocaleString('en-US')}</p>
          </div>
          {showDailyLink && <TodayLine />}
          {daily && (
            <p className="col-span-2 rounded-2xl bg-pond-2 px-3 py-2 text-sm text-ink-2">
              Daily pond #{daily.number} · goal <strong className="text-ink">{daily.goal}</strong> gaps
              {(stats.daily.best[daily.key] ?? 0) >= daily.goal && ' · done ✅'}
            </p>
          )}
        </div>

        <div className="lily p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">Your frog</h2>
            <Link to="/frogs" className="text-sm font-bold text-water underline underline-offset-2">
              All frogs
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Choose a frog">
            {FROGS.map((f) => {
              const locked = stats.totalFlies < f.cost;
              const active = settings.frog === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={locked}
                  onClick={() => updateSettings({ frog: f.id })}
                  title={locked ? `${f.name}: catch ${f.cost} fireflies in total to unlock` : f.name}
                  className={`relative flex aspect-square items-center justify-center rounded-2xl border transition-transform ${
                    active ? 'border-firefly bg-pond-2 shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-firefly-glow)_35%,transparent)]' : 'border-rim hover:-translate-y-0.5'
                  } ${locked ? 'opacity-45' : ''}`}
                  aria-label={locked ? `${f.name}, locked, ${f.cost} fireflies` : f.name}
                >
                  <FrogBadge skin={f} size={44} />
                  {locked && <Lock className="absolute bottom-1 right-1 h-3.5 w-3.5 text-muted" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-ink-2">
            <strong className="text-ink">{skin.name}</strong>: {skin.blurb}
          </p>
        </div>

        <p className="hidden px-2 text-sm leading-6 text-muted lg:block">
          <kbd className="rounded-md border border-rim px-1.5">Space</kbd> or tap to hop · <kbd className="rounded-md border border-rim px-1.5">P</kbd> to pause. Land on a lily pad to bounce. A golden glow bug saves you once.
        </p>
      </aside>
    </section>
  );
};
