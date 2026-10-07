# Portfolio Redesign (Herbario) - Design

**Date:** 2026-10-06
**Status:** Approved in brainstorming, pending spec review
**Builds on:** `2026-06-15-bilingual-site-design.md` (implemented on `feature/bilingual-site`, superseded by this redesign)

## Goal

Revamp `www.aliciapaz.me` into a bilingual (ES default, EN under `/en/`) showcase of a connected
background: natural resources engineering, music, and software. The thread is nature, which runs
through all three fields. The site is phone first, light, and handmade in spirit.

## Decisions

| Question | Decision |
|----------|----------|
| Generator | Keep Jekyll + `jekyll-polyglot`, built and deployed by GitHub Actions |
| Starting point | `feature/redesign` branches from `feature/bilingual-site` and supersedes it (one merge to `main`) |
| Structure | Hybrid: homepage tells the connected story, links into discipline sections |
| Hero | Generative 2D canvas of growing roots / mycelium (no Three.js, no libraries) |
| Visual style | "Herbario": field notebook look, Salvia paper, sepia ink, gold accents |
| Dark mode | Automatic via `prefers-color-scheme` ("Noche"), no toggle |
| URLs | English paths for both languages (`/environment`, `/en/environment`) |
| Media | Plain links to Bandcamp, Spotify, YouTube, SoundCloud. No embedded players |
| Content | Written entirely by Alicia, both languages. Nothing is drafted for her |
| Footer | Contact icons only. No "hecho a mano por mí" line |

## Visual System

### Color tokens (CSS custom properties)

| Token | Salvia (light, default) | Noche (dark) |
|-------|-------------------------|--------------|
| `--paper` | `#eff1ea` | `#1a1f1a` (deep moss) |
| `--ink` | `#2e2219` | `#e6e9df` |
| `--label` | `#8a6a4c` | `#a9b59a` |
| `--rule` | `#d5dacb` | `#2c352c` |
| `--accent` | `#b07a2a` | `#d9ad55` |
| `--root` | sepia, about `rgb(115,78,46)` | gold, about `rgb(225,180,105)` |

Noche values are a starting point. They are previewed and approved before step 3 is considered done.

### Typography

- **Lora** (regular, italic, semibold): body text and headings. Name and page titles in italic.
- **IBM Plex Mono** (400, 500): labels, menu, language switcher, specimen tags (`02 · Música`).
- Loaded from Google Fonts with `display=swap` and serif / monospace fallbacks.

## Structure

### Pages (each in ES and EN)

| Path (ES) | Path (EN) | Notes |
|-----------|-----------|-------|
| `/` | `/en/` | Roots hero, intro, section links, map, all notes |
| `/environment` | `/en/environment` | Short intro + notes tagged `environment` |
| `/music` | `/en/music` | Existing texts, restyled |
| `/software` | `/en/software` | Existing texts, restyled (Alicia may update them) |
| `/about` | `/en/about` | Alicia rewrites to include the engineering degree |
| 404 | 404 | Restyled |

Menu labels are translated (`ambiente · música · software · sobre mí` / `environment · music · software · about`);
paths are shared.

### Removed (unused theme code)

