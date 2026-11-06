import { useState } from "react";
import { Button, Empty, Item, Command, Stack, Text } from "@dixy-ui/react";
import "@dixy-ui/react/materials.css";
export default function CommandExample({
  mode = "inline",
}: {
  mode?: "inline" | "modal";
}) {
  const [message, setMessage] = useState("");
  const command = (
    <Stack gap="md" style={{ width: "min(100%, 24rem)" }}>
      <Stack gap="sm">
        <Command.Root<string>
          inline
          open
          items={["New project", "Open workspace", "Settings"]}
          onValueChange={(value) => setMessage(value ?? "")}
        >
          <Command.Input
            aria-label="Find a command"
            placeholder="Search commands…"
          />
          <Command.List>
            {(item) => (
              <Command.Item key={item} value={item}>
                {item}
              </Command.Item>
            )}
          </Command.List>
          <Command.Empty>No matching commands.</Command.Empty>
        </Command.Root>
        <Text role="status">{message}</Text>
      </Stack>
    </Stack>
  );
  return mode === "inline" ? (
    command
  ) : (
    <Command.Dialog.Root>
      <Command.Dialog.Trigger render={<Button variant="outline" />}>
        Find a command
      </Command.Dialog.Trigger>
      <Command.Dialog.Portal>
        <Command.Dialog.Backdrop />
        <Command.Dialog.Popup>
          <Command.Dialog.Title>Command menu</Command.Dialog.Title>
          {command}
          <Command.Dialog.Close render={<Button variant="outline" />}>
            Close
          </Command.Dialog.Close>
        </Command.Dialog.Popup>
      </Command.Dialog.Portal>
    </Command.Dialog.Root>
  );
}
