import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
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

export default function RadarBasic() {
  return (
    <Chart.Root
      config={config}
      label="Desktop visitors"
      description="A deep dent in April; the other months stay above 180."
      aspectRatio="1"
      style={{ width: "100%", maxWidth: 360, marginInline: "auto" }}
    >
      <RadarChart data={data} accessibilityLayer>
        <Tooltip content={<Chart.TooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="month" />
        <Radar
          dataKey="desktop"
          stroke={seriesColor("desktop")}
          fill={seriesColor("desktop")}
          fillOpacity={0.5}
        />
      </RadarChart>
    </Chart.Root>
  );
}
