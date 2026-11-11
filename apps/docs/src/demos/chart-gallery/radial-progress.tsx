import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const goal = 1200;
const data = [{ name: "signups", value: 864 }];
const config = { signups: { label: "Sign-ups" } } satisfies ChartConfig;
const percent = Math.round((data[0]!.value / goal) * 100);

export default function RadialProgress() {
  return (
    <Chart.Root
      config={config}
      label="Sign-ups against goal"
      description={`864 of ${goal.toLocaleString()} sign-ups, ${percent}% of the quarter's goal.`}
      aspectRatio="1"
      style={{ width: "100%", maxWidth: 280, marginInline: "auto" }}
    >
      <RadialBarChart
        data={data}
        startAngle={90}
        endAngle={-270}
        innerRadius="72%"
        outerRadius="100%"
        accessibilityLayer
      >
        {/* A fixed domain makes the ring a share of the goal, not of the max. */}
        <PolarAngleAxis type="number" domain={[0, goal]} tick={false} />
        <RadialBar
          dataKey="value"
          background
          cornerRadius={12}
          fill={seriesColor("signups")}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox)) return null;
              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan x={viewBox.cx} className="dixy-charts-center-value">
                    {percent}%
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    dy="1.5em"
                    className="dixy-charts-center-label"
                  >
                    of goal
                  </tspan>
                </text>
              );
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </Chart.Root>
  );
}
