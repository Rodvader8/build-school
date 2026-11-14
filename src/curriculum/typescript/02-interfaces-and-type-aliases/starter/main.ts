// Table bookings for Saltmarsh Cafe, an invented cafe.
// Press Run first. It crashes, and the crash is the first lesson.

// 1. An enum needs real JavaScript to exist at runtime, and Node's type stripping
//    only erases types. Replace this with a list of strings and a union type.
export enum Status {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}

export interface Booking {
  id: number;
  name: string;
  guests: number;
  status: Status;
}

// 2. Add an optional `note` (a string) to Booking.
// 3. Add `interface VipBooking extends Booking` with one extra field: table (a string).
// 4. Add `type Summary` with three fields: total, guests (both numbers) and
//    byStatus, which has a number for each Status.

export function summarise(bookings: Booking[]) {
  // 5. Return the Summary. Cancelled bookings don't count towards `guests`.
  return { total: 0, guests: 0, byStatus: {} };
}

export function describe(b: Booking) {
  // 6. Accept Booking | VipBooking. VIPs read "Ana for 4 at table 2".
  return `${b.name} for ${b.guests}`;
}

const sample: Booking[] = [
  { id: 1, name: 'Ana', guests: 4, status: Status.Confirmed },
  { id: 2, name: 'Ben', guests: 2, status: Status.Pending },
];
console.log(summarise(sample), describe(sample[0]!));
