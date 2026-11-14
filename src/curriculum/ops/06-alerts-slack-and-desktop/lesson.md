A monitor nobody hears is a log file. The point of a job that runs while you sleep is that it can tap you on the shoulder when something's wrong: a message in Slack, or a pop-up on your desktop. Two ways to do it, both about ten lines of Python.

## Slack incoming webhooks

An incoming webhook is a URL Slack gives you for one channel. Anything that POSTs JSON to it appears as a message:

```python
import requests

requests.post(url, json={"text": "DOWN: https://example.com (503)"}, timeout=10)
```

That URL **is** the password. Anyone who has it can post to your channel, so it never goes in your code or a repo. Keep it in an environment variable, loaded from a `.env` file that's git-ignored, as you did in the APIs track:

```python
url = os.environ["SLACK_WEBHOOK_URL"]
```

A missing variable should stop with a message that names it. A plain `KeyError` at 3am isn't friendly.

Two habits make the sender trustworthy:

- **`timeout=`** on every request. Without one, a stuck connection hangs your whole job forever.
- **`raise_for_status()`**, so a rejected message becomes an error instead of a silent nothing.

## Alert on change, not on state

This is the part people get wrong. A site that's down for six hours, checked every five minutes, would send 72 messages if you alert on "it's down". By message three you've muted the channel, and the alert you needed gets lost. Alert on the **change**:

| Before | Now | Message |
|---|---|---|
| up | down | `DOWN: url (status)` |
| down | up | `UP again: url` |
| up | up | nothing |
| down | down | nothing |

A site you've never seen before has no "before", so it gets no alert on its first check. (You can see why the state file from the last lesson matters here: the "before" has to live somewhere.)

## Desktop notifications

On a Linux desktop, `notify-send "Title" "Message"` pops up a bubble. It only exists on machines with a desktop, so a server job must not assume it:

```python
path = shutil.which("notify-send")      # the full path, or None
if path:
    subprocess.run([path, "Site down", "example.com"])
```

Pass the command as a **list**, never one big string with your message glued in. That way a message containing quotes or `;` can't turn into a shell command.

## Testing alerts without sending any

You can't test a Slack alert against real Slack without spamming a channel. The tests start a **mock webhook server** on your own machine, which records what it's sent, and point your code at that. For `notify-send`, they swap in a fake that notes how it was called. Nothing real is ever sent, which is how you test anything with side effects.

## Your turn

In `main.py`, write the six pieces. `.env.example` shows the variable name with a made-up value.

1. `webhook_url()` reads `SLACK_WEBHOOK_URL` and raises a `RuntimeError` that names it if it's missing.
2. `send_slack(url, text, timeout=10)` posts the JSON, times out, and raises on a bad reply.
3. `is_up(status)`: true for 200 to 399, false for anything else including `None`.
4. `describe_change(url, old, new)` returns the message above, or `None`.
5. `alert_changes(old, new, send)` takes two `{url: status}` dicts, calls `send(message)` for each change in URL order, and returns the messages.
6. `notify_desktop(title, message)` runs `notify-send` if it exists and returns `True`, otherwise returns `False`.

> Never run `notify-send` or post to a real webhook from a test. Here, the checks never do.
