/**
 * SEO metadata for every page. Used at runtime by <SeoMeta> and at build time
 * by scripts/seoPlugin.ts (one static HTML file per page, sitemap.xml, Netlify
 * _redirects). Keep titles under about 60 characters.
 */
export type ChangeFreq = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  label: string;
  heading: string;
  changefreq: ChangeFreq;
  priority: number;
  noindex?: boolean;
  parent?: string;
  /** Interactive game pages get WebApplication structured data. */
  app?: boolean;
}

const page = (r: Omit<RouteMeta, 'changefreq' | 'priority' | 'parent'> & { priority?: number; changefreq?: ChangeFreq }): RouteMeta => ({
  changefreq: 'monthly',
  priority: 0.5,
  parent: '/',
  ...r,
});

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    title: 'FlappyHop - Free One-Tap Frog Game Online',
    description:
      'Tap to hop a little frog through a moonlit pond. Dodge reeds and vines, bounce off lily pads, catch fireflies and unlock new frogs. Free, no download.',
    label: 'Home',
    heading: 'FlappyHop',
    changefreq: 'weekly',
    priority: 1,
    app: true,
  },
  page({
    path: '/daily',
    title: 'Daily Pond - A New Course Every Day',
    description: 'The same pond for everyone, every day, with a goal to reach. Hit it on back to back days to build a streak.',
    label: 'Daily pond',
    heading: 'Daily pond',
    priority: 0.9,
    app: true,
  }),
  page({
    path: '/frogs',
    title: 'Frogs - Unlock New Frogs With Fireflies',
    description: 'Seven frogs to collect, from Pip the pond frog to Nova, speckled with stars. Catch fireflies to unlock them.',
    label: 'Frogs',
    heading: 'Meet the frogs',
    priority: 0.6,
  }),
  page({
    path: '/stats',
    title: 'Your Stats',
    description: 'Your best score, fireflies, achievements and daily streak, saved on this device.',
    label: 'Stats',
    heading: 'Your pond record',
    noindex: true,
  }),
  page({
    path: '/how-to-play',
    title: 'How to Play FlappyHop - Controls and Rules',
    description: 'Tap or press Space to hop. Here is everything else: lily pads, fireflies, glow bugs, dragonflies, scoring and the daily pond.',
    label: 'How to play',
    heading: 'How to play',
    priority: 0.7,
  }),
  page({
    path: '/tips',
    title: 'FlappyHop Tips - How to Get a Higher Score',
    description: 'Short taps, a steady rhythm and using lily pads as a safety net. Practical tips that add gaps to every run.',
    label: 'Tips',
    heading: 'Tips for a higher score',
    priority: 0.7,
  }),
  page({
    path: '/faq',
    title: 'FlappyHop FAQ - Common Questions Answered',
    description: 'Is it free, does it work on phones, how do lily pads and glow bugs work, and where is my progress saved.',
    label: 'FAQ',
    heading: 'Frequently asked questions',
    priority: 0.6,
  }),
  page({ path: '/about', title: 'About FlappyHop', description: 'Why FlappyHop exists, what makes it different and who builds it.', label: 'About', heading: 'About FlappyHop', changefreq: 'yearly' }),
  page({
    path: '/contact',
    title: 'Contact',
    description: 'Report a bug, suggest a frog or just say hello. Email, LinkedIn and GitHub links for FlappyHop.',
    label: 'Contact',
    heading: 'Contact',
    changefreq: 'yearly',
    priority: 0.4,
  }),
  page({
    path: '/privacy',
    title: 'Privacy Policy',
    description: 'No accounts and no game server. Your progress stays in your browser. Here is the little we collect and how to opt out.',
    label: 'Privacy',
    heading: 'Privacy policy',
    changefreq: 'yearly',
    priority: 0.3,
  }),
  page({ path: '/terms', title: 'Terms and Conditions', description: 'The terms that apply when you use FlappyHop.', label: 'Terms', heading: 'Terms and conditions', changefreq: 'yearly', priority: 0.3 }),
  page({ path: '/sitemap', title: 'Sitemap', description: 'Every page on FlappyHop in one list.', label: 'Sitemap', heading: 'Sitemap', priority: 0.2 }),
];

/** Old or likely URLs, permanently redirected to their page. */
export const REDIRECTS: Record<string, string> = {
  '/play': '/',
  '/game': '/',
  '/daily-challenge': '/daily',
  '/skins': '/frogs',
  '/achievements': '/stats',
  '/help': '/how-to-play',
};

const byPath = new Map(ROUTES.map((m) => [m.path, m]));
export const getRouteMeta = (path: string): RouteMeta | undefined => byPath.get(path);

export const getBreadcrumbs = (path: string): RouteMeta[] => {
  const trail: RouteMeta[] = [];
  let current = byPath.get(path);
  const seen = new Set<string>();
  while (current && !seen.has(current.path)) {
    seen.add(current.path);
    trail.unshift(current);
    current = current.parent ? byPath.get(current.parent) : undefined;
  }
  return trail;
};
