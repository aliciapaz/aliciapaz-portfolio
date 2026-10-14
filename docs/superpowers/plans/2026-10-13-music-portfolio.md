# Music Commissions Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Herbario build on `feature/redesign` into the "Stage" music commissions portfolio described in
`docs/superpowers/specs/2026-10-13-music-portfolio-design.md`.

**Architecture:** Jekyll 4 + `jekyll-polyglot` static site. A new `works` collection (one file per language,
shared permalink) renders one page per work through a `work` layout. Two small dependency-free scripts add the
styled audio player and the click-to-load video facade; both degrade to plain HTML without JS. One stylesheet,
dark only.

**Tech Stack:** Jekyll 4.3, jekyll-polyglot, Liquid, SCSS (single file), vanilla JS, ImageMagick for image variants.

**Testing approach:** This is a static site with no test framework. Each task's checks are build-and-grep
assertions against `_site/` (deterministic, run in seconds) plus headless-browser screenshots via gstack `browse`
for visual steps. Write the assertion first, watch it fail, then implement.

Build command used throughout: `bundle exec jekyll build --quiet` (run from the worktree root).
Browser: `B=~/.claude/skills/gstack/browse/dist/browse` with `bundle exec jekyll serve --port 4001` running in the
background.

---

## File Structure

| File | Status | Responsibility |
|------|--------|----------------|
| `_config.yml` | Modify | `works` collection instead of `notes`; exclude `script/` |
| `_data/translations.yml` | Rewrite | UI strings per language (nav, labels, CTA, mail subject) |
| `_data/home.yml` | Rewrite | Offer line and "Proyectos propios" rows per language |
| `_data/settings.yml` | Modify | Add `contact.email` |
| `_includes/head.html` | Modify | Fonts, `color-scheme: dark`, drop `roots.js` |
| `_includes/topbar.html` | Modify | Name + language switch row, nav row |
| `_includes/footer.html` | Modify | Add email address as text |
| `_includes/mailto.html` | Create | Outputs the `mailto:` URL with localized subject |
| `_includes/cta.html` | Create | "¿Tienes una obra en proceso?" box |
| `_includes/picture.html` | Create | `<picture>` with WebP/JPEG at 800w and 1600w |
| `_includes/audio.html` | Create | Native `<audio>` plus hidden styled controls |
| `_includes/video.html` | Create | Video facade link with embed URL |
| `_includes/icons/play.svg`, `pause.svg` | Create | Player icons (SVG avoids iOS emoji rendering of ▶) |
| `_layouts/home.html` | Rewrite | Offer, works cards, Proyectos propios |
| `_layouts/page.html` | Rewrite | Plain page: title, optional image, prose |
| `_layouts/work.html` | Create | One work |
| `_works/obra-{1,2,3}.md`, `-en.md` | Create | Three works with content markers |
| `assets/css/main.scss` | Rewrite | Stage tokens and all styles |
| `assets/js/audio.js` | Create | Styled audio controls |
| `assets/js/video.js` | Create | Swap facade for iframe on click |
| `script/photo` | Create | Make the four image variants from one source photo |
| `menu/about.md`, `about-en.md` | Modify | Composer bio first, then background |
| `index-en.html` | Modify | Drop the old intro line (ES already dropped) |
| `404.html`, `404-en.html` | Modify | Use `.wrap` |
| Deleted | | `_notes/`, `_plugins/venn.rb`, `_plugins/notes_check.rb`, `_includes/venn.html`, `_includes/notes-list.html`, `_includes/sections-nav.html`, `assets/js/notes-graph.js`, `assets/js/roots.js`, `menu/territorio*.md`, `menu/software*.md`, `menu/music*.md` |

---

### Task 1: Remove the notes system, roots and section pages

**Files:**
- Delete: `_notes/`, `_plugins/venn.rb`, `_plugins/notes_check.rb`, `_includes/venn.html`, `_includes/notes-list.html`, `_includes/sections-nav.html`, `assets/js/notes-graph.js`, `assets/js/roots.js`, `menu/territorio.md`, `menu/territorio-en.md`, `menu/software.md`, `menu/software-en.md`, `menu/music.md`, `menu/music-en.md`
- Modify: `menu/about.md`, `menu/about-en.md`, `_config.yml`, `_includes/head.html`, `_layouts/home.html`, `_layouts/page.html`, `index-en.html`

- [ ] **Step 1: Write the failing assertion**

```bash
bundle exec jekyll build --quiet && \
! ls _site/music.html _site/software.html _site/territorio.html 2>/dev/null && \
! grep -rl "roots.js\|notes-graph\|data-roots" _site && \
grep -q "Haciendo música dialogo con el silencio" _site/about.html && \
grep -q "Through my music, I engage" _site/en/about.html && echo PASS
```

- [ ] **Step 2: Run it, expect no PASS** (music.html exists, about lacks the bio).

