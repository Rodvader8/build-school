Python variables are simpler than JavaScript's: no `const` or `let`, just a name and `=`.

```python
firm = "Larkfield Private Wealth"
clients = 120
clients = clients + 1       # now 121
```

Python style uses `snake_case` names: lowercase words joined by underscores, like `monthly_fee`.

## f-strings

Put an `f` before the quotes and drop values in with `{ }`, just like JavaScript's template literals:

```python
print(f"{firm} looks after {clients} families.")
print(f"${fee:,}")          # :, adds thousands commas: $13,200
```

The bit after the colon is a **format**. `:,` adds commas, and `:.2f` shows two decimal places.

## Asking a question

```python
name = input("What's your name? ")
```

`input()` prints the question, waits for an answer, and gives it back as a string. When you press Run, type your answer in the box under the terminal. When you press Check my work, the checker answers **Sam** for you.

## Strings have tools

```python
firm.upper()      # 'LARKFIELD PRIVATE WEALTH'
firm.lower()
len(firm)         # 24 characters
```

## Your turn

1. Ask for a name with `input()`, then print **G'day, Sam!** (using whatever name was typed).
2. Make `firm`, `fee` (13200) and `clients` (120, then add 1).
3. Print **Larkfield Private Wealth looks after 121 families.**
4. Print **The Private plan is $13,200 a year.** using `:,`
5. Print the firm's name in capitals with `.upper()`.
