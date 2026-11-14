const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks an enquiry from the browser. Never trust it: anyone can send anything to a public URL.
 * Returns { ok, errors, values }. errors has one message per bad field; values are trimmed strings.
 */
export function validateEnquiry(body) {
  const source = body && typeof body === 'object' ? body : {};
  const text = (key) => (typeof source[key] === 'string' ? source[key].trim() : '');
  const values = { name: text('name'), email: text('email'), message: text('message') };
  const errors = {};

  if (values.name.length < 2 || values.name.length > 80) errors.name = 'Please enter your name.';
  if (!EMAIL.test(values.email) || values.email.length > 254) errors.email = 'Please enter a valid email address.';
  if (values.message.length < 10 || values.message.length > 2000) errors.message = 'Please tell us a bit more (10 to 2000 characters).';

  return { ok: Object.keys(errors).length === 0, errors, values };
}
