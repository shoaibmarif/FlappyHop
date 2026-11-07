import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PondGame } from '../components/game/PondGame';
import { GamePage } from '../components/game/GamePage';
import { FrogBadge } from '../components/game/FrogBadge';
import { PondSprite, type SpriteKind } from '../components/game/PondSprite';
import { Accordion } from '../components/ui/Accordion';
import { FAQ_ITEMS } from '../data/faq';
import { FROGS } from '../game/progress';
import { useApp } from '../context/AppContext';

const GUIDE: { kind: SpriteKind; name: string; note: string; body: string }[] = [
  {
    kind: 'gap',
    name: 'Vines and reeds',
    note: 'the walls',
    body: 'Willow vines hang down, cattails grow up. The gap between them is the only way through, and it gets narrower the further you go.',
  },
  {
    kind: 'pad',
    name: 'Lily pad',
    note: 'a second chance',
    body: 'Falling into the water ends a run, unless you land on one of these. It bounces you high, then sinks for good.',
  },
  {
    kind: 'firefly',
    name: 'Firefly',
    note: 'pocket change',
    body: 'Usually hovering in the middle of a gap. Catch a few in a row for a combo. Every one you catch is kept, and they unlock new frogs.',
  },
  {
    kind: 'glowbug',
    name: 'Glow bug',
    note: 'rare, golden',
    body: 'Catch it and a shield of light wraps round your frog. The next crash breaks the shield instead of ending the run.',
  },
  {
    kind: 'dragonfly',
    name: 'Dragonfly',
    note: 'trouble',
    body: 'Turns up after 15 gaps. Faster than the pond and never in a straight line, so get above or below it early.',
  },
];

const SKIES = [
  { score: 0, name: 'Dusk', note: 'where every run starts' },
  { score: 10, name: 'Twilight', note: 'at 10 gaps, a little faster' },
  { score: 25, name: 'Night', note: 'at 25, the stars come out' },
  { score: 50, name: 'Aurora', note: 'at 50, if you get that far' },
];

export const Home: React.FC = () => {
  const { stats } = useApp();
  return (
    <GamePage path="/" wide game={<PondGame title="Hop through the pond" showDailyLink />}>
      <section aria-labelledby="guide-heading" className="mx-auto max-w-5xl">
        <h2 id="guide-heading" className="text-3xl font-semibold sm:text-4xl">
          A field guide to the pond
        </h2>
        <p className="mt-2 max-w-xl text-ink-2">Everything you’ll meet on the way, drawn exactly as it appears in the game.</p>
        <dl className="lily mt-8 grid divide-y divide-rim overflow-hidden md:grid-cols-2 md:divide-y-0">
          {GUIDE.map((g, i) => (
            <div
              key={g.name}
              className={`flex gap-4 p-4 sm:gap-5 sm:p-6 ${i % 2 === 0 ? 'md:border-r md:border-rim' : ''} ${i >= 2 ? 'md:border-t md:border-rim' : ''} ${
                i === GUIDE.length - 1 ? 'md:col-span-2 md:border-r-0' : ''
              }`}
            >
              <div className={`shrink-0 self-start ${g.kind === 'gap' ? 'w-12 sm:w-16' : 'w-20 sm:w-[120px]'}`}>
                <PondSprite kind={g.kind} width={g.kind === 'gap' ? 64 : 120} fluid className="rounded-2xl" />
              </div>
              <div>
                <dt className="font-display text-xl font-semibold">
                  {g.name} <span className="ml-1 text-sm font-normal italic text-muted">{g.note}</span>
                </dt>
                <dd className="mt-1.5 leading-7 text-ink-2">{g.body}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="sky-heading" className="mx-auto mt-24 max-w-5xl">
        <div className="grid items-end gap-6 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="sky-heading" className="text-3xl font-semibold sm:text-4xl">
              The sky keeps score
            </h2>
            <p className="mt-3 leading-7 text-ink-2">
              You don’t need to look at the number to know how you’re doing. The light changes as you go, and each new sky brings a quicker
              pond and tighter gaps.
            </p>
          </div>
          <ol className="relative grid grid-cols-4 gap-2 sm:gap-4">
            <span className="absolute inset-x-4 bottom-[3.15rem] h-px bg-rim" aria-hidden="true" />
            {SKIES.map((s) => (
              <li key={s.name} className="relative flex min-w-0 flex-col items-center text-center">
                <PondSprite kind="sky" score={s.score} width={132} fluid className="rounded-2xl" label={`${s.name} sky`} />
                <span className="relative z-10 mt-3 h-3 w-3 rounded-full border-2 border-pond bg-firefly" aria-hidden="true" />
                <span className="mt-2 font-display font-semibold">{s.name}</span>
                <span className="text-xs leading-4 text-muted">{s.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="frogs-heading" className="mx-auto mt-24 max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="frogs-heading" className="text-3xl font-semibold sm:text-4xl">
            Seven frogs, one pond
          </h2>
          <Link to="/frogs" className="inline-flex items-center gap-1 font-bold text-water hover:underline">
            Meet them <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-2 max-w-xl text-ink-2">Pip is free. The rest join when you’ve caught enough fireflies in total.</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-2 gap-y-6 sm:justify-between">
          {FROGS.map((f) => {
            const unlocked = stats.totalFlies >= f.cost;
            return (
              <li key={f.id} className="flex w-24 flex-col items-center text-center">
                <div className="relative flex h-20 w-20 items-end justify-center">
                  <span className="absolute bottom-0 h-5 w-20 rounded-[50%] bg-reed/50" aria-hidden="true" />
                  <FrogBadge skin={f} size={64} className={`relative -mb-1 ${unlocked ? '' : 'opacity-40 grayscale'}`} />
                </div>
                <span className="mt-2 font-display font-semibold">{f.name}</span>
                <span className="text-xs text-muted">{f.cost === 0 ? 'free' : unlocked ? 'unlocked' : `${f.cost.toLocaleString('en-US')} fireflies`}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="faq-heading" className="mx-auto mt-24 grid max-w-5xl gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 id="faq-heading" className="text-3xl font-semibold sm:text-4xl">
            Questions
          </h2>
          <p className="mt-3 text-ink-2">
            The short answers. There are{' '}
            <Link to="/faq" className="font-bold text-water hover:underline">
              a few more here
            </Link>
            .
          </p>
        </div>
        <Accordion items={FAQ_ITEMS.slice(0, 4)} />
      </section>
    </GamePage>
  );
};
