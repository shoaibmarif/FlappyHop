import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { REDIRECTS, ROUTES, type RouteMeta } from '../src/seo/routes';
import { buildHead, headToHtml, appJsonLd, faqJsonLd } from '../src/seo/head';
import { SITE, absoluteUrl } from '../src/seo/site';
import { FAQ_ITEMS } from '../src/data/faq';

const HEAD_MARK = '<!--seo-head-->';
const BODY_MARK = '<!--seo-body-->';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const NAV_LINKS = ['/', '/daily', '/frogs', '/how-to-play', '/tips', '/faq'];

/** Plain content shown before the app boots (and to crawlers that don't run JS). */
const staticBody = (route: RouteMeta) => {
  const links = NAV_LINKS.filter((p) => p !== route.path)
    .map((p) => ROUTES.find((r) => r.path === p)!)
    .map((r) => `<li><a href="${r.path}">${esc(r.label === 'Home' ? 'Play' : r.label)}</a></li>`)
    .join('');
  return `<div style="max-width:42rem;margin:0 auto;padding:6rem 1rem;font-family:Nunito,system-ui,sans-serif;color:#b5cfc8;background:#07141d">
      <p style="font-weight:700;color:#fff"><a href="/" style="color:inherit;text-decoration:none">${SITE.name}</a></p>
      <h1 style="font-size:2rem;line-height:1.2;color:#fff;margin:1rem 0;font-family:Fredoka,system-ui,sans-serif">${esc(route.heading)}</h1>
      <p style="line-height:1.6">${esc(route.description)}</p>
      <ul style="margin-top:1.5rem;line-height:1.9">${links}</ul>
    </div>`;
};

const extraJsonLd = (route: RouteMeta) => {
  if (route.app) return [appJsonLd(route.path, route.title, route.description)];
  if (route.path === '/faq') return [faqJsonLd(FAQ_ITEMS)];
  return [];
};

const renderPage = (template: string, route: RouteMeta) =>
  template
    .replace(HEAD_MARK, headToHtml(buildHead(route, extraJsonLd(route))))
    .replace(BODY_MARK, staticBody(route));

const render404 = (template: string) =>
  template
    .replace(HEAD_MARK, `<title>Page not found | ${SITE.name}</title>\n    <meta name="robots" content="noindex, follow" />`)
    .replace(BODY_MARK, '');

const sitemap = (lastmod: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${ROUTES.filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url>\n    <loc>${absoluteUrl(r.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>\n`;

/**
 * Netlify routing. Every page is served from its own prerendered HTML file at a
 * clean URL, old URLs redirect permanently, and anything else gets the 404 page.
 */
const netlifyRedirects = () =>
  [
    ...Object.entries(REDIRECTS).map(([from, to]) => `${from}  ${to}  301`),
    ...ROUTES.filter((r) => r.path !== '/').map((r) => `${r.path}  ${r.path}.html  200`),
    '/*  /404.html  404',
  ].join('\n') + '\n';

const netlifyHeaders = () =>
  [
    '/assets/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  X-Frame-Options: SAMEORIGIN',
  ].join('\n') + '\n';

const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;

export { netlifyRedirects };

export function seoPlugin(): Plugin {
  let outDir = '';
  return {
    name: 'flappyhop-seo',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (ctx.server) {
          const home = ROUTES.find((r) => r.path === '/')!;
          return html.replace(HEAD_MARK, headToHtml(buildHead(home))).replace(BODY_MARK, '');
        }
        return html;
      },
    },
    closeBundle() {
      if (!outDir) return;
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      const template = fs.readFileSync(indexPath, 'utf8');
      if (!template.includes(HEAD_MARK)) return;

      const write = (file: string, content: string) => {
        const full = path.join(outDir, file);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, content);
      };

      for (const route of ROUTES) {
        write(route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`, renderPage(template, route));
      }
      write('404.html', render404(template));
      write('sitemap.xml', sitemap(new Date().toISOString().slice(0, 10)));
      write('robots.txt', robots());
      write('_redirects', netlifyRedirects());
      write('_headers', netlifyHeaders());
    },
  };
}
