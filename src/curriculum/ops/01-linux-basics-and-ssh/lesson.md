Sooner or later the thing you built has to run somewhere that isn't your laptop: a small rented server, a spare machine at home, a box that checks websites while you sleep. Almost all of them run Linux, and you reach them with ssh. This lesson is the survival kit, and everything here is safe to try on your own machine.

## Permissions

Every file has three sets of permissions (owner, group, everyone else), each made of read, write and execute. `ls -l` shows them:

```bash
ls -l hello.sh
# -rw-rw-r-- 1 you you 24 hello.sh
```

The first column reads as `-` (a file), then `rw-` (owner), `rw-` (group), `r--` (everyone). Numbers are shorthand: r is 4, w is 2, x is 1, and you add them up. `rw-` is 6, `r-x` is 5, `r--` is 4. So `644` is `rw-r--r--`, and `600` means only the owner can touch the file.

```bash
chmod +x hello.sh     # add the execute bit
chmod 600 .env        # owner read and write, nobody else
./hello.sh            # now it runs
```

Secrets files should always be `600`. A shared server often has other users on it.

## Processes and environment variables

A running program is a **process**, with a number (its PID). `ps` lists yours, `top` shows them live, `kill 1234` asks one to stop.

An **environment variable** is a named value handed to a program when it starts. It's how you give a job its settings without writing them into the code:

```bash
NAME=Sam bash run.sh      # only for this one run
export NAME=Sam           # for everything you start from this shell
echo "${NAME:-world}"     # NAME, or "world" if it isn't set
```

## ssh

`ssh deploy@203.0.113.10` logs you in to another machine, running a shell over an encrypted connection. Instead of a password you use a **key pair**: a private key that stays on your laptop (`~/.ssh/id_ed25519`) and a public one (`.pub`) that you put on the server. Create one with `ssh-keygen -t ed25519`.

The private key is a secret like any other. It never goes in a Git repo, a chat, or a lesson folder.

To stop typing the long form, write a block in `~/.ssh/config`:

```
Host webserver
    HostName 203.0.113.10
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

After that, `ssh webserver` is all you need. (203.0.113.x is a range reserved for examples, so it never points at a real machine.) In this lesson you'll write the block in a practice file called `ssh_config` and inspect it with `ssh -G -F ssh_config webserver`, which prints the settings and never connects anywhere.

## Private access

You don't have to open a port to the whole internet to reach a home server. A tool like Tailscale puts your devices on a private network, so `ssh webserver` works from anywhere while the machine stays invisible to everyone else. Worth knowing it exists before you ever expose a port.

## Your turn

Work in the terminal panel, in this lesson's folder. The questions are in `steps.txt`.

1. Make `hello.sh` runnable with `chmod`, then run it.
2. Copy `.env.example` to `.env`, then lock it down with `chmod 600 .env`. Add `.env` to `.gitignore`.
3. Fill in `run.sh` so it prints `Hello, ` and the `NAME` variable, or `world` when it isn't set.
4. Answer the questions at the bottom of `steps.txt`.
5. Fill in the `webserver` block in `ssh_config`, then try `ssh -G -F ssh_config webserver`.

> Run `ls -l` often. Seeing the permissions change is how it sticks.
