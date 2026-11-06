import { useId } from "react";
import { nativePart, type NativePartProps } from "../utilities/native-part";
import { Table } from "./content";
export interface ChartProps extends Omit<
  NativePartProps<"figure", "color">,
  "children"
> {
  /** Caption and accessible name. */ label: string;
  /** Finite, nonnegative values for this bar-chart recipe. */ data: readonly {
    label: string;
    value: number;
  }[];
}
const Figure = /* @__PURE__ */ nativePart("figure", "dixy-chart", [
  "color",
] as const);
export function Chart({ label, data, ...props }: ChartProps) {
  const id = useId();
  const values = data.map((d) => ({
    ...d,
    value: Number.isFinite(d.value) ? Math.max(0, d.value) : 0,
  }));
  const maximum = Math.max(1, ...values.map((d) => d.value));
  return (
    <Figure {...props}>
      <figcaption id={id}>{label}</figcaption>
      <svg role="img" aria-labelledby={id} viewBox="0 0 600 240">
        <title>{label}</title>
        {values.map((d, i) => {
          const width = 560 / Math.max(1, values.length);
          const height = (d.value / maximum) * 190;
          return (
            <g key={i}>
              <rect
                x={20 + i * width}
                y={200 - height}
                width={Math.max(1, width - 12)}
                height={height}
              />
              <text x={20 + i * width} y="224">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <details>
        <summary>View chart data</summary>
        <Table.Root>
          <Table.Caption>{label}</Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.Head scope="col">Category</Table.Head>
              <Table.Head scope="col">Value</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {values.map((d, i) => (
              <Table.Row key={i}>
                <Table.Head scope="row">{d.label}</Table.Head>
                <Table.Cell>{d.value}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </details>
    </Figure>
  );
}
