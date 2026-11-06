import { useEffect, useRef, useState } from "react";
import {
  Card,
  Button,
  TextField,
  Field,
  Checkbox,
  Switch,
  Table,
  Badge,
  Toast,
  Text,
} from "@dixy-ui/react";
const rows = [
  ["Brand foundations", "Ready", "Today"],
  ["Component library", "In progress", "Yesterday"],
  ["Website refresh", "Draft", "Oct 18"],
];
function StateContents() {
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manager = Toast.useToastManager();
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function save() {
    setBusy(true);
    setSaved(false);
    timer.current = setTimeout(() => {
      setBusy(false);
      setSaved(true);
      manager.add({
        title: "Changes saved",
        description: "Your skin follows this notification through its portal.",
        type: "success",
      });
    }, 900);
  }
  return (
    <div className="theme-state-scene">
      <Card.Root>
        <Card.Header>
          <span className="theme-scene-eyebrow">
            SMALL DETAILS, REAL FEEDBACK
          </span>
          <Card.Title as="h2">Every state has a purpose.</Card.Title>
          <Card.Description>
            Hover, press, tab through, and try saving a change.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="theme-state-actions">
            <Button loading={busy} onClick={save}>
              {saved ? "Saved" : "Save changes"}
            </Button>
            <Button variant="soft">Secondary</Button>
            <Button variant="outline" color="neutral">
              Outline
            </Button>
            <Button disabled>Disabled</Button>
            <Button color="danger">Destructive</Button>
          </div>
          <Field.Root invalid>
            <Field.Label>Project address</Field.Label>
            <TextField aria-invalid="true" defaultValue="already-taken" />
            <Field.Description>
              This address is already in use. Try a different one.
            </Field.Description>
          </Field.Root>
          <div className="theme-state-choices">
            <label>
              <Checkbox.Root defaultChecked>
                <Checkbox.Indicator />
              </Checkbox.Root>{" "}
              Email updates
            </label>
            <label>
              <Checkbox.Root indeterminate>
                <Checkbox.Indicator />
              </Checkbox.Root>{" "}
              Some selected
            </label>
            <label>
              <Switch.Root defaultChecked>
                <Switch.Thumb />
              </Switch.Root>{" "}
              Notifications
            </label>
          </div>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <span className="theme-scene-eyebrow">A QUIETER PLACE TO READ</span>
          <Card.Title as="h2">Personality, with room to work.</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="theme-table-scroll">
            <Table.Root>
              <Table.Caption>Current projects</Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Project</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Updated</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map(([name, status, date]) => (
                  <Table.Row key={name}>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant="soft"
                        color={status === "Ready" ? "success" : "neutral"}
                      >
                        {status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{date}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
          <Text size="sm" tone="muted">
            The frame can be expressive. The content stays clear.
          </Text>
        </Card.Content>
      </Card.Root>
      <Toast.Portal>
        <Toast.Viewport>
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <Toast.Content>
                <Toast.Title />
                <Toast.Description />
              </Toast.Content>
              <Toast.Close aria-label="Dismiss notification" />
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </div>
  );
}
export default function ThemeStateScene() {
  return (
    <Toast.Provider>
      <StateContents />
    </Toast.Provider>
  );
}
