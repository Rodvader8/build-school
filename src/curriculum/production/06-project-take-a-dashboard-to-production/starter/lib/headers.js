/** The headers every response carries. A browser enforces these, so they protect visitors even when your code has a bug. */
export function securityHeaders() {
  return {
    // Where the page may load things from. 'self' means "my own origin and nothing else".
    // object-src, base-uri, form-action and frame-ancestors have no fallback, so they're set explicitly.
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    // Use HTTPS for two years, on every subdomain.
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    // Believe the Content-Type I send. Don't guess.
    'X-Content-Type-Options': 'nosniff',
    // Send the origin, not the full URL, to other sites.
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Switch off powerful features this site never uses.
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  };
}
