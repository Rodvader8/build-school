import type { LessonMeta } from '../../types';
import { errors, fire } from '../../helpers';

const parts = (doc: Document) => ({ button: doc.querySelector('.db-menu-button'), menu: doc.querySelector('#menu') });

export default {
  title: 'Events: menus and the cursor lens',
  minutes: 20,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'Clicking Menu opens it and sets aria-expanded="true"', test: (c) => { const { button, menu } = parts(c.doc); fire(c, button, 'click'); return !!menu?.classList.contains('is-open') && button?.getAttribute('aria-expanded') === 'true'; } },
    { label: 'Clicking again closes it and sets aria-expanded="false"', test: (c) => { const { button, menu } = parts(c.doc); fire(c, button, 'click'); return !menu?.classList.contains('is-open') && button?.getAttribute('aria-expanded') === 'false'; } },
    { label: 'Escape closes an open menu', test: (c) => { const { button, menu } = parts(c.doc); fire(c, button, 'click'); fire(c, c.doc.body, 'keydown', { key: 'Escape' }); return !menu?.classList.contains('is-open') && button?.getAttribute('aria-expanded') === 'false'; } },
    { label: 'The lens follows the pointer (--mx and --my in px)', test: (c) => { const lens = c.doc.querySelector('.db-lens') as HTMLElement | null; if (!lens) return false; const box = lens.getBoundingClientRect(); fire(c, lens, 'pointermove', { clientX: box.left + 120, clientY: box.top + 40 }); return lens.style.getPropertyValue('--mx') === '120px' && lens.style.getPropertyValue('--my') === '40px'; } },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'getAttribute gives back a string, so compare with \'true\', not true.',
    'Listen for keydown on document, not on the button, so Escape works wherever focus is.',
    'Template literal for the value: `${Math.round(event.clientX - box.left)}px`',
  ],
} satisfies LessonMeta;
