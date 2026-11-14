/**
 * Checks an enquiry from the browser. Never trust it: anyone can send anything to a public URL.
 * Returns { ok, errors, values }. errors has one message per bad field; values are trimmed strings.
 *   name: 2 to 80 characters   email: looks like an address, up to 254   message: 10 to 2000 characters
 */
export function validateEnquiry(body) {
  // TODO
  return { ok: true, errors: {}, values: {} };
}
