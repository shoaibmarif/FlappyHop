import React from 'react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../seo/SeoMeta';
import { getRouteMeta } from '../../seo/routes';
import type { JsonLd } from '../../seo/head';

interface ContentPageProps {
  path: string;
  eyebrow?: string;
  intro?: React.ReactNode;
  structuredData?: JsonLd | JsonLd[];
  children: React.ReactNode;
  wide?: boolean;
}

/** Shared frame for the text pages. */
export const ContentPage: React.FC<ContentPageProps> = ({ path, eyebrow, intro, structuredData, children, wide = false }) => {
  const meta = getRouteMeta(path);
  return (
    <div className={`mx-auto w-full pt-4 ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>
      <SeoMeta canonicalPath={path} structuredData={structuredData} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link to="/" className="hover:text-ink">
          Pond
        </Link>
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        <span aria-current="page" className="text-ink-2">
          {meta?.label}
        </span>
      </nav>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl">{meta?.heading}</h1>
      {intro && <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-2">{intro}</p>}
      <div className="mt-10">{children}</div>
    </div>
  );
};
