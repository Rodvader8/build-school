"""Ask an AI model a question and get checked, structured JSON back (the shape of an AI-visibility tracker)."""
import json
import os

import requests

MODEL = os.environ.get("AI_MODEL", "your-model-id-here")


def build_request(prompt, model=MODEL, max_tokens=512, system=None):
    """The JSON body for POST /v1/messages: model, max_tokens, messages (and system, only when given)."""
    body = {"model": model, "max_tokens": max_tokens, "messages": [{"role": "user", "content": prompt}]}
    if system:
        body["system"] = system
    return body


def ask(base_url, api_key, prompt, model=MODEL, max_tokens=512, system=None):
    """POST to {base_url}/v1/messages and return the parsed response.
    Headers: x-api-key, anthropic-version "2023-06-01", content-type application/json.
    """
    response = requests.post(
        base_url + "/v1/messages",
        headers={"x-api-key": api_key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        json=build_request(prompt, model, max_tokens, system),
        timeout=60,
    )
    response.raise_for_status()
    return response.json()


def extract_text(response):
    """Join the text of every {"type": "text"} block in response["content"].
    If response["stop_reason"] is "max_tokens" the answer was cut off: raise ValueError mentioning max_tokens."""
    if response.get("stop_reason") == "max_tokens":
        raise ValueError("the reply was cut off at max_tokens, so the JSON is probably incomplete")
    return "".join(block["text"] for block in response["content"] if block.get("type") == "text")


def parse_json_reply(text):
    """Models often wrap JSON in ```json fences or add a sentence before it. Pull out the JSON object and parse it.
    Raise ValueError if there isn't valid JSON in the text."""
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end < start:
        raise ValueError("no JSON object in the reply")
    return json.loads(text[start : end + 1])  # json.JSONDecodeError is a ValueError too


def validate_mention(data):
    """Check the shape: {"mentioned": bool, "position": int >= 1 or None, "competitors": [str, ...]}.
    If mentioned is false, position must be None. Raise ValueError naming the bad field. Return data if it's fine."""
    if not isinstance(data, dict):
        raise ValueError("the reply must be a JSON object")
    if not isinstance(data.get("mentioned"), bool):
        raise ValueError("mentioned must be true or false")
    position = data.get("position")
    if position is not None and (isinstance(position, bool) or not isinstance(position, int) or position < 1):
        raise ValueError("position must be a whole number from 1, or null")
    if not data["mentioned"] and position is not None:
        raise ValueError("position must be null when mentioned is false")
    competitors = data.get("competitors")
    if not isinstance(competitors, list) or not all(isinstance(c, str) for c in competitors):
        raise ValueError("competitors must be a list of names")
    return data


def check_visibility(base_url, api_key, brand, question):
    """Ask the model `question`, tell it to answer ONLY with JSON in that shape about `brand`, and return validated data."""
    prompt = (
        f"{question}\n\n"
        f"Answer ONLY with JSON, no other text, in this shape: "
        f'{{"mentioned": true or false (is {brand} named in your answer?), '
        f'"position": its place in your list as a whole number, or null, '
        f'"competitors": [other names you listed]}}'
    )
    reply = ask(base_url, api_key, prompt)
    return validate_mention(parse_json_reply(extract_text(reply)))


if __name__ == "__main__":
    print("Run Check my work: this lesson talks to a pretend model on your own machine.")