- [ ] **Step 3: Move the music bio into About**

`menu/about.md` (bio from the current, uncommitted `menu/music.md`, then the existing About text; the Bandcamp and
SoundCloud lines move to Proyectos propios in Task 4):

```markdown
---
layout: page
title: Sobre mí
permalink: /about
image: io.jpg
lang: es
---

Compositora, cantautora y educadora nacida en Chile, con más de doce años de oficio en música, artes escénicas y poesía popular. Egresada de Composición Aplicada y Producción Musical del Centro de Creadores Musicales (México).

Haciendo música dialogo con el silencio, la paciencia y el asombro.
Experimento con sonidos acústicos y electrónicos; con letras de mi autoría, robadas o prestadas.

No me olvido de mi raíz (que apunta al sur), mas el resto diverge en otras direcciones.

Soy bajista y compositora de formación, multi-instrumentista de oficio. Hago música para danza contemporánea y teatro, para árboles y pájaros, para viejxs y niñxs, y para mí.

Ingeniera en recursos naturales renovables, compositora y programadora nacida en Santiago de Chile. Me inspiro en la poesía y la naturaleza para crear sobre lo que me supera y me conmueve.

Algunas de las cosas que más disfruto en la vida son aprender, tocar música y comer fruta.

[ES: escribe aquí] (software, charlas en Rails World y RailsConf, otros trabajos, con links)
```

`menu/about-en.md`:

```markdown
---
layout: page
title: About
permalink: /about
image: io.jpg
lang: en
---

Composer, singer-songwriter and educator born in Chile, with over twelve years’ experience in music, theatre and popular poetry. I trained as a violinist at the Liceo Experimental Artístico of the University of Chile, and in Applied Composition and Music Production at the Centro de Creadores Musicales (Mexico)

Through my music, I engage in a dialogue with silence, patience and wonder.
I experiment with acoustic and electronic sounds,  with lyrics of my own, stolen, or borrowed.

I don't forget my roots (which point south), but the rest diverges in other directions.

I'm a bassist and composer by training, a multi-instrumentalist by trade.

I'm a natural resources engineer, composer and programmer born in Santiago, Chile. I draw inspiration from poetry and nature to create about what overwhelms and moves me.

Some of the things I enjoy most in life are learning, playing music, and eating fruit.

[EN: write here] (software, talks at Rails World and RailsConf, other work, with links)
```

- [ ] **Step 4: Delete the removed files**

```bash
git rm -rq _notes _plugins/venn.rb _plugins/notes_check.rb _includes/venn.html _includes/notes-list.html \
  _includes/sections-nav.html assets/js/notes-graph.js assets/js/roots.js \
  menu/territorio.md menu/territorio-en.md menu/software.md menu/software-en.md menu/music.md menu/music-en.md
```

(`git rm` on `_notes/` and `menu/music.md` discards the uncommitted edits there; the music bio was already copied
in Step 3.)

- [ ] **Step 5: Stop referencing them**

`_config.yml`: replace the `collections:` block with

```yaml
collections:
  works:
    output: true
```

and change `exclude` to

```yaml
exclude:             ["README.md", "LICENSE", "Gemfile", "Gemfile.lock", ".tool-versions", "vendor", "script", "docs"]
```

`_includes/head.html`: delete the line `<script src="/assets/js/roots.js" defer></script>`.

`_layouts/home.html` (temporary, rewritten in Task 4):

```liquid
---
layout: default
---
<div class="wrap">
  {{ content }}
</div>
```

`_layouts/page.html`:

```liquid
---
layout: default
---
<div class="wrap">
  <h1 class="page-title">{{ page.title }}</h1>
  {% if page.image %}
    <img class="page-image" src="/assets/img/{{ page.image }}" alt="">
  {% endif %}
  <article class="prose">
    {{ content }}
  </article>
</div>
```

`index-en.html`: remove the body line `Composer, programmer, and self-taught.` so only front matter remains.

- [ ] **Step 6: Run the assertion from Step 1, expect PASS.** If `_plugins/` is now empty, `rmdir _plugins`.

- [ ] **Step 7: Commit**

```bash
git add -A _config.yml _includes _layouts _plugins menu index-en.html assets/js
git commit -m "refactor: remove notes, roots and section pages

The portfolio now targets music commissions. The notes map and the
three discipline sections told a personal story that no longer fits;
the music bio moves into About as the starting draft."
```

---

### Task 2: Stage tokens, fonts, top bar, footer

**Files:**
- Rewrite: `assets/css/main.scss`, `_data/translations.yml`
- Modify: `_includes/head.html`, `_includes/topbar.html`, `_includes/footer.html`, `_data/settings.yml`, `404.html`, `404-en.html`
- Create: `_includes/mailto.html`, `_includes/cta.html`

- [ ] **Step 1: Write the failing assertion**

