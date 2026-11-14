import type { LessonMeta } from '../../types';
import { errors, globalValue, logLines } from '../../helpers';

type Plan = { name: string; suits: string; fee: number };
const plans = (win: Window) => globalValue(win, 'plans') as Plan[] | undefined;

export default {
  title: 'Arrays and objects',
  minutes: 15,
  kind: 'web',
  entry: 'script.js',
  checks: [
    { label: 'plans holds four plans', test: ({ win }) => Array.isArray(plans(win)) && plans(win)!.length === 4 },
    { label: 'Family and Private have the right details', test: ({ win }) => { const p = plans(win) ?? []; return p[1]?.name === 'Family' && p[1]?.fee === 7700 && p[2]?.name === 'Private' && p[2]?.suits === 'Complex, multi-entity wealth' && p[2]?.fee === 13200; } },
    { label: 'Foundation was added with push', test: ({ win, files }) => plans(win)?.[3]?.name === 'Foundation' && plans(win)?.[3]?.fee === 2200 && /plans\.push\(/.test(files['script.js'] ?? '') },
    { label: 'planNames was made with map', test: ({ win, files }) => JSON.stringify(globalValue(win, 'planNames')) === JSON.stringify(['Essentials', 'Family', 'Private', 'Foundation']) && /\.map\(/.test(files['script.js'] ?? '') },
    { label: 'family was found with find, and you logged its fee', test: ({ win, files }) => (globalValue(win, 'family') as Plan | undefined)?.fee === 7700 && /\.find\(/.test(files['script.js'] ?? '') && logLines(win).includes('7700') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Each object in the array ends with a comma: { name: \'Family\', suits: \'...\', fee: 7700 },',
    'const planNames = plans.map((plan) => plan.name);',
  ],
} satisfies LessonMeta;
