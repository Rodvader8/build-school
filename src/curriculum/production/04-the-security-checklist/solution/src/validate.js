const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value) => value.replace(CONTROL, '').trim();

/**
 * Checks a signup from the outside world. Never trust the shape: it may be missing, a number, an array or huge.
 * Returns { ok, errors, value }. value has only name, email and (optionally) message, and only when ok is true.
 */
export function validateSignup(input) {
  const errors = {};
  if (input === null || typeof input !== 'object' || Array.isArray(input)) return { ok: false, errors: { _: 'Send a JSON object' }, value: null };

  const name = typeof input.name === 'string' ? clean(input.name) : '';
  if (typeof input.name !== 'string' || name.length === 0) errors.name = 'Name is required';
  else if (name.length > 80) errors.name = 'Name must be 80 characters or fewer';

  const email = typeof input.email === 'string' ? clean(input.email).toLowerCase() : '';
  if (typeof input.email !== 'string' || email.length === 0) errors.email = 'Email is required';
  else if (email.length > 254 || !EMAIL.test(email)) errors.email = 'Enter a valid email address';

  let message;
  if (input.message !== undefined) {
    if (typeof input.message !== 'string') errors.message = 'Message must be text';
    else if (input.message.length > 1000) errors.message = 'Message must be 1000 characters or fewer';
    else message = clean(input.message);
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors, value: null };
  // Only the fields we asked for. Anything else the sender included (role, isAdmin...) is dropped here.
  return { ok: true, errors: {}, value: message ? { name, email, message } : { name, email } };
}
