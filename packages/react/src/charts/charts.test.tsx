import type React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Bar, BarChart } from "recharts";
import { expect, it } from "vitest";
import {
  Chart,
  seriesColor,
  seriesVariable,
  type ChartConfig,
} from "../charts";

const config = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile", color: 4 },
  "tablet sales": { label: "Tablet", color: { light: "#123", dark: "#abc" } },
  other: { color: "oklch(0.6 0.1 30)" },
} satisfies ChartConfig;
const data = [
  { month: "Jan", desktop: 1200, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
];
const plot = (
  <BarChart data={data}>
    <Bar dataKey="desktop" fill={seriesColor("desktop")} />
  </BarChart>
);
// jsdom has no layout, so ResponsiveContainer renders an empty box. The table
// slot sits outside it and still has the chart config in context.
const inChart = (part: React.ReactNode) => (
  <Chart.Root config={config} label="Visitors" table={part}>
    {plot}
  </Chart.Root>
);

it("maps config to series variables: auto palette, index, CSS color and light-dark", () => {
  render(
    <Chart.Root config={config} label="Visitors">
      {plot}
    </Chart.Root>,
  );
  const figure = screen.getByRole("figure", { name: "Visitors" });
  const style = figure.style;
  expect(style.getPropertyValue("--dixy-series-desktop")).toBe(
    "var(--dixy-color-chart-1)",
  );
  expect(style.getPropertyValue("--dixy-series-mobile")).toBe(
    "var(--dixy-color-chart-4)",
  );
  expect(style.getPropertyValue("--dixy-series-tablet_sales")).toBe(
    "light-dark(#123, #abc)",
  );
  expect(style.getPropertyValue("--dixy-series-other")).toBe(
    "oklch(0.6 0.1 30)",
  );
  expect(seriesVariable("a.b c")).toBe("--dixy-series-a_b_c");
});

it("names the figure from the caption, even when the caption is hidden", () => {
  render(
    <Chart.Root
      config={config}
      label="Revenue"
      description="Last two months"
      hideLabel
    >
      {plot}
    </Chart.Root>,
  );
  const figure = screen.getByRole("figure", { name: "Revenue" });
  expect(figure).toHaveAccessibleDescription("Last two months");
  expect(figure.querySelector("figcaption")).toHaveAttribute("data-hidden");
});

it("renders loading and empty states instead of the plot and table", () => {
  const { rerender } = render(
    <Chart.Root
      config={config}
      label="Visitors"
      status="loading"
      table={<Chart.DataTable data={data} labelKey="month" />}
    >
      {plot}
    </Chart.Root>,
  );
  expect(screen.getByRole("figure")).toHaveAttribute("aria-busy", "true");
  expect(screen.queryByText("View chart data")).toBeNull();
  rerender(
    <Chart.Root
      config={config}
      label="Visitors"
      status="empty"
      emptyMessage="Nothing yet"
    >
      {plot}
    </Chart.Root>,
  );
  expect(screen.getByText("Nothing yet")).toBeVisible();
});

it("tooltip content uses config labels, series colors and locale numbers", () => {
  render(
    inChart(
      <Chart.TooltipContent
        active
        label="Jan"
        payload={[
          { dataKey: "desktop", value: 1200, color: "red" },
          { dataKey: "unknown", value: 3, color: "red" },
        ]}
      />,
    ),
  );
  expect(screen.getByText("Jan")).toBeInTheDocument();
  const items = screen.getAllByRole("listitem");
  expect(within(items[0]!).getByText("Desktop")).toBeInTheDocument();
  expect(within(items[0]!).getByText("1,200")).toBeInTheDocument();
  const swatch = items[0]!.querySelector<HTMLElement>(".dixy-charts-swatch")!;
  expect(swatch.style.background).toBe("var(--dixy-series-desktop)");
  // Keys outside the config fall back to the Recharts color and raw key.
  expect(within(items[1]!).getByText("unknown")).toBeInTheDocument();
});

it("tooltip renders nothing while inactive", () => {
  const { container } = render(
    inChart(
      <Chart.TooltipContent
        active={false}
        payload={[{ dataKey: "desktop" }]}
      />,
    ),
  );
  expect(container.querySelector(".dixy-charts-tooltip")).toBeNull();
});

it("legend content follows config order, uses config labels and marks inactive series", () => {
  render(
    inChart(
      <Chart.LegendContent
        payload={[
          { dataKey: "mobile", value: "mobile", inactive: true },
          { dataKey: "stray", value: "stray" },
          { dataKey: "desktop", value: "desktop" },
        ]}
      />,
    ),
  );
  // Config order, not Recharts' alphabetical order; unknown keys go last.
  expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
    "Desktop",
    "Mobile",
    "stray",
  ]);
  expect(screen.getByText("Mobile").closest("li")).toHaveAttribute(
    "data-inactive",
  );
});

