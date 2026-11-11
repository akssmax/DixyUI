import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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

export default function BarLabeled() {
  return (
    <Chart.Root
      config={config}
      label="Desktop visitors"
      description="Values sit above each bar, and the month inside it."
      style={{ width: "100%" }}
    >
      <BarChart data={data} margin={{ top: 24 }} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" hide />
        <Tooltip content={<Chart.TooltipContent hideLabel />} />
        <Bar dataKey="desktop" fill={seriesColor("desktop")} radius={6}>
          <LabelList dataKey="desktop" position="top" />
          {/* Inside a fill: white in light, ink in dark. */}
          <LabelList
            dataKey="month"
            position="insideBottom"
            offset={10}
            className="dixy-charts-label-inside"
          />
        </Bar>
      </BarChart>
    </Chart.Root>
  );
}
