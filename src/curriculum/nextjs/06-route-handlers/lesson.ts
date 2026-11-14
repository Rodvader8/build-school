import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Route handlers: an enquiry API',
  minutes: 55,
  kind: 'project',
  entry: 'app/api/enquiry/route.js',
  checkEntry: 'check.mjs',
  devPort: 4846,
  devCommand: 'npm run dev -- --port 4846 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'validateEnquiry accepts a good enquiry and trims it',
    'validateEnquiry gives each bad field its own message',
    'a valid enquiry returns 201 and is sent on',
    'bad fields return 400 with a message per field and send nothing',
    'broken JSON returns 400 instead of crashing',
    'a filled honeypot looks like success but sends nothing',
    'only POST is handled',
    'the webhook address comes from the environment',
    'with no webhook address it does nothing and says so',
    'has a honeypot field that people and screen readers skip',
    'posts the fields as JSON and then says thanks',
    'shows the server\'s messages next to the fields',
    'the site builds',
    'the build includes the /api/enquiry route',
    'the code has no hard-coded addresses or keys',
    '.env.example documents the variable with a fake value, and .env is ignored',
    'the contact page is a server page and only the form is a client component',
  ]),
  hints: [
    'Validate by collecting problems: start with const errors = {}, add errors.name, errors.email, errors.message when each rule fails, then return { ok: Object.keys(errors).length === 0, errors, values }. Trim strings first, and treat anything that isn\'t a string as empty.',
    'A route handler is a function named after the method: export async function POST(request). Parse with await request.json() inside try/catch (return a 400 if it throws), check the honeypot field, validate, then respond with NextResponse.json(data, { status }).',
    'Secrets come from process.env. Read ENQUIRY_WEBHOOK_URL when the function runs, and return { sent: false } if it\'s empty. In .env.example write the name with a fake value, so the next person knows what to set.',
  ],
} satisfies LessonMeta;
