import { Switch } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

export default function SwitchMaterialsComparison() {
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
          <Switch.Root material={value} defaultChecked>
            <Switch.Thumb />
          </Switch.Root>
          {value}
        </label>
      ))}
    </div>
  );
}
