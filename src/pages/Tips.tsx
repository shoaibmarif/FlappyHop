import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';

const TIPS = [
  { n: '1', title: 'Tap less than you think', body: 'Most runs end because of one tap too many, not one too few. Each tap is a small hop; let gravity do half the work.', tint: 'bg-firefly/15' },
  { n: '2', title: 'Find a rhythm', body: 'The pond moves at a steady speed, so the timing between gaps is steady too. Count it in your head: tap, tap, wait. Rhythm beats reaction.', tint: 'bg-water/15' },
  { n: '3', title: 'Aim low in the gap', body: 'Each hop shoots you upwards quickly. Sitting slightly below the middle of a gap leaves room to hop without bumping the vines.', tint: 'bg-reed/15' },
  { n: '4', title: 'Look one gap ahead', body: 'By the time you’re in a gap, it’s too late to plan it. Watch where the next opening is and start drifting towards it early.', tint: 'bg-lotus/15' },
  { n: '5', title: 'Know where the pads are', body: 'A lily pad under you is a free mistake. When you see one coming, you can afford to dive for a low gap or a firefly.', tint: 'bg-moon/20' },
  { n: '6', title: 'Don’t chase every firefly', body: 'A firefly in the middle of a gap is free. One near the edge is a trap. Your total grows over many runs; one greedy dive costs the whole run.', tint: 'bg-ember/15' },
];

export const Tips: React.FC = () => (
  <ContentPage path="/tips" eyebrow="Get better" intro="One-tap games feel like pure reflexes, but a few habits make a surprising difference. These are the ones that add the most gaps to a run." wide>
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TIPS.map((t) => (
        <li key={t.n} className="lily p-6">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-lg font-bold ${t.tint}`}>{t.n}</span>
          <h2 className="mt-4 text-xl font-semibold">{t.title}</h2>
          <p className="mt-2 leading-7 text-ink-2">{t.body}</p>
        </li>
      ))}
    </ol>
    <div className="prose-pond mx-auto mt-14 max-w-3xl">
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
