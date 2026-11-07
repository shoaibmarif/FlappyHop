import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { SITE } from '../seo/site';

export const Terms: React.FC = () => (
  <ContentPage path="/terms" eyebrow="Last updated 7 November 2026" intro="By using FlappyHop you agree to these terms. They’re short, and written to be read.">
    <div className="prose-pond">
      <h2>Using FlappyHop</h2>
      <p>FlappyHop is a free game for personal entertainment. Play as much as you like. Please don’t try to break it, overload it or use it for anything unlawful.</p>

      <h2>No guarantees</h2>
      <p>
        We try to keep the pond running smoothly, but it’s provided as it is, without warranties of any kind. It may change, pause or stop
        at any time. Your progress is stored in your browser, so it can be lost if you clear your data or switch devices, and we can’t
        recover it.
      </p>

      <h2>Scores and frogs</h2>
      <p>Scores, fireflies, frogs and achievements are just for fun. They have no cash value and live only on your device.</p>

      <h2>The code and content</h2>
      <p>
        The source code is public on{' '}
        <a href={SITE.repo} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        . The name FlappyHop, the logo and the written content on this site belong to {SITE.author.name}.
      </p>

      <h2>Liability</h2>
      <p>To the extent the law allows, we aren’t liable for any loss from using FlappyHop, including a broken daily streak, painful as that is.</p>

      <h2>Privacy</h2>
      <p>
        How we handle data is covered in the <Link to="/privacy">privacy policy</Link>.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these terms now and then; the date at the top shows the latest version. Questions? Email{' '}
        <a href={`mailto:${SITE.author.email}`}>{SITE.author.email}</a>.
      </p>
    </div>
  </ContentPage>
);
