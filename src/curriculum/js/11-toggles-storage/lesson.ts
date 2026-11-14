import type { LessonMeta } from '../../types';
import { errors, fire, text, waitFor } from '../../helpers';

const pressed = (doc: Document) => Array.from(doc.querySelectorAll('[data-period][aria-pressed="true"]')).map((b) => b.getAttribute('data-period'));
const press = (c: Parameters<LessonMeta['checks'][number]['test']>[0], p: string) => fire(c, c.doc.querySelector(`[data-period="${p}"]`), 'click');

export default {
  title: 'Toggles, state and localStorage',
  minutes: 25,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'Exactly one button is pressed when the page loads', test: ({ doc }) => pressed(doc).length === 1 },
    { label: '1Y shows $8,110,000 and "Up $690,000 (9%) over 1Y"', test: (c) => { press(c, '1Y'); return text(c.doc.querySelector('.db-figure')) === '$8,110,000' && text(c.doc.querySelector('.db-change')) === 'Up $690,000 (9%) over 1Y'; } },
    { label: '5Y updates the change line and moves aria-pressed', test: (c) => { press(c, '5Y'); return text(c.doc.querySelector('.db-change')) === 'Up $2,850,000 (54%) over 5Y' && JSON.stringify(pressed(c.doc)) === '["5Y"]'; } },
    { label: 'The choice is saved in localStorage as nm-period', test: (c) => { press(c, '10Y'); return c.win.localStorage.getItem('nm-period') === '10Y'; } },
    {
      label: 'A fresh page load remembers 10Y',
      test: async (c) => {
        const frame = c.doc.createElement('iframe');
        frame.src = c.doc.location.href;
        c.doc.body.append(frame);
        const ok = await waitFor(() => JSON.stringify(pressed(frame.contentDocument!)) === '["10Y"]', 3000);
        frame.remove();
        return ok;
      },
    },
    { label: 'Storage is wrapped in try/catch', test: ({ files }) => /try\s*\{[\s\S]*localStorage/.test(files['script.js'] ?? '') && /catch/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Percentage: Math.round((end - start) / start * 100)',
    'Set aria-pressed on every button: String(button.dataset.period === period) gives "true" or "false".',
    'Restore before the final render() call, so the first draw is already right.',
  ],
} satisfies LessonMeta;
