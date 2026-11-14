/** The headers every response carries. A browser enforces these, so they protect visitors even when your code has a bug.
 *
 * Return an object of header name to value. It needs:
 *  - Content-Security-Policy: default-src 'self', and the four directives that have no fallback set by hand:
 *    object-src 'none', base-uri 'self', form-action 'self' and frame-ancestors 'none'. No 'unsafe-inline', no 'unsafe-eval', no *.
 *  - Strict-Transport-Security: at least 180 days (15552000 seconds), with includeSubDomains.
 *  - X-Content-Type-Options: nosniff
 *  - Referrer-Policy: strict-origin-when-cross-origin (or something stricter)
 *  - Permissions-Policy: switch off camera, microphone and geolocation.
 */
export function securityHeaders() {
  // TODO
  return {};
}
