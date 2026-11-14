import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Device features: the clipboard',
  minutes: 40,
  kind: 'project',
  entry: 'lib/copy.js',
  checkEntry: 'check.mjs',
  devPort: 4876,
  devCommand: 'BROWSER=none EXPO_NO_TELEMETRY=1 npx expo start --web --port 4876',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'copyText copies the text and says ok',
    'copyText says no instead of throwing when the device refuses',
    'pressing Copy code copies the code and confirms it',
    'when copying fails the card explains what to do instead',
    'the code is still on screen after a failure',
    'the web build exports',
    'only lib/copy.js talks to the clipboard',
    'the code is selectable, so people can copy it by hand',
    'the exported app includes the clipboard feature',
    'styles stay in StyleSheet.create',
  ]),
  hints: [
    'copyText is async. await Clipboard.setStringAsync(text) inside try, and in catch return { ok: false, reason: "unavailable" }. The call resolves to false (it doesn\'t throw) when the copy is refused.',
    'The card\'s onPress can be an async function: const result = await copyText(code); setStatus(result.ok ? "copied" : "failed"). Then render the message for each status below the button.',
    'role="status" on a Text makes screen readers announce it when it appears. selectable on the Text that shows the code lets people press and hold to copy it themselves.',
  ],
} satisfies LessonMeta;
