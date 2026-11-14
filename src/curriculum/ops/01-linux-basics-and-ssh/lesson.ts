import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Linux basics and ssh',
  minutes: 35,
  kind: 'terminal',
  entry: 'steps.txt',
  checkEntry: 'check.py',
  testSetup: 'if [ -f solve.sh ]; then bash solve.sh; fi',
  checks: [
    { label: 'hello.sh can be run (it has the execute bit)', test: ({ output }) => passed(output, 'hello.sh is executable') },
    { label: '.env exists and only you can read it (chmod 600)', test: ({ output }) => passed(output, '.env is private to you') },
    { label: '.gitignore lists .env', test: ({ output }) => passed(output, '.gitignore lists .env') },
    { label: 'run.sh greets the NAME variable, and falls back to world', test: ({ output }) => passed(output, 'run.sh reads NAME') },
    { label: 'Permission answers are right', test: ({ output }) => passed(output, 'permission answers') },
    { label: 'Process and port answers are right', test: ({ output }) => passed(output, 'process and port answers') },
    { label: 'ssh_config has the webserver host block', test: ({ output }) => passed(output, 'ssh_config host block') },
    { label: 'ssh_config only uses your own key, nothing else', test: ({ output }) => passed(output, 'ssh_config uses IdentitiesOnly') },
    { label: 'No private key is anywhere in the folder', test: ({ output }) => passed(output, 'no private key in the folder') },
  ],
  hints: [
    'chmod +x hello.sh adds the execute bit. For the secrets file, copy the example first (cp .env.example .env), then chmod 600 .env.',
    'In run.sh, ${NAME:-world} means "the NAME variable, or the word world if it isn\'t set". Put it inside double quotes.',
    'Each permission digit is r=4, w=2, x=1 added up. 6 is rw-, 5 is r-x, 4 is r--. Check your ssh_config with: ssh -G -F ssh_config webserver (it prints the settings and never connects).',
  ],
} satisfies LessonMeta;
