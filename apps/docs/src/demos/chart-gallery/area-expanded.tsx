import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { month: "Jan", desktop: 186, mobile: 80, tablet: 45 },
  { month: "Feb", desktop: 305, mobile: 200, tablet: 100 },
  { month: "Mar", desktop: 237, mobile: 120, tablet: 150 },
  { month: "Apr", desktop: 73, mobile: 190, tablet: 50 },
  { month: "May", desktop: 209, mobile: 130, tablet: 100 },
  { month: "Jun", desktop: 214, mobile: 140, tablet: 160 },
];
const config = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
  tablet: { label: "Tablet" },
} satisfies ChartConfig;
const percent = (value: number) => `${Math.round(value * 100)}%`;

export default function AreaExpanded() {
  return (
    <Chart.Root
      config={config}
      label="Share of visitors"
      description="Mobile's share was highest in April, at 61%."
      style={{ width: "100%" }}
    >
      <AreaChart data={data} stackOffset="expand" accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          padding={{ left: 16, right: 16 }}
        />
        <YAxis
          tickFormatter={percent}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip content={<Chart.TooltipContent />} />
        <Legend content={<Chart.LegendContent />} />
        {(["tablet", "mobile", "desktop"] as const).map((key) => (
          <Area
            key={key}
            dataKey={key}
            stackId="a"
            type="natural"
            stroke={seriesColor(key)}
            fill={seriesColor(key)}
            fillOpacity={0.5}
          />
        ))}
      </AreaChart>
    </Chart.Root>
  );
}
