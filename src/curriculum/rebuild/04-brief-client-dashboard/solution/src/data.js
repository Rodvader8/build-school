// Everything the dashboard shows lives here. Crumb and Co. is an invented wholesale bakery: none of these numbers are real.
export const business = {
  name: 'Crumb and Co. Wholesale',
  title: 'Crumb and Co. Wholesale | Orders dashboard',
  description:
    'A clear view of wholesale orders for Crumb and Co.: revenue, order count, average order value and repeat customers, for the last 7, 30 or 90 days.',
  url: 'https://crumbandco.example/',
  defaultPeriod: '30d',
};

/** One entry per period. 'previous' values are the same measure for the period before, used to show the change. */
export const periods = {
  '7d': {
    label: 'Last 7 days',
    series: [
      { label: 'Mon', revenue: 3620, orders: 57 },
      { label: 'Tue', revenue: 4130, orders: 65 },
      { label: 'Wed', revenue: 4060, orders: 61 },
      { label: 'Thu', revenue: 3500, orders: 52 },
      { label: 'Fri', revenue: 3550, orders: 53 },
      { label: 'Sat', revenue: 3680, orders: 58 },
      { label: 'Sun', revenue: 4220, orders: 60 }
    ],
    revenue: 26760,
    orders: 406,
    previousRevenue: 24580,
    avgOrder: 65.91,
    previousAvgOrder: 64.09,
    repeatRate: 0.705,
    previousRepeatRate: 0.74,
    previousOrders: 404
  },
  '30d': {
    label: 'Last 30 days',
    series: [
      { label: '1-5 Oct', revenue: 18610, orders: 259 },
      { label: '6-10 Oct', revenue: 16680, orders: 236 },
      { label: '11-15 Oct', revenue: 18690, orders: 294 },
      { label: '16-20 Oct', revenue: 17940, orders: 275 },
      { label: '21-25 Oct', revenue: 22960, orders: 359 },
      { label: '26-30 Oct', revenue: 21790, orders: 318 }
    ],
    revenue: 116670,
    orders: 1741,
    previousRevenue: 111520,
    avgOrder: 67.01,
    previousAvgOrder: 67.33,
    repeatRate: 0.593,
    previousRepeatRate: 0.562,
    previousOrders: 1603
  },
  '90d': {
    label: 'Last 90 days',
    series: [
      { label: 'Wk 1', revenue: 28380, orders: 428 },
      { label: 'Wk 2', revenue: 25560, orders: 376 },
      { label: 'Wk 3', revenue: 27380, orders: 421 },
      { label: 'Wk 4', revenue: 31050, orders: 450 },
      { label: 'Wk 5', revenue: 26540, orders: 391 },
      { label: 'Wk 6', revenue: 29660, orders: 419 },
      { label: 'Wk 7', revenue: 32070, orders: 494 },
      { label: 'Wk 8', revenue: 34910, orders: 552 },
      { label: 'Wk 9', revenue: 30290, orders: 435 },
      { label: 'Wk 10', revenue: 28390, orders: 424 },
      { label: 'Wk 11', revenue: 27890, orders: 406 },
      { label: 'Wk 12', revenue: 35090, orders: 518 }
    ],
    revenue: 357210,
    orders: 5314,
    previousRevenue: 368398,
    avgOrder: 67.22,
    previousAvgOrder: 65.97,
    repeatRate: 0.719,
    previousRepeatRate: 0.669,
    previousOrders: 5292
  }
};

/** One row per customer. Orders and revenue are keyed by period. */
export const customers = [
  {
    customer: 'Harbour Cafe',
    last: '2026-10-30',
    orders: { '7d': 60, '30d': 212, '90d': 484 },
    revenue: { '7d': 5283, '30d': 16588, '90d': 38503 }
  },
  {
    customer: 'The Corner Pantry',
    last: '2026-10-29',
    orders: { '7d': 79, '30d': 228, '90d': 881 },
    revenue: { '7d': 6617, '30d': 15618, '90d': 49150 }
  },
  {
    customer: 'Marlow Street Deli',
    last: '2026-10-30',
    orders: { '7d': 40, '30d': 159, '90d': 515 },
    revenue: { '7d': 2363, '30d': 13020, '90d': 32788 }
  },
  {
    customer: 'Bellbird Catering',
    last: '2026-10-27',
    orders: { '7d': 56, '30d': 193, '90d': 749 },
    revenue: { '7d': 3237, '30d': 14326, '90d': 62672 }
  },
  {
    customer: 'Brightwater Grocer',
    last: '2026-10-28',
    orders: { '7d': 63, '30d': 288, '90d': 1225 },
    revenue: { '7d': 4380, '30d': 24752, '90d': 73845 }
  },
  {
    customer: 'Fennel and Fig',
    last: '2026-10-30',
    orders: { '7d': 28, '30d': 146, '90d': 385 },
    revenue: { '7d': 1768, '30d': 11040, '90d': 21230 }
  },
  {
    customer: 'Ridgeway Hotel',
    last: '2026-10-26',
    orders: { '7d': 44, '30d': 262, '90d': 636 },
    revenue: { '7d': 3292, '30d': 20741, '90d': 48727 }
  },
  {
    customer: 'Saltwater Bistro',
    last: '2026-10-29',
    orders: { '7d': 45, '30d': 314, '90d': 968 },
    revenue: { '7d': 3891, '30d': 26880, '90d': 66533 }
  },
  {
    customer: 'Oakleigh Market',
    last: '2026-10-24',
    orders: { '7d': 35, '30d': 148, '90d': 508 },
    revenue: { '7d': 2702, '30d': 8488, '90d': 30825 }
  },
  {
    customer: 'Juniper Kitchen',
    last: '2026-10-30',
    orders: { '7d': 31, '30d': 148, '90d': 525 },
    revenue: { '7d': 1705, '30d': 8665, '90d': 29343 }
  }
];
