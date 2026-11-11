import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  Tooltip,
  XAxis,
} from "recharts";
import { Chart, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { month: "Jan", change: 12 },
  { month: "Feb", change: 28 },
  { month: "Mar", change: -9 },
  { month: "Apr", change: -21 },
  { month: "May", change: 6 },
  { month: "Jun", change: 17 },
];
// A semantic color for losses, instead of a palette series.
const config = {
  change: { label: "Net change" },
  loss: {
    label: "Loss",
    color: "var(--dixy-color-background-action-destructive)",
  },
} satisfies ChartConfig;

export default function BarNegative() {
  return (
    <Chart.Root
      config={config}
      label="Net subscribers"
      description="Two losing months, March and April, then growth resumed."
      style={{ width: "100%" }}
    >
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ReferenceLine y={0} stroke="var(--dixy-color-chart-axis)" />
        <Tooltip content={<Chart.TooltipContent hideLabel />} />
        <Bar dataKey="change" radius={4}>
          <LabelList dataKey="change" position="top" />
          {data.map((row) => (
            <Cell
              key={row.month}
              fill={
                row.change < 0
                  ? "var(--dixy-series-loss)"
                  : "var(--dixy-series-change)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </Chart.Root>
  );
}
