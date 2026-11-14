export const periods = ['1Y', '5Y', '10Y'];

// Each entity's return, as a percentage, for each period.
export const entities = [
  { id: 'family-trust', name: 'Family Trust', type: 'Trust', value: 2400000, returns: { '1Y': 4.2, '5Y': 31.5, '10Y': 88.0 } },
  { id: 'rowan-super', name: 'Rowan Super Fund', type: 'SMSF', value: 1850000, returns: { '1Y': 7.9, '5Y': 44.2, '10Y': 112.5 } },
  { id: 'harbour-holdings', name: 'Harbour Holdings', type: 'Company', value: 3100000, returns: { '1Y': -1.8, '5Y': 22.6, '10Y': 64.3 } },
  { id: 'joint-account', name: 'Joint Account', type: 'Personal', value: 420000, returns: { '1Y': 1.1, '5Y': 5.9, '10Y': 12.4 } },
  { id: 'education-trust', name: 'Education Trust', type: 'Trust', value: 310000, returns: { '1Y': 3.4, '5Y': 19.8, '10Y': 47.1 } },
];

// The return across everything, weighting each entity by how much it's worth.
export function weightedReturn(period) {
  const total = entities.reduce((sum, e) => sum + e.value, 0);
  return entities.reduce((sum, e) => sum + e.value * e.returns[period], 0) / total;
}

export const totalValue = () => entities.reduce((sum, e) => sum + e.value, 0);
