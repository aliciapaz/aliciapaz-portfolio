# Music Commissions Portfolio (Stage) - Design

**Date:** 2026-10-13
**Status:** Approved in brainstorming, pending spec review
**Supersedes:** `2026-10-06-portfolio-redesign-design.md` (Herbario). Infrastructure decisions from that spec
(Jekyll, polyglot, GitHub Actions, theme removal) still hold; its structure, visual system, notes and roots do not.

## Why the change

The Herbario build reads as a personal site: a connected story across three fields, a generative hero, short notes
and a Venn map. A portfolio is built for one reader and shows evidence for that reader. The reader is now chosen:
someone commissioning music.

## Decisions

| Question | Decision |
|----------|----------|
| Audience | Clients commissioning music |
| Offer | Original composition and sound design (for dance, theater and other commissions) |
| Software and environment | Background in About only, with links. No sections of their own |
| Own music (Annarresti, experiments) | Small "Proyectos propios" block on the homepage |
| Work presentation | One page per work |
| Evidence | Self-hosted audio excerpts for every work; video only where it can be shared |
| Visual direction | "Stage": dark only, imagery carries the page, one warm accent |
| Display type | Fraunces (300 at 26px and up, 400 below) |
| Contact | `mailto:` link with a prefilled subject, address also shown as text |
| URLs | Shared English paths: `/works/<slug>`, `/en/works/<slug>` |
| Branch | Continue on `feature/redesign` |

## Structure

| Path (ES) | Path (EN) | Content |
|-----------|-----------|---------|
| `/` | `/en/` | Offer line, "Escríbeme" button, all works as stacked cards, Proyectos propios, footer |
| `/works/<slug>` | `/en/works/<slug>` | One work |
| `/about` | `/en/about` | Composer bio first, then the engineering and software background, talks and other work as links |
| 404 | 404 | Restyled |

Navigation: `obras · sobre mí · contacto` / `works · about · contact`. "obras" links to the works on the homepage
(`/#obras`); "contacto" is the `mailto:` link.

### Removed

- `_notes/` and the `notes` collection, `_plugins/venn.rb`, `_plugins/notes_check.rb`, `_includes/venn.html`,
  `_includes/notes-list.html`, `assets/js/notes-graph.js`. Notes are discarded, not migrated.
- `assets/js/roots.js` and every canvas.
- `menu/territorio*.md`, `menu/software*.md`, `menu/music*.md`, `_includes/sections-nav.html`.
- The `prefers-color-scheme` light/dark split.
- `related` and `map_label` keys in `_data/translations.yml`.

The current `/music` bio text is moved into `menu/about.md` / `menu/about-en.md` as Alicia's draft before
`menu/music*.md` is deleted.

### Kept

`jekyll-polyglot`, `jekyll-sitemap`, `jekyll-seo-tag`, hreflang alternates, GitHub Actions deploy, `CNAME`,
`favicon.ico`, `assets/img/io.jpg`, the content-marker convention.

## Content Model

New collection `works` (`output: true`, `permalink: /works/:slug`), one file per language:
`_works/<slug>.md` (`lang: es`) and `_works/<slug>-en.md` (`lang: en`, same `permalink`).

```yaml
title: "..."
order: 1                  # homepage order
year: 2024
discipline: "Danza"       # shown as the accent tag
for: "Compañía, ciudad"   # who commissioned it
role: "Composición y diseño sonoro"
duration: "12 min"        # optional
cover: works/<slug>/cover.jpg
cover_alt: "..."
audio: works/<slug>/excerpt.mp3
audio_label: "Fragmento, 3 min"
video: https://vimeo.com/...   # optional, only if shareable
photos:                         # optional
  - { src: works/<slug>/1.jpg, alt: "...", credit: "..." }
credits: "Coreografía: ... · Intérpretes: ... · Foto: ..."
lang: es
```

Body: Alicia's text about the piece.

Media files live in `assets/works/<slug>/`. Audio is MP3, about 3 MB per excerpt. Images are JPEG plus WebP at
two widths (800, 1600).

`_data/home.yml` per language: `offer` (the offer line), `own_projects` (2 to 3 rows of `title`, `note`, `url`).
`_data/settings.yml` holds the contact email and the prefilled subject per language.

