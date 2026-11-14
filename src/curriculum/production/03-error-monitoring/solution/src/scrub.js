// Removes personal data and secrets from anything before it leaves for an error service.
// Rule of thumb: an error report is read by people who should never see a customer's email or a live key.

const SENSITIVE_KEY = /pass(word)?|pwd|secret|token|(^|[-_])key$|api[-_]?key|authorization|cookie|session|credit|card/i;

// Order matters: the specific patterns go first, the broad ones last.
const PATTERNS = [
  [/eyJ[\w-]{8,}\.eyJ[\w-]{8,}\.[\w-]{8,}/g, '[secret]'], // a JSON web token
  [/\bBearer\s+[\w.~+/=-]{10,}/gi, 'Bearer [secret]'],
  [/\bsk-[\w-]{16,}/g, '[secret]'],
  [/\bAKIA[0-9A-Z]{16}\b/g, '[secret]'],
  [/\bghp_[A-Za-z0-9]{30,}\b/g, '[secret]'],
  [/\bxox[abp]-[\w-]{10,}/g, '[secret]'],
  [/\b(pass(?:word)?|pwd|secret|token|api[_-]?key|auth|session)=[^\s&,;"']+/gi, '$1=[redacted]'],
  [/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '[email]'],
  [/(?:\+\d{1,3}[\s-]?|\b0)\(?\d{1,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}\b/g, '[phone]'],
];

export function scrubString(text) {
  return PATTERNS.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), String(text));
}

/** A URL with sensitive query values hidden and the #fragment dropped. Relative URLs stay relative. */
export function scrubUrl(url) {
  try {
    const absolute = /^[a-z][a-z\d+.-]*:/i.test(url);
    const parsed = new URL(url, 'http://placeholder.invalid');
    for (const key of [...parsed.searchParams.keys()]) {
      if (SENSITIVE_KEY.test(key)) parsed.searchParams.set(key, '[redacted]');
    }
    parsed.hash = '';
    return scrubString(absolute ? parsed.href : parsed.pathname + parsed.search).replace(/%5B(redacted|email|secret|phone)%5D/g, '[$1]');
  } catch {
    return scrubString(url);
  }
}

/** A deep copy with every string cleaned and every sensitive key masked. The original is never changed. */
export function scrub(value, depth = 0) {
  if (typeof value === 'string') return scrubString(value);
  if (value === null || typeof value !== 'object') return value;
  if (depth > 6) return '[truncated]';
  if (Array.isArray(value)) return value.map((item) => scrub(item, depth + 1));
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, SENSITIVE_KEY.test(key) ? '[redacted]' : scrub(item, depth + 1)]));
}
