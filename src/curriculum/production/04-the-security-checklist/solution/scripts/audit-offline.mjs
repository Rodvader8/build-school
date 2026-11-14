// Reads an `npm audit --json` report and fails on high or critical findings, unless they're on the allow list.
// Usage: node scripts/audit-offline.mjs <report.json> [allow.json]. The report is a file, so this never touches the network.
import { existsSync, readFileSync } from 'node:fs';

const [reportFile, allowFile = 'audit-allow.json'] = process.argv.slice(2);
if (!reportFile || !existsSync(reportFile)) {
  console.error('Usage: node scripts/audit-offline.mjs <report.json> [allow.json]');
  process.exit(2);
}

const report = JSON.parse(readFileSync(reportFile, 'utf8'));
const allow = existsSync(allowFile) ? JSON.parse(readFileSync(allowFile, 'utf8')) : [];
const today = new Date().toISOString().slice(0, 10);
// An exception needs a reason and an expiry date. When it expires, the finding blocks the build again.
const allowed = (name) => allow.some((a) => a.package === name && a.reason && a.expires >= today);

const blocking = [];
for (const [name, v] of Object.entries(report.vulnerabilities ?? {})) {
  if (!['high', 'critical'].includes(v.severity)) continue;
  if (allowed(name)) console.log(`allowed  ${v.severity.toUpperCase()} ${name} (on the allow list)`);
  else blocking.push(`${v.severity.toUpperCase()} ${name}${v.fixAvailable ? ' (a fix is available)' : ''}`);
}
for (const line of blocking) console.log(`blocked  ${line}`);
console.log(blocking.length === 0 ? 'audit: nothing blocking' : `audit: ${blocking.length} blocking finding(s)`);
process.exit(blocking.length === 0 ? 0 : 1);
