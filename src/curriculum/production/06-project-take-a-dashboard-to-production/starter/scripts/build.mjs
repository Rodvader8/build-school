// The build: src/ and lib/ are copied into dist/, where the server serves them. A real project would bundle here.
import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('src', 'dist', { recursive: true });
cpSync('lib', 'dist/lib', { recursive: true });
console.log('build: dist/ is ready');
