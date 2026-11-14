set -e
cd site
git init -b main
git config user.name "Build School"
git config user.email "student@build-school.local"
cp .env.example .env
printf '.env\n.env.*\n!.env.example\n' > .gitignore
git add .
git diff --cached --stat
git commit -m "First version of the page"
git switch -c nav-links
sed -i 's|<!-- nav goes here -->|<nav><a href="/">Home</a> <a href="/work">Work</a></nav>|' index.html
git commit -am "Add a nav"
git switch main
sed -i 's|#7c5cff|#00b3d9|' style.css
git commit -am "Change the accent colour"
git merge nav-links -m "Merge nav-links"
