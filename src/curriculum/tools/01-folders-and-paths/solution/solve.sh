# What the answers look like. D is whatever `pwd` says plus the rest of the path.
sed -i "s|^D:.*|D: $PWD/projects/site-monitor/monitor.py|" paths.txt
