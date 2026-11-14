import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'API keys and .env files',
  minutes: 30,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  testSetup: 'if [ -f solve.sh ]; then bash solve.sh; fi',
  checks: [
    { label: 'load_env reads values and skips comments', test: ({ output }) => passed(output, 'load_env reads values and skips comments') },
    { label: 'load_env strips quotes and spaces, and keeps = inside values', test: ({ output }) => passed(output, 'load_env strips quotes and spaces, keeps = in values') },
    { label: 'load_env never overwrites a variable that\'s already set', test: ({ output }) => passed(output, 'load_env never overwrites a variable already set') },
    { label: 'A missing .env file is fine', test: ({ output }) => passed(output, 'a missing .env file is fine') },
    { label: 'mask shows only the last four characters', test: ({ output }) => passed(output, 'mask shows only the last four characters') },
    { label: 'A missing key gives a helpful error that names the variable', test: ({ output }) => passed(output, 'a missing key gives a helpful error naming the variable') },
    { label: 'call_site_api sends the key from the environment', test: ({ output }) => passed(output, 'call_site_api sends the key from the environment') },
    { label: 'The key is read each time, not fixed in the code', test: ({ output }) => passed(output, 'it follows the environment, not a fixed value') },
    { label: 'No key is typed into main.py', test: ({ output }) => passed(output, 'no key is typed into main.py') },
    { label: 'Running main.py shows only the end of the key', test: ({ output }) => passed(output, 'running main.py shows only the end of the key') },
    { label: 'You made a .env with SITE_API_KEY in it', test: ({ output }) => passed(output, '.env exists and holds SITE_API_KEY') },
    { label: '.gitignore keeps .env out of Git, but not .env.example', test: ({ output }) => passed(output, '.gitignore keeps .env out of Git, but not .env.example') },
  ],
  hints: [
    'In a terminal: cp .env.example .env. Then open .env and leave the fake key as it is. The tests never read it.',
    'line.partition("=") splits on the first = only, so a value with = inside survives. value.strip() then removes spaces, and check the first and last characters for quotes.',
    '.gitignore needs three lines: .env, then .env.*, then !.env.example. The ! line puts the example back, so it can be committed.',
  ],
} satisfies LessonMeta;
