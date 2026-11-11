import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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

export default function AreaStacked() {
  return (
    <Chart.Root
      config={config}
      label="Visitors"
      description="Combined traffic peaked in February at 505."
      style={{ width: "100%" }}
    >
      <AreaChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          padding={{ left: 16, right: 16 }}
        />
        <Tooltip content={<Chart.TooltipContent indicator="line" />} />
        <Legend content={<Chart.LegendContent />} />
        <Area
          dataKey="mobile"
          stackId="a"
          type="natural"
          stroke={seriesColor("mobile")}
          fill={seriesColor("mobile")}
          fillOpacity={0.4}
        />
        <Area
          dataKey="desktop"
          stackId="a"
          type="natural"
          stroke={seriesColor("desktop")}
          fill={seriesColor("desktop")}
          fillOpacity={0.4}
        />
      </AreaChart>
    </Chart.Root>
  );
}
