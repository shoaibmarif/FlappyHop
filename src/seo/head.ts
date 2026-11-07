import { SITE, absoluteUrl } from './site';
import { getBreadcrumbs, type RouteMeta } from './routes';

export type JsonLd = Record<string, unknown>;

export interface HeadData {
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
  meta: { key: 'name' | 'property'; id: string; content: string }[];
  jsonLd: JsonLd[];
}

export const formatTitle = (title: string): string =>
  title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export const organizationJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/icon-512.png'),
  founder: { '@type': 'Person', name: SITE.author.name, url: SITE.author.url },
  sameAs: [SITE.author.github, SITE.author.linkedin],
});

export const websiteJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE.name,
  url: absoluteUrl('/'),
  description: SITE.defaultDescription,
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
});

export const appJsonLd = (path: string, name: string, description: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name,
  description,
  url: absoluteUrl(path),
  image: absoluteUrl(SITE.ogImage),
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  inLanguage: 'en',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: SITE.author.name, url: SITE.author.url },
  publisher: { '@id': ORG_ID },
});

export const faqJsonLd = (items: { question: string; answer: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.question,
    acceptedAnswer: { '@type': 'Answer', text: i.answer },
  })),
});

export const breadcrumbJsonLd = (path: string): JsonLd | null => {
  const trail = getBreadcrumbs(path);
  if (trail.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.label,
      item: absoluteUrl(m.path),
    })),
  };
};

/** Builds every head tag for a page. Shared by the runtime and the prerenderer. */
export const buildHead = (
  route: Pick<RouteMeta, 'path' | 'title' | 'description' | 'noindex'>,
  extraJsonLd: JsonLd[] = []
): HeadData => {
  const title = formatTitle(route.title);
  const canonical = absoluteUrl(route.path);
  const image = absoluteUrl(SITE.ogImage);
  const noindex = Boolean(route.noindex);

  const crumbs = breadcrumbJsonLd(route.path);
  const jsonLd = [
    ...(route.path === '/' ? [websiteJsonLd(), organizationJsonLd()] : []),
    ...(crumbs ? [crumbs] : []),
    ...extraJsonLd,
  ];

  return {
    title,
    description: route.description,
    canonical,
    noindex,
    jsonLd,
    meta: [
      { key: 'name', id: 'description', content: route.description },
      {
        key: 'name',
        id: 'robots',
        content: noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
      },
      { key: 'property', id: 'og:site_name', content: SITE.name },
      { key: 'property', id: 'og:locale', content: SITE.locale },
      { key: 'property', id: 'og:type', content: 'website' },
      { key: 'property', id: 'og:title', content: title },
      { key: 'property', id: 'og:description', content: route.description },
      { key: 'property', id: 'og:url', content: canonical },
      { key: 'property', id: 'og:image', content: image },
      { key: 'property', id: 'og:image:width', content: String(SITE.ogImageWidth) },
      { key: 'property', id: 'og:image:height', content: String(SITE.ogImageHeight) },
      { key: 'property', id: 'og:image:alt', content: SITE.ogImageAlt },
      { key: 'name', id: 'twitter:card', content: 'summary_large_image' },
      { key: 'name', id: 'twitter:title', content: title },
      { key: 'name', id: 'twitter:description', content: route.description },
      { key: 'name', id: 'twitter:image', content: image },
      { key: 'name', id: 'twitter:image:alt', content: SITE.ogImageAlt },
    ],
  };
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serialises HeadData to HTML for static prerendering. */
export const headToHtml = (h: HeadData): string =>
  [
    `<title>${esc(h.title)}</title>`,
    `<link rel="canonical" href="${esc(h.canonical)}" />`,
    ...h.meta.map((m) => `<meta ${m.key}="${m.id}" content="${esc(m.content)}" />`),
    ...h.jsonLd.map(
      (j) =>
        `<script type="application/ld+json" data-seo>${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`
    ),
  ].join('\n    ');
