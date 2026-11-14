import { cacheLife, cacheTag } from 'next/cache';

// Stands in for a real API or database. Every call "takes a moment", like a network request would.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MENU = [
  { slug: 'sourdough', name: 'Country sourdough', category: 'bread', price: 9 },
  { slug: 'rye', name: 'Seeded rye', category: 'bread', price: 10 },
  { slug: 'focaccia', name: 'Rosemary focaccia', category: 'bread', price: 8 },
  { slug: 'croissant', name: 'Butter croissant', category: 'pastry', price: 5 },
  { slug: 'cardamom-bun', name: 'Cardamom bun', category: 'pastry', price: 5 },
];

// TODO: the menu changes a few times a year, so cache it: add "use cache", a cacheLife and a cacheTag('menu').
export async function getMenu() {
  await wait(300);
  return MENU;
}

// The oven changes by the minute, so this one is never cached.
export async function getOvenStatus() {
  await wait(200);
  const minute = new Date().getMinutes();
  return { loavesLeft: 60 - minute };
}
