# tests.py: Check my work runs this file. Read it to see exactly what is tested,
# but don't change it.
try:
    import main
except Exception as error:
    print("Could not load main.py:", repr(error))
    raise SystemExit(1)


def check(name, test):
    try:
        ok = bool(test())
    except Exception as error:
        print(f"  ({name} raised {error!r})")
        ok = False
    print(("PASS " if ok else "FAIL ") + name)


check("format_money", lambda: main.format_money(13200) == "$13,200" and main.format_money(380) == "$380")
check("with_gst", lambda: main.with_gst(4400) == 4840 and main.with_gst(3) == 3)
check("nights_label", lambda: [main.nights_label(n) for n in (1, 2, 4, 5, 9)] == ["one night", "short stay", "short stay", "long stay", "long stay"])
check("booking_total default", lambda: main.booking_total(3, 520) == 1560)
check("booking_total gst", lambda: main.booking_total(3, 520, gst=True) == 1716)
check("main guard", lambda: "if __name__" in open("main.py").read())
