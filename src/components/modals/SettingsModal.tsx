import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import type { ThemeMode } from '../../utils/storage';

const Toggle: React.FC<{ label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, hint, checked, onChange }) => (
  <label className="flex cursor-pointer items-start justify-between gap-4 py-3.5">
    <span>
      <span className="block font-bold text-ink">{label}</span>
      <span className="block text-sm leading-6 text-muted">{hint}</span>
    </span>
    <span className="relative mt-1 shrink-0">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="block h-7 w-12 rounded-full bg-rim transition-colors peer-checked:bg-gradient-to-r peer-checked:from-firefly-glow peer-checked:to-water-glow peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-firefly" />
      <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
    </span>
  </label>
);

export const SettingsModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { settings, updateSettings, clearProgress } = useApp();
  const [confirming, setConfirming] = useState(false);
  const themes: { value: ThemeMode; label: string }[] = [
    { value: "dark", label: "Night" },
    { value: 'light', label: 'Day' },
    { value: 'system', label: 'Auto' },
  ];
  return (
    <Modal open={open} onClose={() => { setConfirming(false); onClose(); }} title="Settings" subtitle="Saved on this device.">
      <fieldset className="pb-3.5">
        <legend className="mb-2 font-bold text-ink">Pond lights</legend>
        <div className="flex rounded-full border border-rim bg-pond-2 p-1">
          {themes.map((t) => (
            <label key={t.value} className="flex-1">
              <input type="radio" className="peer sr-only" name="theme" checked={settings.theme === t.value} onChange={() => updateSettings({ theme: t.value })} />
              <span className="block cursor-pointer rounded-full py-1.5 text-center text-sm font-bold text-muted transition-colors peer-checked:bg-leaf peer-checked:text-ink peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-firefly">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="divide-y divide-rim border-y border-rim">
        <Toggle label="Sound" hint="Hops, splashes and a little tune when you beat your best." checked={settings.sound} onChange={(sound) => updateSettings({ sound })} />
        <Toggle label="Reduce motion" hint="Calms the menus and pop-ups. The pond itself still moves." checked={settings.reducedMotion} onChange={(reducedMotion) => updateSettings({ reducedMotion })} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {confirming ? (
          <>
            <span className="text-sm text-ink-2">Delete your stats, fireflies and achievements?</span>
            <button type="button" className="btn btn-sm bg-ember text-white" onClick={() => { clearProgress(); setConfirming(false); }}>
              Yes, reset
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
              Keep them
            </button>
          </>
        ) : (
          <button type="button" className="text-sm font-bold text-muted underline underline-offset-2 hover:text-ember" onClick={() => setConfirming(true)}>
            Reset all progress
          </button>
        )}
      </div>
    </Modal>
  );
};
