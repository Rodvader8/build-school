import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'cron and systemd timers',
  minutes: 35,
  kind: 'terminal',
  entry: 'crontab.txt',
  checkEntry: 'check.py',
  checks: [
    { label: 'Every line in crontab.txt is valid', test: ({ output }) => passed(output, 'every crontab line is valid') },
    { label: 'digest.sh runs every day at 07:30', test: ({ output }) => passed(output, 'digest runs daily at 07:30') },
    { label: 'monitor.sh runs every 15 minutes', test: ({ output }) => passed(output, 'monitor runs every 15 minutes') },
    { label: 'report.sh runs at 09:00 on weekdays only', test: ({ output }) => passed(output, 'report runs weekdays at 09:00') },
    { label: 'backup.sh runs at 02:00 every night', test: ({ output }) => passed(output, 'backup runs nightly at 02:00') },
    { label: 'Every % in a command is escaped as \\%', test: ({ output }) => passed(output, 'percent signs are escaped') },
    { label: 'digest.service is a oneshot with an absolute ExecStart', test: ({ output }) => passed(output, 'digest.service is a oneshot') },
    { label: 'digest.timer fires at 07:30 daily', test: ({ output }) => passed(output, 'digest.timer fires at 07:30') },
    { label: 'The timer catches up after downtime and is installable', test: ({ output }) => passed(output, 'timer is persistent and installable') },
  ],
  hints: [
    'The five fields are minute, hour, day of month, month, day of week. "30 7 * * *" is 07:30. A star means "every".',
    'Every 15 minutes is */15 in the minute field. Weekdays are 1-5 in the day-of-week field (Sunday is 0).',
    'In a crontab, a bare % ends the command. Write date +\\%F, not date +%F. In the .timer file, OnCalendar=*-*-* 07:30:00 means every day at 07:30.',
  ],
} satisfies LessonMeta;
