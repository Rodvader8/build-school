// Lesson 3: functions. Write formatFee and withGst below.
function formatFee(amount) {
  return '$' + amount.toLocaleString('en-AU');
}

const withGst = (amount) => Math.round(amount * 1.1);

console.log(formatFee(4400));
console.log(formatFee(withGst(13200)));
