import type { LessonMeta } from '../../types';
import { outputLines } from '../../helpers';

export default {
  title: 'cargo and your first program',
  minutes: 20,
  kind: 'rust',
  entry: 'src/main.rs',
  checks: [
    { label: 'It compiles and runs without errors', test: ({ output }) => /\[Process exited with code 0\]/.test(output) },
    { label: 'It prints "Hello, Sam!"', test: ({ output }) => outputLines(output).includes('Hello, Sam!') },
    { label: 'It prints "3 nights at $520 = $1560"', test: ({ output }) => outputLines(output).includes('3 nights at $520 = $1560') },
    { label: 'The total is calculated, not typed in', test: ({ files }) => /nights\s*\*\s*rate/.test(files['src/main.rs'] ?? '') },
  ],
  hints: [
    'println! takes a string with {} holes. {nights} reads the variable of that name; a bare {} takes the next value after the string.',
    'A dollar sign is just a character in a Rust string. "${rate}" prints $ then the value of rate.',
    'If it won\'t compile, read the first error from the top. It shows the line, and often the fix.',
  ],
} satisfies LessonMeta;
