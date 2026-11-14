Real data is messy. A spreadsheet has a blank cell, an export has "TBC" where a number should be, an API times out. A script that crashes at 3am on one bad row is worse than useless. This lesson is how your scheduled jobs survive the night.

## Raising an error

When a function gets something it can't handle, it should say so loudly:

```python
if amount < 0:
    raise ValueError(f"Amount can't be negative: {text!r}")
```

`{text!r}` shows the value with quotes, so an empty string is visible in the message.

## Catching one

```python
try:
    total += parse_amount(text)
except ValueError as error:
    log.warning("Skipped a row: %s", error)
```

Catch the **specific** error you expect (`ValueError`), never a bare `except:`. A bare one also swallows typos in your own code, and silent failures are the hardest bugs to find.

## Logging instead of print

```python
import logging
log = logging.getLogger(__name__)

log.info("Starting")
log.warning("Skipped a row: %s", error)
log.error("Couldn't reach the API")
```

Logs carry a **level**. A scheduled job can show only warnings and errors, write them to a file, or post them to Slack, without changing the code that logs them. Your security alarms work like this.

## Your turn

1. `parse_amount(text)`: strip spaces, `$` and commas, convert to `int`. Raise `ValueError` (with the word "amount" in the message) for text that isn't a number, and for negatives.
2. `total_amounts(texts)`: add up the amounts that parse. For each one that doesn't, log a **warning** and keep going.
