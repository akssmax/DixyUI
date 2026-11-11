import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
];
const config = {
  chrome: { label: "Chrome" },
  safari: { label: "Safari" },
  firefox: { label: "Firefox" },
  edge: { label: "Edge" },
  other: { label: "Other" },
} satisfies ChartConfig;
const total = data.reduce((sum, row) => sum + row.visitors, 0);

export default function PieDonut() {
  return (
    <Chart.Root
      config={config}
      label="Visitors by browser"
      description={`${total} visitors; Chrome is the largest share at 30%.`}
      aspectRatio="1"
      style={{ width: "100%", maxWidth: 320, marginInline: "auto" }}
    >
      <PieChart accessibilityLayer>
        <Tooltip
          content={<Chart.TooltipContent nameKey="browser" hideLabel />}
        />
        <Pie
          data={data}
          dataKey="visitors"
          nameKey="browser"
          innerRadius="60%"
          strokeWidth={4}
        >
          {data.map((row) => (
            <Cell key={row.browser} fill={seriesColor(row.browser)} />
          ))}
          {/* No position prop: "center" hands Label a cartesian box without cx. */}
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
                    {total.toLocaleString()}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    dy="1.5em"
                    className="dixy-charts-center-label"
                  >
                    Visitors
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </Chart.Root>
  );
}
