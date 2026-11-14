# Lesson 7: a command-line tool.
# Usage: python3 main.py 520 --nights 3 --gst
import argparse


def main():
    parser = argparse.ArgumentParser(description="Work out a booking total.")
    parser.add_argument("rate", type=int, help="nightly rate in whole dollars")
    parser.add_argument("--nights", type=int, default=1, help="number of nights (default 1)")
    parser.add_argument("--gst", action="store_true", help="add 10%% GST")
    args = parser.parse_args()

    total = args.rate * args.nights
    if args.gst:
        total = round(total * 1.1)
    print(f"${total:,}")


if __name__ == "__main__":
    main()
