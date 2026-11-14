import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'match, Option and Result',
  minutes: 30,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'rate_for finds known rooms and gives None for others', test: ({ output }) => cargoPassed(output, 'rate_for_finds_known_rooms_only') },
    { label: 'describe_rate handles both Some and None', test: ({ output }) => cargoPassed(output, 'describe_rate_handles_both_cases') },
    { label: 'parse_nights accepts whole numbers', test: ({ output }) => cargoPassed(output, 'parse_nights_accepts_whole_numbers') },
    { label: 'parse_nights explains what went wrong', test: ({ output }) => cargoPassed(output, 'parse_nights_explains_what_went_wrong') },
    { label: 'quote chains the steps with ?', test: ({ output }) => cargoPassed(output, 'quote_chains_the_steps_with_a_question_mark') },
    { label: 'stay_type matches on ranges', test: ({ output }) => cargoPassed(output, 'stay_type_matches_on_ranges') },
  ],
  hints: [
    'A match arm is `pattern => value,`. The last arm `_ => ...` catches everything else.',
    'Some(rate) in a pattern opens the Option and names what was inside it.',
    '`?` after a Result or Option returns early with the problem, or unwraps the good value and carries on.',
  ],
} satisfies LessonMeta;
