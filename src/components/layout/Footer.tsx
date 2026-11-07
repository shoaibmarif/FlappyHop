import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons';
import { Logo } from './Logo';
import { INFO_LINKS, LEARN_LINKS, PLAY_LINKS } from './nav';
import { SITE } from '../../seo/site';
import { openConsentSettings } from '../../lib/consent';

const Column: React.FC<{ title: string; links: { to: string; label: string }[] }> = ({ title, links }) => (
  <div>
    <h2 className="eyebrow mb-3">{title}</h2>
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.to}>
          <Link to={l.to} className="text-ink-2 transition-colors hover:text-ink">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer: React.FC = () => (
  <footer className="relative mt-24 overflow-hidden border-t border-rim bg-pond-2/70">
    {/* Reeds along the bank */}
    <svg className="pointer-events-none absolute -top-px right-6 h-16 w-48 text-reed opacity-40" viewBox="0 0 192 64" aria-hidden="true">
      {[12, 30, 44, 70, 86, 120, 140, 168].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 64 Q${x + (i % 2 ? 4 : -4)} 30 ${x + (i % 2 ? 2 : -2)} ${10 + (i % 3) * 8}`} stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
          {i % 2 === 0 && <rect x={x - 4 + (i % 2 ? 2 : -2)} y={10 + (i % 3) * 8} width="7" height="16" rx="3.5" fill="#8a5a36" />}
        </g>
      ))}
    </svg>
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
      <div className="max-w-xs">
        <Logo />
        <p className="mt-4 leading-7 text-ink-2">A one-tap frog game set on a moonlit pond. Free, no download, no account, and your progress stays on your device.</p>
        <div className="mt-4 flex gap-2">
          {[
            { href: SITE.repo, label: 'Source code on GitHub', icon: <Github className="h-4 w-4" /> },
            { href: SITE.author.linkedin, label: 'Shoaib Arif on LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
            { href: `mailto:${SITE.author.email}`, label: 'Send an email', icon: <Mail className="h-4 w-4" /> },
          ].map((s) => (
            <a
              key={s.href}
              href={s.href}
              target={s.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-rim bg-leaf text-ink transition-transform hover:-translate-y-0.5"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      <Column title="Play" links={PLAY_LINKS} />
      <Column title="Learn" links={LEARN_LINKS} />
      <Column title="FlappyHop" links={INFO_LINKS} />
    </div>
    <div className="border-t border-rim">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} FlappyHop. Made by{' '}
          <a href={SITE.author.url} target="_blank" rel="noopener noreferrer" className="font-bold text-ink-2 hover:text-ink">
            {SITE.author.name}
          </a>
          .
        </p>
        <button type="button" onClick={openConsentSettings} className="self-start text-left hover:text-ink sm:self-auto">
          Cookie settings
        </button>
      </div>
    </div>
  </footer>
);
