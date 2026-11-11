import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Tooltip,
} from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [{ month: "June", desktop: 214, mobile: 140 }];
const config = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;
const total = data[0]!.desktop + data[0]!.mobile;

export default function RadialStacked() {
  return (
    <Chart.Root
      config={config}
      label="June visitors"
      description={`${total} visitors in June; desktop is 214 of them, about 60%.`}
      aspectRatio="2 / 1.2"
      style={{ width: "100%", maxWidth: 360, marginInline: "auto" }}
    >
      {/* A half ring: 180° to 0°, centered low in the box. */}
      <RadialBarChart
        data={data}
        startAngle={180}
        endAngle={0}
        cy="80%"
        innerRadius="110%"
        outerRadius="160%"
        accessibilityLayer
      >
        <Tooltip content={<Chart.TooltipContent hideLabel />} />
        {/* The angle domain is the stacked total, so both series fit the arc. */}
        <PolarAngleAxis type="number" domain={[0, total]} tick={false} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox)) return null;
              return (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                  <tspan
                    x={viewBox.cx}
                    dy="-1.4em"
                    className="dixy-charts-center-value"
                  >
                    {total}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    dy="1.6em"
                    className="dixy-charts-center-label"
                  >
                    Visitors
                  </tspan>
                </text>
              );
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="desktop"
          stackId="a"
          cornerRadius={6}
          fill={seriesColor("desktop")}
        />
        <RadialBar
          dataKey="mobile"
          stackId="a"
          cornerRadius={6}
          fill={seriesColor("mobile")}
        />
      </RadialBarChart>
    </Chart.Root>
  );
}
