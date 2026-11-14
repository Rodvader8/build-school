// A Netlify Function (v2): a Request comes in, a Response goes out.

const json = (body, status = 200, headers = {}) => Response.json(body, { status, headers });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });

  // The CRM address and key come from the environment, never from the code.
  const { CRM_URL, CRM_API_KEY } = process.env;
  if (!CRM_URL || !CRM_API_KEY) {
    console.error('Enquiry function is not configured');
    return json({ error: 'Something went wrong. Please try again later.' }, 500);
  }

  let data;
  try {
    const type = req.headers.get('content-type') ?? '';
    data = type.includes('json') ? await req.json() : Object.fromEntries(await req.formData());
  } catch {
    return json({ error: 'Could not read that request' }, 400);
  }

  // Honeypot: people never see this field, bots fill it in. Say "thanks" and do nothing.
  if (data.website) return json({ ok: true });

  const name = String(data.name ?? '').trim();
  const email = String(data.email ?? '').trim();
  const message = String(data.message ?? '').trim();
  const errors = {};
  if (name.length < 2 || name.length > 100) errors.name = 'Please enter your name';
  if (!EMAIL.test(email)) errors.email = 'Please enter a valid email address';
  if (message.length < 10 || message.length > 2000) errors.message = 'Please write a message of 10 to 2000 characters';
  if (Object.keys(errors).length) return json({ errors }, 400);

  const res = await fetch(CRM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CRM_API_KEY}` },
    body: JSON.stringify({ name, email, message, source: 'website' }),
  }).catch(() => null);

  if (!res?.ok) {
    // Log what went wrong, never who it was about.
    console.error('CRM rejected an enquiry', res ? res.status : 'unreachable');
    return json({ error: 'We could not save your enquiry. Please try again.' }, 502);
  }
  return json({ ok: true });
};

export const config = { path: '/api/enquiry' };
