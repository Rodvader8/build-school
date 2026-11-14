import ExcelJS from 'exceljs';

// Builds the spreadsheet version of a plan. Numbers go in as numbers (so Excel can add them up) and the total is
// a formula, so if someone edits a cost the total follows.
export async function buildXlsx(plan) {
  const workbook = new ExcelJS.Workbook();
  workbook.title = plan.title;

  const schedule = workbook.addWorksheet('Schedule');
  schedule.columns = [
    { header: 'Time', key: 'time', width: 10 },
    { header: 'Activity', key: 'activity', width: 50 },
  ];
  schedule.addRows(plan.schedule);
  schedule.getRow(1).font = { bold: true };

  const budget = workbook.addWorksheet('Budget');
  budget.columns = [
    { header: 'Item', key: 'item', width: 30 },
    { header: 'Cost', key: 'cost', width: 14, style: { numFmt: '"$"#,##0.00' } },
  ];
  budget.addRows(plan.budget);
  budget.getRow(1).font = { bold: true };
  const last = plan.budget.length + 1;
  const totalRow = budget.addRow({ item: 'Total', cost: { formula: `SUM(B2:B${last})` } });
  totalRow.font = { bold: true };

  return Buffer.from(await workbook.xlsx.writeBuffer());
}
