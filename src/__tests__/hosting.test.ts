import { describe, it, expect } from 'vitest';
import { REDIRECTS, ROUTES } from '../seo/routes';
import { netlifyRedirects } from '../../scripts/seoPlugin';

describe('Netlify routing', () => {
  const lines = netlifyRedirects().trim().split('\n');

  it('serves every page from its prerendered file', () => {
    for (const r of ROUTES) if (r.path !== '/') expect(lines).toContain(`${r.path}  ${r.path}.html  200`);
  });

  it('redirects retired URLs permanently to live pages', () => {
    const live = new Set(ROUTES.map((r) => r.path));
    for (const [from, to] of Object.entries(REDIRECTS)) {
      expect(lines).toContain(`${from}  ${to}  301`);
      expect(live.has(from)).toBe(false);
      expect(live.has(to)).toBe(true);
    }
  });

  it('ends with the 404 fallback', () => {
    expect(lines.at(-1)).toBe('/*  /404.html  404');
  });

  it('keeps titles and descriptions a sensible length', () => {
    for (const r of ROUTES) {
      expect(r.title.length, r.path).toBeLessThanOrEqual(65);
      expect(r.description.length, r.path).toBeLessThanOrEqual(170);
    }
  });
});
