import Anthropic from '@anthropic-ai/sdk';
import { generatePlan, PlanError } from '@/lib/plan.js';
import { MissingKeyError } from '@/lib/claude.js';
import { buildDocx } from '@/lib/docx.js';
import { buildXlsx } from '@/lib/xlsx.js';

const FORMATS = {
  docx: { build: buildDocx, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  xlsx: { build: buildXlsx, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
};

// The model wrote the title, so don't trust it as a filename: keep letters, digits and hyphens only.
const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'event-plan';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const brief = typeof body?.brief === 'string' ? body.brief.trim() : '';
  const format = Object.hasOwn(FORMATS, body?.format) ? FORMATS[body.format] : null;
  if (!brief || brief.length > 2000 || !format) {
    return Response.json({ error: 'Send a brief (1 to 2000 characters) and a format of docx or xlsx.' }, { status: 400 });
  }

  try {
    const plan = await generatePlan(brief);
    const file = await format.build(plan);
    return new Response(file, {
      headers: {
        'Content-Type': format.type,
        'Content-Disposition': `attachment; filename="${slug(plan.title)}.${body.format}"`,
      },
    });
  } catch (error) {
    // Only a validated plan ever becomes a file. A refusal or a broken reply is an error, never a download.
    if (error instanceof PlanError) {
      return Response.json({ error: error.message, kind: error.kind }, { status: error.kind === 'refused' ? 422 : 502 });
    }
    if (error instanceof MissingKeyError) return Response.json({ error: 'The server has no API key set.' }, { status: 500 });
    if (error instanceof Anthropic.APIError) return Response.json({ error: 'The AI service could not answer that just now.' }, { status: 502 });
    throw error;
  }
}
