# TAPSS — Texas Association of Primary Science Students

Student-led nonprofit website for the **Texas Association of Primary Science Students**, promoting scientific curiosity, innovation, and community impact.

## Features

- **Home page:** Hero, About, Programs, Team, Impact, Science Blitz CTA, home leaderboard preview, Join, Discord, New Members
- **Science Blitz:** Dedicated competition page — 3-minute science quiz, name-only entry, encrypted leaderboard, gift card prize
- **Background switcher:** Toggle between Black and Galaxy (milky way) backgrounds; choice saved in browser
- **Scroll effects:** Animated stars and asteroids with parallax while scrolling
- **Responsive:** Mobile-friendly layout and navigation

## Run locally

1. Clone the repo: `git clone https://github.com/anikethadapa24-crypto/TAPSS.git`
2. Open `index.html` in a browser, or use a local server:
   - **Python:** `python -m http.server 8000` then visit http://localhost:8000
   - **Node:** `npx serve .` then open the URL shown

## Deploy (e.g. GitHub Pages)

1. In the repo: **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **master** (or **main**), folder: **/ (root)**
4. Save. The site will be at `https://anikethadapa24-crypto.github.io/TAPSS/`

## Project structure

- `index.html` — Main site (home, about, programs, team, impact, blitz CTA, join)
- `science-blitz.html` — Science Blitz game and full leaderboard
- `styles.css` — Site styles
- `script.js` — Nav, background switcher, stars/asteroids, hero typing, counters
- `science-blitz.js` — Blitz quiz logic
- `blitz-competition.js` — Leaderboard (name entry, encrypted names, localStorage)
- `blitz-home-leaderboard.js` — Home page leaderboard preview
- `assets/` — Images (logo, team photos, milky-way background)

## License

© 2026 Texas Association of Primary Science Students.
