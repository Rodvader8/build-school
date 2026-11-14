// Table bookings for Saltmarsh Cafe, an invented cafe.
// Press Run first. It crashes, and the crash is the first lesson.

// 1. A list of strings plus a union type does the job of an enum, and Node can run it.
export const STATUSES = ['pending', 'confirmed', 'cancelled'] as const;
export type Status = (typeof STATUSES)[number];

export interface Booking {
  id: number;
  name: string;
  guests: number;
  status: Status;
  note?: string;
}

export interface VipBooking extends Booking {
  table: string;
}

export type Summary = {
  total: number;
  guests: number;
  byStatus: Record<Status, number>;
};

export function summarise(bookings: Booking[]): Summary {
  const byStatus: Record<Status, number> = { pending: 0, confirmed: 0, cancelled: 0 };
  let guests = 0;
  for (const b of bookings) {
    byStatus[b.status] += 1;
    if (b.status !== 'cancelled') guests += b.guests;
  }
  return { total: bookings.length, guests, byStatus };
}

export function describe(b: Booking | VipBooking): string {
  const base = `${b.name} for ${b.guests}`;
  return 'table' in b ? `${base} at table ${b.table}` : base;
}

const sample: Booking[] = [
  { id: 1, name: 'Ana', guests: 4, status: 'confirmed' },
  { id: 2, name: 'Ben', guests: 2, status: 'pending' },
];
console.log(summarise(sample), describe(sample[0]!));
