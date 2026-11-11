import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis } from "recharts";
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

export default function BarStacked() {
  return (
    <Chart.Root
      config={config}
      label="Visitors"
      description="February was the busiest month, with 505 visitors."
      style={{ width: "100%" }}
    >
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Tooltip content={<Chart.TooltipContent />} />
        <Legend content={<Chart.LegendContent />} />
        {/* Round only the outer ends of the stack. */}
        <Bar
          dataKey="desktop"
          stackId="a"
          fill={seriesColor("desktop")}
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="mobile"
          stackId="a"
          fill={seriesColor("mobile")}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </Chart.Root>
  );
}
