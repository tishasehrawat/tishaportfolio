# Tisha Sehrawat — Portfolio

A clean, multi-page portfolio for an aspiring physician-scientist: soft neumorphic surfaces, a clinical-teal accent with a touch of coral, Montserrat headings, Poppins body text and a Playball script logo. No frameworks or animation libraries.

## Run locally

Requires Node.js 20 or newer. No dependency installation is needed.

    npm run dev

Open the printed localhost URL (normally http://localhost:5173). The dev server renders pages on request and serves only application files and curated public assets; it never exposes `resources/`.

## Check and build

    npm run check     # syntax-checks every script
    npm run build     # writes all pages to dist/
    npm run preview   # serves dist/ locally

`vercel.json` sets the build command, the `dist/` output and `cleanUrls`, so `/research` serves `research.html`. These commands do not deploy anything.

## How the site is put together

- `src/layout.html` — the shared page shell: meta tags, icon sprite, header and navigation, mobile menu, footer.
- `src/pages/*.html` — one file per page: `home`, `about`, `education`, `research`, `clinical`, `projects`, `community`, `awards`, `contact`. Edit page content here.
- `scripts/site.mjs` — the page list (slug, nav label, title, description) and the renderer that wraps each page in the layout. Add a page by adding an entry here and a file in `src/pages/`.
- `scripts/art.mjs` — the teal line diagrams used where no photo exists. Insert one in a page with `{{art:helix}}`, `{{art:care}}`, `{{art:plastix}}`, `{{art:prion}}`, `{{art:triad}}`, `{{art:vision}}` or `{{art:dashboard}}`.
- `src/styles.css` — design tokens (colours, shadows, fonts) and all layout and component styles.
- `src/main.js` — small interactions: header shadow, mobile menu, fade-up reveal, back-to-top, awards filter, copy email, and redirects for old single-page links such as `/#project/care`.
- `public/` — fonts (SIL Open Font License, notices included), optimised WebP photos (project images are named `project-*.webp`), documents, favicon and the 1200×630 social card.

## Accessibility

Semantic headings on every page, a skip link, visible focus styles, a keyboard-trapped mobile menu that closes with Escape, and `prefers-reduced-motion` support (content appears without the fade-up).

## Content notes

`resources/` holds the original client materials and is ignored by Git. To publish a new asset, choose it deliberately, optimise it (for example `sips` → `cwebp`), and place it in `public/`. Never copy the whole folder into the site. Hospital photos were chosen so that no patients or screens are visible.

Diagrams are conceptual illustrations. Research results, prototype stages and the published patent application keep their stage notes; the 5hmC accuracy is described as a study-dataset result, not clinical validation. Contact links open an email client; there is no form backend.