```bash
bundle exec jekyll build --quiet && \
grep -q 'family=Fraunces' _site/index.html && \
grep -q 'content="dark"' _site/index.html && \
grep -q 'href="/#obras"' _site/about.html && \
grep -q 'href="/en/#obras"' _site/en/about.html && \
grep -q 'mailto:aliciapazrojas@gmail.com?subject=Encargo%20de%20obra' _site/about.html && \
grep -q 'mailto:aliciapazrojas@gmail.com?subject=Music%20commission' _site/en/about.html && \
grep -q -- '--ground: #0e0d0c' _site/assets/css/main.css && echo PASS
```

- [ ] **Step 2: Run it, expect no PASS.**

- [ ] **Step 3: Data**

`_data/translations.yml`:

```yaml
es:
  menu:
    - { name: 'obras',    url: '/#obras' }
    - { name: 'sobre mí', url: '/about' }
  contact: 'contacto'
  nav_label: 'Navegación'
  write: 'Escríbeme'
  mail_subject: 'Encargo de obra'
  cta: '¿Tienes una obra en proceso?'
  works: 'Obras'
  own: 'Proyectos propios'
  client: 'Para'
  role: 'Rol'
  duration: 'Duración'
  watch: 'Ver fragmento'
  play: 'Reproducir'
  pause: 'Pausar'
  seek: 'Posición'
  prev: 'Anterior'
  next: 'Siguiente'

en:
  menu:
    - { name: 'works', url: '/#obras' }
    - { name: 'about', url: '/about' }
  contact: 'contact'
  nav_label: 'Navigation'
  write: 'Write to me'
  mail_subject: 'Music commission'
  cta: 'Working on a new piece?'
  works: 'Works'
  own: 'Own projects'
  client: 'For'
  role: 'Role'
  duration: 'Duration'
  watch: 'Watch excerpt'
  play: 'Play'
  pause: 'Pause'
  seek: 'Position'
  prev: 'Previous'
  next: 'Next'
```

`_data/settings.yml`: add at the top

```yaml
contact:
  email: 'aliciapazrojas@gmail.com'
```

- [ ] **Step 4: Includes**

`_includes/mailto.html` (one line, no trailing newline):

```liquid
mailto:{{ site.data.settings.contact.email }}?subject={{ site.data.translations[site.active_lang].mail_subject | uri_escape }}
```

`_includes/cta.html`:

```liquid
{% assign t = site.data.translations[site.active_lang] %}
<aside class="cta">
  <p class="cta-line">{{ t.cta }}</p>
  <a class="cta-link" href="{% include mailto.html %}">{{ t.write }} →</a>
</aside>
```

`_includes/head.html`: change `<meta name="color-scheme" content="light dark">` to `content="dark"`, and replace
the Google Fonts stylesheet line with

```html
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Work+Sans:wght@400;500&display=swap">
```

`_includes/topbar.html`:

```liquid
{% assign t = site.data.translations[site.active_lang] %}
{% assign unloc_url = page.url | remove_first: '/en' %}
<header class="topbar">
  <div class="topbar-row">
    <a class="topbar-home" href="/">{{ site.title }}</a>
    {% comment %} static_href so polyglot does not re-localize the switcher links {% endcomment %}
    <nav class="lang" aria-label="Idioma / Language">
      {% if site.active_lang == site.default_lang %}
        <span class="lang-active" aria-current="true">ES</span> ·
        {% capture en_url %}/en{{ unloc_url }}{% endcapture %}
        <a {% static_href %}href="{{ en_url }}"{% endstatic_href %} hreflang="en" lang="en">EN</a>
      {% else %}
        <a {% static_href %}href="{{ unloc_url }}"{% endstatic_href %} hreflang="es" lang="es">ES</a> ·
        <span class="lang-active" aria-current="true">EN</span>
      {% endif %}
    </nav>
  </div>
  <nav class="site-nav" aria-label="{{ t.nav_label }}">
    {% for item in t.menu %}<a href="{{ item.url }}">{{ item.name }}</a>{% endfor %}
    <a href="{% include mailto.html %}">{{ t.contact }}</a>
  </nav>
</header>
```

`_includes/footer.html`:

```liquid
<footer class="footer">
  {% for item in site.data.settings.social %}
    <a href="{{ item.link }}" aria-label="{{ item.label }}"{% unless item.icon == 'email' %} target="_blank" rel="noopener"{% endunless %}>
      {% include icons/{{ item.icon }}.svg %}
    </a>
  {% endfor %}
  <span class="footer-email">{{ site.data.settings.contact.email }}</span>
</footer>
```

`404.html` and `404-en.html`: change `<div class="page">` to `<div class="wrap">`.

- [ ] **Step 5: Stylesheet**

Replace `assets/css/main.scss` entirely:

