// Removes personal data and secrets from anything before it leaves for an error service.
// Replacements to use: [email], [phone], [secret] and [redacted].

/** Cleans one string: email addresses, phone numbers, API keys (sk-..., AKIA..., ghp_..., xox...), bearer tokens, JWTs,
 *  and the value in anything like password=..., token=... or api_key=... */
export function scrubString(text) {
  // TODO
  return String(text);
}

/** A URL with the values of sensitive query parameters (token, key, password, secret, session...) replaced by [redacted]
 *  and the #fragment dropped. A relative URL like "/cart?id=1" stays relative. */
export function scrubUrl(url) {
  // TODO
  return url;
}

/** A deep copy of any value with every string cleaned (scrubString) and the value of every sensitive KEY
 *  (password, token, secret, apiKey, authorization, cookie, session...) replaced with '[redacted]'.
 *  The original must not change. Stop at a sensible depth so a circular object can't hang you. */
export function scrub(value) {
  // TODO
  return value;
}
