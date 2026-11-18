import { useState } from "react";
import { FabMenu, Stack, Text } from "@dixy-ui/react";
import type { FabMenuRootProps } from "@dixy-ui/react";

export default function FabMenuExample({
  size = "lg",
  color = "accent",
}: Pick<FabMenuRootProps, "size" | "color">) {
  const [status, setStatus] = useState("Choose something to create.");
  return (
    <Stack
      gap="md"
      style={{
        width: "min(100%, 24rem)",
        minHeight: "16rem",
        alignItems: "end",
        justifyContent: "end",
      }}
    >
      <Text variant="body.sm" role="status">
        {status}
      </Text>
      <FabMenu.Root aria-label="Create" size={size} color={color}>
        <FabMenu.Item onClick={() => setStatus("New note.")}>Note</FabMenu.Item>
        <FabMenu.Item onClick={() => setStatus("New checklist.")}>
          Checklist
        </FabMenu.Item>
        <FabMenu.Item onClick={() => setStatus("New reminder.")}>
          Reminder
        </FabMenu.Item>
      </FabMenu.Root>
    </Stack>
  );
}
