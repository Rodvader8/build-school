Typing is the slow part of coding. The people who look fast in VS Code aren't typing quicker, they're editing in bulk: five cursors at once, one rename that fixes every call, a search that finds a line across a whole project. The editor in this app is Monaco, the same engine that runs inside VS Code, so these keys work here and carry straight over to real VS Code.

## Multiple cursors

One edit, many places.

- **Ctrl+D** selects the word under the cursor. Press it again to add the next match as a second cursor, and again for a third.
- **Ctrl+Shift+L** selects every match in the file at once.
- **Shift+Alt+drag** makes a column of cursors, one per line. Perfect for wrapping a list of names in quotes.
- **Alt+click** adds a cursor wherever you click. If your desktop grabs Alt+click to drag windows, use Ctrl+D instead.

Type with several cursors and every one of them types. Press Esc to go back to one.

## Find and replace

**Ctrl+F** finds, **Ctrl+H** replaces. Both work on the file you're in. The icons beside the search box switch on case matching and regular expressions, which is how you'd rewrite a hundred lines of similar text in one go.

## Rename symbol

Click on a function or variable and press **F2**. Type the new name, press Enter, and every use in the file changes, and nothing else. It's smarter than find and replace: renaming `url` won't touch the word "url" inside a comment or a string. In this app it works in JavaScript files.

## Move, copy and comment lines

- **Alt+Up / Alt+Down** moves the current line (or everything selected).
- **Shift+Alt+Down** duplicates the line.
- **Ctrl+Shift+K** deletes the line.
- **Ctrl+/** comments or uncomments it. Great for switching a debug line off without losing it.

## The command palette

**F1** opens a search box over every command the editor has. If you can't remember a shortcut, type what you want ("sort lines", "change language") and run it from there. In real VS Code the same palette is **Ctrl+Shift+P**.

## What only real VS Code has

Monaco is the editor, not the whole workbench. In real VS Code (open any lesson folder in it, they're plain folders under `workspace/`) you also get:

- **Ctrl+P**: jump to any file by typing part of its name.
- **Ctrl+Shift+F**: search across every file in the project. This is the one you'll use most on a big site.
- **Ctrl+click** on a name to jump to where it's defined.

> Your desktop can steal shortcuts too. On Ubuntu, GNOME grabs **Shift+Ctrl+S** (screenshot), **Shift+Ctrl+W** (window screenshot) and **Shift+Ctrl+R** (screen recording) before VS Code ever sees them. For Save As, use the command palette instead. If any shortcut here doesn't fire, check File > Preferences > Keyboard Shortcuts in VS Code to see what it's really bound to.

## Your turn

Open `monitor.js`. It has five jobs, marked TODO. Try to do each with a shortcut, not by retyping.

1. Turn the five bare site names into quoted strings ending in commas, using a column of cursors.
2. Change every `http:` to `https:`, using Ctrl+D or find and replace.
3. Put your cursor on `chk` and rename it to `checkSite` with F2.
4. Comment out the DEBUG line with Ctrl+/.
5. Select the `const TIMEOUT_MS` line and move it above the function with Alt+Up.

Your files save as you go. Press Check my work and it runs `monitor.js` for you.
