import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis } from "recharts";
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
const peak = data.reduce((best, row) =>
  row.desktop > best.desktop ? row : best,
);

export default function BarHighlight() {
  return (
    <Chart.Root
      config={config}
      label="Desktop visitors"
      description={`${peak.month} was the peak, at ${peak.desktop}. Other months fade back.`}
      style={{ width: "100%" }}
    >
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Tooltip content={<Chart.TooltipContent hideLabel />} />
        <Bar dataKey="desktop" fill={seriesColor("desktop")} radius={4}>
          {data.map((row) => (
            <Cell key={row.month} fillOpacity={row === peak ? 1 : 0.35} />
          ))}
        </Bar>
      </BarChart>
    </Chart.Root>
  );
}
