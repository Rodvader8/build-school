import type { LessonMeta } from '../../types';
import { cargoPassed } from '../../helpers';

export default {
  title: 'Modules and crates',
  minutes: 30,
  kind: 'rust',
  entry: 'src/lib.rs',
  cargoTest: true,
  checks: [
    { label: 'format_money gives "$13,200" in the money module', test: ({ output }) => cargoPassed(output, 'format_money_adds_the_dollar_sign_and_commas') },
    { label: 'The rooms module knows every rate', test: ({ output }) => cargoPassed(output, 'rooms_module_knows_every_rate') },
    { label: 'serde_json is added to Cargo.toml', test: ({ output }) => cargoPassed(output, 'the_serde_json_crate_is_listed_in_cargo_toml') },
    { label: 'summary_json builds JSON with the serde_json crate', test: ({ output }) => cargoPassed(output, 'summary_json_comes_from_the_serde_json_crate') },
  ],
  hints: [
    'Dependencies go under [dependencies] in Cargo.toml, one per line: serde_json = "1". Cargo downloads it the next time you build.',
    'Inside a function, call a crate\'s code by its path: serde_json::json!({ ... }).',
    'For the commas, push one before a digit when the digits left to go is a multiple of 3 (and you aren\'t at the very start).',
  ],
  realWorld: { label: 'crates.io, where every Rust library lives', href: 'https://crates.io/' },
} satisfies LessonMeta;