## Visual System

| Token | Value | Use |
|-------|-------|-----|
| `--ground` | `#0e0d0c` | Page background |
| `--ink` | `#efe8dc` | Text (15.9:1) |
| `--muted` | `#8a857e` | Labels, metadata (5.3:1) |
| `--rule` | `#2a2622` | Hairlines, borders |
| `--light` | `#e0a458` | Discipline tags, CTA, focus ring (8.9:1) |

- `color-scheme: dark` on `:root`. No light mode.
- **Fraunces** for display: offer line, work titles, CTA italic. Weight 300 at 26px and up, 400 below.
- **Work Sans** (400, 500) for body and labels. Labels are uppercase, 10 to 11px, letter-spacing about 0.14em.
- Google Fonts with `display=swap`.
- Body column max about 34em. Phone first, 20px side gutter.

## Page Design

### Home

1. Top bar: `Alicia Paz` (home link) left, `ES · EN` right, active language in `--light`.
2. Offer line in Fraunces with one word in `--light`, then the "Escríbeme" button (`mailto:`).
3. `#obras`: every work as a full-width card in `order`: 4:5 cover, discipline tag, year, title. Links to the work page.
4. "Proyectos propios": compact rows from `_data/home.yml`, each an external link.
5. Footer: contact icons (email, LinkedIn, YouTube) as inline SVG.

### Work page

1. Top bar.
2. Cover photo, 16:9, full width.
3. Audio player directly under it: play button in `--light`, label, progress. A native `<audio>` element with a small
   styled control script; without JS the native `controls` are shown.
4. Discipline tag and year, title, facts table (`para`, `rol`, `duración`).
5. Body text, photos (two-up grid), video "ver fragmento" if `video` is set, credits.
6. CTA box: "¿Tienes una obra en proceso? Escríbeme" (`mailto:`).
7. Previous / next work links by `order`.

### Video facade

The still and a play button. On tap, `assets/js/video.js` swaps in the YouTube (`youtube-nocookie.com`) or Vimeo
iframe with autoplay. Without JS, the button is a link to the video on its platform.

### About

`io.jpg`, composer bio, then background (natural resources engineering, software, talks at Rails World and
RailsConf) with links. Alicia writes the text.

## Content Handoff

Alicia writes all text in both languages and delivers photos and audio excerpts. Every pending item gets a marker:
`[ES: escribe aquí]`, `[EN: write here]`, `[foto: pendiente]`, `[audio: pendiente]`. One grep lists everything left:

```
grep -rn "escribe aquí\|write here\|foto: pendiente\|audio: pendiente" --exclude-dir=_site --exclude-dir=docs .
```

The branch is not merged until it returns nothing.

## Build Order and Verification

1. **Remove** notes, roots, section pages, and translation keys; move the `/music` bio into About.
   Verify: `bundle exec jekyll build` succeeds, no missing include or layout.
2. **Tokens, fonts, `default` layout, top bar, footer.** Verify: screenshots at 390px and 1280px.
3. **`works` collection, `work` layout, audio player, video facade**, with one sample work (audio and video).
   Verify: audio plays on a phone viewport; the facade loads the iframe only on tap; with JS disabled, native audio
   controls show and the video link works; ES and EN pages both build at the right paths.
4. **Homepage and About.** Verify: both languages, hreflang alternates present, nav anchors and `mailto:` work.
5. **Markers for the three works, `home.yml` and About**, then Alicia's content. Then: full screenshot pass,
   marker grep returns nothing, merge to `main`. At merge, Settings → Pages → Source → "GitHub Actions" (as in the
   previous spec). Verify: live site serves `/` and `/en/`.

## Out of Scope

Contact form, WhatsApp, light mode, software and environment sections, analytics, generative canvas, embedded
SoundCloud or Bandcamp players, a `featured` flag (all works are shown).

## Risks

- **Photo rights.** Performance photos belong to photographers and companies. Each needs credit and permission.
- **Video rights.** Only one video is known to be shareable. The others stay off the site until cleared.
- **Polyglot and collections.** Two documents sharing one `permalink` with different `lang` is the documented polyglot
  pattern, but it is new in this repo; step 3 verifies it before more works are added.
- **Content is the critical path**, now including media, not just text.
