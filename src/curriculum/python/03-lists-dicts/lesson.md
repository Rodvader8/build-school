Python's lists and dictionaries are JavaScript's arrays and objects, with slightly different names.

## Lists

```python
rooms = ["Garden Room", "Ocean Room"]
rooms.append("Cliff Suite")   # JavaScript's push
len(rooms)                    # 3: JavaScript's .length
rooms[0]                      # "Garden Room"
rooms[-1]                     # "Cliff Suite": negative counts from the end
```

## Dictionaries

A **dictionary** (dict) maps keys to values:

```python
rates = {"Garden Room": 380, "Ocean Room": 520}
rates["Ocean Room"]           # 520
rates["Garden Room"] = 400    # change a value
rates["Loft"] = 290           # add a new one
```

Keys go in square brackets with quotes. Python has no dot shortcut like `rates.ocean`.

Dicts are how Python holds JSON data. A site monitor's API responses all arrive as dicts.

## Your turn

1. `append` **Cliff Suite** to `rooms`, then print how many rooms there are, the first room and the last room (use `-1`).
2. Make a dict `rates`: Garden Room 380, Ocean Room 520, Cliff Suite 760. Print the Ocean Room's rate.
3. Raise the Garden Room to 400, then print the whole dict.
4. Make a dict `booking` for **M. Okafor**, the **Ocean Room**, **3** nights, and print **M. Okafor owes $1,560** by looking up the rate for the booking's room.