```scss
---
---

:root {
  --ground: #0e0d0c;
  --ink: #efe8dc;
  --muted: #8a857e;
  --rule: #2a2622;
  --light: #e0a458;
  --display: "Fraunces", Georgia, "Times New Roman", serif;
  --sans: "Work Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --measure: 34em;
  --gutter: 1.25rem;
  --column: calc(var(--measure) + 2 * var(--gutter));
  color-scheme: dark;
}

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--ground);
  color: var(--ink);
  font: 1rem/1.65 var(--sans);
}

main { flex: 1; }

a { color: inherit; text-decoration-color: var(--light); text-underline-offset: .2em; }
a:hover { color: var(--light); }
:focus-visible { outline: 2px solid var(--light); outline-offset: 3px; }
img { display: block; max-width: 100%; height: auto; }
picture { display: block; overflow: hidden; }
picture img { width: 100%; height: 100%; object-fit: cover; }

.wrap {
  max-width: var(--column);
  margin: 0 auto;
  padding: 0 var(--gutter) 3rem;
}

.label {
  font-size: .6875rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.tag { margin: 0 0 .4rem; color: var(--muted); }
.accent { color: var(--light); }

.placeholder {
  background: radial-gradient(ellipse at 50% 30%, #3a2c1f 0%, #1a1511 55%, var(--ground) 100%);
}

/* Top bar */

.topbar {
  max-width: var(--column);
  width: 100%;
  margin: 0 auto;
  padding: 1.1rem var(--gutter) 0;
}

.topbar-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.topbar-home,
.lang,
.site-nav {
  font-size: .6875rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.topbar-home { font-weight: 500; text-decoration: none; }
.lang { color: var(--muted); }
.lang a { text-decoration: none; }
.lang-active { color: var(--light); }

.site-nav {
  display: flex;
  gap: 1.25rem;
  margin-top: .75rem;
  padding-bottom: .9rem;
  border-bottom: 1px solid var(--rule);
}

.site-nav a { color: var(--muted); text-decoration: none; }
.site-nav a:hover { color: var(--light); }

/* Display type */

.offer-line,
.work-title,
.work-card-title,
.page-title {
  margin: 0;
  font-family: var(--display);
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: -.01em;
}

.page-title { font-size: clamp(2rem, 7vw, 2.75rem); margin: 2.5rem 0 1.5rem; }
.page-image { margin: 0 0 1.5rem; }

.prose p { margin: 0 0 1.1rem; }

.wrap iframe { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; border: 0; }

/* Contact */

.button {
  display: inline-block;
  padding: .7rem 1.1rem;
  border: 1px solid var(--light);
  color: var(--light);
  font-size: .75rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  text-decoration: none;
}

.button:hover { background: var(--light); color: var(--ground); }

.cta {
  margin: 2.5rem 0;
  padding: 1.5rem 1rem;
  border: 1px solid var(--light);
  text-align: center;
}

.cta-line {
  margin: 0 0 .6rem;
  font-family: var(--display);
  font-size: 1.25rem;
  font-style: italic;
  font-weight: 400;
}

.cta-link {
  color: var(--light);
  font-size: .75rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  text-decoration: none;
}

/* Footer */

.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  padding: 2rem var(--gutter) 2.5rem;
  border-top: 1px solid var(--rule);
  color: var(--muted);
}

.footer a { display: inline-flex; padding: .25rem; }
.footer-email { font-size: .8125rem; user-select: all; }
```

- [ ] **Step 6: Run the assertion from Step 1, expect PASS.**

- [ ] **Step 7: Screenshot check**

```bash
bundle exec jekyll serve --port 4001 --quiet &   # leave running for later tasks
B=~/.claude/skills/gstack/browse/dist/browse
$B viewport 390x844 && $B goto http://localhost:4001/about && $B screenshot /tmp/about-390.png
$B viewport 1280x800 && $B screenshot /tmp/about-1280.png
```

Expected: dark ground, Fraunces title, nav row `obras · sobre mí · contacto` fits on one line at 390px.

- [ ] **Step 8: Commit**

```bash
git add -A assets/css _data _includes 404.html 404-en.html
git commit -m "feat: apply Stage visual system and contact links

Dark-only palette, Fraunces and Work Sans, a nav row with a mailto
contact link that prefills a commission subject per language."
```

---

### Task 3: Works collection, work page, audio player, video facade

**Files:**
- Create: `_layouts/work.html`, `_includes/picture.html`, `_includes/audio.html`, `_includes/video.html`, `_includes/icons/play.svg`, `_includes/icons/pause.svg`, `assets/js/audio.js`, `assets/js/video.js`, `script/photo`, `_works/obra-1.md`, `_works/obra-1-en.md`, `_works/obra-2.md`, `_works/obra-2-en.md`, `_works/obra-3.md`, `_works/obra-3-en.md`
- Modify: `assets/css/main.scss` (append)

- [ ] **Step 1: Write the failing assertion**

