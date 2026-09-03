# LING 449U: How words are built

Course website for LING 449U, University of Maryland, Fall 2026.
Built with [Quarto](https://quarto.org) and published to GitHub Pages.

## Local build

```sh
quarto preview      # live reload at localhost:xxxx
quarto render       # writes _site/
```

## Layout

```
index.qmd        course home
schedule.qmd     week-by-week plan
slides.qmd       index of the decks
syllabus.qmd     full policies
slides/          one .qmd per class, revealjs
  figs/          figures used in the decks
theme.scss       site theme
slides/custom.scss   slide theme
```

## Adding a deck

1. Write `slides/wN-topic.qmd`, copying the front matter of an existing deck.
2. Put figures in `slides/figs/`.
3. Add a link to it in `slides.qmd`.
4. Push to `main`. The site rebuilds itself.

## Readings

Readings are **not** in this repository and must not be added to it. They are
copyrighted and live on ELMS. `.gitignore` blocks `*.pdf` for that reason.
