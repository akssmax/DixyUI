import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { ResponsiveContainer } from "recharts";
import { Table } from "../components/content";
import { Skeleton } from "../components/basic-controls";
import { ToggleGroup } from "../components/toggle-group";
import { Toggle } from "../components/toggle";

/** One of the six themed categorical colors, `--dixy-color-chart-1` … `-6`. */
export type ChartPaletteIndex = 1 | 2 | 3 | 4 | 5 | 6;
export interface ChartSeriesConfig {
  /** Human name used by the tooltip, legend and data table. */
  label?: ReactNode;
  /** Optional icon shown in place of the legend swatch. */
  icon?: ReactNode;
  /**
   * A palette index (1–6), any CSS color, or separate light and dark colors.
   * Defaults to the next palette color in config order.
   */
  color?: ChartPaletteIndex | string | { light: string; dark: string };
}
/** Maps each data key to its meaning. Keys become `--dixy-series-<key>`. */
export type ChartConfig = Record<string, ChartSeriesConfig>;

/** CSS custom property name for a series key; unsafe characters become `_`. */
export function seriesVariable(key: string): `--dixy-series-${string}` {
  return `--dixy-series-${key.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
/** `var(--dixy-series-<key>)`, for Recharts `fill` and `stroke` props. */
export function seriesColor(key: string): string {
  return `var(${seriesVariable(key)})`;
}
function resolveColor(color: ChartSeriesConfig["color"], index: number) {
  if (color === undefined) return `var(--dixy-color-chart-${(index % 6) + 1})`;
  if (typeof color === "number") return `var(--dixy-color-chart-${color})`;
  if (typeof color === "string") return color;
  // Theme sets color-scheme per appearance, so nested Themes resolve correctly.
  return `light-dark(${color.light}, ${color.dark})`;
}

const ChartContext = createContext<ChartConfig | null>(null);
/** How the table slot is shown; DataTable drops its disclosure in a toggle. */
const TableDisplayContext = createContext<ChartTableDisplay>("disclosure");
/** The nearest Chart.Root config. Throws outside a chart. */
export function useChartConfig(): ChartConfig {
  const config = useContext(ChartContext);
  if (!config) throw new Error("Chart parts must be used inside Chart.Root.");
  return config;
}

export interface ChartRootProps extends Omit<
  ComponentPropsWithRef<"figure">,
  "children"
> {
  /** Series labels and colors, keyed by data key. */
  config: ChartConfig;
  /** Visible caption and the figure's accessible name. */
  label: ReactNode;
  /**
   * One sentence with the takeaway, e.g. "Desktop visits peaked in February
   * at 305." It describes the figure and the chart, and is the text
   * alternative for simple charts; add a table when readers need the values.
   */
  description?: ReactNode;
  /** Hide the caption visually while keeping it as the accessible name. */
  hideLabel?: boolean;
  /** ready renders the chart; loading a skeleton; empty the empty message. @default ready */
  status?: "ready" | "loading" | "empty";
  /** Shown when status is empty. @default No data to show */
  emptyMessage?: ReactNode;
  /** Plot box aspect ratio; any CSS aspect-ratio value. @default 16 / 9 */
  aspectRatio?: CSSProperties["aspectRatio"];
  /** One Recharts chart element, e.g. `<BarChart>`. */
  children: ReactElement;
  /** An alternative view of the data, typically Chart.DataTable. Optional. */
  table?: ReactNode;
  /**
   * disclosure shows the table behind "View chart data" under the plot;
   * toggle adds a Chart | Table switch to the header and swaps the plot for
   * the table. @default disclosure
   */
  tableDisplay?: ChartTableDisplay;
  /** Controlled view when tableDisplay is toggle. */
  view?: ChartView;
  /** Initial view when uncontrolled. @default chart */
  defaultView?: ChartView;
  /** Called when the reader switches between chart and table. */
  onViewChange?: (view: ChartView) => void;
  /** Toggle text. @default { group: "View", chart: "Chart", table: "Table" } */
  viewLabels?: { group?: string; chart?: ReactNode; table?: ReactNode };
}
export type ChartTableDisplay = "disclosure" | "toggle";
export type ChartView = "chart" | "table";
/**
 * accessibilityLayer turns the svg into a focusable role=application with no
 * name. Recharts forwards aria attributes to the svg, so point it at the
 * caption unless the author already named it.
 */
function nameChart(chart: ReactElement, id: string, described: boolean) {
  if (!isValidElement<Record<string, unknown>>(chart)) return chart;
  const props = chart.props;
  if (props["aria-label"] || props["aria-labelledby"]) return chart;
  return cloneElement(chart, {
    "aria-labelledby": `${id}-label`,
    ...(described && !props["aria-describedby"]
      ? { "aria-describedby": `${id}-description` }
      : {}),
  });
}
function Root({
  config,
  label,
  description,
  hideLabel = false,
  status = "ready",
  emptyMessage = "No data to show",
  aspectRatio = "16 / 9",
  children,
  table,
  tableDisplay = "disclosure",
  view: controlledView,
  defaultView = "chart",
  onViewChange,
  viewLabels,
  className,
  style,
  ...props
}: ChartRootProps) {
  const id = useId();
  const [uncontrolledView, setUncontrolledView] = useState(defaultView);
  const view = controlledView ?? uncontrolledView;
  const ready = status === "ready";
  const toggle = tableDisplay === "toggle" && table != null;
  const showTable = toggle && ready && view === "table";
  const setView = (next: ChartView) => {
    if (controlledView === undefined) setUncontrolledView(next);
    onViewChange?.(next);
  };
  const variables = Object.fromEntries(
    Object.entries(config).map(([key, series], index) => [
      seriesVariable(key),
      resolveColor(series.color, index),
    ]),
  );
  return (
    <ChartContext.Provider value={config}>
      <figure
        {...props}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-description` : undefined}
        aria-busy={status === "loading" || undefined}
        className={["dixy-charts", className].filter(Boolean).join(" ")}
        data-status={status}
        data-view={toggle ? view : undefined}
        style={{ ...variables, ...style }}
      >
        <div className="dixy-charts-header">
          <figcaption
            className="dixy-charts-caption"
            data-hidden={hideLabel || undefined}
          >
            <span id={`${id}-label`} className="dixy-charts-label">
              {label}
            </span>
            {description ? (
              <span
                id={`${id}-description`}
                className="dixy-charts-description"
              >
                {description}
              </span>
            ) : null}
          </figcaption>
          {toggle && ready ? (
            <ToggleGroup
              segmented
              className="dixy-charts-view"
              aria-label={viewLabels?.group ?? "View"}
              value={[view]}
              // Base UI lets a single group deselect; a view is always shown.
              onValueChange={(values) => {
                const next = values[0] as ChartView | undefined;
                if (next && next !== view) setView(next);
              }}
            >
              <Toggle size="sm" value="chart">
                {viewLabels?.chart ?? "Chart"}
              </Toggle>
              <Toggle size="sm" value="table">
                {viewLabels?.table ?? "Table"}
              </Toggle>
            </ToggleGroup>
          ) : null}
        </div>
        {showTable ? (
          <div className="dixy-charts-table">
            <TableDisplayContext.Provider value="toggle">
              {table}
            </TableDisplayContext.Provider>
          </div>
        ) : (
          <div className="dixy-charts-plot" style={{ aspectRatio }}>
            {status === "loading" ? (
              <Skeleton className="dixy-charts-skeleton" />
            ) : status === "empty" ? (
              <p className="dixy-charts-empty">{emptyMessage}</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                {nameChart(children, id, Boolean(description))}
              </ResponsiveContainer>
            )}
          </div>
        )}
        {ready && !toggle ? table : null}
      </figure>
    </ChartContext.Provider>
  );
}

