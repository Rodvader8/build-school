import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Project: a tiny drum machine',
  minutes: 60,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'A step is a sixteenth note long', test: ({ output }) => cargoPassed(output, 'a_step_is_a_sixteenth_note_long') },
    { label: 'Steps can be toggled on and off', test: ({ output }) => cargoPassed(output, 'steps_can_be_toggled_on_and_off') },
    { label: 'An empty pattern is perfectly silent', test: ({ output }) => cargoPassed(output, 'an_empty_pattern_is_perfectly_silent') },
    { label: 'A kick on step zero sounds straight away and dies away', test: ({ output }) => cargoPassed(output, 'a_kick_on_step_zero_sounds_straight_away_and_dies_away') },
    { label: 'Hits land on the steps they\'re written on', test: ({ output }) => cargoPassed(output, 'hits_land_on_the_steps_they_are_written_on') },
    { label: 'The machine counts the steps it has played', test: ({ output }) => cargoPassed(output, 'the_machine_counts_the_steps_it_has_played') },
    { label: 'Small buffers sound the same as one big one', test: ({ output }) => cargoPassed(output, 'rendering_in_small_buffers_sounds_the_same_as_one_big_one') },
    { label: 'Everything on at once never clips', test: ({ output }) => cargoPassed(output, 'every_lane_on_every_step_still_never_clips') },
    { label: 'Stereo output repeats the mix in both channels', test: ({ output }) => cargoPassed(output, 'stereo_output_repeats_the_mix_in_both_channels') },
    { label: 'render_offline gives whole bars', test: ({ output }) => cargoPassed(output, 'render_offline_gives_whole_bars') },
    { label: 'A rendered beat can be saved as a WAV file', test: ({ output }) => cargoPassed(output, 'a_rendered_beat_can_be_saved_as_a_wav_file') },
  ],
  hints: [
    'The heartbeat is a countdown. `until_next` is how many frames remain before the next step. Every frame it drops by 1. When it hits zero, fire the step and ADD the length of a step back on. Adding (not resetting to the length) keeps the fractional leftover, so 5512.5 frames per step doesn\'t drift.',
    'One step is a sixteenth note, so four steps per beat. At 120 beats a minute, a beat is 0.5 seconds, a step is 0.125 seconds, and at 44,100 Hz that\'s 5512.5 frames.',
    'render and render_offline can share all the work. render_offline just makes a machine, makes a zeroed Vec the right length, and calls render on it with 1 channel.',
  ],
  realWorld: { label: 'cpal, the Rust crate for cross-platform audio output', href: 'https://docs.rs/cpal' },
} satisfies LessonMeta;
