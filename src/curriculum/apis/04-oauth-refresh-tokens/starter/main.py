"""The OAuth refresh-token dance that Search Console and GA4 use, in miniature."""
import os
import time

import requests


class TokenManager:
    """Hands out a valid access token, refreshing it when it's about to expire.

    Real Google: POST https://oauth2.googleapis.com/token  (form data, not JSON)
    Here: POST {base_url}/token
    """

    def __init__(self, base_url, client_id, client_secret, refresh_token, clock=time.time):
        self.base_url = base_url
        self.client_id = client_id
        self.client_secret = client_secret
        self.refresh_token = refresh_token
        self.clock = clock  # tests pass a fake clock so they don't have to wait an hour
        self.access_token = None
        self.expires_at = 0

    def refresh(self):
        """Swap the refresh token for a new access token. The answer has "access_token" and "expires_in" (seconds)."""
        # TODO 1: requests.post(f"{self.base_url}/token", data={...}, timeout=10)
        # data = grant_type="refresh_token", client_id, client_secret, refresh_token
        # raise_for_status(), then remember the token and when it runs out: self.clock() + expires_in
        raise NotImplementedError

    def get_token(self):
        """The cached token, unless there isn't one or it runs out within the next 60 seconds."""
        # TODO 2
        raise NotImplementedError


def api_get(manager, base_url, path, params=None):
    """GET with "Authorization: Bearer <access token>". If the API answers 401, refresh once and try again."""
    # TODO 3
    raise NotImplementedError


def from_env(base_url):
    """Build a TokenManager from GSC_CLIENT_ID, GSC_CLIENT_SECRET and GSC_REFRESH_TOKEN.
    A missing one raises RuntimeError naming the variable."""
    # TODO 4
    raise NotImplementedError


if __name__ == "__main__":
    print("Run Check my work: this lesson talks to a pretend Google on your own machine.")
