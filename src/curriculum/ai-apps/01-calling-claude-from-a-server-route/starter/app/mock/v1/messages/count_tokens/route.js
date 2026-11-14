import { mockCountTokens } from '@/mock/anthropic-mock.js';

export async function POST(request) {
  const { status, body } = mockCountTokens(Object.fromEntries(request.headers), await request.json().catch(() => null));
  return Response.json(body, { status });
}
