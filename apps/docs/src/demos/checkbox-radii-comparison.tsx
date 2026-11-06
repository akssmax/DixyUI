import { Checkbox } from "@dixy-ui/react";

export default function CheckboxRadiiComparison() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--dixy-spacing-inline-lg)",
      }}
    >
      {(["none", "sm", "md", "lg", "full"] as const).map((value) => (
        <label
          key={value}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--dixy-spacing-inline-sm)",
          }}
        >
          <Checkbox.Root radius={value} defaultChecked>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {value}
        </label>
      ))}
    </div>
  );
}
