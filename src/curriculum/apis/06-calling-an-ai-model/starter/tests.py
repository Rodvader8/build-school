# tests.py: Check my work runs this file. It starts a pretend model API on your own machine
# (no internet, no real key, no cost) that answers in the same shape as the Anthropic
# Messages API. Read it, but don't change it.
import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import requests

try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)

KEY = "test-key-not-real"
GOOD = {"mentioned": True, "position": 2, "competitors": ["Acme Web", "Pixel Co"]}
seen = []  # (headers, body) for every request


def message(text, stop_reason="end_turn", extra_blocks=()):
    return {
        "id": "msg_test_1",
        "type": "message",
        "role": "assistant",
        "model": "test-model",
        "content": [*extra_blocks, {"type": "text", "text": text}],
        "stop_reason": stop_reason,
        "usage": {"input_tokens": 25, "output_tokens": 40},
    }


class Pretend(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reply(self, status, body):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
        seen.append((dict(self.headers), body))
        if self.path != "/v1/messages":
            return self.reply(404, {"type": "error", "error": {"type": "not_found_error"}})
        if self.headers.get("x-api-key") != KEY:
            return self.reply(401, {"type": "error", "error": {"type": "authentication_error", "message": "invalid x-api-key"}})
        if not self.headers.get("anthropic-version") or not body.get("model") or not isinstance(body.get("max_tokens"), int):
            return self.reply(400, {"type": "error", "error": {"type": "invalid_request_error"}})
        prompt = body["messages"][-1]["content"]
        if "[FENCE]" in prompt:
            return self.reply(200, message("Sure! Here you go:\n```json\n" + json.dumps(GOOD) + "\n```\nHope that helps."))
        if "[BAD]" in prompt:
            return self.reply(200, message(json.dumps({"mentioned": "yes", "position": 0})))
        if "[CUT]" in prompt:
            return self.reply(200, message('{"mentioned": tr', stop_reason="max_tokens"))
        self.reply(200, message(json.dumps(GOOD)))


server = HTTPServer(("127.0.0.1", 0), Pretend)
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_address[1]}"


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


def raises(fn, *args, kind=ValueError, mention=None):
    try:
        fn(*args)
    except kind as error:
        return mention is None or mention in str(error)
    return False


check("build_request has model, max_tokens and messages", lambda: main.build_request("Hi", "test-model", 100) == {"model": "test-model", "max_tokens": 100, "messages": [{"role": "user", "content": "Hi"}]})
check("a system prompt is added only when given", lambda: main.build_request("Hi", "m", 5, system="Be brief.")["system"] == "Be brief." and "system" not in main.build_request("Hi", "m", 5))

reply = None
try:
    reply = main.ask(base, KEY, "Hello", "test-model", 64)
except Exception as error:
    print(f"  (ask raised {error!r})")
check("ask sends the key and version headers and returns the response", lambda: reply and reply["content"][0]["text"] and seen[-1][0].get("x-api-key") == KEY and seen[-1][0].get("anthropic-version") == "2023-06-01" and seen[-1][1]["messages"][0]["content"] == "Hello")
check("a wrong key raises an HTTP error", lambda: raises(main.ask, base, "test-wrong-key", "Hello", kind=requests.HTTPError))
check("extract_text joins the text blocks and skips the rest", lambda: main.extract_text({"stop_reason": "end_turn", "content": [{"type": "tool_use", "id": "x"}, {"type": "text", "text": "Hello, "}, {"type": "text", "text": "Sam"}]}) == "Hello, Sam")
check("extract_text refuses a reply that was cut off", lambda: raises(main.extract_text, message("{", stop_reason="max_tokens"), mention="max_tokens"))
check("parse_json_reply handles plain, fenced and chatty replies", lambda: main.parse_json_reply('{"a": 1}') == {"a": 1} and main.parse_json_reply('```json\n{"a": 1}\n```') == {"a": 1} and main.parse_json_reply('Sure! {"a": {"b": 2}} Done.') == {"a": {"b": 2}})
check("parse_json_reply raises ValueError on rubbish", lambda: raises(main.parse_json_reply, "I can't answer that.") and raises(main.parse_json_reply, '{"a": '))
check("validate_mention accepts good data", lambda: main.validate_mention(dict(GOOD)) == GOOD and main.validate_mention({"mentioned": False, "position": None, "competitors": []}))
bads = [
    ({"position": 1, "competitors": []}, "mentioned"),
    ({"mentioned": "yes", "position": 1, "competitors": []}, "mentioned"),
    ({"mentioned": True, "position": 0, "competitors": []}, "position"),
    ({"mentioned": True, "position": True, "competitors": []}, "position"),
    ({"mentioned": False, "position": 3, "competitors": []}, "position"),
    ({"mentioned": True, "position": 1, "competitors": "Acme"}, "competitors"),
    ({"mentioned": True, "position": 1, "competitors": [1, 2]}, "competitors"),
]
check("validate_mention rejects bad shapes and names the field", lambda: all(raises(main.validate_mention, d, mention=field) for d, field in bads))


def full(question):
    return main.check_visibility(base, KEY, "Larkfield Studio", question)


check("check_visibility returns validated data", lambda: full("Who are the best web designers in Riverton?") == GOOD)
sent = seen[-1][1]["messages"][0]["content"] if seen else ""
check("the prompt names the brand, the question and asks for JSON", lambda: "Larkfield Studio" in sent and "best web designers" in sent and "JSON" in sent)
check("it copes with a fenced, chatty reply", lambda: full("[FENCE] Who is best?") == GOOD)
check("it rejects a reply with the wrong shape", lambda: raises(full, "[BAD] Who is best?"))
check("it rejects a reply that was cut off", lambda: raises(full, "[CUT] Who is best?", mention="max_tokens"))
server.shutdown()
