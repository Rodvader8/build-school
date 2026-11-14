// Audits the local page with Lighthouse and writes report.json. Run it with:  node measure.mjs
import { writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
import { auditOnce } from './lib.mjs';
import { median } from './median.mjs';

const server = await serve('site'); // the page, on this machine only
try {
  // One run is noise. TODO: run three audits, one after another, and keep every result.
  const runs = [await auditOnce(server.url)];

  const pick = (key) => runs.map((r) => r[key]);
  const report = {
    url: server.url,
    runs,
    median: { score: runs[0].score, lcp: runs[0].lcp, tbt: runs[0].tbt, cls: runs[0].cls }, // TODO: the median of each, not the first run
    spread: 0, // TODO: best score minus worst score
  };
  writeFileSync('report.json', JSON.stringify(report, null, 2));
  console.log(`Median score ${report.median.score} (spread ${report.spread}) from ${runs.length} run(s)`);
} finally {
  await server.close();
}
