import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';

const TIPS = [
  { n: '1', title: 'Tap less than you think', body: 'Most runs end because of one tap too many, not one too few. Each tap is a small hop; let gravity do half the work.' },
  { n: '2', title: 'Find a rhythm', body: 'The pond moves at a steady speed, so the timing between gaps is steady too. Count it in your head: tap, tap, wait. Rhythm beats reaction.' },
  { n: '3', title: 'Aim low in the gap', body: 'Each hop shoots you upwards quickly. Sitting slightly below the middle of a gap leaves room to hop without bumping the vines.' },
  { n: '4', title: 'Look one gap ahead', body: 'By the time you’re in a gap, it’s too late to plan it. Watch where the next opening is and start drifting towards it early.' },
  { n: '5', title: 'Know where the pads are', body: 'A lily pad under you is a free mistake. When you see one coming, you can afford to dive for a low gap or a firefly.' },
  { n: '6', title: 'Don’t chase every firefly', body: 'A firefly in the middle of a gap is free. One near the edge is a trap. Your total grows over many runs; one greedy dive costs the whole run.' },
];

export const Tips: React.FC = () => (
  <ContentPage path="/tips" intro="One-tap games feel like pure reflexes, but a few habits make a surprising difference. These are the ones that add the most gaps to a run.">
    <ol className="max-w-3xl divide-y divide-rim border-y border-rim">
      {TIPS.map((t) => (
        <li key={t.n} className="grid grid-cols-[3rem_1fr] gap-4 py-7 sm:grid-cols-[4.5rem_1fr]">
          <span className="font-display text-5xl font-bold leading-none text-water/70 sm:text-6xl" aria-hidden="true">
            {t.n}
          </span>
          <div>
            <h2 className="text-2xl font-semibold">{t.title}</h2>
            <p className="mt-2 text-lg leading-8 text-ink-2">{t.body}</p>
          </div>
        </li>
      ))}
    </ol>
    <div className="prose-pond mt-14 max-w-3xl">
      <h2>Dealing with dragonflies</h2>
      <p>
        Dragonflies appear after 15 gaps. They fly faster than the pond and bob up and down. Don’t try to sneak past at the same height: get
        clearly above or below their path while they’re still far away, then line up for the next gap.
      </p>
      <h2>Practise on the daily pond</h2>
      <p>
        The <Link to="/daily">daily pond</Link> is the same course all day, so it’s a great way to practise. You’ll learn where the big drops and
        climbs are, and you can try a section again and again until it feels easy.
      </p>
      <h2>When you’re tired, stop</h2>
      <p>
        Honestly. Scores drop fast when you’re frustrated. Come back later and your first run is often your best.
      </p>
    </div>
  </ContentPage>
);
