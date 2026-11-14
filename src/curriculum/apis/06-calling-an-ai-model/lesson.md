An AI-visibility tracker asks models a question, such as "who are the best web designers in Riverton?", and records whether a brand is named and where. The hard part isn't the call. It's that a model replies with *words*, and your code needs *data*. This lesson is how you get from one to the other without trusting it blindly.

The shape here is the Anthropic Messages API. OpenAI and Perplexity use a close cousin: the same idea, slightly different field names.

## The request

One POST to `https://api.anthropic.com/v1/messages`. The headers carry your key, and the body carries the conversation:

```python
requests.post(
    "https://api.anthropic.com/v1/messages",
    headers={
        "x-api-key": key,                  # from .env, never typed in
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    },
    json={
        "model": "the-model-id",           # check the provider's docs for the current names
        "max_tokens": 512,                 # a hard cap on the reply's length, and required
        "messages": [{"role": "user", "content": "Your question"}],
    },
    timeout=60,
)
```

An optional `system` field sets the model's role ("you're a careful analyst"). The model name isn't hard-coded in your code: it goes in `.env` as `AI_MODEL`, because models get retired and renamed.

## The response

```json
{
  "id": "msg_...",
  "role": "assistant",
  "content": [{"type": "text", "text": "Here's my answer..."}],
  "stop_reason": "end_turn",
  "usage": {"input_tokens": 25, "output_tokens": 40}
}
```

Two things trip people up. **`content` is a list of blocks**, not a string, so join the text ones. And check **`stop_reason`**: `"max_tokens"` means the reply hit your cap mid-sentence. Cut-off JSON is broken JSON.

## Getting JSON out

Ask for it plainly: "Answer ONLY with JSON in this shape: ...". Models usually obey, but not always. Sometimes you get a friendly line first, or the JSON arrives inside a `json` code fence. So:

1. **Extract** the text.
2. **Find** the JSON: everything from the first `{` to the last `}`.
3. **Parse** it with `json.loads`.
4. **Validate** it. Check every field exists and has the right type, and give a precise error when it doesn't.

Step 4 is the one people skip. A model that returns `"position": "second"` instead of `2` will crash your report three steps later, or worse, write nonsense into it without complaining. Treat model output like any untrusted input from the outside.

> Calls cost money and take seconds. In real use you'd also add the retry logic from the last lesson (429s are common) and keep a log of what you asked and got back. Never log the key.

## Your turn

The tests use a pretend model on your own machine and the key `test-key-not-real`, so nothing leaves your laptop. To go live later, put a real key in `.env` as `AI_API_KEY` and pass the real base address. The code doesn't change.

Open `main.py` and fill in the TODOs in order:

1. `build_request` and `ask`.
2. `extract_text` (and refuse a cut-off reply).
3. `parse_json_reply` and `validate_mention`.
4. `check_visibility`, which strings them all together.

Press Check my work as you go. The test names say exactly what's missing.
