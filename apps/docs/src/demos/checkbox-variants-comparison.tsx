import { Checkbox } from "@dixy-ui/react";

export default function CheckboxVariantsComparison() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--dixy-spacing-inline-lg)",
      }}
    >
      {(["solid", "soft", "outline"] as const).map((value) => (
        <label
          key={value}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--dixy-spacing-inline-sm)",
          }}
        >
          <Checkbox.Root variant={value} defaultChecked>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {value}
        </label>
      ))}
    </div>
  );
}
