import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Functions: an enquiry form',
  minutes: 40,
  kind: 'node',
  entry: 'netlify/functions/enquiry.mjs',
  checkEntry: 'check.mjs',
  checks: [
    { label: 'Only POST is accepted, anything else gets a 405', test: ({ output }) => passed(output, 'only POST is accepted') },
    { label: 'Broken JSON gets a 400', test: ({ output }) => passed(output, 'broken JSON gets a 400') },
    { label: 'Missing or invalid fields get a 400 that names them', test: ({ output }) => passed(output, 'invalid fields get a 400 that names them') },
    { label: 'A filled-in honeypot gets a quiet 200 and nothing reaches the CRM', test: ({ output }) => passed(output, 'the honeypot is answered quietly') },
    { label: 'A valid enquiry reaches the CRM once, with the key from the environment', test: ({ output }) => passed(output, 'a valid enquiry reaches the CRM once') },
    { label: 'A plain HTML form post works too', test: ({ output }) => passed(output, 'a plain HTML form post works') },
    { label: 'A CRM failure becomes a 502', test: ({ output }) => passed(output, 'a CRM failure becomes a 502') },
    { label: 'A missing key is a 500 that leaks nothing', test: ({ output }) => passed(output, 'a missing key is a 500') },
    { label: 'Names, emails and messages never reach the logs', test: ({ output }) => passed(output, 'personal data never reaches the logs') },
    { label: 'The key is never written in the code', test: ({ output }) => passed(output, 'the key is not hard-coded') },
    { label: '.env is git-ignored', test: ({ output }) => passed(output, '.env is git-ignored') },
    { label: 'The function has the public path /api/enquiry', test: ({ output }) => passed(output, 'the function has a public path') },
  ],
  hints: [
    'Return early, in this order: wrong method, not configured, unreadable body, honeypot, validation, then the CRM call. Each step can return a Response before the next runs.',
    'Read the key at call time with process.env.CRM_API_KEY and send it as an Authorization header: `Bearer ${key}`. Never type the key into the file.',
    'Log only what you can safely share: a status code or a short reason. console.error("CRM failed", res.status) is fine, console.log(data) is not.',
  ],
} satisfies LessonMeta;
