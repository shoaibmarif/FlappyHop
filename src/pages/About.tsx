import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { SITE } from '../seo/site';

export const About: React.FC = () => (
  <ContentPage path="/about" eyebrow="The story" intro="FlappyHop is a small game about a frog, a pond and one very important button.">
    <div className="prose-pond">
      <h2>Why a frog?</h2>
      <p>
        One-tap games are wonderful: anyone can play in seconds, and they’re still hard to master. But most of them feel the same. We wanted
        one with a place you’d like to spend time in, so we built a pond at dusk, full of reeds, lily pads and fireflies, and gave it a frog
        who would much rather hop than swim.
      </p>

      <h2>What’s different</h2>
      <ul>
        <li>Lily pads that bounce you back up, so the water isn’t always the end.</li>
        <li>Fireflies to catch and chain into combos, and seven frogs to unlock with them.</li>
        <li>Golden glow bugs that shield you from one crash, and dragonflies that keep you honest.</li>
        <li>A sky that changes from dusk to the northern lights the further you go.</li>
        <li>A daily pond with the same course for everyone, and a goal to reach.</li>
        <li>No account, no ads in the game, nothing to install. Your progress stays in your browser.</li>
      </ul>

      <h2>Who makes it</h2>
      <p>
        FlappyHop is built by{' '}
        <a href={SITE.author.url} target="_blank" rel="noopener noreferrer">
          {SITE.author.name}
        </a>
        , a web developer who likes making small things feel lovely. The whole pond, frog included, is drawn in code with HTML canvas, and the
        sounds are made on the fly with the Web Audio API. The source is on{' '}
        <a href={SITE.repo} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
      <ul>
        <li>
          Portfolio: <a href={SITE.author.url} target="_blank" rel="noopener noreferrer">shoaibarif.vercel.app</a>
        </li>
        <li>
          LinkedIn: <a href={SITE.author.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/shoaibmarif</a>
        </li>
        <li>
          GitHub: <a href={SITE.author.github} target="_blank" rel="noopener noreferrer">github.com/shoaibmarif</a>
        </li>
      </ul>
      <p>
        Got an idea for a new frog or something to add to the pond? <Link to="/contact">Get in touch</Link>.
      </p>
    </div>
  </ContentPage>
);
