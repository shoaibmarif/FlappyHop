import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CircleHelp, Menu, Moon, Settings, Sun, X } from 'lucide-react';
import { Logo } from './Logo';
import { HEADER_LINKS, INFO_LINKS, LEARN_LINKS, PLAY_LINKS } from './nav';
import { useApp } from '../../context/AppContext';

const iconBtn = 'flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-leaf hover:text-ink';

export const Header: React.FC = () => {
  const { openModal, isDark, toggleTheme, stats } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-rim bg-pond/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-3 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {HEADER_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `rounded-full px-4 py-2 font-display font-medium transition-colors ${isActive ? 'bg-leaf text-ink shadow-sm' : 'text-ink-2 hover:text-ink'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-0.5">
          <NavLink to="/stats" className="chip !h-9 hover:!border-muted" title="Fireflies caught in total" aria-label={`${stats.totalFlies} fireflies. View your stats`}>
            <span className="h-2 w-2 rounded-full bg-firefly-glow shadow-[0_0_8px_var(--color-firefly-glow)]" aria-hidden="true" />
            {stats.totalFlies.toLocaleString('en-US')}
          </NavLink>
          <button type="button" className={`${iconBtn} hidden sm:flex`} onClick={() => openModal('help')} aria-label="How to play" title="How to play">
            <CircleHelp className="h-5 w-5" />
          </button>
          <button type="button" className={iconBtn} onClick={() => openModal('settings')} aria-label="Settings" title="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <button type="button" className={iconBtn} onClick={toggleTheme} aria-label={isDark ? 'Switch to day pond' : 'Switch to night pond'} title={isDark ? 'Day' : 'Night'}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button type="button" className={`${iconBtn} md:hidden`} onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="animate-fade-in border-t border-rim bg-pond md:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-3 py-4">
            {[...PLAY_LINKS, ...LEARN_LINKS, INFO_LINKS[0]].map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end
                  className={({ isActive }) => `block rounded-2xl border px-4 py-3 font-display font-medium ${isActive ? 'border-firefly bg-leaf text-ink' : 'border-rim bg-leaf/60 text-ink-2'}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
