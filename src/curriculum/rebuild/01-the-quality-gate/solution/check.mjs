// Check my work: runs the quality gate on your site. The gate is gate.mjs, and every Rebuild lesson uses the same one.
// Open it if you're curious. It's plain Node, one rule at a time.
import { runGate } from './gate.mjs';

await runGate();
