#!/usr/bin/env bash
# Builds the practice repository in ./app: a tiny slug library with fourteen commits of history.
# Run it once with: bash setup.sh
set -e
if [ -d app ]; then
  echo "app/ already exists. Delete it (rm -rf app) and run this again if you want to start over."
  exit 0
fi
mkdir app
cd app
git init -q -b main
# This identity applies to this repository only. Nothing global is touched.
git config user.name "Build School"
git config user.email "student@build-school.local"
git config commit.gpgsign false

n=0
c() {
  n=$((n + 1))
  d=$(printf '2026-03-%02dT10:00:00' "$n")
  git add -A
  GIT_AUTHOR_DATE="$d" GIT_COMMITTER_DATE="$d" git commit -q -m "$1"
}

# 1. The library and its tests
printf '__pycache__/\n' > .gitignore
cat > slugify.py <<'PY'
import re


def slugify(text):
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")
PY
cat > test_slugify.py <<'PY'
import sys

from slugify import slugify

CASES = {
    "Hello, World!": "hello-world",
    "  Spaces   everywhere  ": "spaces-everywhere",
    "Already-slugged": "already-slugged",
    "Tom & Jerry": "tom-jerry",
    "2026 plans": "2026-plans",
}

failures = 0
for text, expected in CASES.items():
    got = slugify(text)
    if got != expected:
        failures += 1
        print(f"FAIL {text!r}: expected {expected!r}, got {got!r}")
print("all good" if failures == 0 else f"{failures} failing")
sys.exit(1 if failures else 0)
PY
c "Add slugify with tests"

printf '# slugify\n\nTurns titles into URL-friendly slugs.\n' > README.md
c "Add a README"

cat > cli.py <<'PY'
import sys

from slugify import slugify

print(slugify(" ".join(sys.argv[1:])))
PY
c "Add a command-line wrapper"

printf '# Changelog\n\n## 1.0\n- First release\n' > CHANGELOG.md
c "Add a changelog"
git tag v1.0

cat > slugify.py <<'PY'
import re


def slugify(text, max_length=None):
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    if max_length:
        text = text[:max_length].rstrip("-")
    return text
PY
c "Add an optional max_length"

printf 'Hello World\nSecond Post\n' > examples.txt
c "Add example titles"

printf '\n## Usage\n\npython3 cli.py "Hello World"\n' >> README.md
c "Document the command line"

printf '\n## 1.1\n- Optional max_length\n' >> CHANGELOG.md
c "Update the changelog"

cat > slugify.py <<'PY'
import re


def slugify(text, max_length=None):
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]", "-", text)
    text = text.strip("-")
    if max_length:
        text = text[:max_length].rstrip("-")
    return text
PY
c "Speed up slug cleanup"

cat > cli.py <<'PY'
import sys

from slugify import slugify

args = sys.argv[1:]
limit = None
if args and args[0].startswith("--max="):
    limit = int(args[0][6:])
    args = args[1:]
print(slugify(" ".join(args), limit))
PY
c "Add a --max flag to the command line"

printf '\nTry: python3 cli.py --max=10 "A very long title"\n' >> README.md
c "Document the --max flag"

printf 'Numbers 123\n' >> examples.txt
c "Add a numbers example"

printf '\n## 1.2\n- --max flag\n' >> CHANGELOG.md
c "Note the --max flag in the changelog"

printf 'test:\n\tpython3 test_slugify.py\n' > Makefile
c "Add a Makefile"

echo
echo "Built app/ with $n commits. The tag v1.0 marks a release that worked."
echo "Now: cd app && python3 test_slugify.py"
