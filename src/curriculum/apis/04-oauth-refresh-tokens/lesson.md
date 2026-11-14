A simple API key is one string you send with every request. Google doesn't work like that. Search Console and Google Analytics act on your accounts and your data, so they use **OAuth 2.0**: instead of one permanent key, you hold a long-lived secret that can only *mint* short-lived passes. A site monitor does this dance every time it runs, which is why it can still read Search Console on a Tuesday after you authorised it months ago.

## The shape

Three credentials, three lifetimes:

| Thing | Lasts | Used for |
|---|---|---|
| **Client ID and secret** | forever | identify *your app* to Google |
| **Refresh token** | months, until revoked | get new access tokens |
| **Access token** | about an hour | sent with every API call |

You authorise once in a browser (a consent screen: "this app wants to read your Search Console"). Google hands back the refresh token. After that, no browser is needed. Your script trades the refresh token for an access token whenever it needs one.

## Refreshing

The refresh is one POST of **form data**, not JSON:

```python
response = requests.post(
    "https://oauth2.googleapis.com/token",
    data={
        "grant_type": "refresh_token",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN,
    },
    timeout=10,
)
body = response.json()
# {"access_token": "...", "expires_in": 3599, "token_type": "Bearer"}
```

Then every API call carries the access token:

```python
requests.get(url, headers={"Authorization": "Bearer " + access_token}, timeout=10)
```

The real Search Console and Google Analytics addresses look like `https://searchconsole.googleapis.com/...` and `https://analyticsdata.googleapis.com/...`. In this lesson the base address is a parameter, so the tests can aim you at a pretend Google on your own machine.

## Expiry

An access token stops working after `expires_in` seconds. Two ways to handle it:

1. **Before**: remember when it runs out (`clock() + expires_in`) and refresh a little early, say 60 seconds, so a token never dies mid-request.
2. **After**: if the API says `401`, refresh once and retry once. Not forever, since a 401 that survives a fresh token means something else is wrong, and an endless loop would hammer Google.

Good code does both. `clock` is passed in so the tests can move time forward without waiting an hour.

## Keeping them safe

All three of the client secret, the refresh token and an access token are secrets. The refresh token is the most dangerous, since it makes new access tokens until someone revokes it. They go in `.env` (the starter's `.gitignore` already covers it) and they're never printed, logged, or sent anywhere except Google's token endpoint. The refresh token never travels with an ordinary API call. If one leaks, revoke it in your Google account and authorise again.

> Google also supports **service accounts**: a JSON key file that signs its own tokens, no browser step. That's another way a monitor can authenticate. The refresh-and-expire pattern is the same.

## Your turn

Open `main.py`. It has four TODOs.

1. `refresh`: post the form, check for errors, store the new `access_token` and the time it expires.
2. `get_token`: return the cached token, and refresh first if there isn't one or it expires within 60 seconds.
3. `api_get`: call the API with the Bearer header. On a 401, refresh once and try again.
4. `from_env`: build a `TokenManager` from the three `GSC_` variables, with a clear error naming whichever one is missing.

Press Check my work. All the secrets in `tests.py` are obviously fake, and it uses a pretend Google.
