set -e
git init --bare -b main origin.git
cd site
git init -b main
git config user.name "Build School"
git config user.email "student@build-school.local"
cp .env.example .env
git add .
git commit -m "Larkfield Coastal home page"
git remote add origin ../origin.git
git push -u origin main
git switch -c add-footer
sed -i 's|<!-- footer goes here -->|<footer>Larkfield Coastal, 2026</footer>|' index.html
git commit -am "Add a footer"
git push -u origin add-footer
git switch main
git merge --no-ff add-footer -m "Merge pull request: add footer"
git push origin main
git branch -d add-footer
