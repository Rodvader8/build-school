import { venues } from './data.js';

const sum = (key) => venues.reduce((total, venue) => total + venue[key], 0);

// The four headline numbers, this month and last month. Worked out here so the components stay simple.
export function summarise() {
  const now = { revenue: sum('revenue'), covers: sum('covers'), labour: sum('labour') };
  const before = { revenue: sum('lastRevenue'), covers: sum('lastCovers'), labour: sum('lastLabour') };
  return {
    revenue: { now: now.revenue, before: before.revenue },
    covers: { now: now.covers, before: before.covers },
    spend: { now: now.revenue / now.covers, before: before.revenue / before.covers },
    labourPct: { now: (now.labour / now.revenue) * 100, before: (before.labour / before.revenue) * 100 },
  };
}
