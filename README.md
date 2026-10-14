# Alicia Rojas' Portfolio

- Built with [Jekyll](https://github.com/jekyll/jekyll). An open source static site generator.

- Deployed on GitHub Pages :octocat:

## Content

Everything still to write or add shows up with:

```sh
grep -rn "escribe aquí\|write here\|foto: pendiente\|audio: pendiente" --exclude-dir=_site --exclude-dir=docs --exclude=README.md .
```

The redesign is ready to merge when it prints nothing.

### Adding a work

1. Copy a pair of files in `_works/` (`obra-1.md` and `obra-1-en.md`), rename both to the new slug, and set the same
   `permalink: /works/<slug>` and `order` in each.
2. Photos: `script/photo path/to/photo.jpg assets/works/<slug>/cover` makes the four sizes the site uses
   (needs ImageMagick). Do the same for extra photos (`.../1`, `.../2`) and a video still (`.../still`).
3. Audio: export an excerpt of about 3 MB to `assets/works/<slug>/excerpt.mp3`, for example
   `ffmpeg -i master.wav -ss 0 -t 180 -b:a 128k excerpt.mp3`.
4. In the Spanish file, uncomment `cover:` and `audio:` (and `video:` if the video can be shared), deleting the
   `[foto: pendiente]` / `[audio: pendiente]` notes. Copy the same `cover`, `audio`, `video` and `photos` lines into
   the English file.

## Contributions

Perhaps you found a bug on my website and because you're a nice person you'd like to report it.
For these or any other contributions, please visit the [issues page](https://github.com/aliciapaz/aliciapaz-portfolio/issues) :bug:

## Acknowledgements

My portfolio is inspired by the work of these fine folks:

- [Vincent Garreau](https://github.com/VincentGarreau)
- [Nathan Randecker](https://github.com/nrandecker)
- [Paul Le](https://github.com/LeNPaul)
