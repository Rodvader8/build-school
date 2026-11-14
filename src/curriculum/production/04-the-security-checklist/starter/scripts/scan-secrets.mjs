// Fails when a file contains something shaped like a live key.
// Usage: node scripts/scan-secrets.mjs [folder]. Exit code 0 means clean, 1 means something was found.
//
// Walk the folder (skip node_modules, .git, dist and binary files) and test every line against patterns for:
//   sk-... keys (20+ characters), AWS ids (AKIA + 16), GitHub tokens (ghp_...), Slack tokens (xox...-...),
//   "-----BEGIN ... PRIVATE KEY-----", and assignments like api_key = "long-random-looking-string".
// Print one line per finding: file:line and which rule matched. NEVER print the secret itself (at most its first
// few characters). A report that shows the key is a second leak.
console.log('scan-secrets is not written yet');
process.exit(2);
