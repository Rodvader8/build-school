import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'npm and package.json',
  minutes: 25,
  kind: 'terminal',
  entry: 'steps.txt',
  checkEntry: 'check.py',
  testSetup: 'if [ -f solve.sh ]; then bash solve.sh; fi',
  checks: [
    { label: 'package.json exists and has a name', test: ({ output }) => passed(output, 'package.json exists with a name') },
    { label: 'slug-lite is listed under dependencies', test: ({ output }) => passed(output, 'slug-lite is listed as a dependency') },
    { label: 'package-lock.json exists and knows about slug-lite', test: ({ output }) => passed(output, 'package-lock.json exists and knows slug-lite') },
    { label: 'slug-lite is installed in node_modules', test: ({ output }) => passed(output, 'node_modules has slug-lite installed') },
    { label: 'You added a "slugs" script that runs slugs.js', test: ({ output }) => passed(output, 'the slugs script runs slugs.js') },
    { label: 'npm run slugs prints the three slugs', test: ({ output }) => passed(output, 'npm run slugs works') },
    { label: '.gitignore keeps node_modules out of Git', test: ({ output }) => passed(output, '.gitignore keeps node_modules out of Git') },
    { label: '.gitignore keeps .env out, but not .env.example', test: ({ output }) => passed(output, '.gitignore keeps .env out, but not .env.example') },
  ],
  hints: [
    'Run every command from inside the tool folder (cd tool). package.json is created in whatever folder you\'re standing in.',
    'npm pkg set scripts.slugs="node slugs.js" adds the script for you. Or open package.json and edit the "scripts" section by hand, keeping the commas right.',
    'A .gitignore line ending in a slash, like node_modules/, matches the folder. Add .env, .env.* and !.env.example as well.',
  ],
} satisfies LessonMeta;