type Row = Record<string, unknown>;
/** The subset of Recharts tooltip item fields this content reads. */
export interface ChartTooltipItem {
  dataKey?: unknown;
  name?: unknown;
  value?: unknown;
  color?: string;
  payload?: unknown;
}
const keyOf = (item: { dataKey?: unknown; name?: unknown }) =>
  String(item.dataKey ?? item.name ?? "");

export interface ChartTooltipContentProps {
  /** Supplied by Recharts. */
  active?: boolean;
  /** Supplied by Recharts. */
  payload?: readonly ChartTooltipItem[];
  /** Supplied by Recharts: the category under the cursor. */
  label?: unknown;
  /** Swatch shape. @default dot */
  indicator?: "dot" | "line" | "dashed";
  /** Hide the category heading. @default false */
  hideLabel?: boolean;
  /** Format the category heading. */
  labelFormatter?: (label: unknown) => ReactNode;
  /** Format each value. @default locale number formatting */
  valueFormatter?: (value: unknown, key: string) => ReactNode;
  /** Read the series key from this row field instead, for pie and radial charts. */
  nameKey?: string;
}
const numbers = new Intl.NumberFormat();
const formatValue = (value: unknown) =>
  typeof value === "number" ? numbers.format(value) : String(value ?? "");
function TooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  hideLabel = false,
  labelFormatter,
  valueFormatter = formatValue,
  nameKey,
}: ChartTooltipContentProps) {
  const config = useChartConfig();
  if (!active || !payload?.length) return null;
  return (
    <div className="dixy-charts-tooltip">
      {hideLabel || label === undefined ? null : (
        <div className="dixy-charts-tooltip-label">
          {labelFormatter ? labelFormatter(label) : String(label)}
        </div>
      )}
      <ul className="dixy-charts-tooltip-list">
        {payload.map((item, index) => {
          const row = (item.payload ?? {}) as Row;
          const key = nameKey ? String(row[nameKey] ?? "") : keyOf(item);
          const series = config[key];
          return (
            <li key={`${key}-${index}`} className="dixy-charts-tooltip-item">
              <span
                aria-hidden
                className="dixy-charts-swatch"
                data-indicator={indicator}
                style={{
                  background: config[key]
                    ? seriesColor(key)
                    : (item.color ?? "currentColor"),
                }}
              />
              <span className="dixy-charts-tooltip-name">
                {series?.label ?? key}
              </span>
              <span className="dixy-charts-tooltip-value">
                {valueFormatter(item.value, key)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The subset of Recharts legend item fields this content reads. */
export interface ChartLegendItem {
  dataKey?: unknown;
  value?: unknown;
  color?: string;
  inactive?: boolean;
  /** The data row behind the item, for pie and radial bar legends. */
  payload?: unknown;
}
export interface ChartLegendContentProps {
  /** Supplied by Recharts. */
  payload?: readonly ChartLegendItem[];
  /** Hide icons from config and always show swatches. @default false */
  hideIcon?: boolean;
  /**
   * Where the series key comes from. "value" reads the legend item's value
   * (pie charts); any other key reads that field of the item's data row
   * (radial bars, whose rows carry their own fill). Defaults to the dataKey.
   */
  nameKey?: string;
}
function LegendContent({
  payload,
  hideIcon = false,
  nameKey,
}: ChartLegendContentProps) {
  const config = useChartConfig();
  if (!payload?.length) return null;
  const keyOfItem = (item: ChartLegendItem) => {
    if (nameKey === "value") return String(item.value ?? "");
    if (nameKey) {
      const row = item.payload as Record<string, unknown> | undefined;
      return String(row?.[nameKey] ?? item.value ?? "");
    }
    return String(item.dataKey ?? item.value ?? "");
  };
  // Recharts sorts legend items by name; follow the config order instead so
  // the legend matches the data table and the order series were declared.
  const order = Object.keys(config);
  const rank = (key: string) => {
    const index = order.indexOf(key);
    return index === -1 ? order.length : index;
  };
  const items = [...payload].sort(
    (a, b) => rank(keyOfItem(a)) - rank(keyOfItem(b)),
  );
  return (
    <ul className="dixy-charts-legend">
      {items.map((item, index) => {
        const key = keyOfItem(item);
        const series = config[key];
        return (
          <li
            key={`${key}-${index}`}
            className="dixy-charts-legend-item"
            data-inactive={item.inactive || undefined}
          >
            {series?.icon && !hideIcon ? (
              <span aria-hidden className="dixy-charts-legend-icon">
                {series.icon}
              </span>
            ) : (
              <span
                aria-hidden
                className="dixy-charts-swatch"
                style={{
                  background: series
                    ? seriesColor(key)
                    : (item.color ?? "currentColor"),
                }}
              />
            )}
            {series?.label ?? key}
          </li>
        );
      })}
    </ul>
  );
}

export interface ChartDataTableProps {
  /** The rows passed to the chart. */
  data: readonly Row[];
  /** Field that names each row, e.g. "month". */
  labelKey: string;
  /** Heading for the label column. @default Category */
  labelHeading?: ReactNode;
  /** Columns to show. @default every config key */
  keys?: readonly string[];
  /** Disclosure text; unused when Root's tableDisplay is toggle. @default View chart data */
  summary?: ReactNode;
  /** Format each value. @default locale number formatting */
  valueFormatter?: (value: unknown, key: string) => ReactNode;
}
/** A native table of every plotted value, behind a disclosure. */
function DataTable({
  data,
  labelKey,
  labelHeading = "Category",
  keys,
  summary = "View chart data",
  valueFormatter = formatValue,
}: ChartDataTableProps) {
  const config = useChartConfig();
  const display = useContext(TableDisplayContext);
  const columns = keys ?? Object.keys(config);
  const table = (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head scope="col">{labelHeading}</Table.Head>
          {columns.map((key) => (
            <Table.Head key={key} scope="col">
              {config[key]?.label ?? key}
            </Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((row, index) => (
          <Table.Row key={index}>
            <Table.Head scope="row">{String(row[labelKey] ?? "")}</Table.Head>
            {columns.map((key) => (
              <Table.Cell key={key}>{valueFormatter(row[key], key)}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
  if (display === "toggle") return table;
  return (
    <details className="dixy-charts-data">
      <summary>{summary}</summary>
      {table}
    </details>
  );
}

export interface ChartGradientProps {
  /** Referenced from a mark as `fill="url(#<id>)"`. Unique per page. */
  id: string;
  /** Config key whose color the gradient fades. */
  series: string;
  /** Opacity at the start. @default 0.8 */
  from?: number;
  /** Opacity at the end. @default 0.1 */
  to?: number;
  /** vertical fades top to bottom; horizontal left to right. @default vertical */
  direction?: "vertical" | "horizontal";
}
/**
 * A linear gradient in a series color, for area and bar fills. Render it as
 * a direct child of the Recharts chart; it follows Theme and appearance.
 */
function Gradient({
  id,
  series,
  from = 0.8,
  to = 0.1,
  direction = "vertical",
}: ChartGradientProps) {
  const color = seriesColor(series);
  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        y1="0"
        x2={direction === "horizontal" ? "1" : "0"}
        y2={direction === "vertical" ? "1" : "0"}
      >
        {/* style, not attributes: var() in a presentation attribute is not
            resolved by every engine. */}
        <stop offset="5%" style={{ stopColor: color, stopOpacity: from }} />
        <stop offset="95%" style={{ stopColor: color, stopOpacity: to }} />
      </linearGradient>
    </defs>
  );
}

/**
 * Recharts, dressed in Dixy. Compose one Recharts chart inside Root;
 * Root maps config to `--dixy-series-<key>` and the content parts read it.
 */
export const Chart = /* @__PURE__ */ (() => ({
  Root,
  TooltipContent,
  LegendContent,
  DataTable,
  Gradient,
}))();
