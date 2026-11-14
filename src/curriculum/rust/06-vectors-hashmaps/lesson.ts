import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Vectors and HashMaps',
  minutes: 35,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'total_nights adds up a list', test: ({ output }) => cargoPassed(output, 'total_nights_adds_up_a_slice') },
    { label: 'long_stays keeps stays of five nights or more', test: ({ output }) => cargoPassed(output, 'long_stays_keeps_five_nights_or_more') },
    { label: 'with_gst_all builds a new list with GST added', test: ({ output }) => cargoPassed(output, 'with_gst_all_builds_a_new_vec') },
    { label: 'revenue_by_room groups sales into a HashMap', test: ({ output }) => cargoPassed(output, 'revenue_by_room_groups_with_a_hashmap') },
    { label: 'top_room finds the biggest earner', test: ({ output }) => cargoPassed(output, 'top_room_finds_the_biggest_earner') },
    { label: 'rooms_sorted lists names A to Z', test: ({ output }) => cargoPassed(output, 'rooms_sorted_lists_names_alphabetically') },
  ],
  hints: [
    '`entry(key).or_insert(0)` gives a mutable spot for that key, creating it at 0 if it was missing. Put a * in front to change what\'s inside.',
    'Iterator chains read left to right: .iter() starts, .filter() or .map() shapes it, .collect() builds the result.',
    'A closure is |x| x * 2, like an arrow function (x) => x * 2.',
  ],
} satisfies LessonMeta;
