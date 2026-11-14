set -e
cd tool
npm init -y
npm install ./packages/slug-lite
npm pkg set scripts.slugs="node slugs.js"
npm run slugs
printf 'node_modules/\n.env\n.env.*\n!.env.example\n' > .gitignore
