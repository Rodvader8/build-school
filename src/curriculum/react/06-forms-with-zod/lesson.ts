import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Forms with validation (zod)',
  minutes: 45,
  kind: 'project',
  entry: 'src/components/EntityForm.jsx',
  checkEntry: 'check.mjs',
  devPort: 4836,
  devCommand: 'npm run dev -- --port 4836 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'Submitting an empty form shows a message under each field and sends nothing', test: ({ output }) => passed(output, 'submitting an empty form shows a message under each field and sends nothing') },
    { label: 'An invalid field is marked aria-invalid and linked to its message', test: ({ output }) => passed(output, 'an invalid field is marked aria-invalid and linked to its message') },
    { label: 'A valid form calls onAdd once with clean data', test: ({ output }) => passed(output, 'a valid form calls onAdd once with clean data') },
    { label: 'After a good submit the messages are gone and the form is empty', test: ({ output }) => passed(output, 'after a good submit the messages are gone and the form is empty') },
    { label: 'Accepts a good entity, trims the name and turns the value into a number', test: ({ output }) => passed(output, 'accepts a good entity, trims the name and turns the value into a number') },
    { label: 'Rejects a name under 2 characters, with a message a person can read', test: ({ output }) => passed(output, 'rejects a name under 2 characters, with a message a person can read') },
    { label: 'Rejects an email without a proper address', test: ({ output }) => passed(output, 'rejects an email without a proper address') },
    { label: 'Rejects a value below 1 or one that is not a number', test: ({ output }) => passed(output, 'rejects a value below 1 or one that is not a number') },
    { label: 'The app builds', test: ({ output }) => passed(output, 'the app builds') },
    { label: 'There are no inline style props', test: ({ output }) => passed(output, 'there are no inline style props') },
  ],
  hints: [
    'In schema.js, build the object from three fields: z.string().trim().min(2, \'message\'), z.email(\'message\'), and z.coerce.number(\'Enter a number\').min(1, \'message\'). Coerce is needed because inputs always hold strings.',
    'safeParse never throws. It returns { success: true, data } or { success: false, error }, and error.issues is an array of { path: [\'email\'], message } objects.',
    'To keep the first message per field: found[issue.path[0]] ??= issue.message. Then setErrors(found) and the markup reads errors.email, errors.value and so on.',
  ],
} satisfies LessonMeta;
