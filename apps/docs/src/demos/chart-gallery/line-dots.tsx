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

export default function LineDots() {
  return (
    <Chart.Root
      config={config}
      label="Visitors by device"
      description="Mobile overtook desktop only in April."
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
        <Tooltip content={<Chart.TooltipContent />} />
        <Legend content={<Chart.LegendContent />} />
        {(["desktop", "mobile"] as const).map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="natural"
            stroke={seriesColor(key)}
            strokeWidth={2}
            dot={{ fill: seriesColor(key), r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </Chart.Root>
  );
}
