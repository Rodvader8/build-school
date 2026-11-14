// Reads an `npm audit --json` report and fails on high or critical findings, unless they're on the allow list.
// Usage: node scripts/audit-offline.mjs <report.json> [allow.json]. The report is a file, so this never touches the network.
//
// The report has { vulnerabilities: { "<package>": { name, severity, fixAvailable, ... } } }.
// The allow list is an array of { package, reason, expires: "YYYY-MM-DD" }. An entry only counts while it has a reason
// and hasn't expired. Print one line per blocking finding (package and severity), then exit 1 if any, otherwise 0.
console.log('audit-offline is not written yet');
process.exit(2);
