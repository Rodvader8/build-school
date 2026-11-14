import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Structs and enums',
  minutes: 30,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'Each room has its own rate', test: ({ output }) => cargoPassed(output, 'each_room_has_its_own_rate') },
    { label: 'Each room has a display name', test: ({ output }) => cargoPassed(output, 'each_room_has_a_display_name') },
    { label: 'Booking::new takes its rate from the room', test: ({ output }) => cargoPassed(output, 'a_new_booking_takes_its_rate_from_the_room') },
    { label: 'total is nights times rate', test: ({ output }) => cargoPassed(output, 'total_is_nights_times_rate') },
    { label: 'summary reads "J. Lindqvist: Garden Room, 2 nights, $760"', test: ({ output }) => cargoPassed(output, 'summary_reads_like_a_sentence') },
  ],
  hints: [
    'Inside an impl, `self` is the value the method was called on. `self.nights` reads its field.',
    '`match self { Room::Ocean => 520, ... }` must cover every variant, or it won\'t compile.',
    'In Booking::new, a field with the same name as its variable can be written once: `room,` instead of `room: room,`.',
  ],
} satisfies LessonMeta;
