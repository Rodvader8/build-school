import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Components and props',
  minutes: 30,
  kind: 'project',
  entry: 'src/pages/index.astro',
  checkEntry: 'check.mjs',
  devPort: 4812,
  devCommand: 'npm run dev -- --port 4812 --host 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'The site builds', test: ({ output }) => passed(output, 'the site builds') },
    { label: 'ProductCard exists with typed props and a slot', test: ({ output }) => passed(output, 'a ProductCard component exists with typed props and a slot') },
    { label: 'The page uses <ProductCard> three times', test: ({ output }) => passed(output, 'the page uses <ProductCard> three times') },
    { label: 'The card markup is no longer copied into the page', test: ({ output }) => passed(output, 'the card markup is not copied into the page any more') },
    { label: 'The built page shows three cards', test: ({ output }) => passed(output, 'the built page shows three product cards') },
    { label: 'Prices show to two decimals', test: ({ output }) => passed(output, 'each card shows its price to two decimals') },
    { label: 'Names and descriptions survive', test: ({ output }) => passed(output, 'each card keeps its name and its description') },
    { label: 'href is optional', test: ({ output }) => passed(output, 'href is optional: some cards link, some do not') },
    { label: 'No inline style attributes', test: ({ output }) => passed(output, 'no inline style attributes') },
  ],
  hints: [
    'A component is just another .astro file. Put it in src/components and import it into the page, then use it like a tag: <ProductCard name="..." price={9}>.',
    'Strings go in quotes (name="Seeded rye"). Numbers and expressions go in braces (price={10.5}). Children between the tags appear where <slot /> is.',
    'For an optional prop, write href?: string in Props, then {href ? <a href={href}>{name}</a> : name}.',
  ],
} satisfies LessonMeta;
