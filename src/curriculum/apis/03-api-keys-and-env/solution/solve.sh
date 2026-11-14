cp .env.example .env
printf '.env\n.env.*\n!.env.example\n__pycache__/\n' > .gitignore
