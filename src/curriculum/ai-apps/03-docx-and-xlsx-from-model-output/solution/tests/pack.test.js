import JSZip from 'jszip';
import ExcelJS from 'exceljs';
import { startMockServer } from '../mock/server.mjs';
import { TRIGGERS } from '../mock/anthropic-mock.js';

let mock;
beforeAll(async () => {
  mock = await startMockServer();
});
afterAll(() => mock.close());
beforeEach(() => {
  mock.reset();
  process.env.ANTHROPIC_API_KEY = 'test-key-not-real';
  process.env.CLAUDE_BASE_URL = mock.url;
});

const plan = {
  title: 'Priya & Sam <garden party>',
  venue: 'Harbour Hall',
  guests: 40,
  schedule: [{ time: '16:00', activity: 'Welcome drinks' }, { time: '17:30', activity: 'Grazing tables' }],
  budget: [{ item: 'Venue hire', cost: 1200 }, { item: 'Catering', cost: 1600.5 }],
  notes: 'Confirm the rain plan.',
};
const post = (body) => new Request('http://localhost/api/pack', { method: 'POST', body: JSON.stringify(body) });
const asBytes = async (response) => Buffer.from(await response.arrayBuffer());
const sheetOf = async (buffer, name) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook.getWorksheet(name);
};

describe('the Word document', () => {
  it('the .docx is a real zip with the title, schedule and budget in it', async () => {
    const { buildDocx } = await import('../lib/docx.js');
    const zip = await JSZip.loadAsync(await buildDocx(plan));
    const xml = await zip.file('word/document.xml').async('string');
    for (const text of ['Welcome drinks', '17:30', 'Venue hire', 'Catering', 'Confirm the rain plan', 'Harbour Hall']) expect(xml, text).toContain(text);
  });

  it('the .docx uses real headings and tables, not just styled text', async () => {
    const { buildDocx } = await import('../lib/docx.js');
    const xml = await (await JSZip.loadAsync(await buildDocx(plan))).file('word/document.xml').async('string');
    expect(xml).toMatch(/w:pStyle w:val="Heading1"/);
    expect(xml).toMatch(/w:pStyle w:val="Heading2"/);
    expect((xml.match(/<w:tbl>/g) ?? []).length).toBe(2);
    expect(xml).toContain('Total');
  });

  it('characters like & and < in model text are escaped, not trusted', async () => {
    const { buildDocx } = await import('../lib/docx.js');
    const xml = await (await JSZip.loadAsync(await buildDocx(plan))).file('word/document.xml').async('string');
    expect(xml).toContain('Priya &amp; Sam &lt;garden party&gt;');
  });
});

describe('the spreadsheet', () => {
  it('the workbook has a Schedule sheet and a Budget sheet with header rows', async () => {
    const { buildXlsx } = await import('../lib/xlsx.js');
    const buffer = await buildXlsx(plan);
    const schedule = await sheetOf(buffer, 'Schedule');
    const budget = await sheetOf(buffer, 'Budget');
    expect(schedule.getRow(1).values.slice(1)).toEqual(['Time', 'Activity']);
    expect(budget.getRow(1).values.slice(1)).toEqual(['Item', 'Cost']);
    expect(schedule.getRow(2).getCell(2).value).toBe('Welcome drinks');
    expect(budget.getRow(1).font?.bold).toBe(true);
  });

  it('costs are real numbers with a currency format', async () => {
    const { buildXlsx } = await import('../lib/xlsx.js');
    const budget = await sheetOf(await buildXlsx(plan), 'Budget');
    const cost = budget.getRow(3).getCell(2);
    expect(cost.value).toBe(1600.5);
    expect(cost.numFmt).toMatch(/\$/);
  });

  it('the total is a SUM formula, so editing a cost updates it', async () => {
    const { buildXlsx } = await import('../lib/xlsx.js');
    const budget = await sheetOf(await buildXlsx(plan), 'Budget');
    const total = budget.getRow(4);
    expect(total.getCell(1).value).toBe('Total');
    expect(total.getCell(2).value.formula).toBe('SUM(B2:B3)');
  });

  it('the activity column is wide enough to read', async () => {
    const { buildXlsx } = await import('../lib/xlsx.js');
    const schedule = await sheetOf(await buildXlsx(plan), 'Schedule');
    expect(schedule.getColumn(2).width).toBeGreaterThanOrEqual(40);
  });
});

describe('the /api/pack route', () => {
  it('returns a downloadable Word file with the right type and a safe filename', async () => {
    const { POST } = await import('../app/api/pack/route.js');
    const response = await POST(post({ brief: 'A garden party for 40.', format: 'docx' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="harbour-hall-priya-and-sam-garden-party.docx"');
    expect((await asBytes(response)).subarray(0, 2).toString()).toBe('PK');
  });

  it('returns a downloadable spreadsheet too', async () => {
    const { POST } = await import('../app/api/pack/route.js');
    const response = await POST(post({ brief: 'A garden party for 40.', format: 'xlsx' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(response.headers.get('Content-Disposition')).toMatch(/\.xlsx"$/);
    expect(await sheetOf(await asBytes(response), 'Budget')).toBeTruthy();
  });

  it('an unknown format returns 400 before Claude is called', async () => {
    const { POST } = await import('../app/api/pack/route.js');
    for (const format of ['pdf', undefined, 'constructor']) {
      expect((await POST(post({ brief: 'A garden party.', format }))).status, String(format)).toBe(400);
    }
    expect(mock.requests).toHaveLength(0);
  });

  it('a refusal or a broken reply gives an error, never a file', async () => {
    const { POST } = await import('../app/api/pack/route.js');
    const refused = await POST(post({ brief: `Plan it ${TRIGGERS.refusal}`, format: 'docx' }));
    expect(refused.status).toBe(422);
    expect(refused.headers.get('Content-Type')).toMatch(/json/);
    const broken = await POST(post({ brief: `Plan it ${TRIGGERS.invalid}`, format: 'xlsx' }));
    expect(broken.status).toBe(502);
    expect(broken.headers.get('Content-Disposition')).toBeNull();
  });
});
