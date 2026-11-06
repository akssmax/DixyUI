import { Checkbox } from "@dixy-ui/react";

export default function CheckboxColorsComparison() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--dixy-spacing-inline-lg)",
      }}
    >
      {(["accent", "neutral", "danger", "success"] as const).map((value) => (
        <label
          key={value}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--dixy-spacing-inline-sm)",
          }}
        >
          <Checkbox.Root color={value} defaultChecked>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {value}
        </label>
      ))}
    </div>
  );
}
