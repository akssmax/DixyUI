import { Area, AreaChart, CartesianGrid, Tooltip, XAxis } from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { month: "Jan", seats: 12 },
  { month: "Feb", seats: 12 },
  { month: "Mar", seats: 18 },
  { month: "Apr", seats: 18 },
  { month: "May", seats: 25 },
  { month: "Jun", seats: 31 },
];
const config = { seats: { label: "Seats" } } satisfies ChartConfig;

export default function AreaStep() {
  return (
    <Chart.Root
      config={config}
      label="Paid seats"
      description="Seats change in steps at each renewal: 12 to 31 by June."
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
        <Tooltip content={<Chart.TooltipContent hideLabel />} />
        <Area
          dataKey="seats"
          type="step"
          stroke={seriesColor("seats")}
          fill={seriesColor("seats")}
          fillOpacity={0.3}
        />
      </AreaChart>
    </Chart.Root>
  );
}
