import { Switch } from "@dixy-ui/react";

export default function SwitchIconsComparison() {
  const pairs = [
    {
      label: "Confirm updates",
      color: "success",
      on: "m5 12 4 4L19 6",
      off: "m6 6 12 12M6 18 18 6",
    },
    {
      label: "Day mode",
      color: "accent",
      on: "M12 3v2m0 14v2M3 12h2m14 0h2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
      off: "M20 13a8 8 0 1 1-9-9 6 6 0 0 0 9 9Z",
    },
    {
      label: "Notification sounds",
      color: "danger",
      on: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
      off: "m3 3 18 18M6 6c-1 2 0 8-3 11h14M10 21h4M10 2a6 6 0 0 1 8 6c0 3 0 4 1 5",
    },
  ] as const;
  function icon(path: string) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d={path} />
      </svg>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--dixy-spacing-inline-lg)",
      }}
    >
      {pairs.map((pair) => (
        <Switch.Root
          key={pair.label}
          aria-label={pair.label}
          color={pair.color}
          size="lg"
          radius="full"
          defaultChecked
        >
          <Switch.Thumb
            checkedIcon={icon(pair.on)}
            uncheckedIcon={icon(pair.off)}
          />
        </Switch.Root>
      ))}
    </div>
  );
}
