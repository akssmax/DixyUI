import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { month: "Jan", price: 12 },
  { month: "Feb", price: 12 },
  { month: "Mar", price: 15 },
  { month: "Apr", price: 15 },
  { month: "May", price: 15 },
  { month: "Jun", price: 18 },
];
const config = { price: { label: "Price" } } satisfies ChartConfig;
const dollars = (value: unknown) => `$${value}`;

export default function LineStep() {
  return (
    <Chart.Root
      config={config}
      label="Plan price"
      description="Two price rises: $12 to $15 in March, then $18 in June."
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
        <YAxis
          tickFormatter={dollars}
          tickLine={false}
          axisLine={false}
          width={36}
          domain={[0, 20]}
        />
        <Tooltip
          content={<Chart.TooltipContent hideLabel valueFormatter={dollars} />}
        />
        <Line
          dataKey="price"
          type="step"
          stroke={seriesColor("price")}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </Chart.Root>
  );
}
