---
name: animation-setup
description: Use when the user wants to set up, install, check or repair the Animation Studio (e.g. "set up the animation studio", "install everything", "check my setup", "it says ffmpeg is missing"), and automatically before the first 2D Vintage, 2D Modern, Vox Style, Cozy Sticker or Stick Story video on a new computer. Installs and verifies Node.js, Python, ffmpeg and the Python packages.
---

# Animation Studio setup

The plugin root is two folders up from this skill's base directory. Call it `<plugin>`. Its tools live in `<plugin>/tools`.

## 1. Check
Run `python <plugin>/tools/doctor.py` (on Windows try `py` if `python` isn't found). It prints OK / MISSING for Node.js 18+, npm, Python 3.10+, ffmpeg and the Python packages (numpy, scipy, pillow, edge-tts, faster-whisper), plus the command that fixes each one.

If everything is OK, say so in one line and continue with whatever the user asked for.

## 2. Install what's missing
Tell the user in one short list what you're about to install, then install it:
- **Windows** (winget, already on Windows 10/11): `winget install -e --id OpenJS.NodeJS.LTS`, `winget install -e --id Python.Python.3.12`, `winget install -e --id Gyan.FFmpeg`. Add `--accept-source-agreements --accept-package-agreements` only after the user has agreed to install. After winget, refresh PATH in the same PowerShell session:
  `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`
- **Mac** (Homebrew): `brew install node python@3.12 ffmpeg`. If `brew` is missing, ask the user to install it from brew.sh first (it needs their password, so they must run it themselves).
- **Linux:** `sudo apt install nodejs npm python3-pip ffmpeg` (the user runs sudo commands themselves).
- **Python packages:** `python -m pip install -r <plugin>/tools/requirements.txt`.

Run `doctor.py` again until everything shows OK.

## 3. Notes
- The browser that renders the cartoon style (Playwright Chromium) and the Remotion renderer for the Vox style are installed per project by those skills (`npx playwright install chromium`, Remotion downloads its own headless Chrome on the first render).
- If `npx playwright install chromium` freezes while unpacking on Windows (it can stall on chromium, headless shell or its small ffmpeg download), stop it. For each folder in `%LOCALAPPDATA%\ms-playwright` that is incomplete, extract the matching zip from `%TEMP%\playwright-download-*` with `tar -xf` into it if its files are missing, then create an empty `INSTALLATION_COMPLETE` file in it. Delete the leftover `%LOCALAPPDATA%\ms-playwright\__dirlock` folder.
- npm 11+ may warn that install scripts were skipped (e.g. `esbuild`). That's harmless here: Remotion bundles fine without it. Only if bundling fails with an esbuild error, run `npm install-scripts approve esbuild` and `npm install` again.
- Never kill all Chrome processes to clean up (that closes the user's own browser). Only stop processes whose path is under `ms-playwright` or `.remotion`.
- The first Whisper run downloads its speech model (about 500 MB for `small.en`), so it takes longer once.
