import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { INFO_LINKS, LEARN_LINKS, PLAY_LINKS } from '../components/layout/nav';

const GROUPS = [
  { title: 'Play', links: PLAY_LINKS },
  { title: 'Learn', links: LEARN_LINKS },
  { title: 'FlappyHop', links: INFO_LINKS },
];

export const Sitemap: React.FC = () => (
  <ContentPage path="/sitemap" intro="Every page in the pond, in one place." wide>
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {GROUPS.map((g) => (
        <section key={g.title}>
          <h2 className="eyebrow mb-3">{g.title}</h2>
          <ul className="space-y-2">
            {g.links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="font-bold text-ink underline decoration-rim decoration-2 underline-offset-4 hover:decoration-firefly">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </ContentPage>
);
