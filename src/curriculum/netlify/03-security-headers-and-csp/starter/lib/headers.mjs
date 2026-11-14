// Works out which headers a path gets, the way Netlify reads a _headers file.
// Provided for you: the dev server and Check my work both use it. Read it, but you don't need to change it.

/** Turns the text of a _headers file into [{ for: "/*", values: { Header: "value" } }]. */
export function parseHeadersFile(text) {
  const rules = [];
  let cur = null;
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (/^\s/.test(raw)) {
      const i = raw.indexOf(':');
      if (cur && i > 0) cur.values[raw.slice(0, i).trim()] = raw.slice(i + 1).trim();
    } else {
      cur = { for: raw.trim(), values: {} };
      rules.push(cur);
    }
  }
  return rules;
}

/** A pattern is an exact path, or ends in * to match everything below it. */
export const pathMatches = (pattern, p) => pattern === p || (pattern.endsWith('*') && p.startsWith(pattern.slice(0, -1)));

/** Every header that applies to a path, with lower-case names. */
export function headersFor(p, rules) {
  const h = {};
  for (const r of rules) {
    if (!pathMatches(r.for, p)) continue;
    for (const [k, v] of Object.entries(r.values)) h[k.toLowerCase()] = v;
  }
  return h;
}
