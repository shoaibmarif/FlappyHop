import React from 'react';
import { Mail } from 'lucide-react';
import { ContentPage } from '../components/layout/ContentPage';
import { Github, Linkedin } from '../components/ui/BrandIcons';
import { SITE } from '../seo/site';

const CARDS = [
  {
    href: `mailto:${SITE.author.email}?subject=FlappyHop`,
    icon: Mail,
    title: 'Email',
    detail: SITE.author.email,
    tint: 'bg-lotus text-white',
    note: 'Best for bug reports, frog ideas and anything else. I read everything.',
  },
  {
    href: SITE.issues,
    icon: Github,
    title: 'GitHub issues',
    detail: 'shoaibmarif/flappyhop',
    tint: 'bg-ink text-pond',
    note: 'If you’re a developer, open an issue or a pull request. The code is public.',
  },
  {
    href: SITE.author.linkedin,
    icon: Linkedin,
    title: 'LinkedIn',
    detail: 'in/shoaibmarif',
    tint: 'bg-water text-white',
    note: 'For work enquiries or just to connect.',
  },
];

export const Contact: React.FC = () => (
  <ContentPage path="/contact" eyebrow="Say hello" intro="Got an idea for a new frog or something in the pond? Something not working on your phone? I’d like to hear about it.">
    <div className="grid gap-4 sm:grid-cols-3">
      {CARDS.map((c) => (
        <a
          key={c.title}
          href={c.href}
          target={c.href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noopener noreferrer"
          className="lily flex flex-col p-5 transition-transform hover:-translate-y-1"
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${c.tint}`}>
            <c.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="mt-4 font-display font-bold">{c.title}</span>
          <span className="mt-0.5 break-all text-sm font-medium text-lotus">{c.detail}</span>
          <span className="mt-3 text-sm leading-6 text-ink-2">{c.note}</span>
        </a>
      ))}
    </div>
    <div className="prose-pond mt-10">
      <p>
        If you’re reporting a bug, it helps to mention your browser and device, your score when it happened, and what you saw.
      </p>
      <p>
        You can also find more of my work at{' '}
        <a href={SITE.author.url} target="_blank" rel="noopener noreferrer">
          shoaibarif.vercel.app
        </a>
        .
      </p>
    </div>
  </ContentPage>
);
