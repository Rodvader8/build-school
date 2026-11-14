import { useState } from 'react';
import { schema } from '../schema.js';

const empty = { name: '', email: '', value: '' };

function Field({ id, label, value, error, onChange, ...rest }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} value={value} onChange={onChange} aria-invalid={error ? 'true' : 'false'} aria-describedby={error ? `${id}-error` : undefined} {...rest} />
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function EntityForm({ onAdd }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const found = {};
      for (const issue of result.error.issues) {
        found[issue.path[0]] ??= issue.message; // keep the first message for each field
      }
      setErrors(found);
      return;
    }
    setErrors({});
    setValues(empty);
    onAdd(result.data);
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <Field id="name" label="Name" value={values.name} error={errors.name} onChange={handleChange} />
      <Field id="email" label="Owner email" value={values.email} error={errors.email} onChange={handleChange} />
      <Field id="value" label="Value" value={values.value} error={errors.value} onChange={handleChange} inputMode="numeric" />
      <button type="submit" className="btn">
        Add entity
      </button>
    </form>
  );
}
