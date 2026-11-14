Real tools run from the terminal with options: `clipper episode.mp4`, `monitor --site example`, `git commit -m ...`. Python's built-in `argparse` turns a script into a proper command-line tool, with `--help` for free.

## argparse

```python
import argparse

parser = argparse.ArgumentParser(description="Work out a booking total.")
parser.add_argument("rate", type=int, help="nightly rate in whole dollars")
parser.add_argument("--nights", type=int, default=1, help="number of nights")
parser.add_argument("--gst", action="store_true", help="add 10%% GST")
args = parser.parse_args()

args.rate     # 520
args.nights   # 3
args.gst      # True or False
```

| Kind | Looks like | Notes |
|---|---|---|
| **positional** | `520` | Required, in order. |
| **option** | `--nights 3` | Optional, with a `default`. |
| **flag** | `--gst` | `store_true` makes it `True` when present. |

`type=int` converts the text and refuses anything that isn't a number, with a helpful error. (In help text, `%` must be written `%%`.)

## Your turn

Make `main.py` a tool that prints a booking total:

```bash
python3 main.py 4400                    # $4,400
python3 main.py 4400 --gst              # $4,840
python3 main.py 520 --nights 3          # $1,560
python3 main.py 520 --nights 3 --gst    # $1,716
python3 main.py --help                  # explains itself
```

Test it in the terminal prompt below the editor, then press Check my work. The Run button runs it with no arguments, so expect an argparse error there.
