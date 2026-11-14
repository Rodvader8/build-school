# Lesson 9: using a package from PyPI inside a virtual environment.
import sys

import humanize

print("Python running from:", sys.prefix)
print(humanize.intcomma(1284000))
print(humanize.naturalsize(1_500_000))
