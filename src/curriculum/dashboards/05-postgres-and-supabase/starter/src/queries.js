// Every query takes values as parameters ($1, $2) and never builds SQL from strings. The database keeps the
// SQL and the values apart, so a value can't turn into SQL.
//   const { rows } = await db.query('select ... where org_id = $1', [orgId]);

/**
 * Each venue's total takings for one organisation, biggest first: [{ venue, revenue_cents }].
 * Join daily_sales to venues, group by the venue's name, sum revenue_cents (cast with ::int so it's a plain number).
 */
export async function revenueByVenue(db, orgId) {
  // TODO
  return [];
}

/**
 * Takings per month for one organisation, oldest first: [{ month: '2026-01', revenue_cents }].
 * to_char(day, 'YYYY-MM') makes the month label.
 */
export async function monthlyRevenue(db, orgId) {
  // TODO
  return [];
}

/**
 * Venues in one organisation whose name contains the search text (any case), by name: [{ id, name, suburb }].
 * ilike with '%' || $2 || '%' does the matching. The search text goes in as a parameter, never into the SQL string.
 */
export async function findVenues(db, orgId, search) {
  // TODO
  return [];
}
