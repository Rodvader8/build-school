import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Lists and keys',
  minutes: 35,
  kind: 'project',
  entry: 'src/components/EntityList.jsx',
  checkEntry: 'check.mjs',
  devPort: 4835,
  devCommand: 'npm run dev -- --port 4835 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'Renders one row per entity', test: ({ output }) => passed(output, 'renders one row per entity') },
    { label: 'Each row shows the name, the type and the value', test: ({ output }) => passed(output, 'each row shows the name, the type and the value') },
    { label: 'Filtering by name narrows the list, ignoring capitals', test: ({ output }) => passed(output, 'filtering by name narrows the list, ignoring capitals') },
    { label: 'An empty result says so', test: ({ output }) => passed(output, 'an empty result says so') },
    { label: 'Reversing flips the order without changing the original array', test: ({ output }) => passed(output, 'reversing flips the order without changing the original array') },
    { label: 'A note stays with its own row when the order changes', test: ({ output }) => passed(output, 'a note stays with its own row when the order changes') },
    { label: 'React has no complaints about keys', test: ({ output }) => passed(output, 'React has no complaints about keys') },
    { label: 'The app builds', test: ({ output }) => passed(output, 'the app builds') },
    { label: 'There are no inline style props', test: ({ output }) => passed(output, 'there are no inline style props') },
  ],
  hints: [
    'To make a list, map an array to JSX: shown.map((entity) => <li key={entity.id}>...</li>). The key goes on the outermost element inside map.',
    'Never sort or reverse the array you were given. Copy it first: [...matches].reverse(). Filtering with .filter() already returns a new array.',
    'The empty message is a condition, like the one in the Props lesson: {shown.length === 0 && <p>No entities match "{query}"</p>}.',
  ],
} satisfies LessonMeta;
