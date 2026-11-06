import { Checkbox } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

export default function CheckboxMaterialsComparison() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--dixy-spacing-inline-lg)",
      }}
    >
      {(["matte", "glossy", "soft", "metal", "paper"] as const).map((value) => (
        <label
          key={value}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--dixy-spacing-inline-sm)",
          }}
        >
          <Checkbox.Root material={value} defaultChecked>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {value}
        </label>
      ))}
    </div>
  );
}
