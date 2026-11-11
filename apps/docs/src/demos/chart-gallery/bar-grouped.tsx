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

export default function BarGrouped() {
  return (
    <Chart.Root
      config={config}
      label="Visitors by device"
      description="Desktop led every month except April."
      style={{ width: "100%" }}
    >
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Tooltip content={<Chart.TooltipContent indicator="dashed" />} />
        <Legend content={<Chart.LegendContent />} />
        <Bar dataKey="desktop" fill={seriesColor("desktop")} radius={4} />
        <Bar dataKey="mobile" fill={seriesColor("mobile")} radius={4} />
      </BarChart>
    </Chart.Root>
  );
}
