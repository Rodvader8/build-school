import { useState } from 'react';
import { schema } from '../schema.js';

const empty = { name: '', email: '', value: '' };

export default function EntityForm({ onAdd }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Step 2: check `values` with schema.safeParse(values).
    // If it fails, put the first message for each field into `errors` (keyed by field name).
    // If it passes, call onAdd(result.data), clear the errors and reset the form.
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={values.name} onChange={handleChange} />
        {/* Step 3: aria-invalid and aria-describedby on the input, and the message below it. */}
      </div>
      <div className="field">
        <label htmlFor="email">Owner email</label>
        <input id="email" name="email" />
      </div>
      <div className="field">
        <label htmlFor="value">Value</label>
        <input id="value" name="value" inputMode="numeric" />
      </div>
      <button type="submit" className="btn">
        Add entity
      </button>
    </form>
  );
}
