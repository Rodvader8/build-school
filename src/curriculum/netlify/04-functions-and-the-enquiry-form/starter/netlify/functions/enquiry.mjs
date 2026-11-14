// A Netlify Function (v2): a Request comes in, a Response goes out.
// This first draft works on a good day, but it's unsafe. Fix it step by step.

const json = (body, status = 200, headers = {}) => Response.json(body, { status, headers });

export default async (req) => {
  const data = await req.json();
  console.log('New enquiry', data);

  const res = await fetch(process.env.CRM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer fake_crm_key_for_lessons_only' },
    body: JSON.stringify(data),
  });
  return json({ ok: res.ok });
};

export const config = { path: '/api/enquiry' };
