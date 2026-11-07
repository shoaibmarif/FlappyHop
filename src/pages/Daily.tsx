import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PondGame } from '../components/game/PondGame';
import { GamePage } from '../components/game/GamePage';
import { dailyPond, formatCountdown, msUntilTomorrow } from '../game/progress';

export const Daily: React.FC = () => {
  const [today, setToday] = useState(() => dailyPond());
  const [ms, setMs] = useState(() => msUntilTomorrow());
  useEffect(() => {
    const id = window.setInterval(() => {
      setMs(msUntilTomorrow());
      const now = dailyPond();
      if (now.key !== today.key) setToday(now);
    }, 1000);
    return () => window.clearInterval(id);
  }, [today.key]);

  return (
    <GamePage
      path="/daily"
      wide
      game={<PondGame key={today.key} title={`Daily pond #${today.number}`} seed={today.seed} daily={{ key: today.key, number: today.number, goal: today.goal }} />}
    >
      <p className="mb-10 text-center text-sm text-muted">
        Next pond in <span className="font-bold tabular-nums text-ink">{formatCountdown(ms)}</span>
      </p>
      <section className="prose-pond mx-auto max-w-3xl">
        <h2>One pond, everyone, every day</h2>
        <p>
          The daily pond is a single course that’s the same for everyone today: every gap, lily pad and firefly in the same place. A new one
          appears at midnight in your time zone, with a goal somewhere between 8 and 20 gaps.
        </p>
        <p>
          You can try as many times as you like, and your best run counts. Reach the goal on back to back days to build a streak. Because the
          course never changes during the day, you can learn it: where the tricky drops are, where the lily pads wait, and which fireflies are
          worth the detour.
        </p>
        <h2>Share without spoilers</h2>
        <p>
          When you’re done, share your score. It says how far you got and whether you hit the goal, not what the course looks like. Fancy
          something new instead? Hop back to the <Link to="/">endless pond</Link>.
        </p>
      </section>
    </GamePage>
  );
};
