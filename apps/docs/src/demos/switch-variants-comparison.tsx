import { Switch } from "@dixy-ui/react";

export default function SwitchVariantsComparison() {
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
          <Switch.Root variant={value} defaultChecked>
            <Switch.Thumb />
          </Switch.Root>
          {value}
        </label>
      ))}
    </div>
  );
}
