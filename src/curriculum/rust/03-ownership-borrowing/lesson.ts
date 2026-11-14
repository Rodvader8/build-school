import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Ownership and borrowing',
  minutes: 30,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'greeting borrows a name and says hello', test: ({ output }) => cargoPassed(output, 'greeting_borrows_the_name') },
    { label: 'total_chars counts every note without taking the list', test: ({ output }) => cargoPassed(output, 'total_chars_counts_every_note') },
    { label: 'add_note adds to a list it borrows mutably', test: ({ output }) => cargoPassed(output, 'add_note_changes_the_list_it_borrows') },
    { label: 'into_upper takes ownership and returns a new String', test: ({ output }) => cargoPassed(output, 'into_upper_takes_ownership_and_hands_back_a_new_string') },
    { label: 'first_word returns a slice of the text', test: ({ output }) => cargoPassed(output, 'first_word_returns_a_slice_of_the_text') },
  ],
  hints: [
    'A `&` in a parameter means "borrow it, I won\'t keep it". A bare String parameter means "give it to me".',
    'To change something you only borrowed, the parameter needs `&mut`, and the caller writes `&mut notes` too.',
    'Open src/main.rs, un-comment the line that uses `guest` after it was moved, and read what the compiler says.',
  ],
} satisfies LessonMeta;
