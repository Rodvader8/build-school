// Server-side data. supplierNote is internal: customers must never receive it.
export const menu = [
  { slug: 'sourdough', name: 'Country sourdough', category: 'bread', price: 9, blurb: 'Slow-fermented for 36 hours.', supplierNote: 'Flour from Gundaroo Mill, wholesale $1.12/kg' },
  { slug: 'rye', name: 'Seeded rye', category: 'bread', price: 10, blurb: 'Dense, sweet and full of seeds.', supplierNote: 'Seed mix wholesale $6.40/kg' },
  { slug: 'focaccia', name: 'Rosemary focaccia', category: 'bread', price: 8, blurb: 'Olive oil, sea salt, lots of dimples.', supplierNote: 'Olive oil wholesale $9.80/L' },
  { slug: 'croissant', name: 'Butter croissant', category: 'pastry', price: 5, blurb: 'Three days of folding.', supplierNote: 'Butter wholesale $11.20/kg' },
  { slug: 'cardamom-bun', name: 'Cardamom bun', category: 'pastry', price: 5, blurb: 'Sticky, spiced, best warm.', supplierNote: 'Cardamom wholesale $84/kg' },
  { slug: 'almond-tart', name: 'Almond tart', category: 'pastry', price: 6, blurb: 'Frangipane in a short pastry case.', supplierNote: 'Almond meal wholesale $14/kg' },
];
