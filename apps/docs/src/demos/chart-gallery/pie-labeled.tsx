import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
];
const config = {
  chrome: { label: "Chrome" },
  safari: { label: "Safari" },
  firefox: { label: "Firefox" },
  edge: { label: "Edge" },
  other: { label: "Other" },
} satisfies ChartConfig;

export default function PieLabeled() {
  return (
    <Chart.Root
      config={config}
      label="Visitors by browser"
      description="Values sit beside each slice, joined by a leader line."
      aspectRatio="4 / 3"
      style={{ width: "100%" }}
    >
      <PieChart accessibilityLayer>
        <Tooltip
          content={<Chart.TooltipContent nameKey="browser" hideLabel />}
        />
        <Pie
          data={data}
          dataKey="visitors"
          nameKey="browser"
          outerRadius="70%"
          label
          labelLine
        >
          {data.map((row) => (
            <Cell key={row.browser} fill={seriesColor(row.browser)} />
          ))}
        </Pie>
        <Legend content={<Chart.LegendContent nameKey="value" />} />
      </PieChart>
    </Chart.Root>
  );
}
