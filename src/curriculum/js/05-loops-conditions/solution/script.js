// Lesson 5: loops and conditions.

const plans = [
  { name: 'Foundation', fee: 2200 },
  { name: 'Essentials', fee: 4400 },
  { name: 'Family', fee: 7700 },
  { name: 'Private', fee: 13200 },
];

// 1. total
let total = 0;
for (const plan of plans) {
  total += plan.fee;
}

// 2. premium
const premium = [];
for (const plan of plans) {
  if (plan.fee >= 7000) {
    premium.push(plan.name);
  }
}

// 3. bandFor(fee)
function bandFor(fee) {
  if (fee < 5000) {
    return 'entry';
  } else if (fee < 10000) {
    return 'mid';
  }
  return 'top';
}

console.log(total, premium, bandFor(7700));
