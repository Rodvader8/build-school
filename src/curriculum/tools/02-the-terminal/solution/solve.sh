set -e
mkdir -p archive/2026/reports
cp inbox/report-*.csv archive/2026/reports/
mkdir images
mv inbox/shot-*.png images/
mv inbox/notes.txt inbox/meeting-notes.txt
ls inbox/*.tmp
rm inbox/*.tmp
