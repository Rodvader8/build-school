import { mockMessages } from '@/mock/anthropic-mock.js';

// The dev server doubles as the pretend Anthropic API, at /mock/v1/messages. Delete app/mock/ when you switch to a real key.
export async function POST(request) {
  const { status, body } = mockMessages(Object.fromEntries(request.headers), await request.json().catch(() => null));
  return Response.json(body, { status });
}
