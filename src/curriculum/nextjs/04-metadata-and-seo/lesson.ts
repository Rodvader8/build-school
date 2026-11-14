import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Metadata and SEO',
  minutes: 55,
  kind: 'project',
  entry: 'app/layout.jsx',
  checkEntry: 'check.mjs',
  devPort: 4844,
  devCommand: 'npm run dev -- --port 4844 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the layout sets a title template, a description and an Open Graph image',
    'item pages get their own title and description from generateMetadata',
    'the sitemap lists every page and menu item as an absolute URL',
    'robots.txt allows crawling and points at the sitemap',
    'the site builds',
    'every page has its own title, and inner pages end with | Fennel & Co',
    'every page has a meta description',
    'every page has a canonical link',
    'og:image is an absolute JPG or PNG that exists in public/',
    'the build creates sitemap.xml with every page',
    'the build creates robots.txt pointing at the sitemap',
    'the home page has Bakery structured data',
  ]),
  hints: [
    'Put the shared defaults in the layout: metadataBase: new URL(SITE_URL), title: { default: SITE_NAME, template: \'%s | Fennel & Co\' }, alternates: { canonical: \'./\' } and openGraph.images. A page then only needs title: \'Menu\'.',
    'generateMetadata is an async function in the page file. It receives the same params Promise as the page, so await it, find the item and return { title, description }.',
    'sitemap.js and robots.js each export one default function. The sitemap returns [{ url }], robots returns { rules: { userAgent: \'*\', allow: \'/\' }, sitemap }. For og:image, public/og.jpg is already there. Never point it at a WebP, because many social sites ignore them.',
  ],
} satisfies LessonMeta;
