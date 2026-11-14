import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Word and Excel files from model output',
  minutes: 55,
  kind: 'project',
  entry: 'lib/xlsx.js',
  checkEntry: 'check.mjs',
  devPort: 4863,
  devCommand: 'npm run dev -- --port 4863 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the .docx is a real zip with the title, schedule and budget in it',
    'the .docx uses real headings and tables, not just styled text',
    'characters like & and < in model text are escaped, not trusted',
    'the workbook has a Schedule sheet and a Budget sheet with header rows',
    'costs are real numbers with a currency format',
    'the total is a SUM formula, so editing a cost updates it',
    'the activity column is wide enough to read',
    'returns a downloadable Word file with the right type and a safe filename',
    'returns a downloadable spreadsheet too',
    'an unknown format returns 400 before Claude is called',
    'a refusal or a broken reply gives an error, never a file',
    'the site builds',
    'the build includes the /api/pack route',
    'the API key is read from the environment, never typed in the code',
    '.env.example documents the key with a fake value, and .env is ignored',
    'the key can never reach the browser',
  ]),
  hints: [
    'In docx, a Table is made of TableRow objects, each with TableCell children, and a cell needs at least one Paragraph. Write a small cell(text) helper and build rows with .map so the schedule can be any length.',
    'In exceljs, set sheet.columns = [{ header, key, width }] first, then sheet.addRows(array of objects with those keys). A cell with a number value stays a number; a formula is { formula: "SUM(B2:B3)" }.',
    'Build the route in this order: check the request, generatePlan, build the file, then return new Response(buffer, { headers }). Do the building inside try, so a PlanError can become a JSON error and never a half-made download.',
  ],
} satisfies LessonMeta;
