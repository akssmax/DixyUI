import { Checkbox } from "@dixy-ui/react";

export default function CheckboxSizesComparison() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--dixy-spacing-inline-lg)",
      }}
    >
      {(["sm", "md", "lg"] as const).map((value) => (
        <label
          key={value}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--dixy-spacing-inline-sm)",
          }}
        >
          <Checkbox.Root size={value}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {value}
        </label>
      ))}
    </div>
  );
}
