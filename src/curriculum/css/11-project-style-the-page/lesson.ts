import type { LessonMeta } from '../../types';
import { computed, px, ruleValue, withoutRoot } from '../../helpers';

const anyRule = (doc: Document, selectors: string[], prop: string) => selectors.some((s) => !!ruleValue(doc, s, prop));

export default {
  title: 'Project: style the whole page',
  minutes: 45,
  kind: 'web',
  entry: 'style.css',
  checks: [
    { label: 'Steps: a grid with a gap', test: (c) => computed(c, '.nm-steps', 'display') === 'grid' && px(computed(c, '.nm-steps', 'row-gap')) > 0 },
    { label: 'Fee table: full width with collapsed borders', test: (c) => computed(c, '.nm-fees', 'border-collapse') === 'collapse' && Math.abs(c.doc.querySelector('.nm-fees')!.getBoundingClientRect().width - c.doc.querySelector('#fees')!.getBoundingClientRect().width + px(computed(c, '#fees', 'padding-left')) * 2) < 2 },
    { label: 'Fee table: left-aligned cells with 8px+ padding', test: (c) => computed(c, '.nm-fees th', 'text-align') === 'left' && computed(c, '.nm-fees td', 'text-align') === 'left' && px(computed(c, '.nm-fees td', 'padding-top')) >= 8 },
    { label: 'Fee table: a faint line under each row', test: (c) => px(computed(c, '.nm-fees td', 'border-bottom-width')) >= 1 && computed(c, '.nm-fees td', 'border-bottom-style') !== 'none' },
    { label: 'Form: a grid with gaps and a max-width', test: (c) => computed(c, '.nm-form', 'display') === 'grid' && px(computed(c, '.nm-form', 'row-gap')) > 0 && computed(c, '.nm-form', 'max-width') !== 'none' },
    { label: 'Inputs suit a dark page (panel background, paper text)', test: (c) => computed(c, '.nm-form input', 'background-color') === 'rgb(20, 27, 45)' && computed(c, '.nm-form input', 'color') === 'rgb(232, 228, 218)' && computed(c, '.nm-form textarea', 'background-color') === 'rgb(20, 27, 45)' },
    { label: 'Inputs use the page font (font: inherit)', test: (c) => computed(c, '.nm-form input', 'font-family') === computed(c, 'body', 'font-family') },
    { label: 'Inputs show a focus-visible outline', test: ({ doc }) => anyRule(doc, ['.nm-form input:focus-visible', 'input:focus-visible', '.nm-form :focus-visible'], 'outline') || anyRule(doc, ['.nm-form input:focus-visible', 'input:focus-visible'], 'outline-style') },
    { label: 'Footer: padding, a top border, muted text', test: (c) => px(computed(c, '.nm-footer', 'padding-top')) > 0 && px(computed(c, '.nm-footer', 'border-top-width')) >= 1 && computed(c, '.nm-footer', 'color') === 'rgb(184, 178, 164)' },
    { label: 'House rule: every colour comes from a token', test: ({ files }) => { const rest = withoutRoot(files['style.css'] ?? ''); return !/#[0-9a-f]{3,8}\b/i.test(rest) && !/rgba?\(/i.test(rest); } },
    { label: 'House rule: no inline styles', test: ({ doc, files }) => !doc.querySelector('[style]') && !/\sstyle\s*=/.test(files['index.html'] ?? '') },
  ],
  hints: [
    'Target the cells together with a selector list: .nm-fees th, .nm-fees td { ... }',
    'Same for the form fields: .nm-form input, .nm-form textarea { ... }',
    'Open the index.html tab to see the class names the steps, table, form and footer already have.',
  ],
} satisfies LessonMeta;
