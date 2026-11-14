// Lesson 6: build the fee table from data.

const plans = [
  { name: 'Foundation', suits: 'Just starting out', fee: 2200 },
  { name: 'Essentials', suits: 'One clear goal', fee: 4400 },
  { name: 'Family', suits: 'Couples and growing families', fee: 7700 },
  { name: 'Private', suits: 'Complex, multi-entity wealth', fee: 13200 },
];

const formatFee = (amount) => '$' + amount.toLocaleString('en-AU');

// Your code below: find the tbody, add one row per plan, then update .db-count.

