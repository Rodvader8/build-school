A site monitor that checks a dozen websites every hour. A nightly digest that lands in your inbox at 07:30. A backup at 2am. None of these should need you to remember to press a button. On Linux there are two standard ways to say "run this on a schedule": **cron** (old, tiny, everywhere) and **systemd timers** (newer, with better logging and catch-up).

## cron

You list jobs in a file called a crontab. Each job is a line with five time fields, then the command:

```
# m   h   dom mon dow   command
30    7   *   *   *     /opt/tools/digest.sh
```

Read the fields as minute (0-59), hour (0-23), day of month (1-31), month (1-12) and day of week (0-6, Sunday is 0). A `*` means "every". A few patterns cover nearly everything:

| Written | Means |
|---|---|
| `*/15 * * * *` | every 15 minutes |
| `0 * * * *` | on the hour, every hour |
| `0 9 * * 1-5` | 09:00, Monday to Friday |
| `0 6,18 * * *` | 06:00 and 18:00 |

Three traps catch everyone once:

- **Use full paths.** cron doesn't load your usual shell setup, so `digest.sh` alone won't be found. Write `/opt/tools/digest.sh`.
- **Escape every `%`.** In a crontab a bare `%` means "end of command, the rest is input". So `date +%F` silently breaks. Write `date +\%F`.
- **Capture the output.** Add `>> /var/log/job.log 2>&1` so you can see what happened when it ran at 3am.

## systemd timers

A timer is two small files. The **service** says what to run, the **timer** says when:

```ini
# digest.service
[Unit]
Description=Send the nightly digest

[Service]
Type=oneshot
ExecStart=/opt/tools/digest.sh
```

```ini
# digest.timer
[Unit]
Description=Run the digest every morning

[Timer]
OnCalendar=*-*-* 07:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

`Type=oneshot` means "run once and finish". `Persistent=true` means that if the machine was off at 07:30, the job runs when it next boots instead of being skipped. Logs go to `journalctl -u digest.service`.

## Installing (don't do it in this lesson)

On a real server you'd run `crontab -e` and paste your lines in, or copy the unit files into `~/.config/systemd/user/` and run `systemctl --user enable --now digest.timer`. This lesson's checks only read the files in this folder. They never touch your real crontab or systemd, and neither should you while you're practising.

## Your turn

1. In `crontab.txt`, fix the digest line (it has the fields in the wrong order) and write the other three jobs described in the comments. Escape the `%`.
2. In `digest.service`, make it a oneshot that runs `/opt/tools/digest.sh`.
3. In `digest.timer`, fire at 07:30 every day, catch up after downtime, and make it installable under `timers.target`.

> If you're ever unsure what a schedule means, paste it into a cron explainer site before you trust it with a backup.
