// Everything the page says lives here. The page itself should contain no copy.
// Harbourlight Roasters is an invented business: the phone number, email and reviews aren't real.
export interface Block {
  title: string;
  body: string;
}

export interface Review {
  quote: string;
  who: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface OpeningHours {
  days: string[];
  opens: string;
  closes: string;
}

export interface Brand {
  name: string;
  url: string;
  suburb: string;
  region: string;
  country: string;
  phone: string;
  email: string;
  description: string;
  headline: string;
  intro: string;
  heroAlt: string;
  roasteryAlt: string;
  services: Block[];
  steps: Block[];
  reviews: Review[];
  faqs: Faq[];
  hours: OpeningHours[];
}

export const brand: Brand = {
  name: 'Harbourlight Roasters',
  url: 'https://harbourlight.example/',
  suburb: 'Tidewater Bay',
  region: 'NSW',
  country: 'AU',
  phone: '+61 2 5550 0177',
  email: 'beans@harbourlight.example',
  description: 'Harbourlight Roasters is an invented small-batch coffee roastery in Tidewater Bay, roasting single-origin beans to order and serving them at the roastery window.',
  headline: 'Coffee roasted this week, not this year',
  intro: 'We roast single-origin beans in small batches every Tuesday and Friday, then pack them the same day. Taste the difference a week makes.',
  heroAlt: 'Illustration of dusk over dark hills, in the deep blues and golds of a coffee roastery at closing time',
  roasteryAlt: 'Illustration of warm brown hills, the colour of freshly roasted beans',
  services: [
    { title: 'Beans to your door', body: 'Choose a roast, pick a grind and we post it the day it is roasted.' },
    { title: 'Roastery window', body: 'Flat whites, filter and a bag of whatever came off the roaster this morning.' },
    { title: 'Cafe wholesale', body: 'Fresh beans on a standing weekly order for cafes within an hour of the bay.' },
  ],
  steps: [
    { title: 'Sourced', body: 'We buy from three farms we have visited, and pay above fair-trade prices.' },
    { title: 'Roasted', body: 'Small batches on a 12 kilo drum roaster, profiled by taste, not by timer.' },
    { title: 'Rested', body: 'Four days off the roaster so the flavour settles before it reaches you.' },
    { title: 'Packed', body: 'Sealed with a one-way valve and posted the same afternoon.' },
  ],
  reviews: [
    { quote: 'The best filter I have had outside a capital city.', who: 'Morgan, regular' },
    { quote: 'Our cafe switched to Harbourlight and the complaints stopped.', who: 'Priya, cafe owner' },
    { quote: 'Fresh enough that the bag is still warm when it arrives.', who: 'Jo, subscriber' },
  ],
  faqs: [
    { question: 'How fresh are the beans?', answer: 'Roasted Tuesday and Friday, packed the same day and posted that afternoon.' },
    { question: 'Do you grind to order?', answer: 'Yes. Choose espresso, filter, plunger or whole bean at checkout.' },
    { question: 'Can I visit the roastery?', answer: 'The window is open on the days listed below. Come and smell it.' },
  ],
  hours: [
    { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '14:00' },
    { days: ['Saturday', 'Sunday'], opens: '08:00', closes: '13:00' },
  ],
};
