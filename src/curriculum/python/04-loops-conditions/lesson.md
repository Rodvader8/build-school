The same ideas as JavaScript, with Python's tidier look: no brackets around conditions, and **indentation instead of curly braces**.

## for loops

```python
for booking in bookings:
    print(booking["guest"])
```

The colon starts a block, and every line indented under it belongs to the block. Indentation isn't just neatness in Python. It's the grammar. Use 4 spaces.

## if, elif, else

```python
if nights >= 5:
    label = "long stay"
elif nights == 1:
    label = "one night"
else:
    label = "short stay"
```

`elif` is Python's `else if`. Python writes `and`, `or` and `not` as words.

## List comprehensions

A one-line way to build a list, and one of Python's best features:

```python
ocean = [b["guest"] for b in bookings if b["room"] == "Ocean Room"]
```

Read it as "the guest of each b in bookings, where the room is Ocean Room".

## Your turn

1. Loop over `bookings`. For each, work out `nights * rate` and print a line like **M. Okafor: $1,560 (short stay)**.
2. The label: 5 or more nights is **long stay**, exactly 1 is **one night**, anything else is **short stay**.
3. Keep a running `total` and print **Total: $6,640** at the end.
4. Use a list comprehension to print the guests in Ocean Rooms: `['M. Okafor', 'R. Patel']`.
