"I changed something and now it works" isn't a fix. It's a coincidence you can't repeat. Professionals debug with a method, and the method is boring on purpose: it means you find the cause instead of a patch that hides it.

Here are three bugs in a small log summariser. They're three different *kinds* of bug, and the method is the same for all of them.

## The method

1. **Reproduce.** Make it fail on demand, with the smallest input you can. If you can't make it fail, you can't know you've fixed it.
2. **Isolate.** Cut the problem down to one function, then one line. Call the function directly. Print the values going in and out.
3. **Hypothesise.** Say what you think is wrong, in a sentence, *before* you change anything. A good hypothesis predicts something you can check: "if `ms` is text, then `max` will compare it as text, so `"95"` beats `"1200"`".
4. **Fix** the cause, not the symptom. One change.
5. **Prove.** A regression test that **failed before** your fix and **passes after**. A test you never saw fail might not be testing anything.

## Three kinds of bug

- **Off by one.** A loop or slice that's one step too short or too long. Check the edges: ask for 1, ask for exactly as many as exist, ask for more.
- **Wrong type.** A number that's really text, so comparisons and sums behave strangely. `type(x)` is the quickest probe.
- **Shared state.** Something that remembers between calls. Python's classic: a default argument like `found=[]` is built once, when the function is defined, then shared by every call.

```python
def add(item, bag=[]):      # one list, shared forever
    bag.append(item)
    return bag

def add(item, bag=None):    # a fresh list per call
    bag = [] if bag is None else bag
```

## Your turn

1. Read `BUGS.md`, then run `python3 run_report.py`. Find the three bugs in the output.
2. For each bug, reproduce it on its own, isolate it, and write your hypothesis in `DEBUG_LOG.md` before you change `report.py`.
3. Open `my_tests.py`. Write one regression test for each bug using plain `assert` with a message. Each test takes the module as an argument: call `report.top_paths(...)`, not an imported function.
4. Check that each test fails against the frozen buggy copy, `bugged.py`, and passes on your fixed `report.py`. `check.py` does the same, so a test that always passes doesn't count.
5. Fix `report.py`, one bug at a time. Run `python3 -m unittest tests` after each fix to be sure the team's existing tests still pass.
6. Finish the five lines for each bug in `DEBUG_LOG.md`, then press **Check my work**.

> Tip: the existing tests pass with all three bugs present. That's worth a sentence in your log: what would they have needed to include to catch each one?
