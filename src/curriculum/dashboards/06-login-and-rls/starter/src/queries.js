// Every query takes values as parameters ($1, $2) and never builds SQL from strings. The database keeps the
// SQL and the values apart, so a value can't turn into SQL.

/** Each venue's total takings for one organisation, biggest first: [{ venue, revenue_cents }]. */
export async function revenueByVenue(db, orgId) {
  const { rows } = await db.query(
    `select v.name as venue, sum(s.revenue_cents)::int as revenue_cents
       from daily_sales s
       join venues v on v.id = s.venue_id
      where s.org_id = $1
      group by v.name
      order by revenue_cents desc`,
    [orgId],
  );
  return rows;
}

/** Takings per month for one organisation, oldest first: [{ month: '2026-01', revenue_cents }]. */
export async function monthlyRevenue(db, orgId) {
  const { rows } = await db.query(
    `select to_char(day, 'YYYY-MM') as month, sum(revenue_cents)::int as revenue_cents
       from daily_sales
      where org_id = $1
      group by month
      order by month`,
    [orgId],
  );
  return rows;
}

/** Venues in one organisation whose name contains the search text, any case, by name: [{ id, name, suburb }]. */
export async function findVenues(db, orgId, search) {
  const { rows } = await db.query(
    `select id, name, suburb
       from venues
      where org_id = $1 and name ilike '%' || $2 || '%'
      order by name`,
    [orgId, search],
  );
  return rows;
}
