// Loads every lesson folder: <track>/<NN-slug>/{lesson.ts, lesson.md, starter/**, solution/**}
import type { Lesson, LessonMeta, Track } from './types';

export const TRACKS: Track[] = [
  // Same order as the curriculum map (src/curriculum/map.ts). Playgrounds stay last.
  { id: 'html', title: 'HTML', blurb: 'The structure of every page you will ever build.' },
  { id: 'tools', title: 'Terminal, files and Git', blurb: 'The command line, folders and version control every project runs on.' },
  { id: 'css', title: 'CSS', blurb: 'Colour, type, layout and motion: how a page gets its look.' },
  { id: 'js', title: 'JavaScript', blurb: 'Logic, data and interaction: how a page comes alive.' },
  { id: 'python', title: 'Python', blurb: 'Scripts that do the work for you: files, data, images and automation.' },
  { id: 'apis', title: 'APIs and secrets', blurb: 'Talking to Google, Stripe and AI models from code, with keys kept safe.' },
  { id: 'ops', title: 'Servers and scheduled jobs', blurb: 'Software that runs by itself: cron, SQLite, small servers and alerts.' },
  { id: 'media', title: 'Media pipelines', blurb: 'ffmpeg, captions and batch jobs: the guts of any video tool.' },
  { id: 'rust', title: 'Rust', blurb: 'Fast, safe, native programs: command-line tools, threads and desktop windows.' },
  { id: 'gsap', title: 'GSAP', blurb: 'Scroll and motion: tweens, timelines, pinning and scroll-driven stories.' },
  { id: 'canvas', title: 'Canvas', blurb: 'Drawing with code, and the scroll-scrubbed frame-sequence hero.' },
  { id: 'three', title: 'Three.js', blurb: '3D in the browser: scenes, lights, models and scroll-driven cameras.' },
  { id: 'cpal', title: 'CPAL audio', blurb: 'Real-time sound in Rust: oscillators, ring buffers, MIDI and a tiny drum machine.' },
  { id: 'typescript', title: 'TypeScript', blurb: 'JavaScript with labels that catch mistakes before the browser does.' },
  { id: 'astro', title: 'Astro', blurb: 'Fast content sites: pages, components, images and fonts.' },
  { id: 'netlify', title: 'Shipping on Netlify', blurb: 'Deploys, redirects, security headers, forms and edge functions.' },
  { id: 'quality', title: 'Performance, SEO and accessibility', blurb: 'Measuring what clients pay for: Lighthouse, Core Web Vitals, schema and WCAG.' },
  { id: 'playwright', title: 'Browser automation', blurb: 'Playwright for QA, screenshots, scripted scrolling and tests.' },
  { id: 'tailwind', title: 'Tailwind CSS', blurb: 'Utility-first styling with Tailwind 4: variants, dark mode and components.' },
  { id: 'react', title: 'React', blurb: 'Components, props and state: the idea behind every modern app.' },
  { id: 'nextjs', title: 'Next.js', blurb: 'Full-stack React: routing, server components, metadata and deploys.' },
  { id: 'dashboards', title: 'Dashboards and data', blurb: 'Charts, KPI tiles, Postgres and logins with row-level security.' },
  { id: 'ai-apps', title: 'AI inside your apps', blurb: 'Calling Claude from a server, structured output and documents.' },
  { id: 'react-native', title: 'React Native', blurb: 'Phone apps with Expo, built from the React you already know.' },
  { id: 'design', title: 'Design for developers', blurb: 'Layout, type, colour and art direction: the decisions behind a premium site.' },
  { id: 'workflow', title: 'Professional workflow', blurb: 'Unfamiliar codebases, debugging with a method, git bisect, docs and code review.' },
  { id: 'rebuild', title: 'Rebuild from a brief', blurb: 'Capstones with no step-by-step: a brief, a reference and a quality gate.' },
  { id: 'production', title: 'Shipping to production', blurb: 'CI, preview builds, error monitoring, security and performance budgets.' },
  { id: 'playgrounds', title: 'Playgrounds', blurb: 'Free-play sandboxes for each language. No checks, just build.' },
];

const metas = import.meta.glob<LessonMeta>('./*/*/lesson.ts', { eager: true, import: 'default' });
const bodies = import.meta.glob<string>('./*/*/lesson.md', { eager: true, query: '?raw', import: 'default' });
// Text files only. Fonts and images are copied into the workspace by the server instead.
const files = import.meta.glob<string>(['./*/*/starter/**/*', './*/*/solution/**/*', '!**/*.{woff,woff2,ttf,otf,png,jpg,jpeg,webp,avif,gif,ico,glb,mp3,wav,mp4,mid,midi}'], {
  eager: true,
  query: '?raw',
  import: 'default',
});

function folderFiles(folder: string, which: 'starter' | 'solution') {
  const prefix = `${folder}/${which}/`;
  const out: Record<string, string> = {};
  for (const [key, content] of Object.entries(files)) {
    if (key.startsWith(prefix)) out[key.slice(prefix.length)] = content;
  }
  return out;
}

export const LESSONS: Lesson[] = Object.entries(metas)
  .map(([key, meta]) => {
    const folder = key.replace(/\/lesson\.ts$/, ''); // ./html/01-first-page
    const [, trackId, slug] = folder.split('/');
    return {
      ...meta,
      id: `${trackId}-${slug}`,
      trackId,
      order: parseInt(slug, 10),
      body: bodies[`${folder}/lesson.md`] ?? '',
      starter: folderFiles(folder, 'starter'),
      solution: folderFiles(folder, 'solution'),
    };
  })
  .sort(
    (a, b) =>
      TRACKS.findIndex((t) => t.id === a.trackId) - TRACKS.findIndex((t) => t.id === b.trackId) || a.order - b.order,
  );

export function lessonsIn(trackId: string) {
  return LESSONS.filter((l) => l.trackId === trackId);
}

/** The page a web lesson previews. */
export const pageOf = (lesson: { page?: string }) => lesson.page ?? 'index.html';

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id);
}
