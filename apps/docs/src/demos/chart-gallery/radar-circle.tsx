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
  { month: "Jan", mobile: 80 },
  { month: "Feb", mobile: 200 },
  { month: "Mar", mobile: 120 },
  { month: "Apr", mobile: 190 },
  { month: "May", mobile: 130 },
  { month: "Jun", mobile: 140 },
];
const config = { mobile: { label: "Mobile", color: 2 } } satisfies ChartConfig;

export default function RadarCircle() {
  return (
    <Chart.Root
      config={config}
      label="Mobile visitors"
      description="Circular grid and dots; February and April stand out."
      aspectRatio="1"
      style={{ width: "100%", maxWidth: 360, marginInline: "auto" }}
    >
      <RadarChart data={data} accessibilityLayer>
        <Tooltip content={<Chart.TooltipContent hideLabel />} />
        <PolarGrid gridType="circle" />
        <PolarAngleAxis dataKey="month" />
        <Radar
          dataKey="mobile"
          stroke={seriesColor("mobile")}
          fill={seriesColor("mobile")}
          fillOpacity={0.35}
          dot={{ r: 4, fillOpacity: 1 }}
        />
      </RadarChart>
    </Chart.Root>
  );
}
