import os
import shutil
import subprocess

import requests


def webhook_url():
    """The Slack webhook URL from the SLACK_WEBHOOK_URL environment variable.
    Raise a RuntimeError that mentions the variable's name if it isn't set."""
    pass


def send_slack(url, text, timeout=10):
    """POST {"text": text} as JSON. Give up after `timeout` seconds. Raise if the reply is an error. Return True."""
    pass


def is_up(status):
    """True for a status from 200 to 399. False for anything else, including None (no reply at all)."""
    pass


def describe_change(url, old, new):
    """The alert for a status change, or None if there's nothing to say.
    up -> down: "DOWN: <url> (<status>)", using "no response" when the status is None.
    down -> up: "UP again: <url>"."""
    pass


def alert_changes(old, new, send):
    """old and new are {url: status}. Call send(message) for each change, in URL order.
    A URL missing from old is new to us: no alert. Return the list of messages sent."""
    pass


def notify_desktop(title, message):
    """Show a desktop notification with notify-send. Return True if it ran, False if notify-send isn't installed."""
    pass
