// npm run release: deploys ./site as a new release. Provided for you.
import { release } from './deploy.mjs';

const id = release(process.cwd(), 'site');
console.log(`Released ${id} and switched current to it.`);
