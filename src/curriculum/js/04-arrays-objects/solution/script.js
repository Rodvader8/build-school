// Lesson 4: arrays and objects.

const plans = [
  { name: 'Essentials', suits: 'One clear goal', fee: 4400 },
  { name: 'Family', suits: 'Couples and growing families', fee: 7700 },
  { name: 'Private', suits: 'Complex, multi-entity wealth', fee: 13200 },
];

plans.push({ name: 'Foundation', suits: 'Just starting out', fee: 2200 });

const planNames = plans.map((plan) => plan.name);
const family = plans.find((plan) => plan.name === 'Family');

console.log(plans.length);
console.log(planNames);
console.log(family.fee);
