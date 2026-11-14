import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Structured data (JSON-LD)',
  minutes: 35,
  kind: 'node',
  entry: 'site/index.html',
  checkEntry: 'check.mjs',
  checks: [
    { label: 'Every JSON-LD block is valid JSON with @context https://schema.org', test: ({ output }) => passed(output, 'every JSON-LD block is valid') },
    { label: 'LocalBusiness has a name, url, telephone, description and areaServed', test: ({ output }) => passed(output, 'LocalBusiness has its required fields') },
    { label: 'The address is a suburb only: locality, region and country, no street', test: ({ output }) => passed(output, 'the address is suburb only') },
    { label: 'Service has a name, type, description and areaServed, and names its provider', test: ({ output }) => passed(output, 'Service has its required fields') },
    { label: 'FAQPage has at least three questions, each with an answer', test: ({ output }) => passed(output, 'FAQPage has three or more complete questions') },
    { label: 'Every FAQ question and answer matches what visitors can read', test: ({ output }) => passed(output, 'the FAQ matches the visible page') },
    { label: 'No street address appears anywhere on the page', test: ({ output }) => passed(output, 'no street address anywhere') },
  ],
  hints: [
    'JSON is strict: double quotes on every key and string, commas between items and never after the last one. Paste a block into the terminal with node -e "JSON.parse(...)" if you can\'t spot the error.',
    'Delete streetAddress completely. A home-based business lists its suburb, state and country, and uses areaServed for the places it works in.',
    'Copy each question and answer from the page word for word into the FAQPage. Google only trusts structured data that matches what\'s visible.',
  ],
} satisfies LessonMeta;
