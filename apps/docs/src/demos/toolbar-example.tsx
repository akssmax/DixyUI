import { useState } from "react";
import { Toolbar, Stack } from "@dixy-ui/react";

export default function ToolbarExample({
  radius,
  variant = "plain",
  size = "md",

  disabled = false,
}: {
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "plain" | "outline" | "soft";
  size?: "sm" | "md" | "lg";

  disabled?: boolean;
}) {
  const [action, setAction] = useState("Choose a tool.");
  return (
    <Stack gap="md" style={{ width: "min(100%, 22rem)" }}>
      <Toolbar.Root
        size={size}
        variant={variant}
        radius={radius}
        aria-label="Document tools"
        disabled={disabled}
      >
        <Toolbar.Group>
          <Toolbar.Button onClick={() => setAction("Changes saved")}>
            Save
          </Toolbar.Button>
          <Toolbar.Button onClick={() => setAction("Link copied locally")}>
            Share
          </Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Button onClick={() => setAction("Preview ready")}>
          Preview
        </Toolbar.Button>
      </Toolbar.Root>
      <span role="status">{action}</span>
    </Stack>
  );
}
