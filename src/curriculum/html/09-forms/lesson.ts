import type { LessonMeta } from '../../types';
import { controlsLabelled } from '../../helpers';

export default {
  title: 'Forms',
  minutes: 15,
  kind: 'web',
  entry: 'index.html',
  checks: [
    { label: 'A form element', test: ({ doc }) => !!doc.querySelector('form') },
    { label: 'A required email field (type="email")', test: ({ doc }) => !!doc.querySelector('form input[type=email][required]') },
    { label: 'A required name field', test: ({ doc }) => !!doc.querySelector('form input[name*=name i][required]') },
    { label: 'A phone field (type="tel")', test: ({ doc }) => !!doc.querySelector('form input[type=tel]') },
    { label: 'A textarea for the message', test: ({ doc }) => !!doc.querySelector('form textarea') },
    { label: 'Every field has a label', test: ({ doc }) => !!doc.querySelector('form') && controlsLabelled(doc.querySelector('form')!) },
    { label: 'Every field has a name', test: ({ doc }) => { const f = Array.from(doc.querySelectorAll('form input, form textarea, form select')); return f.length > 0 && f.every((c) => !!c.getAttribute('name')); } },
    { label: 'A submit button', test: ({ doc }) => !!doc.querySelector('form button:not([type=button]), form input[type=submit]') },
  ],
  hints: [
    'Each field is a pair: <label for="phone">Phone</label> then <input id="phone" name="phone" type="tel">',
    'The for on the label must match the id on the input exactly.',
    'Try clicking a label in the preview. If the box gets focus, they\'re linked.',
  ],
} satisfies LessonMeta;
