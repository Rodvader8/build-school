import { useState } from 'preact/hooks';

export default function Estimator({ price, unit }) {
  const [qty, setQty] = useState(6);

  // TODO: the total is price times quantity.
  const total = 0;

  return (
    <div class="estimator">
      <label for="estimator-qty">How many {unit}s?</label>
      <input
        id="estimator-qty"
        type="range"
        min="1"
        max="24"
        value={qty}
        onInput={(e) => setQty(Number(e.currentTarget.value))}
      />
      <p class="estimator__total">
        {qty} x ${price.toFixed(2)} = <strong>${total.toFixed(2)}</strong>
      </p>
    </div>
  );
}
