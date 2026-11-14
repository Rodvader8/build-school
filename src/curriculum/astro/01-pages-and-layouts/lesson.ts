import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Pages and layouts',
  minutes: 30,
  kind: 'project',
  entry: 'src/pages/index.astro',
  checkEntry: 'check.mjs',
  devPort: 4811,
  devCommand: 'npm run dev -- --port 4811 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'A layout exists with a slot and props', test: ({ output }) => passed(output, 'a layout exists with a slot and props') },
    { label: 'Pages use the layout instead of repeating the page shell', test: ({ output }) => passed(output, 'index and menu use the layout instead of repeating the page shell') },
    { label: 'There is an about page', test: ({ output }) => passed(output, 'there is an about page') },
    { label: 'Every page has its own title', test: ({ output }) => passed(output, 'every page has its own title') },
    { label: 'Every page has a meta description', test: ({ output }) => passed(output, 'every page has a meta description') },
    { label: 'Every page says lang="en-AU"', test: ({ output }) => passed(output, 'every page says lang="en-AU"') },
    { label: 'Every page has the same navigation, including About', test: ({ output }) => passed(output, 'every page has the same navigation, including About') },
    { label: 'Every page has exactly one h1', test: ({ output }) => passed(output, 'every page has exactly one h1') },
  ],
  hints: [
    'A file in src/pages becomes a URL: about.astro is /about. The layout lives in src/layouts and is not a page itself.',
    'In the layout, read the props with const { title, description } = Astro.props; and put <slot /> where each page\'s own content should go.',
    'In a page, import Base from \'../layouts/Base.astro\'; then write <Base title="..." description="..."> with the page content inside it.',
  ],
} satisfies LessonMeta;
