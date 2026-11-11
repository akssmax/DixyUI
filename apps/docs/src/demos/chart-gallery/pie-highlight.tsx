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
const focus = "safari";

export default function PieHighlight() {
  return (
    <Chart.Root
      config={config}
      label="Safari's share"
      description="Safari is 200 of 925 visitors, about 22%."
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
          innerRadius="40%"
          outerRadius="80%"
        >
          {data.map((row) => (
            <Cell
              key={row.browser}
              fill={seriesColor(row.browser)}
              fillOpacity={row.browser === focus ? 1 : 0.3}
            />
          ))}
        </Pie>
        <Legend content={<Chart.LegendContent nameKey="value" />} />
      </PieChart>
    </Chart.Root>
  );
}
