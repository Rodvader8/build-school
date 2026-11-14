import { NextResponse } from 'next/server';
import { validateEnquiry } from '@/lib/validate.js';
import { sendEnquiry } from '@/lib/notify.js';

// A route handler: export a function named after the HTTP method. There's no GET here, so GET gets a 405.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send the enquiry as JSON.' }, { status: 400 });
  }

  // Honeypot: real visitors can't see this field, so a filled one means a bot. Say "thanks" and quietly drop it.
  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const { ok, errors, values } = validateEnquiry(body);
  if (!ok) return NextResponse.json({ errors }, { status: 400 });

  await sendEnquiry(values);
  return NextResponse.json({ ok: true }, { status: 201 });
}
