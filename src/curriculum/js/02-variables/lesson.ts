import type { LessonMeta } from '../../types';
import { errors, globalValue, logLines } from '../../helpers';

export default {
  title: 'Variables and values',
  minutes: 12,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'firmName is the string \'Larkfield Private Wealth\'', test: ({ win }) => globalValue(win, 'firmName') === 'Larkfield Private Wealth' },
    { label: 'clients starts at 120 with let, and ends up 121', test: ({ win, files }) => globalValue(win, 'clients') === 121 && /let\s+clients\s*=\s*120/.test(files['script.js'] ?? '') },
    { label: 'isOpen is the boolean true', test: ({ win }) => globalValue(win, 'isOpen') === true },
    { label: 'firmName and isOpen use const', test: ({ files }) => /const\s+firmName/.test(files['script.js'] ?? '') && /const\s+isOpen/.test(files['script.js'] ?? '') },
    { label: 'You logged the sentence with a template literal', test: ({ win, files }) => logLines(win).includes('Larkfield Private Wealth looks after 121 families') && /`[^`]*\$\{/.test(files['script.js'] ?? '') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'clients = clients + 1; reads the old value, adds one, and puts the result back in the box.',
    'Template literals use backticks, not quotes: `${firmName} looks after ${clients} families`',
    'Trying to change a const throws an error. That\'s why clients needs let.',
  ],
} satisfies LessonMeta;
