// Everything the page says lives here. Halden Audio is an invented business: the people and details aren't real.
export const halden = {
  name: 'Halden Audio',
  url: 'https://haldenaudio.example/',
  suburb: 'Corrigan Bay',
  region: 'TAS',
  country: 'AU',
  email: 'listen@haldenaudio.example',
  phone: '+61 3 5550 0188',
  title: 'Halden Audio | Handmade loudspeakers, built to order in Corrigan Bay',
  description:
    'Halden Audio builds loudspeakers by hand, to order, in Corrigan Bay, Tasmania. Book a listening session and hear a pair in a real room before you decide.',
  headline: 'Loudspeakers built slowly, for people who listen closely.',
  intro: 'Three people, one workshop and a waiting list of about eight weeks. Every pair is voiced by ear before it leaves.',
  cta: 'Book a listening session',
  images: {
    hero: 'Warm amber rings spreading across a dark background, like the ripple of a single struck note',
    driver: 'A close view of a loudspeaker driver, lit from the centre, in glowing amber and deep blue',
    walnut: 'Oiled walnut veneer in warm brown light, the grain running left to right',
    room: 'A listening room in low blue light with an amber glow where the speakers stand',
  },
  philosophy: [
    'We build for the second hour of listening, not the first minute.',
    'Every cabinet is cut, veneered and tuned in the same building.',
    'If a pair isn\'t right, we say so and we fix it. That is the whole warranty.',
  ],
  speakers: [
    {
      name: 'The Marlow',
      tagline: 'A bookshelf pair that fills a small room.',
      body: 'Two drivers in a sealed walnut cabinet. It asks for a good stand and an hour of patience, and gives back a sound far larger than its size.',
      image: 'driver',
      specs: [
        { label: 'Drivers', value: '25 mm silk dome, 150 mm paper cone' },
        { label: 'Sensitivity', value: '87 dB at 1 watt' },
        { label: 'Suits rooms up to', value: '20 square metres' },
        { label: 'Build time', value: 'Eight weeks' },
      ],
    },
    {
      name: 'The Kestrel',
      tagline: 'A floorstanding pair for rooms that deserve one.',
      body: 'Three drivers and a tall, braced cabinet. It plays quietly with the same poise it plays loudly, which is rarer than it sounds.',
      image: 'walnut',
      specs: [
        { label: 'Drivers', value: '25 mm silk dome, two 150 mm paper cones' },
        { label: 'Sensitivity', value: '90 dB at 1 watt' },
        { label: 'Suits rooms up to', value: '40 square metres' },
        { label: 'Build time', value: 'Ten weeks' },
      ],
    },
  ],
  craft: [
    { title: 'Cut', body: 'Cabinets are cut from sheet walnut and braced so the box stays out of the music.' },
    { title: 'Veneer', body: 'Each pair is veneered from one flitch, so the grain runs on across both speakers.' },
    { title: 'Voice', body: 'Crossovers are tuned by ear in the listening room, then measured to prove it.' },
    { title: 'Deliver', body: 'We carry the pair to your home, set it up and stay until you are happy with it.' },
  ],
  quote: { text: 'I stopped skipping tracks. That is the best thing I can say about them.', who: 'A customer in Launceston' },
  hours: 'Listening sessions run Thursday to Saturday, by appointment.',
};