- Blog: `menu/blog.md`, `archive` and `post` layouts, pagination, related posts, read time, post date,
  social sharing, Disqus (still pointing at the theme author's shortname).
- `jekyll-paginate` and `jekyll-feed`, `rss-feed.xml`.
- Google Analytics include (ID already empty).
- Font Awesome, replaced by inline SVG icons for email, LinkedIn, YouTube.
- All `_sass/` theme partials and `lagrange.gemspec` packaging (Gemfile lists dependencies directly).

Kept: `jekyll-polyglot`, `jekyll-sitemap`, `jekyll-seo-tag`, hreflang alternates, `CNAME`, `favicon.ico`,
`assets/img/io.jpg`.

### New files

- `_layouts/default.html`: document shell, top bar (name + ES | EN), footer icons.
- `_layouts/home.html`: hero, intro, cards. Reads text from `_data/home.yml`.
- `_layouts/page.html`: root strip, specimen label, italic title, body column, optional image.
- `_data/home.yml`: per-language roles line.
- `assets/css/main.scss`: one stylesheet with tokens, both color schemes, layout.
- `assets/js/roots.js`: the canvas, around 100 lines, no dependencies.

## Page Design

### Top bar and menu

- Top bar on every page: `alicia paz` (link home) on the left, `ES | EN` on the right, active language in `--accent`.
- Homepage navigation is the three cards. Inner pages show one row of monospace section links.
  It must fit on one line at 360px. No hamburger, no menu JS.

### Home

1. Hero: canvas about 55vh on phones (capped on desktop), name in italic Lora and roles line in mono overlaid at the bottom.
2. Intro: 2 to 3 sentences from `_data/home.yml`.
3. Cards `01 Ambiente`, `02 Música`, `03 Software`: hairline border in `--rule`, mono tag in `--accent`, title, one-liner.
4. Footer: inline SVG contact icons.

### Section pages

- Static root strip (about 80px) at the top, drawn by `roots.js` in a non-interactive mode.
- Specimen label, italic title, body in a column of about 34em max.
- External links as a list with mono labels. Open in a new tab with `rel="noopener"`.
- `about` shows `io.jpg`.

## Notes and Map

Supersedes the homepage cards. Content is a set of short notes, one file per language in `_notes/`
(`key`, `title`, `fields` from environment/music/software, `related` note keys, optional `link`, `lang`).
`key` is used because Jekyll reserves `id` on documents.

- Notes have no pages of their own (`output: false`). The homepage lists all of them; section pages
  (`field:` front matter) list only notes tagged with that field, below an optional intro.
- Each note shows its field tags and a "relacionado / related" line linking to `/#note-<key>`.
- **Map, phone and fallback:** a three-circle Venn rendered as SVG at build time (`_plugins/venn.rb` places
  titles in regions with word wrap). No JS. Titles link to their note.
- **Map, desktop** (`min-width: 60rem` and `pointer: fine`): `assets/js/notes-graph.js` replaces the Venn with a
  graph. Fields are fixed hubs; edges are note-field and note-note (`related`, dashed). Layout is computed up front
  with a small force simulation and drawn once (no animation). Hover highlights a node's edges.
- **Build check:** `_plugins/notes_check.rb` fails the build on an unknown field or `related` key.

## `roots.js` Behavior

- Draws on any `<canvas data-roots>`; mode `hero` (animated, interactive) or `strip` (static).
- Reads colors from computed CSS custom properties, and redraws on `prefers-color-scheme` change.
- Hero starts pre-grown (about 160 steps) so it is never empty, keeps growing slowly, caps live tips (about 450).
- Tap or click seeds new roots at that point. Never calls `preventDefault` on touch, so scrolling is unaffected.
- Pauses via `IntersectionObserver` when off screen and on `visibilitychange` when the tab is hidden.
- `prefers-reduced-motion: reduce`: draws one finished network, no animation loop.
- Device pixel ratio capped at 2. Resizes on container size change.
- Loaded with `defer`. Without JS or canvas, the hero is plain `--paper` with the name and roles, which is a complete design.

## Content Handoff

Alicia writes all text, in both languages. Implementation creates every page file with front matter and layout,
and an empty body marked with a comment: `<!-- ES: escribe aquí -->` / `<!-- EN: write here -->`.
`_data/home.yml` gets the same markers as values. A `grep -rn "escribe aquí\|write here"` lists everything left to write.

The redesign branch is not merged until no markers remain.

## Build Order and Verification

1. **Branch `feature/redesign` from `feature/bilingual-site`.** The bilingual branch is never merged on its own.
2. **Remove theme code.** Verify: `bundle exec jekyll build` succeeds with no missing include or layout errors.
3. **Layouts, stylesheet, tokens.** Verify with headless browser screenshots: every page, both languages,
   at 390px and 1280px wide, in light and dark scheme. Noche colors approved by Alicia.
4. **`roots.js`.** Verify: animation pauses off screen; reduced motion renders static; JS disabled still looks complete;
   no long frames under 4x CPU throttling on the 390px viewport; page still scrolls when the gesture starts on the hero.
5. **Page skeletons and `_data/home.yml` with markers.** Verify: the grep lists every expected marker, and the site builds.
6. **Alicia writes content.** Then: full screenshot pass of all pages, markers grep returns nothing, merge to `main`.
   At merge, Alicia sets Settings → Pages → Source → "GitHub Actions". Verify: live site serves `/` (ES) and `/en/` (EN).

## Out of Scope

- Three.js or any 3D. A later data or music visualization may use it once there is content to justify it.
- Blog, comments, analytics, newsletter.
- Embedded third-party players.
- Dark mode toggle.
- Showing the Telos agroecology apps (client permission unknown). The open-source app is added as a featured
  project on `/environment` after it launches, in a separate change.

## Risks

- **Polyglot and `_data` per language:** `site.active_lang` lookup into `_data/home.yml` follows the pattern already
  used by `_data/translations.yml` on the bilingual branch, so low risk.
- **Pages source flip is manual.** Until Alicia changes it, merges to `main` will not reach the live site.
- **Content is the critical path.** The redesign is invisible until the texts are written. No deadline is assumed.
