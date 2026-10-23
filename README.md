# Tisha Sehrawat — Curiosity, in service of care

A cinematic, editorial portfolio for an aspiring physician, student researcher, and builder. Dark "clinical" chapters alternate with warm bone-paper chapters; motion is built on GSAP, ScrollTrigger, SplitText, and Lenis smooth scrolling, all self-hosted.

## Run locally

Requires Node.js 20 or newer. No dependency installation is needed.

    npm run dev

Open the printed localhost URL (normally http://localhost:5173). The development server serves only application files and curated public assets; it never exposes `resources/`.

## Check and build

    npm run check     # syntax-checks every script
    npm run build     # writes the production site to dist/
    npm run preview   # serves dist/ locally

`vercel.json` defines the build command and output directory for Vercel. These commands do not deploy anything.

## What's where

- `index.html` — page structure and copy: hero, recognition marquee, about, case files, journey, beyond the ward, recognition, contact.
- `src/data.js` — the six case files and three further threads (copy, stats, stage notes, links). Edit project content here.
- `src/main.js` — case-file rendering and their line-art "plates", the project drawer with `#project/<id>` deep links, header behaviour, mobile menu, and all motion choreography.
- `src/artwork.js` — the hero's procedural cell (a breathing dot-sphere that reacts to the cursor) and the bedside-monitor ECG trace. Both share a 72 BPM clock.
- `src/styles.css` — design tokens (`--ink`, `--bone`, `--mint`, `--coral`), dark/light chapter themes, layout, responsive and print rules.
- `public/vendor/` — GSAP 3.15 (ScrollTrigger, SplitText) under GreenSock's standard no-charge licence, and Lenis 1.3 (MIT).
- `public/fonts/` — Fraunces, Geist, and Geist Mono as variable WOFF2 files, under the SIL Open Font License (notices included).
- `public/images/` — curated, optimised WebP photos and the 1200×630 social preview card.

## Motion and accessibility

- The intro preloader plays once per browser session; later visits go straight to the hero animation.
- `prefers-reduced-motion` turns off the preloader, smooth scrolling, scroll choreography, and ambient loops; all content renders in its final state.
- The pause button in the header stops the cell, ECG, marquee, and CSS loops, and is remembered for the session.
- Case files pin into a horizontal rail on screens at least 1024 × 620 px and stack vertically elsewhere. Keyboard focus inside the rail scrolls the page to the focused card.
- The canvases pause when off screen or when the tab is hidden.

## Content notes

`resources/` holds the original client materials and is ignored by Git. To publish a new asset, choose it deliberately, optimise it (for example `sips` → `cwebp`), and place it in `public/`. Never copy the whole folder into the site. Hospital photos were chosen so that no patients or screens are visible.

Project illustrations are conceptual line art. Research results, prototype stages, and the published patent application are qualified in each case file's stage note. Contact links open an email client; there is no form backend.
