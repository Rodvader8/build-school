import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Functions and the __main__ guard',
  minutes: 20,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'format_money(13200) gives "$13,200"', test: ({ output }) => passed(output, 'format_money') },
    { label: 'with_gst(4400) gives 4840', test: ({ output }) => passed(output, 'with_gst') },
    { label: 'nights_label gets 1, 2, 4, 5 and 9 right', test: ({ output }) => passed(output, 'nights_label') },
    { label: 'booking_total(3, 520) gives 1560', test: ({ output }) => passed(output, 'booking_total default') },
    { label: 'booking_total(3, 520, gst=True) gives 1716', test: ({ output }) => passed(output, 'booking_total gst') },
    { label: 'main.py has an if __name__ == "__main__": block', test: ({ output }) => passed(output, 'main guard') },
  ],
  hints: [
    'Every function needs return. Without it, Python hands back None.',
    'booking_total can call with_gst: return with_gst(total) if gst else total',
    'Read tests.py to see exactly what each check calls.',
  ],
} satisfies LessonMeta;
