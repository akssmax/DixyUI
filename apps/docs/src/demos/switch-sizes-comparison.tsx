import { Switch } from "@dixy-ui/react";

export default function SwitchSizesComparison() {
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
          <Switch.Root size={value}>
            <Switch.Thumb />
          </Switch.Root>
          {value}
        </label>
      ))}
    </div>
  );
}
