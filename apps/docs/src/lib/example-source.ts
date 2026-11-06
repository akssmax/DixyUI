import {
  comparisonItemStyle,
  comparisonRowStyle,
  type FamilyComparison,
} from "./comparison-layout.ts";

type ExampleTheme = {
  appearance: string;
  accentColor: string;
  neutralColor?: string;
  radius: string;
  density?: string;
  motion?: string;
  dir?: string;
};

export function configureExample(
  source: string,
  state: Record<string, string | boolean>,
  theme: ExampleTheme,
) {
  const name = source.match(/export default function (\w+)/)?.[1];
  if (!name) throw new Error("Examples must have a named default function.");
  const configured = Object.entries(state)
    .reduce(
      (result, [key, value]) =>
        result.replace(
          new RegExp(`\\b${key} = (?:"[^"]*"|true|false)`),
          `${key} = ${JSON.stringify(value)}`,
        ),
      source,
    )
    .replace("export default function", "function");
  return wrapExample(configured, `<${name} />`, theme);
}

/** Keep helpers, imports and per-instance state intact in the grouped example. */
export function configureComparisonExample(
  source: string,
  family: string,
  comparison: FamilyComparison,
  theme: ExampleTheme,
) {
  const name = source.match(/export default function (\w+)/)?.[1];
  if (!name) throw new Error("Examples must have a named default function.");
  const configured = `import { Inline as ComparisonRow, Stack as ComparisonItem, Text as ComparisonLabel } from "@dixy-ui/react";\n${source.replace("export default function", "function").trim()}\n\nconst comparisons = ${JSON.stringify(comparison.items, null, 2)} as const;`;
  const body = `<ComparisonRow gap="lg" align="start" style={${JSON.stringify(comparisonRowStyle)}}>
        {comparisons.map(({ label, props }) => (
          <ComparisonItem key={label} gap="md" role="group" aria-label={${JSON.stringify(`${comparison.name}: `)} + label} style={${JSON.stringify(comparisonItemStyle(family))}}>
            <ComparisonLabel variant="body.sm">{label}</ComparisonLabel>
            <${name} {...props} />
          </ComparisonItem>
        ))}
      </ComparisonRow>`;
  return wrapExample(configured, body, theme);
}

function wrapExample(source: string, body: string, theme: ExampleTheme) {
  const settings = ["density", "motion", "dir"]
    .flatMap((key) => {
      const value = theme[key as "density" | "motion" | "dir"];
      return value ? [` ${key}=${JSON.stringify(value)}`] : [];
    })
    .join("");
  return `import "@dixy-ui/react/styles.css";\nimport { Theme } from "@dixy-ui/react";\n${source.trim()}\n\nexport default function Example() {\n  return (\n    <Theme appearance=${JSON.stringify(theme.appearance)} accentColor=${JSON.stringify(theme.accentColor)} neutralColor=${JSON.stringify(theme.neutralColor ?? "neutral")} radius=${JSON.stringify(theme.radius)}${settings}>\n      ${body}\n    </Theme>\n  );\n}\n`;
}
