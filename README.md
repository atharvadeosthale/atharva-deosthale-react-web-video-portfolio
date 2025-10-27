## Atharva Deosthale — React & Web Video Portfolio

This is a dark, Linear-inspired portfolio and video library for Atharva Deosthale, a content creator focused on React and the modern web. Built end-to-end by [Teda.dev](https://teda.dev), the AI app builder for everyday problems, it includes a beautiful landing page and a functional application for browsing, searching, filtering, favoriting, and queuing videos.

### Features
- Landing page with a centered hero, clear value proposition, and strong CTAs
- Video library with search, tag filters, favorites, and a personal queue (saved in localStorage)
- Modal video player that supports deep links via `?v=video-id`
- Contact form with local draft saving
- Newsletter capture on the landing page (stored locally)
- Accessible, responsive design with WCAG-friendly color contrast

### Tech stack
- HTML5 + CSS3
- Tailwind CSS (via CDN Play) for utility-first styling
- jQuery 3.7.x for DOM interactions
- Modular JavaScript organized under `scripts/` with a single global namespace `window.App`

### File structure
- `index.html` — Landing page
- `app.html` — Main application (video library)
- `styles/main.css` — Global styles (no Tailwind directives here)
- `scripts/helpers.js` — Utilities, localStorage wrapper, sample data
- `scripts/ui.js` — App namespace, state, rendering and event bindings
- `scripts/main.js` — Entrypoint with safe initialization

### Data persistence
- Favorites: `localStorage["atharva:favorites"]`
- Queue: `localStorage["atharva:queue"]`
- Contact draft: `localStorage["atharva:contact-draft"]`
- Subscribers: `localStorage["atharva:subscribers"]`

All data is stored locally in the browser. No external servers are used.

### Getting started
Simply open `index.html` or `app.html` in a modern browser. No build step required.

### Accessibility
- Keyboard and screen-reader friendly controls
- Reduced motion respected via `prefers-reduced-motion`
- High-contrast, dark UI inspired by Linear

### Notes
- Thumbnails are sourced from YouTube for the example video IDs. Replace IDs in `scripts/helpers.js` to point to your real videos.
- If you open the app via `file://`, everything still works since no external JSON fetch is used.
