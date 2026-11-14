import type { LessonMeta } from '../../types';
import { computed, withoutRoot } from '../../helpers';

const TOKENS = ['ink', 'paper', 'muted', 'gold', 'gold-hi', 'panel', 'line'];

export default {
  title: 'Colours as design tokens',
  minutes: 15,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'All seven --nm- tokens are defined on :root', test: ({ doc, win }) => TOKENS.every((t) => win.getComputedStyle(doc.documentElement).getPropertyValue(`--nm-${t}`).trim() !== '') },
    { label: 'No hex or rgb colours left outside :root', test: ({ files }) => { const rest = withoutRoot(files['style.css'] ?? ''); return !/#[0-9a-f]{3,8}\b/i.test(rest) && !/rgba?\(/i.test(rest); } },
    { label: 'Colours use var(--nm-...) at least 8 times', test: ({ files }) => ((files['style.css'] ?? '').match(/var\(--nm-/g) ?? []).length >= 8 },
    { label: 'The page still looks the same', test: (c) => computed(c, 'body', 'background-color') === 'rgb(12, 18, 32)' && computed(c, 'h1', 'color') === 'rgb(242, 195, 139)' && computed(c, '.nm-card', 'background-color') === 'rgb(20, 27, 45)' },
  ],
  hints: [
    'Work top to bottom. Each time you see a # colour, swap it for the var() with the same value from the table.',
    'The faint card border is rgba(...). That becomes var(--nm-line).',
    'If a colour disappears, check the spelling of the token. A typo in var() leaves the property unset.',
  ],
} satisfies LessonMeta;
