import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
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
// No colors given: series take --dixy-color-chart-1, -2 … in order.
const config = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;

const browsers = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
];
const browserConfig = {
  chrome: { label: "Chrome" },
  safari: { label: "Safari" },
  firefox: { label: "Firefox" },
  edge: { label: "Edge" },
  other: { label: "Other" },
} satisfies ChartConfig;

type Indicator = "dot" | "line" | "dashed";
export default function ChartsExample({
  type = "bar",
  indicator = "dot",
  legend = true,
  grid = true,
  status = "ready",
  table = "none",
}: {
  type?: string;
  indicator?: string;
  legend?: boolean;
  grid?: boolean;
  status?: string;
  table?: string;
}) {
  const tooltip = (
    <Tooltip
      content={<Chart.TooltipContent indicator={indicator as Indicator} />}
    />
  );
  const legendPart = legend ? (
    <Legend content={<Chart.LegendContent />} />
  ) : null;
  const axes = (
    <>
      {grid ? <CartesianGrid vertical={false} /> : null}
      <XAxis
        dataKey="month"
        tickLine={false}
        axisLine={false}
        // Lines and areas start on the plot edge; pad so end labels don't clip.
        padding={type === "bar" ? undefined : { left: 16, right: 16 }}
      />
      <YAxis tickLine={false} axisLine={false} width={32} />
    </>
  );
  const rootStatus = status as "ready" | "loading" | "empty";
  // Most dashboards need no table: the description carries the takeaway.
  // Add one when readers need the values: a disclosure for reports, a
  // Chart | Table toggle for analytical views.
  const tableDisplay = table === "toggle" ? "toggle" : "disclosure";
  const withTable = table !== "none";

  if (type === "pie")
    return (
      <Chart.Root
        config={browserConfig}
        label="Visitors by browser"
        description="Chrome leads with 275 of 925 visitors, about 30%."
        status={rootStatus}
        aspectRatio="4 / 3"
        style={{ width: "min(100%, 32rem)" }}
        tableDisplay={tableDisplay}
        table={
          withTable ? (
            <Chart.DataTable
              data={browsers}
              labelKey="browser"
              labelHeading="Browser"
              keys={["visitors"]}
            />
          ) : undefined
        }
      >
        <PieChart accessibilityLayer>
          <Tooltip
            content={
              <Chart.TooltipContent
                nameKey="browser"
                hideLabel
                indicator={indicator as Indicator}
              />
            }
          />
          <Pie
            data={browsers}
            dataKey="visitors"
            nameKey="browser"
            innerRadius="45%"
          >
            {browsers.map((row) => (
              <Cell key={row.browser} fill={seriesColor(row.browser)} />
            ))}
          </Pie>
          {legend ? (
            <Legend content={<Chart.LegendContent nameKey="value" />} />
          ) : null}
        </PieChart>
      </Chart.Root>
    );

  return (
    <Chart.Root
      config={config}
      label="Visitors by device"
      description="Desktop peaked in February at 305; mobile led only in April."
      status={rootStatus}
      style={{ width: "min(100%, 32rem)" }}
      tableDisplay={tableDisplay}
      table={
        withTable ? (
          <Chart.DataTable data={data} labelKey="month" labelHeading="Month" />
        ) : undefined
      }
    >
      {type === "line" ? (
        <LineChart data={data} accessibilityLayer>
          {axes}
          {tooltip}
          {legendPart}
          <Line
            dataKey="desktop"
            stroke={seriesColor("desktop")}
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="mobile"
            stroke={seriesColor("mobile")}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      ) : type === "area" ? (
        <AreaChart data={data} accessibilityLayer>
          {axes}
          {tooltip}
          {legendPart}
          <Area
            dataKey="mobile"
            stackId="a"
            stroke={seriesColor("mobile")}
            fill={seriesColor("mobile")}
            fillOpacity={0.35}
          />
          <Area
            dataKey="desktop"
            stackId="a"
            stroke={seriesColor("desktop")}
            fill={seriesColor("desktop")}
            fillOpacity={0.35}
          />
        </AreaChart>
      ) : (
        <BarChart data={data} accessibilityLayer>
          {axes}
          {tooltip}
          {legendPart}
          <Bar dataKey="desktop" fill={seriesColor("desktop")} radius={4} />
          <Bar dataKey="mobile" fill={seriesColor("mobile")} radius={4} />
        </BarChart>
      )}
    </Chart.Root>
  );
}
