# Lesson 3: lists and dictionaries.

rooms = ["Garden Room", "Ocean Room"]
rooms.append("Cliff Suite")
print(len(rooms))
print(rooms[0])
print(rooms[-1])

rates = {"Garden Room": 380, "Ocean Room": 520, "Cliff Suite": 760}
print(rates["Ocean Room"])
rates["Garden Room"] = 400
print(rates)

booking = {"guest": "M. Okafor", "room": "Ocean Room", "nights": 3}
print(f"{booking['guest']} owes ${booking['nights'] * rates[booking['room']]:,}")
