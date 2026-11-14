import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'VS Code like a pro',
  minutes: 25,
  kind: 'terminal',
  entry: 'monitor.js',
  checkEntry: 'check.py',
  checks: [
    { label: 'monitor.js runs without errors', test: ({ output }) => passed(output, 'monitor.js runs without errors') },
    { label: 'The five site names are quoted strings', test: ({ output }) => passed(output, 'the five names are quoted strings') },
    { label: 'Every address uses https', test: ({ output }) => passed(output, 'every address is https') },
    { label: 'chk is renamed to checkSite everywhere', test: ({ output }) => passed(output, 'chk is renamed to checkSite everywhere') },
    { label: 'The debug line is commented out', test: ({ output }) => passed(output, 'the debug line is commented out') },
    { label: 'TIMEOUT_MS sits above the function', test: ({ output }) => passed(output, 'TIMEOUT_MS sits above the function') },
  ],
  hints: [
    'For the names: click at the start of "ironbark", then hold Shift+Alt and drag straight down through the other four lines. You get five cursors. Type the quote, press End, then type quote and comma.',
    'For the replace: put the cursor in one "http:", press Ctrl+D until all five are selected, and type "https:". Or open find and replace and do it in one go.',
    'To rename: click on chk, press F2, type checkSite, press Enter. If F2 does nothing, check File > Preferences > Keyboard Shortcuts.',
  ],
} satisfies LessonMeta;
