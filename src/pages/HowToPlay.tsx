import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { DIFFICULTY } from '../game/world';
import { FROGS } from '../game/progress';

export const HowToPlay: React.FC = () => (
  <ContentPage path="/how-to-play" eyebrow="The rules" intro="FlappyHop uses one button, but there’s a whole pond to learn. Here’s everything that can help you, and everything that can end a run.">
    <div className="prose-pond">
      <h2>Controls</h2>
      <ul>
        <li>
          <strong>Hop:</strong> tap the pond on a phone or tablet, click with a mouse, or press <kbd>Space</kbd>, <kbd>↑</kbd> or <kbd>W</kbd>.
        </li>
        <li>
          <strong>Pause:</strong> the pause button in the corner, or <kbd>P</kbd> or <kbd>Esc</kbd>. The game also pauses if you switch tabs.
        </li>
      </ul>

      <h2>The goal</h2>
      <p>
        Your frog moves forward on its own. Hop through the gaps between the willow vines hanging from above and the reeds growing out of the
        water. Each gap you pass is one point. Bump into a vine, a reed or a dragonfly, or fall into open water, and the run is over.
      </p>

      <h2>Lily pads</h2>
      <p>
        The water is deadly, except where a lily pad is floating. Drop onto a pad and it bounces you high into the air. Each pad works
        once and then sinks, so treat it as a spare life, not a trampoline.
      </p>

      <h2>Fireflies and combos</h2>
      <p>
        Most gaps have a firefly glowing in the middle, and little trails of three drift between them. Catch fireflies within about two seconds
        of each other to build a combo. Every firefly is added to your total, which unlocks new frogs. There are {FROGS.length} to collect, the
        last one at {FROGS[FROGS.length - 1].cost.toLocaleString('en-US')} fireflies.
      </p>

      <h2>Glow bugs</h2>
      <p>
        Every so often, a golden glow bug floats in a gap. Catch it and a shimmering shield surrounds your frog. The next time you’d crash, the
        shield breaks instead and you get a moment to recover. You can only carry one at a time.
      </p>

      <h2>It gets harder</h2>
      <ul>
        {DIFFICULTY.slice(1).map((d) => (
          <li key={d.from}>
            From <strong>{d.from} gaps</strong>, the pond speeds up and the gaps get a little narrower.
          </li>
        ))}
        <li>
          From <strong>15 gaps</strong>, dragonflies start darting across, and they move faster than the pond.
        </li>
      </ul>
      <p>The sky changes too: dusk at the start, twilight from 10 gaps, full night from 25 and the northern lights from 50.</p>

      <h2>The daily pond</h2>
      <p>
        <Link to="/daily">The daily pond</Link> is one course a day, the same for everyone, with a goal between 8 and 20 gaps. Try as often as you
        like. Reach the goal on consecutive days to build a streak.
      </p>
      <p>
        Ready? <Link to="/">Start hopping</Link>, or read a few <Link to="/tips">tips</Link> first.
      </p>
    </div>
  </ContentPage>
);
