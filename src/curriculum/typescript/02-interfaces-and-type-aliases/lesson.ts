import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Interfaces and type aliases',
  minutes: 25,
  kind: 'node',
  entry: 'main.ts',
  checkEntry: 'check.mjs',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund',
  checks: [
    { label: 'tsc finds no type errors', test: ({ output }) => passed(output, 'types check cleanly') },
    { label: 'Status is a union of strings, not an enum', test: ({ output }) => passed(output, 'Status is a union of strings, not an enum') },
    { label: 'Booking has an optional note', test: ({ output }) => passed(output, 'Booking has an optional note') },
    { label: 'VipBooking extends Booking', test: ({ output }) => passed(output, 'VipBooking extends Booking') },
    { label: 'Summary is a type alias', test: ({ output }) => passed(output, 'Summary is a type alias') },
    { label: 'The three statuses exist at runtime', test: ({ output }) => passed(output, 'the three statuses exist') },
    { label: 'summarise() counts bookings and guests', test: ({ output }) => passed(output, 'summarise counts bookings and guests') },
    { label: 'describe() handles plain and VIP bookings', test: ({ output }) => passed(output, 'describe handles plain and VIP bookings') },
  ],
  hints: [
    'const STATUSES = [\'pending\', \'confirmed\', \'cancelled\'] as const; then type Status = (typeof STATUSES)[number]; gives you the strings and the union from one list.',
    'Record<Status, number> is an object with a number for every status. Start from { pending: 0, confirmed: 0, cancelled: 0 } and add one per booking.',
    '\'table\' in b narrows Booking | VipBooking down to VipBooking, so b.table is safe inside that branch.',
  ],
} satisfies LessonMeta;
