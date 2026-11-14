import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'npm audit and dependency upgrades',
  minutes: 35,
  kind: 'node',
  entry: 'package.json',
  checkEntry: 'check.mjs',
  checks: [
    { label: 'tiny-markdown\'s range can no longer install the vulnerable versions', test: ({ output }) => passed(output, 'tiny-markdown can only install the fixed version or later') },
    { label: 'zip-sanitiser\'s range is widened so it can reach the fix', test: ({ output }) => passed(output, 'zip-sanitiser can reach the fixed version') },
    { label: 'The glob-match override no longer blocks the fix', test: ({ output }) => passed(output, 'the glob-match override no longer blocks the fix') },
    { label: 'slugify-au, which has no fix yet, is recorded in audit-notes.md with a reason', test: ({ output }) => passed(output, 'the unfixable finding is written down') },
    { label: 'No dependency was deleted or turned into a wildcard', test: ({ output }) => passed(output, 'no dependency was deleted or wildcarded') },
    { label: 'There is an "audit" script that fails the build on high findings', test: ({ output }) => passed(output, 'there is an audit script') },
  ],
  hints: [
    'Run node read-audit.mjs. For every finding it shows the range that is vulnerable and the first fixed version. Your range must not allow anything below that.',
    '~3.0.2 means 3.0.x only, so it can never reach 3.1.0. Widen it to ^3.1.0, which allows 3.1.0 up to (not including) 4.0.0.',
    'An override with a ceiling such as "<=3.4.1" forces the vulnerable version on everything. Replace it with a floor: "^3.4.2".',
  ],
} satisfies LessonMeta;