```bash
bundle exec jekyll build --quiet && \
for n in 1 2 3; do test -f _site/works/obra-$n.html && test -f _site/en/works/obra-$n.html || exit 1; done && \
grep -q 'class="work-title"' _site/works/obra-1.html && \
grep -q 'href="/en/works/obra-2"' _site/en/works/obra-1.html && \
grep -q 'class="work-cover placeholder"' _site/works/obra-1.html && echo PASS
```

- [ ] **Step 2: Run it, expect no PASS.**

- [ ] **Step 3: Icons**

`_includes/icons/play.svg`:

```html
<svg class="icon-play" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>
```

`_includes/icons/pause.svg`:

```html
<svg class="icon-pause" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/></svg>
```

- [ ] **Step 4: Includes**

`_includes/picture.html` (`base` is a path under `assets/` without size or extension, e.g. `works/obra-1/cover`):

```liquid
{% capture b %}/assets/{{ include.base }}{% endcapture %}
<picture class="{{ include.class }}">
  <source type="image/webp" srcset="{{ b }}-800.webp 800w, {{ b }}-1600.webp 1600w" sizes="{{ include.sizes | default: '100vw' }}">
  <img src="{{ b }}-800.jpg" srcset="{{ b }}-800.jpg 800w, {{ b }}-1600.jpg 1600w" sizes="{{ include.sizes | default: '100vw' }}" alt="{{ include.alt | escape }}"{% unless include.eager %} loading="lazy"{% endunless %} decoding="async">
</picture>
```

`_includes/audio.html`:

```liquid
{% assign t = site.data.translations[site.active_lang] %}
<div class="player" data-player>
  <audio src="/assets/{{ include.src }}" preload="metadata" controls></audio>
  <div class="player-ui" hidden>
    <button type="button" class="player-toggle" aria-label="{{ t.play }}" data-label-play="{{ t.play }}" data-label-pause="{{ t.pause }}">
      {% include icons/play.svg %}{% include icons/pause.svg %}
    </button>
    <div class="player-meta">
      <span class="player-label label">{{ include.label }}</span>
      <input class="player-seek" type="range" min="0" max="100" step="0.1" value="0" aria-label="{{ t.seek }}">
    </div>
  </div>
</div>
```

`_includes/video.html` (`include.video` is `{ platform: youtube|vimeo, id, still }`):

```liquid
{% assign t = site.data.translations[site.active_lang] %}
{% assign v = include.video %}
{% if v.platform == "vimeo" %}
  {% capture watch %}https://vimeo.com/{{ v.id }}{% endcapture %}
  {% capture embed %}https://player.vimeo.com/video/{{ v.id }}?autoplay=1&dnt=1{% endcapture %}
{% else %}
  {% capture watch %}https://www.youtube.com/watch?v={{ v.id }}{% endcapture %}
  {% capture embed %}https://www.youtube-nocookie.com/embed/{{ v.id }}?autoplay=1{% endcapture %}
{% endif %}
<figure class="video">
  <a class="video-facade placeholder" href="{{ watch }}" target="_blank" rel="noopener" data-embed="{{ embed }}">
    {% if v.still %}{% include picture.html base=v.still alt="" sizes="(min-width: 40rem) 34em, 100vw" %}{% endif %}
    <span class="video-play label">{% include icons/play.svg %}<span>{{ t.watch }}</span></span>
  </a>
</figure>
```

- [ ] **Step 5: Work layout**

`_layouts/work.html`:

```liquid
---
layout: default
---
{% assign t = site.data.translations[site.active_lang] %}
{% assign works = site.works | where: "lang", site.active_lang | sort: "order" %}
{% for w in works %}{% if w.url == page.url %}{% assign i = forloop.index0 %}{% endif %}{% endfor %}
{% assign prev_i = i | minus: 1 %}
{% assign next_i = i | plus: 1 %}
<article class="work">
  {% if page.cover %}
    {% include picture.html base=page.cover alt=page.cover_alt class="work-cover" eager=true %}
  {% else %}
    <div class="work-cover placeholder"></div>
  {% endif %}
  {% if page.audio %}{% include audio.html src=page.audio label=page.audio_label %}{% endif %}
  <div class="wrap">
    <p class="tag label"><span class="accent">{{ page.discipline }}</span> · {{ page.year }}</p>
    <h1 class="work-title">{{ page.title }}</h1>
    <dl class="facts">
      {% if page.client %}<dt class="label">{{ t.client }}</dt><dd>{{ page.client }}</dd>{% endif %}
      {% if page.role %}<dt class="label">{{ t.role }}</dt><dd>{{ page.role }}</dd>{% endif %}
      {% if page.duration %}<dt class="label">{{ t.duration }}</dt><dd>{{ page.duration }}</dd>{% endif %}
    </dl>
    <div class="prose">{{ content }}</div>
    {% if page.photos.size > 0 %}
      <div class="photos">
        {% for p in page.photos %}
          <figure>
            {% include picture.html base=p.src alt=p.alt sizes="(min-width: 40rem) 17em, 50vw" %}
            {% if p.credit %}<figcaption>{{ p.credit }}</figcaption>{% endif %}
          </figure>
        {% endfor %}
      </div>
    {% endif %}
    {% if page.video %}{% include video.html video=page.video %}{% endif %}
    {% if page.credits %}<p class="credits">{{ page.credits }}</p>{% endif %}
    {% include cta.html %}
    <nav class="pager">
      {% if i > 0 %}<a href="{{ works[prev_i].url }}">← {{ t.prev }}</a>{% else %}<span></span>{% endif %}
      {% if next_i < works.size %}<a href="{{ works[next_i].url }}">{{ t.next }} →</a>{% endif %}
    </nav>
  </div>
</article>
<script src="/assets/js/audio.js" defer></script>
<script src="/assets/js/video.js" defer></script>
```

