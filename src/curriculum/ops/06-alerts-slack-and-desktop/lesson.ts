import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Alerts: Slack and desktop notifications',
  minutes: 35,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'webhook_url reads SLACK_WEBHOOK_URL from the environment', test: ({ output }) => passed(output, 'webhook_url reads the environment') },
    { label: 'A missing variable gives an error that names it', test: ({ output }) => passed(output, 'missing webhook variable is a clear error') },
    { label: 'send_slack posts {"text": ...} as JSON', test: ({ output }) => passed(output, 'send_slack posts json') },
    { label: 'send_slack raises when Slack says no', test: ({ output }) => passed(output, 'send_slack raises on a bad reply') },
    { label: 'send_slack gives up after its timeout', test: ({ output }) => passed(output, 'send_slack has a timeout') },
    { label: 'describe_change writes DOWN and UP messages, and nothing else', test: ({ output }) => passed(output, 'describe_change messages') },
    { label: 'alert_changes sends one message per change, and none for steady states', test: ({ output }) => passed(output, 'alert_changes only on change') },
    { label: 'notify_desktop does nothing when notify-send is missing', test: ({ output }) => passed(output, 'notify_desktop skips when missing') },
    { label: 'notify_desktop runs notify-send with the title and message', test: ({ output }) => passed(output, 'notify_desktop runs notify-send') },
  ],
  hints: [
    'requests.post(url, json={"text": text}, timeout=timeout) sends JSON and sets the Content-Type for you. Call raise_for_status() on the reply so a 4xx or 5xx becomes an exception.',
    'A site counts as up when the status isn\'t None and is 200 to 399. Alert only on up-to-down and down-to-up. A site that is still down shouldn\'t send a second message.',
    'shutil.which("notify-send") returns the full path, or None if the program isn\'t installed. Run it with a list: subprocess.run([path, title, message]).',
  ],
} satisfies LessonMeta;
