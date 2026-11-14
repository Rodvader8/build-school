# Python playground. Press Run.

name = input("What's your name? ")
print(f"G'day, {name}!")

services = ["Websites", "Dashboards", "AI search"]
for number, service in enumerate(services, start=1):
    print(f"{number}. {service}")
