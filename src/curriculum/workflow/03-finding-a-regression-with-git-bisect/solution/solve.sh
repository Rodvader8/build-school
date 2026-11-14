set -e
cd app
git bisect start
git bisect bad HEAD
git bisect good v1.0
git bisect run python3 test_slugify.py
git bisect log > ../bisect.log
git rev-parse refs/bisect/bad > ../answer.txt
git bisect reset
sed -i 's|\[^a-z0-9\]"|[^a-z0-9]+"|' slugify.py
git commit -qam "Fix slugify: collapse runs of separators again"
