Functions in Python start with `def`, and their body is indented, like loops:

```python
def format_money(amount):
    """Format a whole-dollar amount like $13,200."""
    return f"${amount:,}"
```

The string in triple quotes straight under the `def` is a **docstring**. It explains what the function does, and editors show it when you hover over the name.

## Default arguments

```python
def booking_total(nights, rate, gst=False):
    ...

booking_total(3, 520)             # gst is False
booking_total(3, 520, gst=True)   # naming the argument makes calls readable
```

## Rounding

`round(4840.000000000001)` gives `4840`. (Same binary-decimal trap as in JavaScript.)

## Testing your own code

From here on, **Check my work runs `tests.py`**. Open it in the Explorer: it imports your `main.py` and calls your functions with known inputs. That's how professional code gets checked, and you'll write tests like it for your own tools later.

There's one catch. Importing a file runs it, top to bottom. Code you only want when running the file directly goes under this guard:

```python
if __name__ == "__main__":
    print(format_money(13200))
```

When you press Run, `__name__` is `"__main__"`, so the block runs. When `tests.py` imports the file, it isn't, so the block is skipped. You'll see this line at the bottom of nearly every Python script, including the site monitor you'll build later.

## Your turn

Write these four functions in `main.py`:

1. `format_money(amount)`: `13200` gives `"$13,200"`.
2. `with_gst(amount)`: adds 10% and rounds, so `4400` gives `4840`.
3. `nights_label(nights)`: **long stay** for 5 or more, **one night** for 1, otherwise **short stay**.
4. `booking_total(nights, rate, gst=False)`: nights times rate, with GST added if `gst` is `True`.

Then add a `__main__` block that prints something using them.
