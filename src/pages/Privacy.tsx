import React from 'react';
import { ContentPage } from '../components/layout/ContentPage';
import { SITE } from '../seo/site';
import { openConsentSettings } from '../lib/consent';

export const Privacy: React.FC = () => (
  <ContentPage path="/privacy" eyebrow="Last updated 7 November 2026" intro="Short version: no accounts, your progress lives on your own device, and we use Google Analytics to count visits. You can opt out at any time.">
    <div className="prose-pond">
      <h2>What stays on your device</h2>
      <p>
        Your settings, scores, fireflies, frogs, achievements and daily results are saved in your browser’s local storage. They never leave
        your device and we can’t see them. Clearing your browser data, or choosing <strong>Reset all progress</strong> in Settings, deletes
        them.
      </p>

      <h2>Analytics</h2>
      <p>
        We use Google Analytics, loaded through Google Tag Manager, to understand how many people visit, which pages and modes they use,
        and roughly where in the world they are. It sets cookies to tell visits apart. We also record a few game events, such as a run ending or a score being shared, with details like the score and number of fireflies.
      </p>
      <p>
        Analytics is on by default. If you’d rather not be counted, choose <strong>Opt out</strong> in the notice, or{' '}
        <button type="button" onClick={openConsentSettings} className="font-bold text-water underline underline-offset-2">
          open cookie settings
        </button>{' '}
        at any time. Your choice is remembered on this device. Advertising features are always off, and we don’t sell or share data with
        anyone. Google handles this data under its own{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          privacy policy
        </a>
        .
      </p>

      <h2>Other services</h2>
      <ul>
        <li>The site is hosted on Netlify, which keeps standard server logs (such as IP addresses) for security and reliability.</li>
        <li>Fonts load from Google Fonts.</li>
      </ul>

      <h2>Children</h2>
      <p>
        FlappyHop is suitable for all ages. There are no accounts, chat or in-game ads, and we don’t knowingly collect personal information from
        anyone. Parents who prefer no analytics at all can use the Opt out button.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${SITE.author.email}`}>{SITE.author.email}</a> and I’ll get back to you. If this policy changes, the date at the
        top will change too.
      </p>
    </div>
  </ContentPage>
);
