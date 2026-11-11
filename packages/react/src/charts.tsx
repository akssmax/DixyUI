/**
 * @dixy-ui/react/charts: Recharts, dressed in Dixy. The approach follows
 * shadcn/ui charts (MIT): compose Recharts primitives yourself; Dixy adds the
 * series config, themed palette, tooltip, legend, states and a data table.
 * Needs the optional peer recharts. Import "@dixy-ui/react/charts.css"
 * alongside the core styles.
 */
export {
  Chart,
  seriesColor,
  seriesVariable,
  useChartConfig,
  type ChartConfig,
  type ChartSeriesConfig,
  type ChartPaletteIndex,
  type ChartRootProps,
  type ChartTableDisplay,
  type ChartView,
  type ChartTooltipContentProps,
  type ChartTooltipItem,
  type ChartLegendContentProps,
  type ChartLegendItem,
  type ChartDataTableProps,
  type ChartGradientProps,
} from "./charts/chart";
