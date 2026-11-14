import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Deploying a site',
  minutes: 25,
  kind: 'node',
  entry: 'netlify.toml',
  checkEntry: 'check.mjs',
  checks: [
    { label: 'netlify.toml has a [build] section with a command and a publish folder', test: ({ output }) => passed(output, 'netlify.toml has a build command and a publish folder') },
    { label: 'The build command runs without errors', test: ({ output }) => passed(output, 'the build command runs') },
    { label: 'The publish folder is the one the build actually makes', test: ({ output }) => passed(output, 'the publish folder is the one the build makes') },
    { label: 'Node is pinned to version 20 or newer', test: ({ output }) => passed(output, 'node is pinned') },
    { label: 'Deploy previews set SITE_ENV to preview', test: ({ output }) => passed(output, 'deploy previews set SITE_ENV=preview') },
    { label: 'A preview build tells search engines to stay away', test: ({ output }) => passed(output, 'a preview build is noindex') },
    { label: 'The live build does not', test: ({ output }) => passed(output, 'the live build is not noindex') },
    { label: 'No secrets are written into netlify.toml', test: ({ output }) => passed(output, 'no secrets in netlify.toml') },
  ],
  hints: [
    'Netlify runs the command, then publishes a folder. Check what npm run build creates (look in package.json and build.mjs), and put exactly that folder name in publish.',
    'The command is what you would type in the terminal: npm run build. Plain "npm build" is a different, almost unused command.',
    'Environment variables live in tables: [build.environment] for every deploy, [context.deploy-preview.environment] for previews only.',
  ],
} satisfies LessonMeta;
