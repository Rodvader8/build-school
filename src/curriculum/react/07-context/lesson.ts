import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Context',
  minutes: 35,
  kind: 'project',
  entry: 'src/period-context.jsx',
  checkEntry: 'check.mjs',
  devPort: 4837,
  devCommand: 'npm run dev -- --port 4837 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'UsePeriod gives a clear error outside a provider', test: ({ output }) => passed(output, 'usePeriod gives a clear error outside a provider') },
    { label: 'The provider starts on 1Y by default', test: ({ output }) => passed(output, 'the provider starts on 1Y by default') },
    { label: 'The provider can start on another period', test: ({ output }) => passed(output, 'the provider can start on another period') },
    { label: 'The toggle marks the current period as pressed', test: ({ output }) => passed(output, 'the toggle marks the current period as pressed') },
    { label: 'One toggle updates the summary and the breakdown, with no props passed down', test: ({ output }) => passed(output, 'one toggle updates the summary and the breakdown, with no props passed down') },
    { label: 'The app builds', test: ({ output }) => passed(output, 'the app builds') },
    { label: 'There are no inline style props', test: ({ output }) => passed(output, 'there are no inline style props') },
  ],
  hints: [
    'Three parts: const PeriodContext = createContext(null); a provider component that holds useState and renders <PeriodContext value={{ period, setPeriod }}>{children}</PeriodContext>; and a usePeriod() hook that returns useContext(PeriodContext).',
    'For the guard, check the value before returning it: if (value === null) throw new Error(\'usePeriod must be used inside a PeriodProvider\');',
    'In App.jsx, wrap everything that needs the period in <PeriodProvider>. PeriodToggle, Summary and Breakdown can then sit anywhere inside it, however deep.',
  ],
} satisfies LessonMeta;
