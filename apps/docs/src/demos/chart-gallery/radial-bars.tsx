import { Legend, RadialBar, RadialBarChart, Tooltip } from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const config = {
  chrome: { label: "Chrome" },
  safari: { label: "Safari" },
  firefox: { label: "Firefox" },
  edge: { label: "Edge" },
  other: { label: "Other" },
} satisfies ChartConfig;
// Radial bars read their color from each row's fill.
const data = [
  { browser: "other", visitors: 90 },
  { browser: "edge", visitors: 173 },
  { browser: "firefox", visitors: 187 },
  { browser: "safari", visitors: 200 },
  { browser: "chrome", visitors: 275 },
].map((row) => ({ ...row, fill: seriesColor(row.browser) }));

export default function RadialBars() {
  return (
    <Chart.Root
      config={config}
      label="Visitors by browser"
      description="Chrome's ring is longest, at 275; each ring sits on a track."
      aspectRatio="1"
      style={{ width: "100%", maxWidth: 360, marginInline: "auto" }}
    >
      <RadialBarChart
        data={data}
        innerRadius="25%"
        outerRadius="100%"
        startAngle={90}
        endAngle={-270}
        accessibilityLayer
      >
        <Tooltip
          content={<Chart.TooltipContent nameKey="browser" hideLabel />}
        />
        <RadialBar dataKey="visitors" background cornerRadius={8} />
        <Legend content={<Chart.LegendContent nameKey="browser" />} />
      </RadialBarChart>
    </Chart.Root>
  );
}
