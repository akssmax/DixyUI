import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
} from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { month: "Jan", revenue: 42, target: 40 },
  { month: "Feb", revenue: 47, target: 44 },
  { month: "Mar", revenue: 45, target: 48 },
  { month: "Apr", revenue: 51, target: 52 },
  { month: "May", revenue: 58, target: 56 },
  { month: "Jun", revenue: 63, target: 60 },
];
// The target is a reference, not a series: a neutral, dashed line.
const config = {
  revenue: { label: "Revenue" },
  target: { label: "Target", color: "var(--dixy-color-chart-axis)" },
} satisfies ChartConfig;
const thousands = (value: unknown) => `$${value}k`;

export default function LineTarget() {
  return (
    <Chart.Root
      config={config}
      label="Revenue against target"
      description="Revenue missed target in March and April, then beat it."
      style={{ width: "100%" }}
    >
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          padding={{ left: 16, right: 16 }}
        />
        <Tooltip
          content={<Chart.TooltipContent valueFormatter={thousands} />}
        />
        <Legend content={<Chart.LegendContent />} />
        <Line
          dataKey="revenue"
          type="monotone"
          stroke={seriesColor("revenue")}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="target"
          type="monotone"
          stroke={seriesColor("target")}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </Chart.Root>
  );
}