it("data table exposes every value behind a native disclosure and passes axe", async () => {
  const user = userEvent.setup();
  const { container } = render(
    <Chart.Root
      config={{ desktop: config.desktop, mobile: config.mobile }}
      label="Visitors"
      table={
        <Chart.DataTable data={data} labelKey="month" labelHeading="Month" />
      }
    >
      {plot}
    </Chart.Root>,
  );
  await user.click(screen.getByText("View chart data"));
  const table = screen.getByRole("table");
  expect(
    within(table).getByRole("columnheader", { name: "Mobile" }),
  ).toBeInTheDocument();
  expect(
    within(table).getByRole("rowheader", { name: "Feb" }),
  ).toBeInTheDocument();
  expect(within(table).getByText("1,200")).toBeInTheDocument();
  const results = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
    },
    rules: { "color-contrast": { enabled: false } },
  });
  expect(results.violations).toEqual([]);
});

it("parts throw a clear error outside Chart.Root", () => {
  expect(() => render(<Chart.LegendContent payload={[]} />)).toThrow(
    "inside Chart.Root",
  );
});

it("table is optional: no table slot means no disclosure or toggle", () => {
  render(
    <Chart.Root config={config} label="Visitors" tableDisplay="toggle">
      {plot}
    </Chart.Root>,
  );
  expect(screen.queryByText("View chart data")).toBeNull();
  expect(screen.queryByRole("group", { name: "View" })).toBeNull();
});

it("toggle display swaps the plot for an inline table and back, by pointer and keyboard", async () => {
  const user = userEvent.setup();
  const views: string[] = [];
  const { container } = render(
    <Chart.Root
      config={{ desktop: config.desktop, mobile: config.mobile }}
      label="Visitors"
      tableDisplay="toggle"
      onViewChange={(view) => views.push(view)}
      table={<Chart.DataTable data={data} labelKey="month" />}
    >
      {plot}
    </Chart.Root>,
  );
  const group = screen.getByRole("group", { name: "View" });
  const chart = within(group).getByRole("button", { name: "Chart" });
  const table = within(group).getByRole("button", { name: "Table" });
  expect(chart).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.queryByText("View chart data")).toBeNull();

  await user.click(table);
  // Inline: the table shows at once, with no disclosure around it.
  expect(screen.getByRole("table")).toBeVisible();
  expect(container.querySelector("details")).toBeNull();
  expect(container.querySelector(".dixy-charts-plot")).toBeNull();
  expect(screen.getByRole("figure")).toHaveAttribute("data-view", "table");

  // Pressing the active view again never leaves the figure empty.
  await user.click(table);
  expect(table).toHaveAttribute("aria-pressed", "true");

  table.focus();
  await user.keyboard("{ArrowLeft}{Enter}");
  expect(chart).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("table")).toBeNull();
  expect(views).toEqual(["table", "chart"]);

  const results = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
    },
    rules: { "color-contrast": { enabled: false } },
  });
  expect(results.violations).toEqual([]);
});

it("controlled view follows the prop; the toggle hides while loading", () => {
  const table = <Chart.DataTable data={data} labelKey="month" />;
  const { rerender } = render(
    <Chart.Root
      config={config}
      label="Visitors"
      tableDisplay="toggle"
      view="table"
      table={table}
    >
      {plot}
    </Chart.Root>,
  );
  expect(screen.getByRole("table")).toBeInTheDocument();
  rerender(
    <Chart.Root
      config={config}
      label="Visitors"
      tableDisplay="toggle"
      view="table"
      status="loading"
      table={table}
    >
      {plot}
    </Chart.Root>,
  );
  expect(screen.queryByRole("group", { name: "View" })).toBeNull();
  expect(screen.queryByRole("table")).toBeNull();
});
