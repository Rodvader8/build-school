"""Ask an AI model a question and get checked, structured JSON back (the shape of an AI-visibility tracker)."""
import json
import os

import requests

MODEL = os.environ.get("AI_MODEL", "your-model-id-here")


def build_request(prompt, model=MODEL, max_tokens=512, system=None):
    """The JSON body for POST /v1/messages: model, max_tokens, messages (and system, only when given)."""
    # TODO: messages is a list of {"role": "user", "content": prompt}
    return {}


def ask(base_url, api_key, prompt, model=MODEL, max_tokens=512, system=None):
    """POST to {base_url}/v1/messages and return the parsed response.
    Headers: x-api-key, anthropic-version "2023-06-01", content-type application/json.
    """
    # TODO: requests.post(..., headers=..., json=build_request(...), timeout=60), raise_for_status()
    raise NotImplementedError


def extract_text(response):
    """Join the text of every {"type": "text"} block in response["content"].
    If response["stop_reason"] is "max_tokens" the answer was cut off: raise ValueError mentioning max_tokens."""
    # TODO
    return ""


def parse_json_reply(text):
    """Models often wrap JSON in ```json fences or add a sentence before it. Pull out the JSON object and parse it.
    Raise ValueError if there isn't valid JSON in the text."""
    # TODO: take everything from the first { to the last }
    return json.loads(text)


def validate_mention(data):
    """Check the shape: {"mentioned": bool, "position": int >= 1 or None, "competitors": [str, ...]}.
    If mentioned is false, position must be None. Raise ValueError naming the bad field. Return data if it's fine."""
    # TODO
    return data


def check_visibility(base_url, api_key, brand, question):
    """Ask the model `question`, tell it to answer ONLY with JSON in that shape about `brand`, and return validated data."""
    # TODO: ask -> extract_text -> parse_json_reply -> validate_mention
    raise NotImplementedError


if __name__ == "__main__":
    print("Run Check my work: this lesson talks to a pretend model on your own machine.")
