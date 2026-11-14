import type { Business } from './types';

export const saltmarsh: Business = {
  slug: 'saltmarsh-bakehouse',
  name: 'Saltmarsh Bakehouse',
  tagline: 'Sourdough, baked slowly by the sea',
  description: 'An invented neighbourhood bakery making country loaves, seeded rye and Saturday cinnamon scrolls.',
  phone: '02 5550 0143',
  email: 'hello@saltmarsh.example',
  suburb: 'Tidewater Bay',
  services: [
    { name: 'Daily loaves', blurb: 'Country loaf and seeded rye, out of the oven by 7am.' },
    { name: 'Wholesale', blurb: 'Fresh bread for cafes within 20 minutes of the bakehouse.' },
    { name: 'Saturday scrolls', blurb: 'Cinnamon scrolls, baked once and sold until they run out.' },
  ],
  hours: [
    { days: 'Tuesday to Friday', open: '7am to 2pm' },
    { days: 'Saturday', open: '7am to 12 noon' },
    { days: 'Sunday and Monday', open: 'Closed' },
  ],
};
