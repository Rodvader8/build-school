import type { LessonMeta } from '../../types';
import { mediaRules, rulesFor, rulesInMedia, ruleValue } from '../../helpers';

const base = (doc: Document) => rulesFor(doc, '.nm-header').filter((r) => r.parentRule === null);
const wide = (doc: Document) => rulesInMedia(doc, /min-width/);

export default {
  title: 'Responsive, mobile-first',
  minutes: 20,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'Phones first: the base .nm-header is a column', test: ({ doc }) => base(doc).some((r) => r.style.getPropertyValue('flex-direction') === 'column') },
    { label: 'The base .nm-header no longer sets justify-content', test: ({ doc }) => base(doc).length > 0 && base(doc).every((r) => !r.style.getPropertyValue('justify-content')) },
    { label: 'A min-width media query exists', test: ({ doc }) => mediaRules(doc).some((m) => /min-width/.test(m.conditionText)) },
    { label: 'Inside it, the header becomes a row', test: ({ doc }) => ruleValue(wide(doc), '.nm-header', 'flex-direction') === 'row' && ruleValue(wide(doc), '.nm-header', 'justify-content') === 'space-between' },
    { label: 'Inside it, sections get 120px / 48px padding', test: ({ doc }) => /^120px 48px$/.test(ruleValue(wide(doc), '.nm-section', 'padding')) || (ruleValue(wide(doc), '.nm-section', 'padding-top') === '120px' && ruleValue(wide(doc), '.nm-section', 'padding-left') === '48px') },
    { label: 'No max-width media queries (mobile-first only)', test: ({ doc }) => mediaRules(doc).every((m) => !/max-width/.test(m.conditionText)) },
  ],
  hints: [
    'Two .nm-header rules: one plain (for phones) and one inside @media (min-width: 48rem) { ... } for bigger screens.',
    'Rules inside a media query sit inside its curly braces, so you\'ll have two closing braces at the end.',
  ],
} satisfies LessonMeta;
