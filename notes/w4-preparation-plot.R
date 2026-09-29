# Observed means from Roelofs (1996), Experiment 1, Table 2, p. 863.
# Reviewed in Roelofs (2000), pp. 98 to 99. Positive values mean time saved.
# Simple words: 648 - 618 = 30 ms. Compounds: 699 - 625 = 74 ms.
library(ggplot2)
results <- data.frame(
  condition = factor(c("Syllable only\nbijbel-type words", "Syllable + morpheme\nbijrol-type compounds"),
    levels = c("Syllable + morpheme\nbijrol-type compounds", "Syllable only\nbijbel-type words")),
  benefit = c(30, 74),
  label = c("30 ms", "74 ms")
)
p <- ggplot(results, aes(x = benefit, y = condition)) +
  geom_segment(aes(x = 0, xend = benefit, yend = condition), linewidth = 1.4, colour = "#d8d2c7") +
  geom_point(size = 5.5, colour = "#8c1515") +
  geom_text(aes(label = label), nudge_y = 0.19, size = 6, colour = "#1a1a1a") +
  scale_x_continuous(limits = c(0, 95), breaks = seq(0, 80, 20), expand = c(0.015, 0)) +
  scale_y_discrete(expand = expansion(add = 0.5)) +
  labs(x = "Preparation benefit (ms): mixed minus shared", y = NULL) +
  theme_minimal(base_size = 21, base_family = "sans") +
  theme(panel.grid.major.y = element_blank(), panel.grid.minor = element_blank(),
        axis.text = element_text(colour = "#1a1a1a"),
        axis.title.x = element_text(margin = margin(t = 18)),
        plot.margin = margin(16, 22, 12, 14))
ggsave("slides/figs/bij-preparation.png", p, width = 11, height = 4.1, dpi = 180, bg = "white")
