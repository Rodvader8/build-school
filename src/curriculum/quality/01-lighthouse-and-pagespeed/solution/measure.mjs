// Audits the local page with Lighthouse and writes report.json. Run it with:  node measure.mjs
import { writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
import { auditOnce } from './lib.mjs';
import { median } from './median.mjs';

const RUNS = 3;
const server = await serve('site'); // the page, on this machine only
try {
  // One run is noise, so audit three times, one after another.
  const runs = [];
  for (let i = 0; i < RUNS; i++) runs.push(await auditOnce(server.url));

  const pick = (key) => runs.map((r) => r[key]);
  const scores = pick('score');
  const report = {
    url: server.url,
    runs,
    median: { score: median(scores), lcp: median(pick('lcp')), tbt: median(pick('tbt')), cls: median(pick('cls')) },
    spread: Math.max(...scores) - Math.min(...scores),
  };
  writeFileSync('report.json', JSON.stringify(report, null, 2));
  console.log(`Median score ${report.median.score} (spread ${report.spread}) from ${runs.length} runs`);
} finally {
  await server.close();
}
