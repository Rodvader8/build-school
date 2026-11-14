import type { LessonMeta } from '../../types';
import { passed } from '../../helpers';

export default {
  title: 'Components and JSX',
  minutes: 30,
  kind: 'project',
  entry: 'src/App.jsx',
  checkEntry: 'check.mjs',
  devPort: 4831,
  devCommand: 'npm run dev -- --port 4831 --host 127.0.0.1 --strictPort',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: [
    { label: 'Header is a component with the site name and three nav links', test: ({ output }) => passed(output, 'Header is a component with the site name and three nav links') },
    { label: 'Footer is a component that shows the current year', test: ({ output }) => passed(output, 'Footer is a component that shows the current year') },
    { label: 'App puts Header, main and Footer together', test: ({ output }) => passed(output, 'App puts Header, main and Footer together') },
    { label: 'The page still has exactly one h1', test: ({ output }) => passed(output, 'the page still has exactly one h1') },
    { label: 'React has no complaints about the markup', test: ({ output }) => passed(output, 'React has no complaints about the markup') },
    { label: 'JSX uses className, never class', test: ({ output }) => passed(output, 'JSX uses className, never class') },
    { label: 'The app builds', test: ({ output }) => passed(output, 'the app builds') },
    { label: 'There are no inline style props', test: ({ output }) => passed(output, 'there are no inline style props') },
  ],
  hints: [
    'A component is a function whose name starts with a capital letter and that returns JSX. Header.jsx should export default function Header() { return (<header>...</header>); }',
    'JSX isn\'t HTML: class becomes className, and a value in curly braces is JavaScript, so {new Date().getFullYear()} prints the year.',
    'In App.jsx, import Header from \'./components/Header.jsx\'; then write <Header /> where the header markup used to be. Do the same for Footer.',
  ],
} satisfies LessonMeta;