- [ ] **Step 6: Scripts**

`assets/js/audio.js`:

```js
document.querySelectorAll("[data-player]").forEach((player) => {
  const audio = player.querySelector("audio");
  const toggle = player.querySelector(".player-toggle");
  const seek = player.querySelector(".player-seek");

  audio.controls = false;
  player.querySelector(".player-ui").hidden = false;

  const setPlaying = (playing) => {
    player.classList.toggle("is-playing", playing);
    toggle.setAttribute("aria-label", playing ? toggle.dataset.labelPause : toggle.dataset.labelPlay);
  };

  toggle.addEventListener("click", () => (audio.paused ? audio.play() : audio.pause()));
  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
  });
  seek.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  });
});
```

`assets/js/video.js`:

```js
document.querySelectorAll(".video-facade").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const iframe = document.createElement("iframe");
    iframe.src = link.dataset.embed;
    iframe.title = link.textContent.trim();
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    link.replaceWith(iframe);
  });
});
```

- [ ] **Step 7: Styles** (append to `assets/css/main.scss`)

```scss
/* Work page */

.work-cover {
  max-width: 60rem;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
}

.player {
  max-width: var(--column);
  margin: 0 auto;
  padding: 1rem var(--gutter) 0;
}

.player audio { width: 100%; }

.player-ui {
  display: flex;
  align-items: center;
  gap: .9rem;
  padding: .75rem;
  border: 1px solid var(--rule);
}

.player-ui[hidden] { display: none; }

.player-toggle {
  flex: none;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 0;
  border-radius: 50%;
  background: var(--light);
  color: var(--ground);
  cursor: pointer;
}

.player-toggle svg { width: 1rem; height: 1rem; }
.icon-pause,
.is-playing .icon-play { display: none; }
.is-playing .icon-pause { display: block; }

.player-meta { flex: 1; min-width: 0; }
.player-label { display: block; margin-bottom: .35rem; color: var(--muted); }
.player-seek { width: 100%; margin: 0; accent-color: var(--light); }

.work .tag { margin-top: 2rem; }
.work-title { font-size: clamp(2rem, 7vw, 2.75rem); margin-bottom: 1.25rem; }

.facts {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: .4rem 1.25rem;
  margin: 0 0 2rem;
  font-size: .875rem;
}

.facts dt { padding-top: .15rem; color: var(--muted); }
.facts dd { margin: 0; }

.photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .5rem;
  margin: 2rem 0;
}

.photos figure { margin: 0; }
.photos picture { aspect-ratio: 1; }
.photos figcaption { margin-top: .3rem; color: var(--muted); font-size: .6875rem; }

.video { margin: 2rem 0; }

.video-facade,
.video iframe {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  text-decoration: none;
}

.video-facade picture { position: absolute; inset: 0; }

.video-play {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  display: flex;
  align-items: center;
  gap: .6rem;
}

.video-play svg {
  width: 2.75rem;
  height: 2.75rem;
  padding: .85rem;
  border: 1px solid var(--ink);
  border-radius: 50%;
}

.credits {
  margin: 2rem 0;
  padding-top: 1rem;
  border-top: 1px solid var(--rule);
  color: var(--muted);
  font-size: .8125rem;
  line-height: 1.8;
}

.pager {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: .8125rem;
}

.pager a { text-decoration: none; }
```

- [ ] **Step 8: Works with markers**

`_works/obra-1.md` (repeat for `obra-2`, `obra-3` with `order: 2`/`3` and matching slugs/paths):

```markdown
---
layout: work
permalink: /works/obra-1
order: 1
lang: es
title: '[ES: escribe aquí]'
year: '[ES: escribe aquí]'
discipline: '[ES: escribe aquí]'
client: '[ES: escribe aquí]'
role: '[ES: escribe aquí]'
duration: '[ES: escribe aquí]'
# [foto: pendiente] cover: works/obra-1/cover   (run script/photo, see README)
cover_alt: '[ES: escribe aquí]'
# [audio: pendiente] audio: works/obra-1/excerpt.mp3
audio_label: '[ES: escribe aquí]'
# Optional, only if the video can be shared:
# video: { platform: vimeo, id: '123456', still: works/obra-1/still }
photos: []
# photos:
#   - { src: works/obra-1/1, alt: '...', credit: 'Foto: ...' }
credits: '[ES: escribe aquí]'
---

[ES: escribe aquí]
```

