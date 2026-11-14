Clients don't want JSON. They want a Word document to forward and a spreadsheet to tweak. The pattern for that is simple and worth learning properly: Claude produces **checked data**, and your own code turns the data into files. The model never writes the file itself.

## Why code builds the file

A `.docx` or `.xlsx` is a zip of XML. If a model wrote that by hand, one stray character would give you a file Word refuses to open. If your code builds it from validated data, the layout is the same every time, the numbers are real numbers, and the only variable part is the words.

So the flow is:

1. `generatePlan(brief)` returns a plan that passed the zod schema (last lesson).
2. `buildDocx(plan)` and `buildXlsx(plan)` turn it into bytes.
3. The route sends those bytes with the right headers.

## Word with docx

The `docx` package builds documents from plain objects:

```js
import { Document, HeadingLevel, Packer, Paragraph } from 'docx';

const doc = new Document({
  sections: [{ children: [new Paragraph({ text: plan.title, heading: HeadingLevel.HEADING_1 })] }],
});
const buffer = await Packer.toBuffer(doc);
```

Use real heading levels so the document has structure (navigation pane, accessibility), and real tables for rows of data. The library escapes `&` and `<` for you, which matters because the text came from a model. (A different approach is a template with placeholders, which `docxtemplater` fills in. That suits a client's own branded template. For a layout you control, building it in code is simpler.)

## Excel with exceljs

```js
const sheet = workbook.addWorksheet('Budget');
sheet.columns = [{ header: 'Item', key: 'item', width: 30 }, { header: 'Cost', key: 'cost', width: 14 }];
sheet.addRows(plan.budget);
sheet.addRow({ item: 'Total', cost: { formula: 'SUM(B2:B4)' } });
```

Three habits make a spreadsheet feel professional. Store costs as **numbers**, never strings, and give them a format like `"$"#,##0.00`. Make totals **formulas**, so if someone edits a cost the total follows. And set column **widths**, because an unwidened column hides half your text.

## Sending a file from a route

```js
return new Response(buffer, {
  headers: {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Content-Disposition': 'attachment; filename="garden-party.docx"',
  },
});
```

The filename comes from the plan's title, which the model wrote, so clean it: lowercase letters, digits and hyphens only. And only ever send a file for a plan that passed validation. A refusal or a bad reply gets a JSON error, never a download.

## Your turn

1. In the terminal, run `npm install`, then `cp .env.example .env`. Press **Start dev server** above the preview.
2. Open `tests/pack.test.js`. It reads your files back with `jszip` and `exceljs`, the way Word and Excel would.
3. In `lib/docx.js`, finish the document: venue line, a Schedule heading and table, a Budget heading and table with a Total row, and the notes.
4. In `lib/xlsx.js`, replace the single text sheet with a Schedule sheet and a Budget sheet, with numeric costs, a currency format, a SUM total and a wide Activity column.
5. Create `app/api/pack/route.js`. It takes a brief and a format (`docx` or `xlsx`), and answers 400 for anything else before it calls Claude.
6. Press the buttons in the preview and open what downloads.
7. Press **Check my work**.
