# AGENTS.md

## Cursor Cloud specific instructions

### Overview

TAPSS (Texas Association of Primary Science Students) is a **static front-end website** (HTML/CSS/vanilla JS). There is no build step, no package manager, and no server-side code.

### Running locally

Serve the project root with any static file server. See `README.md` "Run locally" section for commands. Example:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Key pages

- `index.html` — Homepage (hero, about, programs, team, impact, join)
- `science-blitz.html` — Science Blitz 3-minute quiz game with leaderboard
- `blitz-login.html` — Firebase Google sign-in (optional)

### Notes

- No linter, test framework, or build tool is configured in this repo. There is nothing to lint or build.
- Firebase integration is **optional** and requires manual setup — see `FIREBASE_SETUP.md`. The site works fully without it using localStorage for the leaderboard.
- Background theme preference (Black vs Galaxy) is saved to `localStorage` and persists across sessions.
- The Science Blitz quiz uses a 3-minute timer and stores encrypted player names in `localStorage`.
