import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Server and client components',
  minutes: 50,
  kind: 'project',
  entry: 'app/menu/page.jsx',
  checkEntry: 'check.mjs',
  devPort: 4842,
  devCommand: 'npm run dev -- --port 4842 --hostname 127.0.0.1',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the add button counts every click',
    'the category buttons filter the cards',
    'the menu page shows every item but never the supplier notes',
    'the site builds',
    'only components that need state or events use "use client"',
    'the menu page is a server component that uses MenuBrowser',
    'the menu is already in the HTML the server sends',
    'the supplier notes never reach the browser',
  ]),
  hints: [
    'Start with AddToOrder.jsx: "use client" on the first line, import { useState } from \'react\', and a button whose onClick adds one. A tiny component like this is the right size for a client boundary.',
    'MenuBrowser.jsx is the filter from the old page, moved out and given items as a prop. Then app/menu/page.jsx loses "use client" and useState, and renders <MenuBrowser items={items} />.',
    'Props you pass to a client component are sent to the browser, so build a safe copy first: menu.map(({ supplierNote, ...publicFields }) => publicFields).',
  ],
} satisfies LessonMeta;
