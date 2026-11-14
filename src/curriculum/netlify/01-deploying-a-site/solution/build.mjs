// The "build": turns src/ into a finished site in dist/.
// On a deploy preview, Netlify runs it with SITE_ENV=preview (set in netlify.toml) so search engines are told to ignore the page.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const preview = process.env.SITE_ENV === 'preview';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
cpSync('src/style.css', 'dist/style.css');

const html = readFileSync('src/index.html', 'utf8').replace('<!-- robots -->', preview ? '<meta name="robots" content="noindex, nofollow">' : '');
writeFileSync('dist/index.html', html);

console.log(preview ? 'Built a preview into dist/' : 'Built the live site into dist/');
