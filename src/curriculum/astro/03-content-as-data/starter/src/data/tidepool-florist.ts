import type { Business } from './types';

export const tidepool: Business = {
  slug: 'tidepool-florist',
  name: 'Tidepool Florist',
  tagline: 'Seasonal flowers, wrapped in paper',
  description: 'An invented florist making seasonal bunches, wedding flowers and weekly subscriptions.',
  phone: '02 5550 0188',
  email: 'hello@tidepool.example',
  suburb: 'Tidewater Bay',
  services: [
    { name: 'Seasonal bunches', blurb: 'Whatever is best this week, tied by hand and wrapped in paper.' },
    { name: 'Weddings', blurb: 'Bouquets, buttonholes and table flowers, planned over a cup of tea.' },
    { name: 'Weekly subscriptions', blurb: 'A fresh bunch delivered to your door every Friday.' },
  ],
  hours: [
    { days: 'Monday to Friday', open: '8am to 5pm' },
    { days: 'Saturday', open: '8am to 1pm' },
    { days: 'Sunday', open: 'Closed' },
  ],
};
