import React from 'react';
import { SeoMeta } from '../seo/SeoMeta';
import { appJsonLd } from '../../seo/head';
import { getRouteMeta } from '../../seo/routes';

/** SEO tags plus a readable section under the board for each game page. */
export const GamePage: React.FC<{ path: string; game: React.ReactNode; children?: React.ReactNode; wide?: boolean }> = ({ path, game, children, wide = false }) => {
  const meta = getRouteMeta(path)!;
  return (
    <>
      <SeoMeta canonicalPath={path} structuredData={appJsonLd(path, meta.title, meta.description)} />
      {game}
      {children && <div className={`mx-auto mt-16 w-full ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}>{children}</div>}
    </>
  );
};
