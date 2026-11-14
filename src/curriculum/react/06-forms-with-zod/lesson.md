Forms are where apps meet real people and real typos. Someone will type "lots" into a number box, so your code needs a calm answer: which field, what's wrong, and how to fix it. Two tools do most of the work: controlled inputs in React, and **zod** to describe what valid means.

## Controlled inputs

```jsx
const [values, setValues] = useState({ name: '', email: '', value: '' });

<input name="name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
```

The input shows whatever the state says, and every keystroke updates the state. React is the single source of truth. It's the "state, then render" pattern one more time, and it's why you can reset a form by setting the state back to empty.

## Describe valid with a schema

Rather than a pile of `if` statements, describe the shape once:

```js
import { z } from 'zod';

export const schema = z.object({
  name: z.string().trim().min(2, 'Enter a name of at least 2 characters'),
  email: z.email('Enter a valid email address'),
  value: z.coerce.number('Enter a number').min(1, 'Value must be at least $1'),
});
```

- Each field is a chain of rules, and the second argument is the message a person sees.
- `.trim()` cleans the input as part of the check.
- **`z.coerce.number()`** converts first. Every form value is a string, so `"2400000"` becomes `2400000` before `.min(1)` runs.

## safeParse

```js
const result = schema.safeParse(values);
```

`safeParse` doesn't throw. You get either `{ success: true, data }` with the **cleaned** data, or `{ success: false, error }`, where `error.issues` lists every problem with the field in `path` and the text in `message`:

```js
for (const issue of result.error.issues) {
  found[issue.path[0]] ??= issue.message; // first message per field
}
```

Always send the cleaned `result.data` onwards, not the raw `values`.

## Show errors so everyone can use them

- Put the message **next to** its field, with `role="alert"` so screen readers announce it.
- Mark the field `aria-invalid="true"` and link it with `aria-describedby="email-error"`.
- Say what to do ("Enter a valid email address"), not just what went wrong.
- Keep the labels. A placeholder isn't a label, because it vanishes as soon as you type.

The form has `noValidate` so the browser's own bubbles don't compete with yours. Your schema is the one source of truth.

## One more rule

Validating in the browser is for kindness and speed. It's **not** security, because anyone can skip your page and send the request directly. When there's a server, it runs the same schema again.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview.
2. In `src/schema.js`, build the schema. The exact messages are in `tests/schema.test.jsx`.
3. In `EntityForm.jsx`, finish `handleSubmit`: parse the values, store the first message per field on failure, and on success call `onAdd(result.data)`, clear the errors and reset the form.
4. Wire up the email and value inputs the same way the name input is, then show each message under its field with `aria-invalid` and `aria-describedby`.
5. Press **Check my work**.

> Tip: press the button with the form empty. You should get three messages at once, not one at a time.
