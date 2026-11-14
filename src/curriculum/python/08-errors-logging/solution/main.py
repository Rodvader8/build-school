# Lesson 8: errors and logging.
import logging

log = logging.getLogger(__name__)


def parse_amount(text):
    """Turn text like "$4,400" into 4400. Raise ValueError for anything that isn't a positive amount."""
    cleaned = text.strip().replace("$", "").replace(",", "")
    try:
        amount = int(cleaned)
    except ValueError:
        raise ValueError(f"Not an amount: {text!r}") from None
    if amount < 0:
        raise ValueError(f"Amount can't be negative: {text!r}")
    return amount


def total_amounts(texts):
    """Add up the amounts that parse. Log a warning for each one that doesn't, and carry on."""
    total = 0
    for text in texts:
        try:
            total += parse_amount(text)
        except ValueError as error:
            log.warning("Skipped a row: %s", error)
    return total


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    print(total_amounts(["4,400", "oops", "7,700"]))
