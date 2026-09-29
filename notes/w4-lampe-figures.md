# Lampe deck: figure sources

The scientific figures are separate from the eight Wikimedia naming photos,
whose sources and licenses appear on the deck's final slide.

- `slides/figs/lampe-figure1-ab.png` and `lampe-figure1-c.png`: original
  Figure 1, panels A and B and panel C, respectively, from Lampe et al.
  (2024), p. 29, https://doi.org/10.1080/02643294.2024.2315822.
  These show raw distributions and means, not adjusted model estimates.
- `slides/figs/mirman2011-figure3.png`: original Figure 3 from Mirman
  (2011), p. 39, https://doi.org/10.3758/s13415-010-0009-7.
  Author-hosted source: https://dmirman.github.io/papers/Mirman2011.pdf.
  This figure shows target-neighbourhood effects in Study 2. It does not
  plot the separate target-response similarity analysis.
- `slides/figs/lampe-adjusted-estimates.{png,svg}`: new plot of the primary
  model intercepts and 95% CIs reported on p. 28 of Lampe et al. (2024).
  The three panels have different units and scales. No simulated data.
- `slides/figs/lampe-trial-timing.{png,svg}`: new diagram of the procedure
  on p. 24, showing practice and experimental trials. A 750 ms fixation
  illustrates the study's variable 500 to 1000 ms fixation period.

Regenerate the new plots from the repository root:

```sh
Rscript notes/w4-lampe-plots.R
```

The original figures were rendered with PyMuPDF at 3 pixels per PDF point.
Crop coordinates `(left, top, right, bottom)` in points, with zero-based
page indices, for the source PDFs used:

| Asset | Page index | Crop |
|---|---|---|
| Lampe A and B | 12 | (78, 50, 530, 328) |
| Lampe C | 12 | (78, 328, 530, 465) |
| Mirman Figure 3 | 7 | (222, 545, 547, 711) |

Only surrounding page text was excluded; plotted values, labels, axes,
legends, and error bars were retained. Source PDFs remain outside the repo.
