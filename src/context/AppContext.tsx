import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadSettings, loadStats, resetStats, saveSettings, saveStats, type Settings } from '../utils/storage';
import { EMPTY_STATS, recordRun, type RunOutcome, type RunRecord, type Stats } from '../game/progress';
import { sound } from '../utils/sound';

type Modal = 'settings' | 'help' | null;

interface Toast {
  id: number;
  icon: string;
  title: string;
  body: string;
}

interface AppContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  isDark: boolean;
  toggleTheme: () => void;
  stats: Stats;
  record: (r: RunRecord) => RunOutcome;
  clearProgress: () => void;
  modal: Modal;
  openModal: (m: Exclude<Modal, null>) => void;
  closeModal: () => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const systemDark = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [stats, setStats] = useState<Stats>(loadStats);
  const [modal, setModal] = useState<Modal>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [osDark, setOsDark] = useState(systemDark);

  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && osDark);

  useEffect(() => {
    saveSettings(settings);
    sound.setMuted(!settings.sound);
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
  }, [settings.reducedMotion]);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = () => setOsDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Show the rules once, on the first visit.
  useEffect(() => {
    try {
      if (localStorage.getItem('flappyhop_seen_help')) return;
      const id = window.setTimeout(() => {
        localStorage.setItem('flappyhop_seen_help', '1');
        setModal('help');
      }, 700);
      return () => window.clearTimeout(id);
    } catch {
      // storage blocked: skip the welcome
    }
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const toggleTheme = useCallback(() => setSettings((s) => ({ ...s, theme: isDarkFor(s) ? 'light' : 'dark' })), []);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list.slice(-2), { ...t, id }]);
    window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 4500);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((list) => list.filter((x) => x.id !== id)), []);

  const record = useCallback((r: RunRecord) => {
    // Read the latest saved stats so two tabs don't overwrite each other's runs.
    const outcome = recordRun(loadStats(), r);
    saveStats(outcome.stats);
    setStats(outcome.stats);
    return outcome;
  }, []);

  const clearProgress = useCallback(() => {
    resetStats();
    setStats(EMPTY_STATS);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      settings,
      updateSettings,
      isDark,
      toggleTheme,
      stats,
      record,
      clearProgress,
      modal,
      openModal: setModal,
      closeModal: () => setModal(null),
      toasts,
      pushToast,
      dismissToast,
    }),
    [settings, updateSettings, isDark, toggleTheme, stats, record, clearProgress, modal, toasts, pushToast, dismissToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

function isDarkFor(s: Settings) {
  return s.theme === 'dark' || (s.theme === 'system' && systemDark());
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
