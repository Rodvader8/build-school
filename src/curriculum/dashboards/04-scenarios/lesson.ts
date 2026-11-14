import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Scenarios: a cash forecast',
  minutes: 65,
  kind: 'project',
  entry: 'src/forecast.js',
  checkEntry: 'check.mjs',
  devPort: 4854,
  devCommand: 'npm run dev -- --port 4854 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'without a hire, the balance rises by income minus costs each month',
    'income grows by the growth rate every month after the first',
    'a hire adds their salary from the start month, and extra revenue once they have ramped up',
    'a hire with no extra revenue just costs money, and the ramp defaults to two months',
    'lowestBalance finds the smallest balance and its month',
    'cashOutMonth gives the first month below zero, or null',
    'starts with the switch off: one line, and cash that stays positive',
    'turning the switch on adds a second line and changes the numbers',
    'the salary and start month inputs rework the forecast',
    'turning the switch off again goes back to the baseline',
    'the app builds',
    'there are no inline style props',
    'colours come from the theme, not one-off values',
    'the panel keeps only what people change in state',
    'the switch is a real switch',
    'the maths lives in forecast.js, not in the component',
  ]),
  hints: [
    'In forecastCash, loop month from 1 to months with a running balance variable. Income is revenue * (1 + growth) ** (month - 1), plus extraRevenue once month >= startMonth + rampMonths. Outgoings are costs, plus salary once month >= startMonth.',
    'Default the hire fields when you destructure: const { salary = 0, startMonth = Infinity, rampMonths = 2, extraRevenue = 0 } = hire ?? {}. With no hire, startMonth is never reached, so nothing changes.',
    'In ScenarioPanel, three useStates (hireOn, salary, startMonth) and everything else is a const worked out each render: baseline, withHire (null when off), the series being shown, lowestBalance(shown) and cashOutMonth(shown).',
  ],
} satisfies LessonMeta;
