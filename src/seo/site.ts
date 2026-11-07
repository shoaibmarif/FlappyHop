/**
 * Brand and deployment details in one place. Change `url` if the domain
 * changes: canonical URLs, the sitemap, social tags and structured data all
 * derive from it.
 */
export const SITE = {
  name: 'FlappyHop',
  url: 'https://flappyhop.netlify.app',
  defaultDescription:
    'FlappyHop is a free one-tap game: hop a little frog through a moonlit pond, bounce off lily pads, catch fireflies and unlock new frogs. Works on phones and computers.',
  locale: 'en_US',
  ogImage: '/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'FlappyHop, a free one-tap frog game',
  author: {
    name: 'Shoaib Arif',
    url: 'https://shoaibarif.vercel.app/',
    github: 'https://github.com/shoaibmarif',
    linkedin: 'https://www.linkedin.com/in/shoaibmarif/',
    email: 'shoaibmuhammadarif@gmail.com',
  },
  repo: 'https://github.com/shoaibmarif/flappyhop',
  issues: 'https://github.com/shoaibmarif/flappyhop/issues',
} as const;

export const absoluteUrl = (path: string): string => (path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`);
