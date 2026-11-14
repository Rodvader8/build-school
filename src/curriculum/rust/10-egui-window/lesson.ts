import type { LessonMeta } from '../../types';
import { cargoPassed, fileHas } from '../../helpers';

export default {
  title: 'A desktop window with egui',
  minutes: 40,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'A new mixer starts at 80%, unmuted, 120 bpm', test: ({ output }) => cargoPassed(output, 'a_new_mixer_starts_at_80_percent_unmuted_at_120_bpm') },
    { label: 'set_volume stays between 0 and 1', test: ({ output }) => cargoPassed(output, 'set_volume_stays_between_0_and_1') },
    { label: 'toggle_mute flips and flips back', test: ({ output }) => cargoPassed(output, 'toggle_mute_flips_and_flips_back') },
    { label: 'output_gain is silent when muted', test: ({ output }) => cargoPassed(output, 'output_gain_is_silent_when_muted') },
    { label: 'nudge_tempo stops at 40 and 240', test: ({ output }) => cargoPassed(output, 'nudge_tempo_stops_at_40_and_240') },
    { label: 'The level label shows a percentage, or "Muted"', test: ({ output }) => cargoPassed(output, 'the_label_shows_a_percentage_or_muted') },
    { label: 'The window has a Mute button wired to toggle_mute', test: ({ output, files }) => cargoPassed(output, 'toggle_mute_flips_and_flips_back') && fileHas(files, 'src/main.rs', /ui\.button\(\s*"Mute"\s*\)[\s\S]{0,120}toggle_mute/) },
  ],
  hints: [
    'The logic goes in src/lib.rs, the window in src/main.rs. Do lib.rs first: the tests only look at it.',
    'The slider needs a plain `&mut f32`, so copy the value out, let the slider change the copy, then call set_volume(copy) if it changed.',
    'The Mute button is the same shape as the tempo buttons: `if ui.button("Mute").clicked() { self.mixer.toggle_mute(); }`.',
  ],
  realWorld: { label: 'egui, the library behind Bramble\'s whole interface', href: 'https://github.com/emilk/egui' },
} satisfies LessonMeta;
