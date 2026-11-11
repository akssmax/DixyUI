import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { skill: "Speed", current: 82, previous: 64 },
  { skill: "Accuracy", current: 74, previous: 70 },
  { skill: "Coverage", current: 58, previous: 61 },
  { skill: "Clarity", current: 90, previous: 72 },
  { skill: "Cost", current: 66, previous: 55 },
];
const config = {
  current: { label: "This release" },
  previous: { label: "Last release" },
} satisfies ChartConfig;

export default function RadarMultiple() {
  return (
    <Chart.Root
      config={config}
      label="Release scorecard"
      description="Better on four of five measures; coverage slipped from 61 to 58."
      aspectRatio="1"
      style={{ width: "100%", maxWidth: 360, marginInline: "auto" }}
    >
      <RadarChart data={data} accessibilityLayer>
        <Tooltip content={<Chart.TooltipContent indicator="line" />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        {/* Draw the comparison first so the current release sits on top. */}
        <Radar
          dataKey="previous"
          stroke={seriesColor("previous")}
          fill={seriesColor("previous")}
          fillOpacity={0.25}
        />
        <Radar
          dataKey="current"
          stroke={seriesColor("current")}
          fill={seriesColor("current")}
          fillOpacity={0.5}
        />
        <Legend content={<Chart.LegendContent />} />
      </RadarChart>
    </Chart.Root>
  );
}
