import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'App Router, pages and layouts',
  minutes: 50,
  kind: 'project',
  entry: 'app/layout.jsx',
  checkEntry: 'check.mjs',
  devPort: 4841,
  devCommand: 'npm run dev -- --port 4841 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the root layout wraps pages in a header with Home, Menu and About links and a main area',
    'the menu page links each item to /menu/<slug>',
    'an item page shows the name, price and description of the item',
    'an unknown item calls notFound()',
    'the site builds',
    'every route is prerendered: home, about, menu and each menu item',
    'the menu layout wraps the menu pages',
    'the shared header appears on every page',
    'every page has exactly one h1',
    'the not-found page is custom',
  ]),
  hints: [
    'A folder is a URL, and the page.jsx inside it is what shows. app/about/page.jsx becomes /about. Wrap the pieces you share (header, footer) in app/layout.jsx and render {children} where the page goes.',
    'A layout in a subfolder wraps only that folder and everything under it: app/menu/layout.jsx. Link is imported from next/link, and it takes href like an anchor.',
    'In app/menu/[slug]/page.jsx, params is a Promise in Next 16: const { slug } = await params. If the slug isn\'t in the menu, call notFound() from next/navigation. generateStaticParams returns one { slug } per item so each is built ahead of time.',
  ],
} satisfies LessonMeta;
