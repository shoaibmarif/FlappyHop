import React from 'react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/seo/SeoMeta';
import { LogoMark } from '../components/layout/Logo';

export const NotFound: React.FC = () => (
  <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center">
    <SeoMeta canonicalPath="/404" title="Page not found" description="This page doesn’t exist." noindex />
    <div className="relative" aria-hidden="true">
      <span className="animate-ripple absolute inset-x-0 bottom-0 mx-auto h-10 w-40 rounded-[50%] border-2 border-water" />
      <LogoMark className="animate-bob h-32 w-32" />
    </div>
    <h1 className="mt-8 text-4xl font-bold">Splash! Wrong lily pad</h1>
    <p className="mt-3 text-lg text-ink-2">This page doesn’t exist, or it hopped away. The pond is still right here.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link to="/" className="btn btn-glow">
        Play FlappyHop
      </Link>
      <Link to="/daily" className="btn btn-ghost">
        Today’s pond
      </Link>
    </div>
  </div>
);
