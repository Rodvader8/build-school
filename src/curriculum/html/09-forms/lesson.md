The enquiry form is the most important part of a business site. It's how visitors turn into clients.

```html
<form action="/thanks" method="post">
  <label for="name">Your name</label>
  <input id="name" name="name" type="text" autocomplete="name" required>

  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required>

  <label for="message">How can we help?</label>
  <textarea id="message" name="message" rows="5"></textarea>

  <button type="submit">Send enquiry</button>
</form>
```

| Piece | Why |
|---|---|
| `label for="email"` + `input id="email"` | Links the words to the box. Clicking the label focuses the box, and screen readers read the label aloud. **Every input needs one.** |
| `type="email"` | Phones show the @ keyboard, and the browser checks the format. Others: `tel`, `number`, `date`. |
| `name` | The key the data is sent under. Without it, the field isn't sent at all. |
| `required` | The browser won't submit until it's filled in. |
| `autocomplete` | Lets the browser fill in saved details. Fewer taps means more enquiries. |
| `textarea` | A multi-line box for longer messages. |

## Your turn

Build an enquiry form with:

1. A **name** field and an **email** field (`type="email"`), both `required`.
2. A **phone** field with `type="tel"`.
3. A `textarea` for the message.
4. A `label` for every field.
5. A submit `button`.
