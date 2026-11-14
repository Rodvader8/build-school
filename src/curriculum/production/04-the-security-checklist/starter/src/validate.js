/**
 * Checks a signup from the outside world. Never trust the shape: it may be missing, a number, an array or huge.
 *
 * Returns { ok, errors, value }:
 *  - input must be a plain object. Otherwise ok is false, errors is { _: '...' } and value is null.
 *  - name: a string, trimmed, 1 to 80 characters. Control characters are stripped.
 *  - email: a string, trimmed and lower-cased, at most 254 characters, shaped like name@host.tld.
 *  - message (optional): a string of at most 1000 characters.
 *  - errors has one entry per bad field (errors.name, errors.email, errors.message), each a short sentence.
 *  - value has ONLY name, email and message (when given), and only when ok is true. Drop everything else
 *    the sender included, such as role or isAdmin. That's what stops mass assignment.
 */
export function validateSignup(input) {
  // TODO
  return { ok: true, errors: {}, value: input };
}
