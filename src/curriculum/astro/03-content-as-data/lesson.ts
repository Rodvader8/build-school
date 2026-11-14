import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Content as data',
  minutes: 35,
  kind: 'project',
  entry: 'src/data/saltmarsh-bakehouse.ts',
  checkEntry: 'check.mjs',
  devPort: 4813,
  devCommand: 'npm run dev -- --port 4813 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'Both businesses get a page', test: ({ output }) => passed(output, 'both businesses get a page') },
    { label: 'One [slug].astro template makes them', test: ({ output }) => passed(output, 'the pages come from one [slug].astro template') },
    { label: 'Each page has its business name as the h1', test: ({ output }) => passed(output, 'each page has its business name as the h1') },
    { label: 'Taglines and descriptions come from the data', test: ({ output }) => passed(output, 'each page shows its tagline and a description meta tag') },
    { label: 'Every service is listed', test: ({ output }) => passed(output, 'every service is listed') },
    { label: 'Every opening-hours row is listed', test: ({ output }) => passed(output, 'every opening-hours row is listed') },
    { label: 'The phone number is a tel: link', test: ({ output }) => passed(output, 'the phone number is a tel: link') },
    { label: 'Each page only shows its own business', test: ({ output }) => passed(output, 'each page only shows its own business') },
    { label: 'No content typed into the template', test: ({ output }) => passed(output, 'no phone numbers or names typed into the page template') },
  ],
  hints: [
    'A file called [slug].astro is a dynamic route. getStaticPaths returns one { params: { slug }, props: { business } } per page you want built.',
    'Inside the page, const { business } = Astro.props; gives you the one business for this page. Then {business.name}, {business.services.map(...)} and so on.',
    'For the phone link: const phoneHref = \'tel:\' + business.phone.replace(/\\s/g, \'\'); then <a href={phoneHref}>.',
  ],
} satisfies LessonMeta;
