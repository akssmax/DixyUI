import { Checkbox } from "@dixy-ui/react";

export default function CheckboxStatesComparison() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--dixy-spacing-inline-lg)",
      }}
    >
      {[
        { label: "Checked", defaultChecked: true },
        { label: "Mixed", indeterminate: true },
        { label: "Disabled", disabled: true, defaultChecked: true },
        { label: "Read only", readOnly: true, defaultChecked: true },
      ].map(({ label, ...props }) => (
        <label
          key={label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--dixy-spacing-inline-sm)",
          }}
        >
          <Checkbox.Root {...props}>
            <Checkbox.Indicator />
          </Checkbox.Root>
          {label}
        </label>
      ))}
    </div>
  );
}
