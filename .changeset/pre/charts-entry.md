---
"@dixy-ui/react": minor
"@dixy-ui/tokens": minor
---

New optional `@dixy-ui/react/charts` entry: Recharts, dressed in Dixy. `Chart.Root` maps a series config (labels, icons, colors) to `--dixy-series-<key>` variables and adds a caption, loading and empty states, and an optional data table shown behind a disclosure or through a Chart | Table toggle (`tableDisplay`); `Chart.TooltipContent`, `Chart.LegendContent` and `Chart.DataTable` read the same config. Import `@dixy-ui/react/charts.css` after the core styles and install the optional peer `recharts` (3.10+). Tokens add `chart.1`–`chart.6` series colors (series 1 follows the accent; 2–6 are rebound per accent so none repeats its hue) and `chartSeriesFamilies()`, with `chart.grid`, `chart.axis` and `chart.cursor`, each series at least 3:1 against canvas, surface and raised surfaces in every accent and neutral. The core entry and its existing `Chart` are unchanged.
