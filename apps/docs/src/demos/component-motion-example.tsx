import { useState } from "react";
import {
  Button,
  Dialog,
  Drawer,
  Field,
  Inline,
  Menu,
  Stack,
  Tabs,
  Text,
  TextField,
  Theme as ComponentScope,
} from "@dixy-ui/react";

interface Props {
  reduceMotion?: boolean;
  drawerDirection?: "up" | "down" | "left" | "right";
  orientation?: "horizontal" | "vertical";
  rtl?: boolean;
}

export default function ComponentMotionExample({
  reduceMotion = false,
  drawerDirection = "right",
  orientation = "horizontal",
  rtl = false,
}: Props) {
  const [message, setMessage] = useState("Ready for your next change.");
  return (
    <ComponentScope
      motion={reduceMotion ? "reduced" : "system"}
      dir={rtl ? "rtl" : "ltr"}
    >
      <Stack gap="md" style={{ minWidth: 0 }}>
        <Inline gap="sm">
          <Button onClick={() => setMessage("Project saved.")}>
            Save project
          </Button>
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant="outline" />}>
              Edit project
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Viewport>
                <Dialog.Popup>
                  <Dialog.Title>Project details</Dialog.Title>
                  <Dialog.Description>
                    Focus stays with this task. Close it at any point, including
                    during the transition.
                  </Dialog.Description>
                  <Stack gap="md">
                    <Field.Root>
                      <Field.Label>Project name</Field.Label>
                      <TextField defaultValue="Dixy Studio" />
                    </Field.Root>
                    <Dialog.Close render={<Button />}>
                      Done editing
                    </Dialog.Close>
                  </Stack>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
          <Drawer.Root swipeDirection={drawerDirection}>
            <Drawer.Trigger render={<Button variant="outline" />}>
              Project settings
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Backdrop />
              <Drawer.Viewport>
                <Drawer.Popup>
                  <Drawer.Content>
                    <Stack gap="md">
                      <Drawer.Title>Workspace settings</Drawer.Title>
                      <Drawer.Description>
                        The drawer follows its edge, keeps direct swipe
                        tracking, and respects the same motion preference.
                      </Drawer.Description>
                      <Drawer.Close render={<Button variant="outline" />}>
                        Close settings
                      </Drawer.Close>
                    </Stack>
                  </Drawer.Content>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
          <Menu.Root>
            <Menu.Trigger render={<Button variant="outline" />}>
              Project actions
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner sideOffset={8}>
                <Menu.Popup>
                  <Menu.Item onClick={() => setMessage("Project duplicated.")}>
                    Duplicate project
                  </Menu.Item>
                  <Menu.Item onClick={() => setMessage("Project archived.")}>
                    Archive project
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </Inline>
        <Tabs.Root defaultValue="overview" orientation={orientation}>
          <Tabs.List aria-label="Workspace information">
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
            <Tabs.Tab value="notes">Notes</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value="overview">
            <Text>
              The indicator moves. The content is available immediately.
            </Text>
          </Tabs.Panel>
          <Tabs.Panel value="activity">
            <Text>Your latest project changes appear here.</Text>
          </Tabs.Panel>
          <Tabs.Panel value="notes">
            <Text>Keep useful context close to your work.</Text>
          </Tabs.Panel>
        </Tabs.Root>
        <Text role="status" size="sm" tone="muted">
          {message}
        </Text>
      </Stack>
    </ComponentScope>
  );
}
