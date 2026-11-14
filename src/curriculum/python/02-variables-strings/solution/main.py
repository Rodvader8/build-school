# Lesson 2: variables, strings and f-strings.
name = input("What's your name? ")
print(f"G'day, {name}!")

firm = "Larkfield Private Wealth"
fee = 13200
clients = 120
clients = clients + 1

print(f"{firm} looks after {clients} families.")
print(f"The Private plan is ${fee:,} a year.")
print(firm.upper())