`_works/obra-1-en.md` (repeat for 2 and 3):

```markdown
---
layout: work
permalink: /works/obra-1
order: 1
lang: en
title: '[EN: write here]'
year: '[EN: write here]'
discipline: '[EN: write here]'
client: '[EN: write here]'
role: '[EN: write here]'
duration: '[EN: write here]'
# cover, audio, video and photos: same values as the Spanish file
cover_alt: '[EN: write here]'
audio_label: '[EN: write here]'
photos: []
credits: '[EN: write here]'
---

[EN: write here]
```

- [ ] **Step 9: Photo helper**

`script/photo` (make executable with `chmod +x script/photo`):

```bash
#!/usr/bin/env bash
# Usage: script/photo <source.jpg> <assets/works/slug/name>
# Writes name-800.jpg, name-1600.jpg, name-800.webp, name-1600.webp
set -euo pipefail
src=$1
base=$2
mkdir -p "$(dirname "$base")"
for width in 800 1600; do
  magick "$src" -auto-orient -strip -resize "${width}x>" -quality 82 "$base-$width.jpg"
  magick "$src" -auto-orient -strip -resize "${width}x>" -quality 80 "$base-$width.webp"
done
```

- [ ] **Step 10: Run the assertion from Step 1, expect PASS.**

- [ ] **Step 11: Media check with throwaway fixtures** (not committed)

```bash
magick -size 2000x1125 gradient:'#6b4a2b'-'#0e0d0c' /tmp/cover.jpg
script/photo /tmp/cover.jpg assets/works/obra-1/cover
ffmpeg -loglevel error -f lavfi -i "sine=frequency=220:duration=20" -b:a 128k assets/works/obra-1/excerpt.mp3
```

Temporarily set in `_works/obra-1.md`: `cover: works/obra-1/cover`, `audio: works/obra-1/excerpt.mp3`,
`video: { platform: youtube, id: 'SIaFtAKnqBU' }`. Then:

```bash
bundle exec jekyll build --quiet && \
grep -q 'cover-1600.webp 1600w' _site/works/obra-1.html && \
grep -q 'youtube-nocookie.com/embed/SIaFtAKnqBU' _site/works/obra-1.html && \
! grep -q 'iframe' _site/works/obra-1.html && echo PASS
B=~/.claude/skills/gstack/browse/dist/browse
$B viewport 390x844 && $B goto http://localhost:4001/works/obra-1 && $B screenshot /tmp/work-390.png
$B click ".player-toggle" && $B js "document.querySelector('audio').paused"     # expect false
$B click ".video-facade" && $B js "!!document.querySelector('.video iframe')"   # expect true
```

Also check with JS off (`$B` JS-disabled load or `curl` the HTML): native `<audio controls>` present, facade is a
plain link. Then revert the three front-matter lines and `rm -r assets/works/obra-1`.

- [ ] **Step 12: Commit**

```bash
git add -A _layouts/work.html _includes assets/js assets/css _works script
git commit -m "feat: add works collection with audio player and video facade

Each work gets one page that leads with its cover and a self-hosted
audio excerpt. Video loads only on tap, from youtube-nocookie or
Vimeo with dnt. Without JS the native audio controls and a plain
video link remain."
```

---

### Task 4: Homepage and Proyectos propios

**Files:**
- Rewrite: `_layouts/home.html`, `_data/home.yml`
- Modify: `assets/css/main.scss` (append)

- [ ] **Step 1: Write the failing assertion**

```bash
bundle exec jekyll build --quiet && \
test "$(grep -c 'class="work-card"' _site/index.html)" = 3 && \
grep -q 'id="obras"' _site/en/index.html && \
grep -q 'annarresti.bandcamp.com' _site/index.html && \
grep -q 'href="/en/works/obra-1"' _site/en/index.html && \
grep -q 'class="button"' _site/index.html && echo PASS
```

- [ ] **Step 2: Run it, expect no PASS.**

- [ ] **Step 3: Data**

