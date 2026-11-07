import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, Flame } from 'lucide-react';
import { PondGame } from '../components/game/PondGame';
import { GamePage } from '../components/game/GamePage';
import { FrogBadge } from '../components/game/FrogBadge';
import { Accordion } from '../components/ui/Accordion';
import { FAQ_ITEMS } from '../data/faq';
import { FROGS, dailyPond, liveStreak } from '../game/progress';
import { useApp } from '../context/AppContext';

const POND = [
  { icon: '🌿', title: 'Vines and reeds', body: 'Willow vines hang from above, reeds and cattails grow from the water. Hop through the gaps between them.', tint: 'bg-reed/15' },
  { icon: '🪷', title: 'Lily pads', body: 'Land on one and it bounces you back up instead of a splash. Each pad works once, then sinks.', tint: 'bg-lotus/15' },
  { icon: '✨', title: 'Fireflies', body: 'Catch them for combos and save them up to unlock new frogs. Most gaps have one glowing inside.', tint: 'bg-firefly/15' },
  { icon: '🛡️', title: 'Glow bugs', body: 'Rare golden bugs. Catch one and it shields you from your next bump.', tint: 'bg-moon/20' },
  { icon: '💨', title: 'Dragonflies', body: 'After 15 gaps they start zipping through the pond. They don’t wait for you.', tint: 'bg-ember/15' },
];

const SKIES = [
  { name: 'Dusk', at: 0, colors: ['#2b1d52', '#7a3f78', '#f0906a'] },
  { name: 'Twilight', at: 10, colors: ['#14163d', '#3c2d6e', '#a8678f'] },
  { name: 'Night', at: 25, colors: ['#050817', '#0d1a3a', '#1d3557'] },
  { name: 'Aurora', at: 50, colors: ['#03071a', '#0a1d33', '#123f4a'] },
];

const DailyStrip: React.FC = () => {
  const { stats } = useApp();
  const today = dailyPond();
  const best = stats.daily.best[today.key] ?? 0;
  const done = best >= today.goal;
  return (
    <section aria-label="Today’s daily pond" className="lily relative mx-auto max-w-5xl overflow-hidden p-5 sm:p-6">
      <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-moon-glow/25 blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-water/15 text-water">
            <CalendarDays className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Daily pond #{today.number}</p>
            <p className="font-display text-xl font-semibold">{done ? 'Today’s goal: done!' : `Today’s goal: ${today.goal} gaps`}</p>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-muted">Your best today</p>
            <p className="font-display text-2xl font-bold">{best}</p>
          </div>
          <div>
            <p className="text-muted">Streak</p>
            <p className="flex items-center gap-1 font-display text-2xl font-bold">
              <Flame className="h-5 w-5 text-ember" aria-hidden="true" />
              {liveStreak(stats, today.key)}
            </p>
          </div>
        </div>
        <Link to="/daily" className={`btn ${done ? 'btn-ghost' : 'btn-glow'}`}>
          {done ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
          {done ? 'Beat your best' : 'Hop in'}
          {!done && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Link>
      </div>
    </section>
  );
};

export const Home: React.FC = () => {
  const { stats } = useApp();
  return (
    <GamePage path="/" wide game={<PondGame title="Hop through the pond" />}>
      <DailyStrip />

      <section aria-labelledby="pond-heading" className="mt-20">
        <p className="eyebrow">Field guide</p>
        <h2 id="pond-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
          What’s in the pond
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {POND.map((p) => (
            <div key={p.title} className="lily p-5">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${p.tint}`} aria-hidden="true">
                {p.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-[15px] leading-6 text-ink-2">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="sky-heading" className="mt-20">
        <p className="eyebrow">The further you hop</p>
        <h2 id="sky-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
          From dusk to the northern lights
        </h2>
        <p className="mt-2 max-w-2xl text-ink-2">The sky changes as you go. Each new sky also means a faster pond and narrower gaps.</p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-4">
          {SKIES.map((s, i) => (
            <li
              key={s.name}
              className="relative flex h-36 flex-col justify-end overflow-hidden rounded-[24px] p-4 text-white"
              style={{ background: `linear-gradient(180deg, ${s.colors[0]}, ${s.colors[1]} 55%, ${s.colors[2]})` }}
            >
              <span className="absolute right-4 top-4 h-6 w-6 rounded-full bg-[#fff3c9] shadow-[0_0_24px_8px_rgba(255,240,200,0.35)]" aria-hidden="true" />
              {i === 3 && (
                <span className="absolute inset-x-0 top-8 h-6 bg-gradient-to-r from-transparent via-[#50ffaa]/40 to-transparent blur-md" aria-hidden="true" />
              )}
              <span className="font-display text-xl font-semibold">{s.name}</span>
              <span className="text-sm opacity-80">{s.at === 0 ? 'From the first hop' : `From ${s.at} gaps`}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="frogs-heading" className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Collect them all</p>
            <h2 id="frogs-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
              Seven frogs to unlock
            </h2>
          </div>
          <Link to="/frogs" className="inline-flex items-center gap-1.5 font-bold text-water underline underline-offset-4">
            Meet the frogs <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {FROGS.map((f) => {
            const unlocked = stats.totalFlies >= f.cost;
            return (
              <li key={f.id} className={`lily flex flex-col items-center p-4 text-center ${unlocked ? '' : 'opacity-60'}`}>
                <FrogBadge skin={f} size={64} className={unlocked ? 'animate-bob' : 'grayscale'} />
                <span className="mt-2 font-display font-semibold">{f.name}</span>
                <span className="text-xs text-muted">{f.cost === 0 ? 'Free' : `✨ ${f.cost.toLocaleString('en-US')}`}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="faq-heading" className="mx-auto mt-20 max-w-4xl">
        <p className="eyebrow">Questions</p>
        <h2 id="faq-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
          Good to know
        </h2>
        <div className="mt-6">
          <Accordion items={FAQ_ITEMS.slice(0, 5)} />
        </div>
        <Link to="/faq" className="mt-5 inline-flex items-center gap-1.5 font-bold text-water underline underline-offset-4">
          All questions <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </GamePage>
  );
};
