export interface OpeningHours {
  days: string[];
  opens: string;
  closes: string;
}

export interface Business {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  suburb: string;
  region: string;
  country: string;
  services: string[];
  hours: OpeningHours[];
}

export const business: Business = {
  name: 'Saltmarsh Bakehouse',
  tagline: 'Sourdough, baked slowly by the sea',
  description: 'Saltmarsh Bakehouse is an invented neighbourhood bakery in Tidewater Bay, making country loaves, seeded rye and Saturday cinnamon scrolls.',
  phone: '+61 2 5550 0143',
  email: 'hello@saltmarsh.example',
  suburb: 'Tidewater Bay',
  region: 'NSW',
  country: 'AU',
  services: ['Daily sourdough loaves', 'Wholesale bread for cafes', 'Saturday cinnamon scrolls'],
  hours: [
    { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '14:00' },
    { days: ['Saturday'], opens: '07:00', closes: '12:00' },
  ],
};
