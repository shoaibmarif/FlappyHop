import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ConsentBanner } from '../ui/ConsentBanner';
import { Toasts } from '../ui/Toasts';
import { HelpModal } from '../modals/HelpModal';
import { SettingsModal } from '../modals/SettingsModal';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { modal, closeModal } = useApp();
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-leaf focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-3 pt-4 sm:px-6 sm:pt-8">
        {children}
      </main>
      <Footer />
      <ConsentBanner />
      <Toasts />
      <HelpModal open={modal === 'help'} onClose={closeModal} />
      <SettingsModal open={modal === 'settings'} onClose={closeModal} />
    </div>
  );
};
