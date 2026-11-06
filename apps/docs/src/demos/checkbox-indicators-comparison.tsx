import { Checkbox } from "@dixy-ui/react";

export default function CheckboxIndicatorsComparison() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--dixy-spacing-inline-lg)",
      }}
    >
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--dixy-spacing-inline-sm)",
        }}
      >
        <Checkbox.Root defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
        Check
      </label>
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--dixy-spacing-inline-sm)",
        }}
      >
        <Checkbox.Root defaultChecked color="danger" radius="full">
          <Checkbox.Indicator
            checkedIcon={
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 13.5 2.6 8.2C-.5 5.2 3.7.8 6.8 3.8L8 5l1.2-1.2c3.1-3 7.3 1.4 4.2 4.4Z" />
              </svg>
            }
          />
        </Checkbox.Root>
        Favorite
      </label>
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--dixy-spacing-inline-sm)",
        }}
      >
        <Checkbox.Root indeterminate variant="soft">
          <Checkbox.Indicator
            indeterminateIcon={
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 8h8M8 4v8" />
              </svg>
            }
          />
        </Checkbox.Root>
        Mixed artwork
      </label>
    </div>
  );
}
