# Lesson 5: functions. tests.py imports this file and calls your functions.


def format_money(amount):
    """Format a whole-dollar amount like $13,200."""
    return f"${amount:,}"


def with_gst(amount):
    """Add 10% GST, rounded to whole dollars."""
    return round(amount * 1.1)


def nights_label(nights):
    if nights >= 5:
        return "long stay"
    if nights == 1:
        return "one night"
    return "short stay"


def booking_total(nights, rate, gst=False):
    total = nights * rate
    return with_gst(total) if gst else total


if __name__ == "__main__":
    print(format_money(booking_total(3, 520, gst=True)))
    print(nights_label(5))
