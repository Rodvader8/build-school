import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

const cell = (text, bold = false) =>
  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(text), bold })] })] });

const table = (rows) =>
  new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((cells, i) => new TableRow({ tableHeader: i === 0, children: cells.map((text) => cell(text, i === 0)) })) });

const money = (n) => `$${n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Builds the Word version of a plan. Plan data has already been validated, so this can trust its shape.
// The docx library writes the XML for you and escapes characters like & and <, so model text can't break the file.
export async function buildDocx(plan) {
  const total = plan.budget.reduce((sum, line) => sum + line.cost, 0);
  const doc = new Document({
    title: plan.title,
    sections: [
      {
        children: [
          new Paragraph({ text: plan.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: `${plan.venue}, ${plan.guests} guests` }),
          new Paragraph({ text: 'Schedule', heading: HeadingLevel.HEADING_2 }),
          table([['Time', 'Activity'], ...plan.schedule.map((row) => [row.time, row.activity])]),
          new Paragraph({ text: 'Budget', heading: HeadingLevel.HEADING_2 }),
          table([['Item', 'Cost'], ...plan.budget.map((line) => [line.item, money(line.cost)]), ['Total', money(total)]]),
          new Paragraph({ text: 'Notes', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: plan.notes }),
        ],
      },
    ],
  });
  return Packer.toBuffer(doc);
}
