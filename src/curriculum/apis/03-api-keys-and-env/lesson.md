A site monitor, a traffic reporter and an AI-visibility tracker all need keys: long strings that prove a request comes from you, and that Google, Stripe or OpenAI bill or rate-limit against. A key is a password with a credit card attached. This lesson is the habit that keeps yours safe.

## The rule

**A key never goes in code, and never goes in Git.** Not "just for a minute", not in a private repo. Git remembers every commit forever, and automated scanners search public GitHub for keys within seconds.

## Where keys live instead

A **`.env` file**: plain text, one `NAME=value` per line, sitting next to your code and never committed.

```
SITE_API_KEY=paste-the-real-key-here
SITE_API_BASE=https://api.example-monitor.test
```

Your program reads it into **environment variables**, values the operating system hands to every program. In Python:

```python
import os
key = os.environ["SITE_API_KEY"]
```

Traffic and Search Console tools do exactly this. The code is the same on every machine, and only the `.env` differs.

## The three files

| File | Holds | In Git? |
|---|---|---|
| `.env` | the real values | **Never** |
| `.env.example` | the same names, with fake placeholders | Yes |
| `.gitignore` | a rule that keeps `.env` out | Yes |

The `.env.example` is documentation: it tells the next person (or you in six months) which variables the program needs. Your `.gitignore` should contain:

```
.env
.env.*
!.env.example
```

The second line covers `.env.local` and friends. The third, starting with `!`, puts the example back in.

## Never print one

Logs get pasted into chats, support tickets and screenshots. If you need to show which key is in use, show a masked tail: `****4321`. That's enough to tell two keys apart, and useless to a thief.

## If one leaks

Delete the line, and the key is *still* in Git's history. So the fix isn't deleting, it's **rotating**: make a new key at the provider, put it in `.env`, and revoke the old one. Do it straight away, then clean up.

Before every commit, run `git status` and `git diff --cached` and read them. A key is easy to spot when you're looking.

> `python-dotenv` is a package that does `load_env` for you (`pip install python-dotenv`). You'll build the small version yourself first, so you know what it's doing.

## Your turn

The tests use an obviously fake key (`test-key-not-real-...`) and a pretend API on your own machine. To use a real service later, put the real key in `.env` and set `SITE_API_BASE` to the real address. The code doesn't change.

1. In `main.py`, delete the typed-in `API_KEY` line.
2. Write `load_env`, `mask` and `get_key`, following the notes in each docstring.
3. Change `call_site_api` to use `get_key()`, and change the last line to print `mask(get_key())`.
4. In the terminal, run `cp .env.example .env`. Then create `.gitignore` with the three lines above.
5. Press Run. You should see a masked key, not a full one.