`_data/home.yml` (the own-project notes are Alicia's existing words from the old notes and music page):

```yaml
# Homepage text. Replace every "[ES: escribe aquí]" / "[EN: write here]".
# Wrap one word of the offer line in <em> to show it in the accent color.
es:
  offer: '[ES: escribe aquí]'
  own_projects:
    - { title: 'Annarresti', url: 'https://annarresti.bandcamp.com/album/annarresti', note: 'Mi proyecto de cantautora.' }
    - { title: 'SoundCloud', url: 'https://soundcloud.com/annarresti', note: 'Mi repositorio de experimentos y maquetas caseras.' }

en:
  offer: '[EN: write here]'
  own_projects:
    - { title: 'Annarresti', url: 'https://annarresti.bandcamp.com/album/annarresti', note: '[EN: write here]' }
    - { title: 'SoundCloud', url: 'https://soundcloud.com/annarresti', note: 'My repository of experiments and home demos.' }
```

- [ ] **Step 4: Layout**

`_layouts/home.html`:

```liquid
---
layout: default
---
{% assign t = site.data.translations[site.active_lang] %}
{% assign home = site.data.home[site.active_lang] %}
{% assign works = site.works | where: "lang", site.active_lang | sort: "order" %}
<div class="wrap">
  <section class="offer">
    <h1 class="offer-line">{{ home.offer }}</h1>
    <a class="button" href="{% include mailto.html %}">{{ t.write }}</a>
  </section>

  <section id="obras" class="works" aria-label="{{ t.works }}">
    {% for w in works %}
      <a class="work-card" href="{{ w.url }}">
        {% if w.cover %}
          {% include picture.html base=w.cover alt=w.cover_alt class="work-card-image" sizes="(min-width: 40rem) 34em, 100vw" %}
        {% else %}
          <div class="work-card-image placeholder"></div>
        {% endif %}
        <p class="tag label"><span class="accent">{{ w.discipline }}</span> · {{ w.year }}</p>
        <h2 class="work-card-title">{{ w.title }}</h2>
      </a>
    {% endfor %}
  </section>

  <section class="own">
    <h2 class="own-title">{{ t.own }}</h2>
    <ul>
      {% for p in home.own_projects %}
        <li>
          <a href="{{ p.url }}" target="_blank" rel="noopener">{{ p.title }} ↗</a>
          <span>{{ p.note }}</span>
        </li>
      {% endfor %}
    </ul>
  </section>
</div>
```

- [ ] **Step 5: Styles** (append to `assets/css/main.scss`)

```scss
/* Home */

.offer { padding: 2.5rem 0 1rem; }
.offer-line { font-size: clamp(2.125rem, 8vw, 3.25rem); margin-bottom: 1.5rem; }
.offer-line em { color: var(--light); }

.works {
  display: grid;
  gap: 2.5rem;
  margin: 3rem 0;
  scroll-margin-top: 1rem;
}

.work-card { display: block; text-decoration: none; }
.work-card-image { aspect-ratio: 4 / 5; margin-bottom: .9rem; }
.work-card-title { font-size: 1.75rem; }
.work-card:hover .work-card-title { color: var(--light); }

.own { padding-top: 1.5rem; border-top: 1px solid var(--rule); }

.own-title {
  margin: 0 0 .5rem;
  font-family: var(--display);
  font-size: 1.25rem;
  font-weight: 400;
}

.own ul { margin: 0; padding: 0; list-style: none; }
.own li { padding: .75rem 0; border-bottom: 1px solid var(--rule); }
.own li a { text-decoration: none; }
.own li span { display: block; color: var(--muted); font-size: .875rem; }
```

- [ ] **Step 6: Run the assertion from Step 1, expect PASS.**

- [ ] **Step 7: Screenshots**: `/`, `/en/`, `/about`, `/en/about`, `/works/obra-1`, `/en/works/obra-1`, `/404.html`
at 390x844 and 1280x800. Check: no horizontal scroll at 390 (`$B js "document.documentElement.scrollWidth <= innerWidth"`
returns true), nav on one line, hreflang tags present on every page.

- [ ] **Step 8: Commit**

```bash
git add -A _layouts/home.html _data/home.yml assets/css
git commit -m "feat: build homepage around the offer and the works

Offer line and contact button first, then every work as a full-width
card, then a short list of own projects."
```

---

### Task 5: Content handoff check

- [ ] **Step 1: List remaining content**

```bash
grep -rn "escribe aquí\|write here\|foto: pendiente\|audio: pendiente" --exclude-dir=_site --exclude-dir=docs --exclude-dir=.superpowers .
```

Expected: markers in `_works/*` (all three works, both languages), `_data/home.yml` (offer ES/EN, Annarresti EN
note), `menu/about*.md` (background paragraph). Nothing else.

- [ ] **Step 2: Add a short "Adding a work" section to `README.md`** covering: copy an `obra-N` pair, set `permalink`
and `order`, run `script/photo` for cover/photos/still, export a ~3 MB MP3 excerpt to
`assets/works/<slug>/excerpt.mp3` (`ffmpeg -i master.wav -ss 0 -t 180 -b:a 128k excerpt.mp3`), remove the
`[foto: pendiente]` / `[audio: pendiente]` comments.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: explain how to add a work and its media"
```

Merging stays blocked until the Step 1 grep returns nothing (Alicia's content).
