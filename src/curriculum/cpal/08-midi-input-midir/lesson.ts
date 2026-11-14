import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'MIDI input with midir',
  minutes: 40,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'Note-on messages give a note and a 0 to 1 velocity', test: ({ output }) => cargoPassed(output, 'note_on_messages_carry_the_note_and_a_velocity_from_0_to_1') },
    { label: 'Note-on with velocity 0 means note-off', test: ({ output }) => cargoPassed(output, 'a_note_on_with_velocity_zero_means_note_off') },
    { label: 'Note-off messages are parsed', test: ({ output }) => cargoPassed(output, 'note_off_messages_are_parsed') },
    { label: 'Control changes give a 0 to 1 value', test: ({ output }) => cargoPassed(output, 'control_changes_give_a_value_from_0_to_1') },
    { label: 'Pitch bend joins two 7-bit halves', test: ({ output }) => cargoPassed(output, 'pitch_bend_joins_two_7_bit_halves_into_minus_one_to_one') },
    { label: 'Short and unknown messages are ignored', test: ({ output }) => cargoPassed(output, 'short_or_unknown_messages_are_ignored') },
    { label: 'Note numbers become frequencies', test: ({ output }) => cargoPassed(output, 'note_numbers_become_frequencies') },
    { label: 'notes_in_file lists notes with their tick times', test: ({ output }) => cargoPassed(output, 'notes_in_file_lists_each_note_with_its_time_in_ticks') },
    { label: 'Notes from several tracks come back in time order', test: ({ output }) => cargoPassed(output, 'notes_from_several_tracks_come_back_sorted_by_time') },
    { label: 'Non-MIDI bytes give an error', test: ({ output }) => cargoPassed(output, 'bytes_that_are_not_a_midi_file_give_an_error') },
  ],
  hints: [
    'A MIDI message is just two or three bytes. The top bit of the first byte is always 1 (status), and of the others always 0 (data), which is why every data value is 0 to 127. `status & 0xF0` keeps the type and throws the channel away.',
    'Use `bytes.split_first()?` or index with a length check first, so a short message returns None instead of panicking. A MIDI callback that panics takes the whole input thread down.',
    'In a file, deltas are relative: "480 ticks after the previous event". Keep a running `tick += event.delta.as_int()` for each track, and start it from 0 again on every new track.',
  ],
  realWorld: { label: 'midir, the Rust crate for MIDI input and output', href: 'https://docs.rs/midir' },
} satisfies LessonMeta;
