import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';

const page = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));

// The home page ships in the main bundle; everything else loads on demand.
const Daily = page(() => import('./pages/Daily'), 'Daily');
const Frogs = page(() => import('./pages/Frogs'), 'Frogs');
const StatsPage = page(() => import('./pages/StatsPage'), 'StatsPage');
const HowToPlay = page(() => import('./pages/HowToPlay'), 'HowToPlay');
const Tips = page(() => import('./pages/Tips'), 'Tips');
const Faq = page(() => import('./pages/Faq'), 'Faq');
const About = page(() => import('./pages/About'), 'About');
const Contact = page(() => import('./pages/Contact'), 'Contact');
const Privacy = page(() => import('./pages/Privacy'), 'Privacy');
const Terms = page(() => import('./pages/Terms'), 'Terms');
const Sitemap = page(() => import('./pages/Sitemap'), 'Sitemap');
const NotFound = page(() => import('./pages/NotFound'), 'NotFound');

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Loading = () => <div className="min-h-[70vh]" aria-busy="true" />;

export const App: React.FC = () => {
  const { pathname } = useLocation();

  // The page loaded fine, so a later stale-file error may reload again.
  useEffect(() => {
    try {
      sessionStorage.removeItem('flappyhop.chunk-reload');
    } catch {
      // storage blocked
    }
  }, []);

  return (
    <AppLayout>
      <ScrollToTop />
      <ErrorBoundary resetKey={pathname}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/frogs" element={<Frogs />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppLayout>
  );
};
