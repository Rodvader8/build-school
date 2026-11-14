# My review of other.patch

praise: is_admin has a docstring that says what "admin" means, and the change is small enough to review in a minute.

blocking: is_admin returns True when anything goes wrong, so a malformed or missing profile makes the user an admin. A permission check should fail closed. Catch KeyError and TypeError and return False, and add a test with a user that has no role.

nit: ttl(x) doesn't say what x is. Something like ttl_seconds(hours) would save the next reader a look at the body.
