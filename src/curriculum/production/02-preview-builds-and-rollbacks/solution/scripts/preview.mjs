// npm run preview -- <name>: builds ./site into previews/<name>. Provided for you.
import { preview } from './deploy.mjs';

const name = process.argv[2] ?? 'preview';
console.log(`Preview ready in ${preview(process.cwd(), 'site', name)}`);
