import { useState, type FormEvent } from "react";
import { Check, MoreHorizontal, Plus, Rocket } from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  Field,
  Form,
  Menu,
  Progress,
  Select,
  Switch,
  Table,
  Tabs,
  Text,
  TextField,
  Toast,
} from "@dixy-ui/react";
import { usePreviewVoice } from "./theme-preview-voice";

/*
 * The landing page's live composition: one small product, built only from
 * public Dixy parts. Layout lives in landing.css; colour, type, radius,
 * material and chrome come from whichever starter theme wraps it.
 */

const deployments = [
  { id: "a1f", branch: "main", status: "Ready", time: "2m ago" },
  { id: "9c2", branch: "theme/ink", status: "Building", time: "6m ago" },
  { id: "4e7", branch: "fix/focus", status: "Failed", time: "1h ago" },
  { id: "7b0", branch: "main", status: "Ready", time: "3h ago" },
] as const;

const statusColor = {
  Ready: "success",
  Building: "accent",
  Failed: "danger",
} as const;

const regions = [
  { value: "ams", label: "Amsterdam" },
  { value: "iad", label: "Washington, D.C." },
  { value: "sin", label: "Singapore" },
] as const;

function Composition() {
  const voice = usePreviewVoice();
  const toasts = Toast.useToastManager();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [region, setRegion] = useState<string>("ams");
  const [watching, setWatching] = useState<string[]>(["a1f"]);

  function notify(title: string, description: string = voice.body) {
    toasts.add({ title, description, type: "success" });
  }

  function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    setInviteOpen(false);
    notify("Invite sent", `${email} can join the project now.`);
  }

  return (
    <div className="landing-composition">
      <Card.Root className="landing-card landing-card-intro">
        <Card.Header>
          <span className="landing-card-eyebrow">{voice.eyebrow}</span>
          <Badge variant="soft">Live</Badge>
        </Card.Header>
        <Card.Content>
          <Card.Title className="landing-card-headline">
            {voice.headline}
          </Card.Title>
          <Card.Description>{voice.body}</Card.Description>
          <div className="landing-card-actions">
            <Button onClick={() => notify(voice.primary)}>
              {voice.primary}
            </Button>
            <Dialog.Root open={inviteOpen} onOpenChange={setInviteOpen}>
              <Dialog.Trigger
                render={<Button variant="outline" color="neutral" />}
              >
                <Plus size={15} aria-hidden="true" />
                Invite
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Viewport>
                  <Dialog.Popup>
                    <Dialog.Title>Invite a teammate</Dialog.Title>
                    <Dialog.Description>
                      They get the same theme, the same components and the same
                      keyboard support.
                    </Dialog.Description>
                    <Form onSubmit={invite}>
                      <Field.Root name="email">
                        <Field.Label>Email</Field.Label>
                        <TextField
                          name="email"
                          type="email"
                          required
                          defaultValue="mara@northwind.co"
                        />
                      </Field.Root>
                      <div className="landing-dialog-actions">
                        <Dialog.Close
                          render={<Button variant="ghost" color="neutral" />}
                        >
                          Cancel
                        </Dialog.Close>
                        <Button type="submit">Send invite</Button>
                      </div>
                    </Form>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="landing-progress">
            <div className="landing-progress-label">
              <Text size="sm" variant="label.sm">
                Launch checklist
              </Text>
              <Text size="sm" tone="muted">
                7 of 10
              </Text>
            </div>
            <Progress.Root value={70} aria-label="Launch checklist">
              <Progress.Track>
                <Progress.Indicator />
              </Progress.Track>
            </Progress.Root>
          </div>
        </Card.Content>
      </Card.Root>

      <Card.Root className="landing-card landing-card-table">
        <Tabs.Root defaultValue="deployments">
          <Card.Header>
            <Card.Title>Northwind web</Card.Title>
            <Tabs.List aria-label="Project views">
              <Tabs.Tab value="deployments">Deployments</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>
          </Card.Header>
          <Card.Content>
            <Tabs.Panel value="deployments">
              <div
                className="landing-table-scroll"
                role="region"
                aria-label="Recent deployments"
                tabIndex={0}
              >
                <Table.Root size="sm">
                  <Table.Caption className="sr-only">
                    Recent deployments
                  </Table.Caption>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head scope="col">Build</Table.Head>
                      <Table.Head scope="col">Branch</Table.Head>
                      <Table.Head scope="col">Status</Table.Head>
                      <Table.Head scope="col">
                        <span className="sr-only">Actions</span>
                      </Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {deployments.map((row) => (
                      <Table.Row key={row.id}>
                        <Table.Head scope="row">
                          <code>{row.id}</code>
                          <span className="landing-table-time">{row.time}</span>
                        </Table.Head>
                        <Table.Cell>{row.branch}</Table.Cell>
                        <Table.Cell>
                          <Badge variant="soft" color={statusColor[row.status]}>
                            {row.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Menu.Root>
                            <Menu.Trigger
                              render={
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  color="neutral"
                                  aria-label={`Actions for build ${row.id}`}
                                />
                              }
                            >
                              <MoreHorizontal size={15} aria-hidden="true" />
                            </Menu.Trigger>
                            <Menu.Portal>
                              <Menu.Positioner sideOffset={6} align="end">
                                <Menu.Popup>
                                  <Menu.CheckboxItem
                                    checked={watching.includes(row.id)}
                                    onCheckedChange={(on) =>
                                      setWatching((all) =>
                                        on
                                          ? [...all, row.id]
                                          : all.filter((id) => id !== row.id),
                                      )
                                    }
                                  >
                                    <Menu.CheckboxItemIndicator>
                                      <Check size={14} />
                                    </Menu.CheckboxItemIndicator>
                                    Watch build
                                  </Menu.CheckboxItem>
                                  <Menu.Item
                                    onClick={() =>
                                      notify(
                                        "Redeploy queued",
                                        `Build ${row.id} on ${row.branch}.`,
                                      )
                                    }
                                  >
                                    Redeploy
                                  </Menu.Item>
                                  <Menu.Separator />
                                  <Menu.Item
                                    color="danger"
                                    onClick={() =>
                                      notify(
                                        "Build removed",
                                        `${row.id} is gone from the list.`,
                                      )
                                    }
                                  >
                                    Remove
                                  </Menu.Item>
                                </Menu.Popup>
                              </Menu.Positioner>
                            </Menu.Portal>
                          </Menu.Root>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="settings" className="landing-settings">
              {[
                ["Preview deployments", "Every pull request", true],
                ["Deploy notifications", "Failures only", false],
              ].map(([label, note, on]) => (
                <label key={String(label)} className="landing-setting">
                  <span>
                    <Text size="sm" variant="label.sm">
                      {label}
                    </Text>
                    <Text size="sm" tone="muted">
                      {note}
                    </Text>
                  </span>
                  <Switch.Root defaultChecked={Boolean(on)}>
                    <Switch.Thumb />
                  </Switch.Root>
                </label>
              ))}
            </Tabs.Panel>
          </Card.Content>
        </Tabs.Root>
      </Card.Root>

      <Card.Root className="landing-card landing-card-form">
        <Card.Header>
          <Card.Title>New project</Card.Title>
          <Rocket size={16} aria-hidden="true" />
        </Card.Header>
        <Card.Content>
          <Form
            className="landing-form"
            onSubmit={(event) => {
              event.preventDefault();
              const name = String(
                new FormData(event.currentTarget).get("project"),
              );
              const where = regions.find((r) => r.value === region)?.label;
              notify("Project created", `${name}, served from ${where}.`);
            }}
          >
            <Field.Root name="project">
              <Field.Label>Project name</Field.Label>
              <TextField name="project" required defaultValue="Northwind web" />
            </Field.Root>
            <Field.Root name="region">
              <Field.Label>Region</Field.Label>
              <Select.Root
                value={region}
                onValueChange={(value) => value && setRegion(String(value))}
                items={regions}
              >
                <Select.Trigger>
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner sideOffset={8}>
                    <Select.Popup>
                      <Select.List>
                        {regions.map((r) => (
                          <Select.Item key={r.value} value={r.value}>
                            <Select.ItemText>{r.label}</Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </Field.Root>
            <label className="landing-check">
              <Checkbox.Root defaultChecked>
                <Checkbox.Indicator />
              </Checkbox.Root>
              Start from the current theme
            </label>
            <Button type="submit" className="landing-wide">
              Create project
            </Button>
          </Form>
        </Card.Content>
      </Card.Root>

      <Card.Root className="landing-card landing-card-team">
        <Card.Header>
          <Card.Title>Team</Card.Title>
          <Badge variant="outline" color="neutral">
            3 people
          </Badge>
        </Card.Header>
        <Card.Content>
          {[
            ["SD", "Sofia Davis", "Owner"],
            ["JL", "Jackson Lee", "Editor"],
            ["MR", "Mara Ruiz", "Viewer"],
          ].map(([initials, name, role]) => (
            <div key={initials} className="landing-person">
              <Avatar.Root size="sm">
                <Avatar.Fallback>{initials}</Avatar.Fallback>
              </Avatar.Root>
              <Text size="sm" variant="label.sm">
                {name}
              </Text>
              <Text size="sm" tone="muted">
                {role}
              </Text>
            </div>
          ))}
          <Button
            variant="soft"
            className="landing-wide"
            onClick={() => notify(voice.secondary)}
          >
            {voice.secondary}
          </Button>
        </Card.Content>
      </Card.Root>

      <Toast.Portal>
        <Toast.Viewport>
          {toasts.toasts.map((toast) => (
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

/** A small product built from Dixy parts, restyled by whichever theme wraps it. */
export function LandingShowcase() {
  return (
    <Toast.Provider>
      <Composition />
    </Toast.Provider>
  );
}
