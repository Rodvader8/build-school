import ExcelJS from 'exceljs';

// Builds the spreadsheet version of a plan and returns it as a Buffer.
// Right now there's one sheet with everything as text. Make it two sheets, "Schedule" (Time, Activity)
// and "Budget" (Item, Cost), with a bold header row on each. Costs must be numbers with a currency format
// (numFmt '"$"#,##0.00'), the Budget sheet needs a Total row whose cost is a SUM formula, and the Activity
// column should be wide enough to read (width 40 or more).
export async function buildXlsx(plan) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Plan');
  sheet.addRow(['Time', 'Activity']);
  for (const row of plan.schedule) sheet.addRow([row.time, row.activity]);
  for (const line of plan.budget) sheet.addRow([line.item, String(line.cost)]);
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
