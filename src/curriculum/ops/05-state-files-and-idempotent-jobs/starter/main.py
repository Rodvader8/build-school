import json
import os
import tempfile
from pathlib import Path


def load_state(path):
    """The saved state. {"done": []} if the file doesn't exist. ValueError (naming the file) if it's corrupt."""
    pass


def save_state(path, state):
    """Write the state atomically: temp file in the same folder, then os.replace. Clean up if anything fails."""
    pass


def process_new(items, handler, state_path):
    """Call handler(item) for each item whose "id" isn't in state["done"]. Save after each success.
    Return the list of ids handled in this run (an empty list if there was nothing new)."""
    pass
