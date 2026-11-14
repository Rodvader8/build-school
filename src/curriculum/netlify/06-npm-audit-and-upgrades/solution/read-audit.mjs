// Prints a saved "npm audit --json" report as a readable table. Provided for you: run it with  node read-audit.mjs
import { readFileSync } from 'node:fs';

const report = JSON.parse(readFileSync(process.argv[2] ?? 'audit.json', 'utf8'));
const order = ['critical', 'high', 'moderate', 'low'];
const rows = Object.values(report.vulnerabilities).sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));

for (const v of rows) {
  const fix = v.fixAvailable ? `fixed in ${v.fixAvailable.version}${v.fixAvailable.isSemVerMajor ? ' (breaking major)' : ''}` : 'NO FIX AVAILABLE';
  const why = typeof v.via[0] === 'string' ? `pulled in through ${v.via[0]}` : v.via[0].title;
  console.log(`${v.severity.toUpperCase().padEnd(9)} ${v.name.padEnd(15)} ${v.isDirect ? 'direct    ' : 'transitive'}  vulnerable: ${v.range.padEnd(9)} ${fix}`);
  console.log(`          ${why}`);
}
const m = report.metadata.vulnerabilities;
console.log(`\n${m.total} findings: ${m.critical} critical, ${m.high} high, ${m.moderate} moderate, ${m.low} low`);
