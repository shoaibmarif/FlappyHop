import React from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../ui/Modal';

const STEPS = [
  { icon: '🐸', title: 'Tap to hop', body: 'Tap, click or press Space. Each tap is a little hop upwards. Let go and the frog falls.' },
  { icon: '🌿', title: 'Thread the gaps', body: 'Hop through the openings between the hanging vines and the reeds. Every gap is a point.' },
  { icon: '🪷', title: 'Lily pads save you', body: 'The pond is wet. Fall in and it’s over, unless you land on a lily pad: it bounces you back up, once.' },
  { icon: '✨', title: 'Catch fireflies', body: 'Fireflies in a quick chain build a combo. Collect enough and you unlock new frogs.' },
  { icon: '🛡️', title: 'Golden glow bugs', body: 'Rare and precious. Catch one and it saves you from your next bump.' },
];

export const HelpModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} title="How to play" subtitle="One button. A lot of pond.">
    <ol className="space-y-4">
      {STEPS.map((s) => (
        <li key={s.title} className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pond-2 text-2xl" aria-hidden="true">
            {s.icon}
          </span>
          <span>
            <span className="block font-display font-semibold">{s.title}</span>
            <span className="block text-sm leading-6 text-ink-2">{s.body}</span>
          </span>
        </li>
      ))}
    </ol>
    <p className="mt-4 text-sm text-ink-2">
      Watch out for dragonflies once you pass 15 gaps. More in the{' '}
      <Link to="/how-to-play" onClick={onClose} className="font-bold text-water underline underline-offset-2">
        full guide
      </Link>{' '}
      and{' '}
      <Link to="/tips" onClick={onClose} className="font-bold text-water underline underline-offset-2">
        tips
      </Link>
      .
    </p>
    <button type="button" className="btn btn-glow mt-5 w-full" onClick={onClose}>
      Let’s hop
    </button>
  </Modal>
);
