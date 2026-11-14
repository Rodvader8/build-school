# Notes for the next new starter

## Where things happen

- The file that defines the free-shipping threshold: src/config/rules.js
- The file that works out how much a promo code takes off: src/pricing/discounts.js
- The file that prints the receipt text: src/receipt/format.js
- The file that calls all the others in order to build an order: src/index.js

## How I found them

I ran `grep -rn "shipping" src` to find the threshold, then `grep -rn "Discount" src` for the receipt line.
