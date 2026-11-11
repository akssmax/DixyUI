import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
} from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
];
const config = { desktop: { label: "Desktop" } } satisfies ChartConfig;

export default function LineLabeled() {
  return (
    <Chart.Root
      config={config}
      label="Desktop visitors"
      description="Each point carries its value, so the chart reads without hovering."
      style={{ width: "100%" }}
    >
      <LineChart
        data={data}
        margin={{ top: 24, left: 16, right: 16 }}
        accessibilityLayer
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <Tooltip content={<Chart.TooltipContent hideLabel />} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke={seriesColor("desktop")}
          strokeWidth={2}
          dot={{ fill: seriesColor("desktop") }}
        >
          <LabelList dataKey="desktop" position="top" offset={12} />
        </Line>
      </LineChart>
    </Chart.Root>
  );
}
