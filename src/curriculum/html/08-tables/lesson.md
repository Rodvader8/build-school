Tables are for **data with rows and columns**, like a fee schedule. (Years ago people used tables to lay out whole pages. Don't. That's CSS's job now.)

```html
<table>
  <caption>Yearly advice fees</caption>
  <thead>
    <tr>
      <th scope="col">Service</th>
      <th scope="col">Who it suits</th>
      <th scope="col">Yearly fee</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Essentials</td>
      <td>Single goal</td>
      <td>$4,400</td>
    </tr>
  </tbody>
</table>
```

| Tag | Meaning |
|---|---|
| `caption` | The table's title. Screen readers read it first. |
| `thead` / `tbody` | The header row group and the data rows. |
| `tr` | Table **r**ow. |
| `th` | A header cell. `scope="col"` says it labels a column. |
| `td` | A normal data cell. |

## Your turn

The Larkfield "plain fee table" is waiting as text. Build it as a real table:

1. Add a `caption`: **Yearly advice fees**.
2. A `thead` with three `th` cells (with `scope="col"`): Service, Who it suits, Yearly fee.
3. A `tbody` with one `tr` per service, three `td` cells each.
