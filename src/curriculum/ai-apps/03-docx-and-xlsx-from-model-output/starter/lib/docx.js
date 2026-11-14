import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

// Builds the Word version of a plan and returns it as a Buffer.
// Right now it only writes the title. A good pack also has: the venue and guest count, a "Schedule" heading with a
// two-column table (Time, Activity), a "Budget" heading with a table (Item, Cost) ending in a Total row, and the notes.
// Packer.toBuffer(doc) turns a Document into the bytes of a .docx file.
export async function buildDocx(plan) {
  const doc = new Document({
    title: plan.title,
    sections: [{ children: [new Paragraph({ text: plan.title, heading: HeadingLevel.HEADING_1 })] }],
  });
  return Packer.toBuffer(doc);
}
