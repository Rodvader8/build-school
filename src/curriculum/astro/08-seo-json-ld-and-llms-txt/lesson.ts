import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'SEO, JSON-LD and llms.txt',
  minutes: 40,
  kind: 'project',
  entry: 'src/layouts/Base.astro',
  checkEntry: 'check.mjs',
  devPort: 4818,
  devCommand: 'npm run dev -- --port 4818 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'An absolute canonical link', test: ({ output }) => passed(output, 'the page has an absolute canonical link') },
    { label: 'Open Graph title, description, url and type', test: ({ output }) => passed(output, 'Open Graph title, description, url and type are set') },
    { label: 'og:image is an absolute JPG', test: ({ output }) => passed(output, 'og:image is an absolute JPG') },
    { label: 'The meta description is a useful length', test: ({ output }) => passed(output, 'the meta description is a useful length') },
    { label: 'Exactly one h1', test: ({ output }) => passed(output, 'there is exactly one h1') },
    { label: 'One JSON-LD block that parses', test: ({ output }) => passed(output, 'there is one JSON-LD block and it parses') },
    { label: 'The JSON-LD says Bakery on schema.org', test: ({ output }) => passed(output, 'the JSON-LD says this is a Bakery on schema.org') },
    { label: 'Name, telephone and url come from the data', test: ({ output }) => passed(output, 'name, telephone and url come from the data') },
    { label: 'The address is the suburb only', test: ({ output }) => passed(output, 'the address is the suburb only') },
    { label: 'Opening hours match the data', test: ({ output }) => passed(output, 'opening hours match the data') },
    { label: 'Nothing typed into the layout', test: ({ output }) => passed(output, 'no business details are typed into the layout') },
    { label: 'llms.txt starts with the name and a summary', test: ({ output }) => passed(output, 'llms.txt starts with the name and a summary') },
    { label: 'llms.txt links to the site and lists services', test: ({ output }) => passed(output, 'llms.txt links to the site and lists the services') },
    { label: 'robots.txt allows crawlers', test: ({ output }) => passed(output, 'robots.txt allows crawlers') },
  ],
  hints: [
    'Anything in public/ is copied to the root of the site, so public/llms.txt becomes /llms.txt and public/robots.txt becomes /robots.txt.',
    'In the layout\'s top half, build a plain object called schema from business. Then in the head: <script type="application/ld+json" set:html={JSON.stringify(schema)} />.',
    'Astro.site comes from astro.config.mjs. new URL(Astro.url.pathname, Astro.site).href gives this page\'s full https:// address for the canonical and og:url.',
  ],
} satisfies LessonMeta;
