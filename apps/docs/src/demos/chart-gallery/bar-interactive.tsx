import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts";
import { Toggle, ToggleGroup } from "@dixy-ui/react";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];
const config = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;
type Series = keyof typeof config;
const total = (key: Series) => data.reduce((sum, row) => sum + row[key], 0);

export default function BarInteractive() {
  const [series, setSeries] = useState<Series>("desktop");
  return (
    <div style={{ display: "grid", gap: 16, width: "100%" }}>
      <ToggleGroup
        aria-label="Series"
        value={[series]}
        onValueChange={(values) => values[0] && setSeries(values[0] as Series)}
      >
        {(Object.keys(config) as Series[]).map((key) => (
          <Toggle key={key} value={key} variant="outline" color="neutral">
            {config[key].label} · {total(key).toLocaleString()}
          </Toggle>
        ))}
      </ToggleGroup>
      <Chart.Root
        config={config}
        label={`${config[series].label} visitors`}
        description={`${total(series).toLocaleString()} visitors, January to June.`}
      >
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <Tooltip content={<Chart.TooltipContent hideLabel />} />
          <Bar dataKey={series} fill={seriesColor(series)} radius={4} />
        </BarChart>
      </Chart.Root>
    </div>
  );
}
