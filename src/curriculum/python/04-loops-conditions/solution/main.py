# Lesson 4: loops and conditions.

bookings = [
    {"guest": "M. Okafor", "room": "Ocean Room", "nights": 3, "rate": 520},
    {"guest": "J. Lindqvist", "room": "Garden Room", "nights": 2, "rate": 380},
    {"guest": "A. Nguyen", "room": "Cliff Suite", "nights": 5, "rate": 760},
    {"guest": "R. Patel", "room": "Ocean Room", "nights": 1, "rate": 520},
]

total = 0
for booking in bookings:
    amount = booking["nights"] * booking["rate"]
    total += amount
    if booking["nights"] >= 5:
        label = "long stay"
    elif booking["nights"] == 1:
        label = "one night"
    else:
        label = "short stay"
    print(f"{booking['guest']}: ${amount:,} ({label})")

print(f"Total: ${total:,}")

ocean = [b["guest"] for b in bookings if b["room"] == "Ocean Room"]
print(ocean)
