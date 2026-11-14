import json
import os
import tempfile
from pathlib import Path


def load_state(path):
    """The saved state. {"done": []} if the file doesn't exist. ValueError (naming the file) if it's corrupt."""
    path = Path(path)
    if not path.exists():
        return {"done": []}
    try:
        return json.loads(path.read_text())
    except ValueError as error:
        raise ValueError(f"state file {path} is corrupt: {error}") from error


def save_state(path, state):
    """Write the state atomically: temp file in the same folder, then os.replace. Clean up if anything fails."""
    path = Path(path)
    fd, temp = tempfile.mkstemp(dir=path.parent, prefix=path.name + ".")
    try:
        with os.fdopen(fd, "w") as f:
            json.dump(state, f)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp, path)
    except BaseException:
        if os.path.exists(temp):
            os.remove(temp)
        raise


def process_new(items, handler, state_path):
    """Call handler(item) for each item whose "id" isn't in state["done"]. Save after each success.
    Return the list of ids handled in this run (an empty list if there was nothing new)."""
    state = load_state(state_path)
    handled = []
    for item in items:
        if item["id"] in state["done"]:
            continue
        handler(item)
        state["done"].append(item["id"])
        save_state(state_path, state)
        handled.append(item["id"])
    return handled
