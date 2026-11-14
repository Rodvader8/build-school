// The "build": copies src/ into dist/ and stamps it with the commit the build came from.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('src', 'dist', { recursive: true });
writeFileSync('dist/build.json', JSON.stringify({ commit: process.env.GITHUB_SHA ?? 'local', builtAt: new Date().toISOString() }));
console.log('build: dist/ is ready');
