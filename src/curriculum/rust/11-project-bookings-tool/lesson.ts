import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Project: a command-line tool',
  minutes: 60,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'format_money gives "$9,680"', test: ({ output }) => cargoPassed(output, 'format_money_adds_dollar_sign_and_commas') },
    { label: 'It reads every row of the CSV after the header', test: ({ output }) => cargoPassed(output, 'parse_bookings_reads_each_row_after_the_header') },
    { label: 'A bad row is an error that names the line', test: ({ output }) => cargoPassed(output, 'parse_bookings_names_the_bad_line') },
    { label: 'It totals nights, revenue and revenue per room', test: ({ output }) => cargoPassed(output, 'summarise_totals_nights_revenue_and_rooms') },
    { label: 'The JSON has the same fields as the Python version', test: ({ output }) => cargoPassed(output, 'summary_to_json_has_the_same_fields_as_the_python_version') },
    { label: 'The program prints "6 bookings, $9,680 revenue" and writes summary.json', test: ({ output }) => cargoPassed(output, 'the_program_prints_a_summary_and_writes_summary_json') },
    { label: 'A missing file is a clear error, not a crash', test: ({ output }) => cargoPassed(output, 'a_missing_file_is_a_clear_error_not_a_crash') },
  ],
  hints: [
    'Build it bottom-up: format_money and parse_bookings first, then summarise, then the JSON, then run() joins them all.',
    'In run(), use ? after each step and map_err to turn an io error into your own message that includes the file name.',
    'Put your Python version (lesson 6 of that track) next to this one. read_bookings is parse_bookings, and summarise is almost line for line the same.',
  ],
  realWorld: { label: 'Bramble\'s own project files are saved as JSON, just like summary.json', href: 'https://serde.rs/' },
} satisfies LessonMeta;
