// The starting position for the forecast: what's in the bank, what comes in and what goes out each month.
export const scenarioBase = { opening: 50000, months: 12, revenue: 40000, growth: 0, costs: 38000 };

// The default "what if we hire?" numbers: salary per month, which month they start, and the extra revenue they bring in
// once they've ramped up.
export const hireDefaults = { salary: 6000, startMonth: 3, rampMonths: 2, extraRevenue: 5000 };
