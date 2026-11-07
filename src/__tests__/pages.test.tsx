import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../seo/routes';
import { App } from '../App';
import { AppProvider } from '../context/AppContext';

beforeAll(() => {
  window.scrollTo = () => {};
  localStorage.setItem('flappyhop_seen_help', '1');
  window.matchMedia ??= ((q: string) => ({
    matches: false, media: q, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});
afterEach(cleanup);

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>
  );

describe('every page renders with its SEO tags', () => {
  for (const route of ROUTES) {
    it(route.path, async () => {
      renderAt(route.path);
      const h1 = await screen.findByRole('heading', { level: 1 }, { timeout: 5000 });
      expect(h1.textContent?.length).toBeGreaterThan(0);
      await new Promise((r) => setTimeout(r, 0));
      expect(document.title).toContain(route.title.split(' - ')[0]);
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        route.path === '/' ? 'https://flappyhop.netlify.app/' : `https://flappyhop.netlify.app${route.path}`
      );
    });
  }

  it('shows a noindex 404 for unknown URLs', async () => {
    renderAt('/nope');
    expect(await screen.findByRole('heading', { level: 1, name: /Wrong lily pad/ })).toBeTruthy();
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
  });

  it('the game shows its controls and frog picker', async () => {
    renderAt('/');
    expect(await screen.findByRole('img', { name: /press Space to hop/ })).toBeTruthy();
    expect(screen.getByRole('radiogroup', { name: 'Choose a frog' })).toBeTruthy();
  });
});
