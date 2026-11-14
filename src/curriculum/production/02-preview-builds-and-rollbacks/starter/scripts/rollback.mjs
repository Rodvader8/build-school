// npm run rollback: one command, back to the release before this one. Provided for you.
import { rollback } from './deploy.mjs';

try {
  console.log(`Rolled back. current is now ${rollback(process.cwd())}.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
