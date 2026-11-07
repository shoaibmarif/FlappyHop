import React, { useEffect } from 'react';
import { getRouteMeta } from '../../seo/routes';
import { buildHead, type JsonLd } from '../../seo/head';
import { SITE } from '../../seo/site';

interface SeoMetaProps {
  /** Path of the canonical URL. Title/description come from src/seo/routes.ts. */
  canonicalPath: string;
  /** Overrides - only needed for pages that are not in the route registry. */
  title?: string;
  description?: string;
  noindex?: boolean;
  structuredData?: JsonLd | JsonLd[];
}

/**
 * Keeps <head> in sync with the current page during client-side navigation.
 * The same tags are written into static HTML at build time (see vite.config.ts),
 * so crawlers and link previews get them without running JavaScript.
 */
export const SeoMeta: React.FC<SeoMetaProps> = ({
  canonicalPath,
  title,
  description,
  noindex,
  structuredData,
}) => {
  const json = JSON.stringify(structuredData ?? null);

  useEffect(() => {
    const registered = getRouteMeta(canonicalPath);
    const extra = structuredData
      ? Array.isArray(structuredData)
        ? structuredData
        : [structuredData]
      : [];
    const head = buildHead(
      {
        path: canonicalPath,
        title: title ?? registered?.title ?? SITE.name,
        description: description ?? registered?.description ?? SITE.defaultDescription,
        noindex: noindex ?? registered?.noindex,
      },
      extra
    );

    document.title = head.title;

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!registered && (noindex ?? false)) {
      // Error/utility pages should not advertise a canonical URL.
      canonical?.remove();
      canonical = null;
    } else if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    if (canonical) canonical.href = head.canonical;

    for (const m of head.meta) {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${m.key}="${m.id}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(m.key, m.id);
        document.head.appendChild(tag);
      }
      tag.content = m.content;
    }

    // Replace (not accumulate) structured data from the previous page.
    document.head.querySelectorAll('script[data-seo]').forEach((el) => el.remove());
    for (const block of head.jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seo = '';
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalPath, title, description, noindex, json]);

  return null;
};
