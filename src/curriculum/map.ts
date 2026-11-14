// The full journey, from first tag to production.
// Track status: built = lessons exist, planned = on the map but not written yet.
// suggested = why the track sits where it does on the map.

export interface Capstone {
  name: string;
  what: string;
}

export interface MapTrack {
  id: string;
  title: string;
  status: 'built' | 'planned';
  suggested?: string; // why it's on the map
  modules: string[];
  capstones: Capstone[];
}

export interface Stage {
  title: string;
  summary: string;
  tracks: MapTrack[];
}

export const STAGES: Stage[] = [
  {
    title: 'Stage 1. The web, from the ground up',
    summary: 'Structure, style and behaviour. Every website and dashboard sits on these three.',
    tracks: [
      {
        id: 'html',
        title: 'HTML',
        status: 'built',
        modules: ['First page', 'Headings', 'Page skeleton', 'Links', 'Images', 'Lists', 'Layout tags', 'Tables', 'Forms', 'Accessibility', 'Search and sharing tags', 'Project: a landing page'],
        capstones: [],
      },
      {
        id: 'tools',
        title: 'Terminal, files and Git',
        status: 'built',
        suggested: 'Every project after this point lives in a folder, runs from a terminal and is saved with Git. Learning it early saves months.',
        modules: ['Folders and paths', 'The terminal: cd, ls, mkdir', 'VS Code like a pro', 'Chrome DevTools', 'Git: commit, branch, merge', 'GitHub and pull requests', 'npm and package.json'],
        capstones: [],
      },
      {
        id: 'css',
        title: 'CSS',
        status: 'built',
        modules: ['Your first stylesheet', 'Selectors and the cascade', 'The box model', 'Colours as design tokens', 'Typography and self-hosted fonts', 'Flexbox: the header', 'CSS Grid: the cards', 'Responsive, mobile-first', 'Transitions and keyframes', 'A cinematic hero', 'Project: style the whole page'],
        capstones: [{ name: 'A brochure page', what: 'A one-page site for a local business in plain HTML and CSS' }],
      },
      {
        id: 'js',
        title: 'JavaScript',
        status: 'built',
        modules: ['Your first script', 'Variables and values', 'Functions', 'Arrays and objects', 'Loops and conditions', 'The DOM: data into a table', 'Events: menus and the cursor lens', 'Modules: import and export', 'fetch and JSON', 'Sorting and filtering a table', 'Toggles, state and localStorage', 'An SVG chart by hand', 'Count-ups with IntersectionObserver', 'Project: the Brightwater room grid'],
        capstones: [
          { name: 'A quote and invoice tool', what: 'Forms, localStorage and print-to-PDF in one file' },
          { name: 'A logo slider', what: 'A small DOM and animation component you can reuse' },
        ],
      },
    ],
  },
  {
    title: 'Stage 2. Python: scripts that do the work for you',
    summary: 'Automation, reports and APIs. Python is the language behind most monitors, reports and media tools.',
    tracks: [
      {
        id: 'python',
        title: 'Python',
        status: 'built',
        modules: ['Hello, Python', 'Variables, strings and f-strings', 'Lists and dictionaries', 'Loops and conditions', 'Functions and the __main__ guard', 'Files: CSV in, JSON out', 'Command-line tools with argparse', 'Errors and logging', 'Packages and virtual environments', 'Images with Pillow', 'Project: a thumbnail tool'],
        capstones: [{ name: 'A gallery thumbnail script', what: 'Stack page screenshots into thumbnails with Pillow' }],
      },
      {
        id: 'apis',
        title: 'APIs, JSON and keeping secrets safe',
        status: 'built',
        suggested: 'Most useful tools talk to another service: analytics, payments or an AI model. Calling APIs safely, with keys kept out of code, is the skill that unlocks them.',
        modules: ['What an API is', 'HTTP requests with urllib and requests', 'API keys and .env files', 'OAuth and refresh tokens', 'Rate limits and retries', 'Calling an AI model and getting JSON back'],
        capstones: [
          { name: 'An analytics report', what: 'Pull an export API into a weekly report' },
          { name: 'An enquiry checker', what: 'DNS and domain lookups that flag a suspicious lead' },
        ],
      },
      {
        id: 'ops',
        title: 'Servers, databases and scheduled jobs',
        status: 'built',
        suggested: 'Monitors and alerts run on their own, on a server, on a timer. This track teaches how software keeps running without you.',
        modules: ['Linux basics and ssh', 'cron and systemd timers', 'SQLite with Python', 'A tiny web server and JSON API', 'State files and idempotent jobs', 'Alerts: Slack and desktop notifications', 'Project: a small site monitor'],
        capstones: [
          { name: 'A security alarm', what: 'Poll a CVE feed on a timer and send a morning digest' },
          { name: 'A site monitor', what: 'Uptime and speed checks for a handful of sites, in SQLite, served as a dashboard' },
        ],
      },
      {
        id: 'media',
        title: 'Media pipelines: ffmpeg, Whisper and video',
        status: 'built',
        suggested: 'Shorts, reels and captioned clips are usually Python driving ffmpeg. Worth its own track once Python feels comfortable.',
        modules: ['ffmpeg basics: cut, join, resize', 'Burning in captions', 'Transcripts and timing', 'Composing frames with Pillow', 'Project: a batch clip maker'],
        capstones: [{ name: 'A shorts maker', what: 'A long video in, captioned 9:16 clips out' }],
      },
    ],
  },
  {
    title: 'Stage 3. Rust: fast, safe, native',
    summary: 'A stricter language that makes desktop apps and real-time audio possible.',
    tracks: [
      {
        id: 'rust',
        title: 'Rust',
        status: 'built',
        modules: ['cargo and your first program', 'Variables and types', 'Ownership and borrowing', 'Structs and enums', 'match, Option and Result', 'Vectors and HashMaps', 'Traits', 'Modules and crates', 'Threads, channels and atomics', 'A desktop window with egui', 'Project: a command-line tool'],
        capstones: [{ name: 'A CLI of your own', what: 'For example, a faster version of a Python script you wrote in Stage 2' }],
      },
    ],
  },
  {
    title: 'Stage 4. Motion, 3D and sound',
    summary: 'The techniques that make a site feel premium, and real-time sound in Rust.',
    tracks: [
      {
        id: 'gsap',
        title: 'GSAP',
        status: 'built',
        modules: ['Tweens: to, from, fromTo', 'Easing: the feel of a movement', 'Timelines: choreographing a hero', 'Stagger: one tween, many elements', 'ScrollTrigger: animate when it arrives', 'Pin and scrub: Larkfield\'s chapters', 'A horizontal pinned track: Anchorline\'s industries', 'Self-drawing SVG lines', 'Colour shift on scroll: Brightwater\'s day', 'Count-ups and the results strip', 'matchMedia and reduced motion', 'Project: rebuild Willow Cove\'s first-visit journey'],
        capstones: [{ name: 'A scroll story', what: 'A landing page that tells its story as you scroll' }],
      },
      {
        id: 'canvas',
        title: 'Canvas and scroll-scrubbed image sequences',
        status: 'built',
        suggested: 'Many cinematic scroll heroes aren\'t Three.js. They\'re hundreds of rendered frames scrubbed on a canvas. That technique needs its own short track.',
        modules: ['Canvas 2D: drawing a sunrise', 'Loading image sequences without hurting LCP', 'Scrubbing frames with ScrollTrigger', 'Spring easing and crossfades', 'Project: phone pinning and performance'],
        capstones: [{ name: 'A frame-sequence hero', what: 'A rendered animation scrubbed by scroll, fast on phones' }],
      },
      {
        id: 'three',
        title: 'Three.js',
        status: 'built',
        modules: ['Scene, camera, renderer', 'Geometry and materials', 'Lights and shadows', 'The animation loop and resizing', 'Textures', 'Loading GLTF models', 'Pointer and raycasting', 'Scroll-driven cameras', 'Shader basics', 'Performance: pixel ratio and disposal', 'Project: a 3D hero'],
        capstones: [{ name: 'A WebGL hero', what: 'A 3D hero for a landing page, with a still-image fallback' }],
      },
      {
        id: 'cpal',
        title: 'CPAL and real-time audio',
        status: 'built',
        modules: ['Samples, sample rates and buffers', 'Devices and the default output', 'A sine oscillator', 'Envelopes: the Bramble click voice', 'Real-time rules: no locks or allocations in the callback', 'Lock-free messages with rtrb', 'Playing WAV files with hound', 'MIDI input with midir', 'Meters with atomics', 'Project: a tiny drum machine'],
        capstones: [{ name: 'A tiny DAW', what: 'cpal, egui and MIDI: a sequencer you can actually play' }],
      },
    ],
  },
  {
    title: 'Stage 5. The professional toolkit',
    summary: 'How professional sites are actually built, shipped and kept fast.',
    tracks: [
      {
        id: 'typescript',
        title: 'TypeScript',
        status: 'built',
        suggested: 'Most modern codebases are TypeScript. It\'s JavaScript with labels that catch mistakes before the browser does.',
        modules: ['Types and inference', 'Interfaces and type aliases', 'Typing the DOM', 'Typing data files', 'Generics, lightly'],
        capstones: [],
      },
      {
        id: 'astro',
        title: 'Astro',
        status: 'built',
        suggested: 'For content-led marketing sites, Astro is hard to beat: fast by default, with JavaScript only where you ask for it.',
        modules: ['Pages and layouts', 'Components and props', 'Content as data', 'Images with astro:assets', 'Local fonts with fontProviders.local', 'Scripts per page, and GSAP from npm', 'Islands with Preact', 'SEO, JSON-LD and llms.txt', 'Project: a one-page premium site'],
        capstones: [
          { name: 'A trade business site', what: 'A fast multi-page site with real content and an enquiry form' },
          { name: 'A site template', what: 'One template, one JSON file per business' },
        ],
      },
      {
        id: 'netlify',
        title: 'Shipping: Netlify, headers and functions',
        status: 'built',
        suggested: 'Getting a site live safely: deploys, redirects, a Content Security Policy, form functions and edge functions.',
        modules: ['Deploying a site', 'netlify.toml and redirects', 'Security headers and CSP', 'Functions: an enquiry form', 'Edge functions and Blobs', 'npm audit and dependency upgrades'],
        capstones: [{ name: 'A locked-down site', what: 'Strict CSP, security headers and a working form function' }],
      },
      {
        id: 'quality',
        title: 'Performance, SEO and accessibility',
        status: 'built',
        suggested: 'Speed, findability and accessibility are what clients pay for. Measuring them properly (medians, not one run) is a skill of its own.',
        modules: ['Lighthouse and PageSpeed', 'LCP, CLS and TBT', 'Image pipelines with sharp', 'Font loading', 'Structured data (JSON-LD)', 'WCAG checks with axe-core'],
        capstones: [],
      },
      {
        id: 'playwright',
        title: 'Browser automation with Playwright',
        status: 'built',
        suggested: 'QA, screenshots, recordings and end-to-end tests can all run on Playwright.',
        modules: ['Opening pages and clicking', 'Screenshots at four widths', 'Smooth scripted scrolling', 'Visual diffs', 'End-to-end tests'],
        capstones: [{ name: 'A visual QA kit', what: 'Screenshots at four widths and a diff after every change' }],
      },
    ],
  },
  {
    title: 'Stage 6. Frameworks and full apps',
    summary: 'React-based apps, dashboards with real data, and phones.',
    tracks: [
      {
        id: 'tailwind',
        title: 'Tailwind CSS',
        status: 'built',
        modules: ['Utility-first thinking', 'Tailwind 4 setup and @theme', 'Responsive and state variants', 'Dark mode', 'Components without repeating yourself'],
        capstones: [],
      },
      {
        id: 'react',
        title: 'React',
        status: 'built',
        modules: ['Components and JSX', 'Props', 'State with useState', 'Effects with useEffect', 'Lists and keys', 'Forms with validation (zod)', 'Context', 'Project: a dashboard widget'],
        capstones: [{ name: 'A small React app', what: 'A tool you use yourself, with state, forms and validation' }],
      },
      {
        id: 'nextjs',
        title: 'Next.js',
        status: 'built',
        modules: ['App Router, pages and layouts', 'Server and client components', 'Data fetching and caching', 'Metadata and SEO', 'Images and fonts', 'Route handlers: an enquiry API', 'shadcn-style components with Radix', 'Project: a multi-page site'],
        capstones: [{ name: 'A studio website', what: 'A multi-page Next.js site with metadata, images and an enquiry API' }],
      },
      {
        id: 'dashboards',
        title: 'Dashboards and data',
        status: 'built',
        suggested: 'A real dashboard needs charts, a database and a login. That\'s Recharts, Postgres and Supabase with row-level security.',
        modules: ['KPI tiles and tables', 'Charts with Recharts', 'Heatmaps and grids', 'Scenarios: a cash forecast', 'Postgres and Supabase', 'Login and row-level security'],
        capstones: [{ name: 'A client dashboard', what: 'Multi-tenant Supabase with tested row-level security' }],
      },
      {
        id: 'ai-apps',
        title: 'AI inside your apps',
        status: 'built',
        suggested: 'More and more apps call an AI model from code. This track covers doing it safely in a web app.',
        modules: ['Calling Claude from a server route', 'Structured output you can trust', 'Word and Excel files from model output', 'Costs, caching and a budget guard'],
        capstones: [{ name: 'A document generator', what: 'Structured AI output turned into a Word document' }],
      },
      {
        id: 'react-native',
        title: 'React Native (Expo)',
        status: 'built',
        modules: ['Expo setup and Expo Go', 'Core components: View, Text, Image, Pressable, ScrollView', 'Styling with StyleSheet', 'Navigation with expo-router', 'Lists with FlatList and keys', 'Device features: the clipboard', 'Project: the owner\'s morning view'],
        capstones: [{ name: 'Your quote tool, as a phone app', what: 'Rebuild the quote tool from Stage 1 as a native app' }],
      },
    ],
  },
  {
    title: 'Stage 7. Production',
    summary: 'From guided lessons to unguided work: design judgement, briefs with no step-by-step, real shipping and real codebases.',
    tracks: [
      {
        id: 'design',
        title: 'Design for developers',
        status: 'built',
        suggested: 'A premium site is as much art direction as code. This track teaches the design decisions behind one, using an invented brand as the worked case study.',
        modules: ['Layout and the grid', 'A type scale that holds together', 'Colour: palettes, contrast and dark themes', 'Spacing and rhythm from tokens', 'Art direction: one idea per page', 'Project: a design system for an invented brand'],
        capstones: [{ name: 'A design system of your own', what: 'Tokens, type, colour and components for a brand you invent' }],
      },
      {
        id: 'workflow',
        title: 'Professional workflow',
        status: 'built',
        suggested: 'Real work means code you didn\'t write, bugs nobody explains and docs you have to read first.',
        modules: ['Reading an unfamiliar codebase', 'Debugging with a method', 'Finding a regression with git bisect', 'Docs before guesses', 'Code review: giving and taking it'],
        capstones: [],
      },
      {
        id: 'rebuild',
        title: 'Rebuild from a brief',
        status: 'built',
        suggested: 'No starter steps and no hints: a brief, a reference and an automated quality gate, the way a real job arrives.',
        modules: ['The quality gate: what "done" means', 'Brief 1: a motion-led landing page', 'Brief 2: a multi-page service site', 'Brief 3: a client dashboard'],
        capstones: [{ name: 'Your portfolio', what: 'Three briefs, each one passed through the quality gate' }],
      },
      {
        id: 'production',
        title: 'Shipping to production',
        status: 'built',
        suggested: 'Getting it live and keeping it alive: CI on every commit, preview builds, error monitoring and a security checklist.',
        modules: ['CI: tests on every commit', 'Preview builds and rollbacks', 'Error monitoring', 'The security checklist', 'Performance budgets that fail the build', 'Project: take a dashboard to production'],
        capstones: [],
      },
    ],
  },
];

export const TOTAL_TRACKS = STAGES.reduce((n, s) => n + s.tracks.length, 0);
