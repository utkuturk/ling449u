# Run from the repository root: Rscript notes/w4-lampe-plots.R
# Estimates and 95% CIs: Lampe et al. (2024), p. 28, primary analyses.
# Timing: Lampe et al. (2024), p. 24. Diagram uses a 750 ms example fixation.
library(ggplot2)

estimates <- data.frame(
  measure = factor(c("Typicality", "Semantic features", "Semantic similarity"),
    levels = c("Typicality", "Semantic features", "Semantic similarity")),
  estimate = c(2.52, 0.61, -0.06),
  lower = c(0.81, 0.13, -0.09),
  upper = c(4.22, 1.09, -0.03),
  label = c("+2.52 [0.81, 4.22]", "+0.61 [0.13, 1.09]", "-0.06 [-0.09, -0.03]")
)
limits <- data.frame(
  measure = rep(estimates$measure, each = 2),
  x = c(-1, 5, -0.3, 1.4, -0.12, 0.03)
)
p <- ggplot(estimates, aes(x = estimate, y = 1)) +
  geom_blank(data = limits, aes(x = x, y = 1), inherit.aes = FALSE) +
  geom_vline(xintercept = 0, linetype = "dashed", colour = "#707070", linewidth = 0.6) +
  geom_segment(aes(x = lower, xend = upper, yend = 1), linewidth = 1.4, colour = "#8c1515") +
  geom_point(size = 4.5, colour = "#8c1515") +
  geom_text(aes(label = label), y = 1.2, size = 5.2) +
  facet_wrap(~measure, scales = "free_x", nrow = 1) +
  scale_y_continuous(limits = c(0.8, 1.4), breaks = NULL) +
  labs(x = "Adjusted difference (each panel uses its own units and scale)", y = NULL,
       subtitle = "Points: model intercepts     Lines: 95% confidence intervals     Dashed line: no difference") +
  theme_classic(base_size = 18) +
  theme(axis.line.y = element_blank(), axis.ticks.y = element_blank(),
        strip.background = element_blank(), strip.text = element_text(face = "bold"),
        plot.subtitle = element_text(size = 14, margin = margin(b = 18)),
        axis.title.x = element_text(margin = margin(t = 18)),
        panel.spacing = grid::unit(1.5, "lines"), plot.margin = margin(16, 18, 14, 18))
ggsave("slides/figs/lampe-adjusted-estimates.png", p, width = 12, height = 3.7, dpi = 200, bg = "white")
ggsave("slides/figs/lampe-adjusted-estimates.svg", p, width = 12, height = 3.7, device = grDevices::svg)

stages <- rbind(
  data.frame(row = 2, stage = c("Fixation", "Picture", "Feedback", "Blank"),
             start = c(-750, 0, 600, 1000), end = c(0, 600, 1000, 2000),
             duration = c("750*", "600", "400", "1000")),
  data.frame(row = 1, stage = c("Fixation", "Picture", "Feedback", "Blank"),
             start = c(-750, 0, 2000, 2400), end = c(0, 2000, 2400, 3400),
             duration = c("750*", "2000", "400", "1000"))
)
stages$stage <- factor(stages$stage, levels = c("Fixation", "Picture", "Feedback", "Blank"))
p <- ggplot(stages) +
  geom_rect(aes(xmin = start, xmax = end, ymin = row - 0.25, ymax = row + 0.25, fill = stage),
            colour = "white", linewidth = 1) +
  geom_text(aes(x = (start + end) / 2, y = row, label = duration), size = 5) +
  geom_segment(aes(x = 600, xend = 600, y = 0.6, yend = 2.4),
               inherit.aes = FALSE, data = data.frame(x = 1),
               colour = "#8c1515", linetype = "dashed", linewidth = 0.8) +
  annotate("text", x = 600, y = 2.62, label = "600 ms response-onset goal", colour = "#8c1515", size = 5) +
  scale_fill_manual(values = c(Fixation = "#d9d9d9", Picture = "#e6c8a0", Feedback = "#b7cfdf", Blank = "#f1f1f1")) +
  scale_x_continuous(breaks = c(-750, 0, 600, 1000, 2000, 3000), limits = c(-850, 3500), expand = c(0, 0)) +
  scale_y_continuous(breaks = 1:2,
    labels = c("Experimental trial\n(no beep)", "Practice trial\n(beep at 600 ms)"),
    limits = c(0.55, 2.85), expand = c(0, 0)) +
  labs(x = "Time from picture onset (ms)", y = NULL, fill = NULL,
       caption = "Numbers inside bars: duration in ms. *Study fixation varies from 500 to 1000 ms; 750 ms is illustrated.") +
  theme_classic(base_size = 17) +
  theme(axis.line.y = element_blank(), axis.ticks.y = element_blank(),
        axis.text = element_text(colour = "#1a1a1a"),
        legend.position = "bottom", plot.caption = element_text(size = 12, hjust = 0),
        axis.title.x = element_text(margin = margin(t = 12)),
        plot.margin = margin(12, 18, 12, 12))
ggsave("slides/figs/lampe-trial-timing.png", p, width = 12, height = 5.3, dpi = 200, bg = "white")
ggsave("slides/figs/lampe-trial-timing.svg", p, width = 12, height = 5.3, device = grDevices::svg)
