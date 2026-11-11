import { Area, AreaChart, CartesianGrid, Tooltip, XAxis } from "recharts";
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

export default function AreaGradient() {
  return (
    <Chart.Root
      config={config}
      label="Visitors"
      description="Chart.Gradient fades each series color, so fills follow the theme."
      style={{ width: "100%" }}
    >
      <AreaChart data={data} accessibilityLayer>
        <Chart.Gradient id="gallery-fill-desktop" series="desktop" />
        <Chart.Gradient id="gallery-fill-mobile" series="mobile" />
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          padding={{ left: 16, right: 16 }}
        />
        <Tooltip content={<Chart.TooltipContent />} />
        <Area
          dataKey="mobile"
          stackId="a"
          type="natural"
          stroke={seriesColor("mobile")}
          fill="url(#gallery-fill-mobile)"
        />
        <Area
          dataKey="desktop"
          stackId="a"
          type="natural"
          stroke={seriesColor("desktop")}
          fill="url(#gallery-fill-desktop)"
        />
      </AreaChart>
    </Chart.Root>
  );
}
