import React from 'react';
import { Link } from 'react-router-dom';

/** A frog peeking over a lily pad. */
export const LogoMark: React.FC<{ className?: string }> = ({ className = 'h-10 w-10' }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <ellipse cx="24" cy="38" rx="21" ry="7" fill="#2f8f4e" />
    <path d="M24 38 L45 36 A21 7 0 0 0 40 33 Z" fill="#07141d" opacity="0.35" />
    <ellipse cx="24" cy="29" rx="15" ry="11" fill="#4cc768" />
    <ellipse cx="24" cy="33" rx="9" ry="5" fill="#c8f7a6" />
    <circle cx="16" cy="19" r="6.5" fill="#4cc768" />
    <circle cx="32" cy="19" r="6.5" fill="#4cc768" />
    <circle cx="16.5" cy="18.5" r="4.2" fill="#fff" />
    <circle cx="32.5" cy="18.5" r="4.2" fill="#fff" />
    <circle cx="17.5" cy="18.5" r="2.2" fill="#10302a" />
    <circle cx="33.5" cy="18.5" r="2.2" fill="#10302a" />
    <path d="M18 29 Q24 33 30 29" stroke="#2f9c4c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <circle cx="41" cy="9" r="2.5" fill="#d9ff6a" />
    <circle cx="41" cy="9" r="5" fill="#d9ff6a" opacity="0.3" />
  </svg>
);

export const Logo: React.FC = () => (
  <Link to="/" className="group flex items-center gap-2" aria-label="FlappyHop home">
    <LogoMark className="h-10 w-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6" />
    <span className="font-display text-2xl font-bold tracking-tight">
      Flappy<span className="glow-text">Hop</span>
    </span>
  </Link>
);
