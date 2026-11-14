import type { LessonMeta } from '../../types';
import { errors, fire, typeInto } from '../../helpers';

const names = (doc: Document) => Array.from(doc.querySelectorAll('.db-entities tr td:first-child')).map((td) => td.textContent?.trim());
const header = (doc: Document, key: string) => doc.querySelector(`th[data-key="${key}"]`);
const clickHeader = (c: Parameters<LessonMeta['checks'][number]['test']>[0], key: string) => fire(c, header(c.doc, key)?.querySelector('button') ?? null, 'click');

export default {
  title: 'Sorting and filtering a table',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'All five entities show to start with', test: ({ doc }) => names(doc).length === 5 },
    { label: 'Value sorts smallest first, and aria-sort says ascending', test: (c) => { clickHeader(c, 'value'); return names(c.doc)[0] === 'Education Trust' && names(c.doc)[4] === 'Harbour Holdings' && header(c.doc, 'value')?.getAttribute('aria-sort') === 'ascending'; } },
    { label: 'Clicking Value again flips to largest first', test: (c) => { clickHeader(c, 'value'); return names(c.doc)[0] === 'Harbour Holdings' && header(c.doc, 'value')?.getAttribute('aria-sort') === 'descending'; } },
    { label: 'Entity sorts A to Z, and the other headers say none', test: (c) => { clickHeader(c, 'name'); return names(c.doc)[0] === 'Education Trust' && names(c.doc)[1] === 'Family Trust' && header(c.doc, 'value')?.getAttribute('aria-sort') === 'none' && header(c.doc, 'name')?.getAttribute('aria-sort') === 'ascending'; } },
    { label: 'Typing "trust" shows only the two trusts', test: (c) => { typeInto(c, c.doc.querySelector('#filter'), 'trust'); const n = names(c.doc); return n.length === 2 && n.every((x) => /trust/i.test(x ?? '')); } },
    { label: 'Clearing the filter brings all five back, still sorted', test: (c) => { typeInto(c, c.doc.querySelector('#filter'), ''); return names(c.doc).length === 5 && names(c.doc)[0] === 'Education Trust'; } },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'filter first, then sort the filtered array. Both go inside render().',
    'Direction flip: state.dir = state.key === key && state.dir === \'ascending\' ? \'descending\' : \'ascending\';',
    'Numbers subtract (a.value - b.value); text uses a.name.localeCompare(b.name).',
  ],
} satisfies LessonMeta;
