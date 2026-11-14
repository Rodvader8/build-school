import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Lock-free messages with rtrb',
  minutes: 40,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'send returns false when the queue is full, instead of waiting', test: ({ output }) => cargoPassed(output, 'send_says_false_when_the_queue_is_full_instead_of_waiting') },
    { label: 'NoteOn makes sound and NoteOff stops it', test: ({ output }) => cargoPassed(output, 'note_on_makes_sound_and_note_off_stops_it') },
    { label: 'SetGain changes the volume', test: ({ output }) => cargoPassed(output, 'set_gain_changes_the_volume') },
    { label: 'Every waiting message is applied before the buffer is filled', test: ({ output }) => cargoPassed(output, 'every_waiting_message_is_applied_before_the_buffer_is_filled') },
    { label: 'Messages are handled in the order they were sent', test: ({ output }) => cargoPassed(output, 'messages_are_handled_in_the_order_they_were_sent') },
    { label: 'A producer thread can control the audio state', test: ({ output }) => cargoPassed(output, 'a_producer_thread_can_talk_to_the_audio_state') },
  ],
  hints: [
    'rtrb::RingBuffer::new(n) returns a pair: (Producer, Consumer). Give the producer to whoever sends (it becomes your Handle) and keep the consumer inside the audio state.',
    '`while let Ok(command) = consumer.pop()` drains the queue and stops the moment it\'s empty, with no waiting. pop() returns Err when there\'s nothing there, which is not a failure, just "nothing yet".',
    'Do the draining at the top of render, once per buffer, rather than once per sample. A buffer is only a few milliseconds long, and that\'s fast enough for any human gesture.',
  ],
  realWorld: { label: 'The rtrb crate, a real-time safe ring buffer', href: 'https://crates.io/crates/rtrb' },
} satisfies LessonMeta;
