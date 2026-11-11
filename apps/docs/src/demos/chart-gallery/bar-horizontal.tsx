import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { Chart, seriesColor, type ChartConfig } from "@dixy-ui/react/charts";
import "@dixy-ui/react/charts.css";

const data = [
  { page: "Pricing", views: 1840 },
  { page: "Docs", views: 1420 },
  { page: "Blog", views: 960 },
  { page: "Careers", views: 410 },
  { page: "About", views: 260 },
];
const config = { views: { label: "Views" } } satisfies ChartConfig;

export default function BarHorizontal() {
  return (
    <Chart.Root
      config={config}
      label="Top pages"
      description="Pricing drew the most views, 1,840."
      aspectRatio="4 / 3"
      style={{ width: "100%" }}
    >
      {/* layout="vertical" lays bars out horizontally: categories on Y. */}
      <BarChart
        data={data}
        layout="vertical"
        margin={{ right: 48 }}
        accessibilityLayer
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="page"
          type="category"
          tickLine={false}
          axisLine={false}
          width={64}
        />
        <Tooltip content={<Chart.TooltipContent hideLabel />} />
        <Bar dataKey="views" fill={seriesColor("views")} radius={4}>
          <LabelList dataKey="views" position="right" />
        </Bar>
      </BarChart>
    </Chart.Root>
  );
}
