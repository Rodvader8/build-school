#!/usr/bin/env bash
# Print "Hello, " followed by the NAME environment variable.
# If NAME isn't set, print "Hello, world".
echo "Hello, ${NAME:-world}"
