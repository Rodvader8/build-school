import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'State files and idempotent jobs',
  minutes: 35,
  kind: 'python',
  entry: 'main.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'load_state gives an empty state when there\'s no file yet', test: ({ output }) => passed(output, 'load_state starts empty') },
    { label: 'A corrupt state file raises an error that names the file', test: ({ output }) => passed(output, 'corrupt state is not hidden') },
    { label: 'save_state then load_state round-trips', test: ({ output }) => passed(output, 'state round-trips') },
    { label: 'save_state leaves no temp files behind', test: ({ output }) => passed(output, 'no temp files left') },
    { label: 'A failed save keeps the old file whole (atomic write)', test: ({ output }) => passed(output, 'a failed save keeps the old file') },
    { label: 'process_new handles every new item and returns their ids', test: ({ output }) => passed(output, 'process_new handles new items') },
    { label: 'Running it again does nothing', test: ({ output }) => passed(output, 'second run does nothing') },
    { label: 'Only the new item is handled when one is added', test: ({ output }) => passed(output, 'only new items are handled') },
    { label: 'A crash part way keeps the finished work, and a re-run picks up the rest', test: ({ output }) => passed(output, 'a crash resumes cleanly') },
  ],
  hints: [
    'Atomic write: create the temp file in the same folder (tempfile.mkstemp(dir=...)), write the JSON, then os.replace(temp, path). os.replace swaps the file in one step.',
    'Put the os.replace inside try, and delete the temp file in an except that re-raises. Then a failed save leaves nothing behind.',
    'Save the state inside the loop, right after each handler call succeeds. If the handler raises, the item never gets marked done.',
  ],
} satisfies LessonMeta;
