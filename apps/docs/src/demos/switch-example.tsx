import { useId, useState } from "react";
import { Switch, Stack, Text, type SwitchRootProps } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";

type Icons = "none" | "check" | "theme" | "notifications";
type Props = Pick<
  SwitchRootProps,
  "size" | "variant" | "color" | "radius" | "material" | "disabled" | "readOnly"
> & {
  icons?: Icons;
  description?: boolean;
};

function Artwork({ kind, on }: { kind: Exclude<Icons, "none">; on: boolean }) {
  const paths = {
    check: on ? "m5 12 4 4L19 6" : "m6 6 12 12M6 18 18 6",
    theme: on
      ? "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17m10-10 1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
      : "M20 13a8 8 0 1 1-9-9 6 6 0 0 0 9 9Z",
    notifications: on
      ? "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
      : "m3 3 18 18M6 6c-1 2 0 8-3 11h14M10 21h4M10 2a6 6 0 0 1 8 6c0 3 0 4 1 5",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden="true"
    >
      <path d={paths[kind]} />
    </svg>
  );
}

export default function SwitchExample({
  size = "md",
  variant = "solid",
  color = "accent",
  radius,
  material,
  icons = "check",
  disabled = false,
  readOnly = false,
  description = true,
}: Props) {
  const [checked, setChecked] = useState(false);
  const descriptionId = useId();
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--dixy-spacing-inline-md)",
          font: "var(--dixy-font-label-md)",
        }}
      >
        <Switch.Root
          name="notifications"
          checked={checked}
          onCheckedChange={setChecked}
          disabled={disabled}
          readOnly={readOnly}
          size={size}
          variant={variant}
          color={color}
          radius={radius}
          material={material}
          aria-describedby={description ? descriptionId : undefined}
        >
          <Switch.Thumb
            checkedIcon={
              icons === "none" ? undefined : <Artwork kind={icons} on />
            }
            uncheckedIcon={
              icons === "none" ? undefined : <Artwork kind={icons} on={false} />
            }
          />
        </Switch.Root>
        Notifications
      </label>
      {description && (
        <Text variant="body.sm" id={descriptionId}>
          Receive updates about your projects.
        </Text>
      )}
      <Text variant="body.sm" role="status">
        Notifications {checked ? "on" : "off"}
      </Text>
    </Stack>
  );
}
