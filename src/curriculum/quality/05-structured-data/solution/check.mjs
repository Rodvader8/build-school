// Check my work: runs your project and inspects what it does.
// Open this file if you're curious. Every check prints PASS or FAIL.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
/** Source code without comments, so a comment can't fool a check. */
const codeOf = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');


const html = read('site/index.html');

/* ---- find and parse every JSON-LD block ---- */
const blocks = [...html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const parsed = [];
const problems = [];
blocks.forEach((raw, i) => {
  try {
    parsed.push(JSON.parse(raw));
  } catch (e) {
    problems.push(`Block ${i + 1} isn't valid JSON: ${e.message}`);
  }
});
const nodes = parsed.flatMap((b) => (Array.isArray(b['@graph']) ? b['@graph'] : [b]));
const badContext = parsed.filter((b) => b['@context'] !== 'https://schema.org');
check(
  'every JSON-LD block is valid',
  blocks.length >= 3 && problems.length === 0 && badContext.length === 0,
  problems.join('\n') || (blocks.length < 3 ? `Found ${blocks.length} block(s); the page needs a LocalBusiness, a Service and a FAQPage.` : 'Each block needs "@context": "https://schema.org".'),
);

const typeOf = (n) => [].concat(n['@type'] ?? []);
const find = (re) => nodes.find((n) => typeOf(n).some((t) => re.test(t)));
const biz = find(/LocalBusiness$|^ProfessionalService$|^HomeAndConstructionBusiness$/);
const service = find(/^Service$/);
const faq = find(/^FAQPage$/);
const filled = (v) => (Array.isArray(v) ? v.length > 0 && v.every(filled) : typeof v === 'object' && v ? !!(v.name || v['@id']) : typeof v === 'string' && v.trim().length > 0);

const missingBiz = ['name', 'url', 'telephone', 'description', 'areaServed'].filter((k) => !filled(biz?.[k]));
if (biz && !/^https:\/\//.test(biz.url ?? '')) missingBiz.push('url (must start with https://)');
if (biz && biz.telephone && !/^\+61[\s\d-]{8,}$/.test(biz.telephone)) missingBiz.push('telephone (use +61 format)');
check('LocalBusiness has its required fields', !!biz && missingBiz.length === 0, biz ? `Missing or invalid: ${missingBiz.join(', ')}` : 'No LocalBusiness block found.');

const addr = biz?.address;
const hasStreet = JSON.stringify(parsed).includes('streetAddress');
check(
  'the address is suburb only',
  !!addr && addr['@type'] === 'PostalAddress' && !!addr.addressLocality && !!addr.addressRegion && addr.addressCountry === 'AU' && !hasStreet,
  hasStreet ? 'Remove streetAddress. A home-based business shares its suburb only.' : 'address needs @type PostalAddress with addressLocality, addressRegion and addressCountry "AU".',
);

const missingSvc = ['name', 'serviceType', 'description', 'areaServed'].filter((k) => !filled(service?.[k]));
if (service && (service.description ?? '').length < 30) missingSvc.push('description (a proper sentence)');
const provider = service?.provider;
const providerOk = !!provider && (provider.name === biz?.name || (!!provider['@id'] && provider['@id'] === biz?.['@id']));
if (service && !providerOk) missingSvc.push('provider (should name the business)');
check('Service has its required fields', !!service && missingSvc.length === 0, service ? `Missing or invalid: ${missingSvc.join(', ')}` : 'No Service block found.');

const qs = [].concat(faq?.mainEntity ?? []);
const complete = qs.every((q) => typeOf(q).includes('Question') && (q.name ?? '').trim() && typeOf(q.acceptedAnswer ?? {}).includes('Answer') && (q.acceptedAnswer?.text ?? '').trim());
check('FAQPage has three or more complete questions', qs.length >= 3 && complete, faq ? `${qs.length} question(s) found. Each needs @type Question, a name and an acceptedAnswer with text.` : 'No FAQPage block found.');

const visible = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, ' ');
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const mismatches = qs.filter((q) => !visible.includes(norm(q.name)) || !visible.includes(norm(q.acceptedAnswer?.text ?? '')));
const visibleQuestions = (html.match(/<summary\b/gi) ?? []).length;
check(
  'the FAQ matches the visible page',
  qs.length > 0 && mismatches.length === 0 && qs.length === visibleQuestions,
  mismatches.length ? `Doesn't match the page word for word: "${norm(mismatches[0].name)}"` : `The page shows ${visibleQuestions} questions but the schema has ${qs.length}.`,
);

const street = /\b\d{1,4}[A-Za-z]?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl|Crescent|Cres)\b/;
check('no street address anywhere', !street.test(html) && !hasStreet, 'There is still a street address or streetAddress in the file. Search for the street name and remove it.');
