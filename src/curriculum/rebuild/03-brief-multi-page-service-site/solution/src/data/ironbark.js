// Everything the site says lives here. Ironbark Landscape Studio is an invented business: the people and details aren't real.
export const ironbark = {
  name: 'Ironbark Landscape Studio',
  url: 'https://ironbarkstudio.example/',
  suburb: 'Wattlebrook',
  region: 'VIC',
  country: 'AU',
  email: 'studio@ironbarkstudio.example',
  phone: '+61 3 5550 0231',
  hours: 'Monday to Friday, 8:00 to 16:30. We reply to every enquiry within two working days.',
  area: 'Wattlebrook, the Bellarine and the Surf Coast',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/services/', label: 'Services' },
    { href: '/about/', label: 'About' },
    { href: '/contact/', label: 'Contact' },
  ],
  images: {
    hero: 'Soft green and sand tones with a warm terracotta glow in the corner, like a garden at the end of a summer day',
    'project-1': 'Sage green and cream shapes blending into one another, suggesting a native planting bed',
    'project-2': 'Deep green with pale sand light, suggesting a shaded courtyard',
    'project-3': 'Terracotta and cream washes over dark green, suggesting a paved terrace at dusk',
    about: 'Cream light and sage green layered over deep green, suggesting the studio garden in the morning',
  },
  pages: {
    home: {
      title: 'Ironbark Landscape Studio | Garden design and landscaping in Wattlebrook',
      description:
        'Ironbark Landscape Studio designs and builds low-water gardens in Wattlebrook and along the coast. One small crew, from first sketch to final planting.',
      headline: 'Gardens that look like they have always been there.',
      intro: 'We design, build and plant low-water gardens for coastal homes. One small crew looks after every job from the first sketch to the last plant.',
      cta: 'Start an enquiry',
      stats: [
        { figure: '14', label: 'years working the coast' },
        { figure: '320', label: 'gardens planted' },
        { figure: '1', label: 'crew, start to finish' },
      ],
      projectsTitle: 'Recent gardens',
      projects: [
        { image: 'project-1', title: 'The Dunes House', place: 'Wattlebrook', body: 'A native meadow in place of a lawn. It needs no watering after the first summer.' },
        { image: 'project-2', title: 'Courtyard on Heron Lane', place: 'Wattlebrook', body: 'A shaded courtyard with a recycled-brick floor and three tree ferns.' },
        { image: 'project-3', title: 'The Terrace', place: 'Bellarine', body: 'A raised terrace and a long timber bench, planted for evening scent.' },
      ],
      quote: { text: 'They turned up when they said they would, and the garden looks better each year. I can\'t say that about much else I\'ve paid for.', who: 'A client in Wattlebrook' },
    },
    services: {
      title: 'Services | Ironbark Landscape Studio',
      description:
        'Garden design, construction and planting from one crew in Wattlebrook. See what each service includes and how a Ironbark project runs from sketch to handover.',
      headline: 'Three services, one crew.',
      intro: 'You can hire us for a design alone, or for the whole job. Most clients do both, because the person who drew the garden is the best one to build it.',
    },
    about: {
      title: 'About | Ironbark Landscape Studio',
      description:
        'Meet the three people behind Ironbark Landscape Studio. We have worked the coast around Wattlebrook for fourteen years, and we plant for the climate we have.',
      headline: 'Three people who like dirt under their nails.',
      story: [
        'Ironbark started in 2012 with one ute, one spade and a client who wanted a garden that survived the wind. It still works that way.',
        'We plant for the coast we actually have: salt air, sandy soil and long dry summers. That means native grasses, hardy shrubs and a little structure to hold it all together.',
        'The team is small on purpose. The people you meet at the first visit are the people who dig the beds.',
      ],
      team: [
        { name: 'Mara Quist', role: 'Design lead', bio: 'Trained in landscape architecture. Draws every garden by hand before she opens the software.' },
        { name: 'Tomas Reyes', role: 'Build lead', bio: 'A stonemason by trade. If it is paved, walled or stepped, Tomas built it.' },
        { name: 'Jess Orlowski', role: 'Planting and care', bio: 'Grows most of our plants from seed. Returns after the first winter to check every garden.' },
      ],
      values: [
        { title: 'Low water', body: 'Every plan has to survive on rain once the plants are established.' },
        { title: 'Local plants', body: 'We choose species that already belong on this coast.' },
        { title: 'Plain quotes', body: 'You get one written price with the scope spelled out. It changes only if the job does.' },
      ],
    },
    contact: {
      title: 'Contact | Ironbark Landscape Studio',
      description:
        'Tell Ironbark Landscape Studio about your garden. Send an enquiry and we will reply within two working days to arrange a free first visit in Wattlebrook.',
      headline: 'Tell us about your garden.',
      intro: 'A few details are plenty. We will reply within two working days and, if it suits, book a free first visit.',
      serviceOptions: ['Not sure yet'],
      faqs: [
        { question: 'Do you charge for the first visit?', answer: 'No. We walk the site, listen and talk through what\'s possible. You get a written quote afterwards.' },
        { question: 'How long does a garden take?', answer: 'Design takes about three weeks. Most builds run four to eight weeks, depending on paving and walls.' },
        { question: 'Do you work outside Wattlebrook?', answer: 'Yes, around the Bellarine and the Surf Coast. Further than that, tell us where and we\'ll say honestly.' },
        { question: 'Can I just hire the design?', answer: 'You can. You\'ll get a plan, a planting list and a costed scope that any builder can follow.' },
      ],
    },
  },
  services: [
    {
      title: 'Garden design',
      summary: 'A complete plan for your garden, drawn by hand and costed before anything is dug.',
      includes: ['A site visit and measured survey', 'A concept plan and a planting plan', 'A written, costed scope of work'],
    },
    {
      title: 'Construction',
      summary: 'Paving, walls, steps, decks and drainage, built by the same people who drew them.',
      includes: ['Earthworks and drainage', 'Stone, brick and timber structures', 'Irrigation, lighting and edging'],
    },
    {
      title: 'Planting and care',
      summary: 'Plants chosen for the coast, many grown by us, and a check-up after the first winter.',
      includes: ['Soil preparation and mulching', 'Supply and planting of native species', 'A care guide and one return visit'],
    },
  ],
};
