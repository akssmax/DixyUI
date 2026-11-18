import { useState } from "react";
import { Menu, SplitButton, Stack, Text } from "@dixy-ui/react";
import type { SplitButtonRootProps } from "@dixy-ui/react";

export default function SplitButtonExample({
  size = "md",
  variant = "solid",
  color = "accent",
}: Pick<SplitButtonRootProps, "size" | "variant" | "color">) {
  const [status, setStatus] = useState("Nothing sent yet.");
  return (
    <Stack gap="md" style={{ width: "min(100%, 24rem)", alignItems: "center" }}>
      <SplitButton.Root
        size={size}
        variant={variant}
        color={color}
        aria-label="Send"
      >
        <SplitButton.Action onClick={() => setStatus("Sent now.")}>
          Send
        </SplitButton.Action>
        <SplitButton.Menu aria-label="More send options">
          <Menu.Item onClick={() => setStatus("Scheduled for 9:00.")}>
            Schedule for 9:00
          </Menu.Item>
          <Menu.Item onClick={() => setStatus("Saved as a draft.")}>
            Save as draft
          </Menu.Item>
        </SplitButton.Menu>
      </SplitButton.Root>
      <Text variant="body.sm" role="status">
        {status}
      </Text>
    </Stack>
  );
}
