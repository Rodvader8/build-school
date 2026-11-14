# Lesson 8: errors and logging.
import logging

log = logging.getLogger(__name__)


def parse_amount(text):
    """Turn text like "$4,400" into 4400. Raise ValueError for anything that isn't a positive amount."""


def total_amounts(texts):
    """Add up the amounts that parse. Log a warning for each one that doesn't, and carry on."""


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    print(total_amounts(["4,400", "oops", "7,700"]))
