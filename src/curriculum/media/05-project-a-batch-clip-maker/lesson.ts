import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Project: a batch clip maker',
  minutes: 60,
  kind: 'python',
  entry: 'clipmaker.py',
  checkEntry: 'tests.py',
  checks: [
    { label: 'progress_bar draws the bar and rounds down', test: ({ output }) => passed(output, 'progress_bar draws the bar') },
    { label: 'load_jobs reads a good jobs file', test: ({ output }) => passed(output, 'load_jobs reads good jobs') },
    { label: 'load_jobs names the job and the problem when something\'s wrong', test: ({ output }) => passed(output, 'load_jobs explains bad jobs') },
    { label: 'run_batch makes one clip per job, numbered and named', test: ({ output }) => passed(output, 'run_batch makes every clip') },
    { label: 'Re-running skips clips that exist, and --force redoes them', test: ({ output }) => passed(output, 'run_batch skips finished clips') },
    { label: 'One bad job doesn\'t stop the batch, and leaves no half-made file', test: ({ output }) => passed(output, 'one failure does not stop the batch') },
    { label: 'run_batch reports progress after every job', test: ({ output }) => passed(output, 'progress is reported for every job') },
    { label: 'Real clips: title card plus the cut, right size, with sound', test: ({ output }) => passed(output, 'real clips come out right') },
    { label: 'The command line works end to end and shows 100%', test: ({ output }) => passed(output, 'cli runs end to end') },
    { label: 'A second command line run skips everything', test: ({ output }) => passed(output, 'cli skips on a second run') },
    { label: 'A bad jobs file is a friendly error, not a traceback', test: ({ output }) => passed(output, 'cli reports a bad jobs file kindly') },
  ],
  hints: [
    'progress_bar: filled = width * done // total, percent = 100 * done // total. Then f"[{\'#\' * filled}{\'-\' * (width - filled)}] {percent:3d}%".',
    'In run_batch, wrap only the maker call in try/except Exception. In the except: delete the half-made file if it exists (out.unlink(missing_ok=True)), record the failure, and carry on to the next job.',
    'Call on_progress(i, len(jobs), name) at the bottom of the loop so it runs for made, skipped and failed jobs alike. In main, print "\\r" plus the bar so one line updates in place.',
  ],
} satisfies LessonMeta;
