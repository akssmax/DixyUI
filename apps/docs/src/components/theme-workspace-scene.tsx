import { useState } from "react";
import { Check, Mail, MoreHorizontal, Plus, Upload } from "lucide-react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Chart,
  Checkbox,
  Chip,
  Command,
  Field,
  Heading,
  IconButton,
  Kbd,
  Menu,
  OTPField,
  Progress,
  RangeCalendar,
  Separator,
  Slider,
  Switch,
  TagGroup,
  Text,
  TextField,
  Toast,
  Toggle,
  ToggleGroup,
} from "@dixy-ui/react";
import { usePreviewVoice } from "./theme-preview-voice";
import "../styles/theme-workspace.css";

/*
 * The playground's Overview: a dense wall of small, unrelated compositions.
 * Each card is Card.Header + Card.Content, so skin chrome (titlebars, wells,
 * frames) applies to every block and the wall shows a theme across the board.
 */

const revenue = [
  { label: "Jan", value: 8.2 },
  { label: "Feb", value: 9.6 },
  { label: "Mar", value: 7.9 },
  { label: "Apr", value: 11.4 },
  { label: "May", value: 13.1 },
  { label: "Jun", value: 15.2 },
];

const team = [
  { initials: "SD", name: "Sofia Davis", email: "sofia@northwind.co" },
  { initials: "JL", name: "Jackson Lee", email: "jackson@northwind.co" },
  { initials: "MR", name: "Mara Ruiz", email: "mara@northwind.co" },
] as const;

const roles = ["Owner", "Editor", "Viewer"] as const;

const notifications = [
  { id: "mentions", label: "Mentions", note: "Replies and @you", on: true },
  { id: "digest", label: "Weekly digest", note: "Every Monday", on: false },
  { id: "news", label: "Product news", note: "Twice a month", on: true },
] as const;

const commands = ["New project", "Invite people", "Open settings"];

function Wall() {
  const voice = usePreviewVoice();
  const manager = Toast.useToastManager();
  const [billing, setBilling] = useState<string[]>(["yearly"]);
  const [tags, setTags] = useState(["Design", "Remote", "Full time"]);
  const [roleOf, setRoleOf] = useState<Record<string, string>>({
    SD: "Owner",
    JL: "Editor",
    MR: "Viewer",
  });
  const [code, setCode] = useState("");
  const [uploading, setUploading] = useState(true);
  const yearly = billing[0] === "yearly";

  function notify(title: string) {
    manager.add({ title, description: voice.body, type: "success" });
  }

  return (
    <div className="theme-wall">
      <header className="theme-wall-intro">
        <span className="theme-scene-eyebrow">{voice.eyebrow}</span>
        <Heading as="h2" variant="heading.lg">
          {voice.headline}
        </Heading>
        <Text tone="muted">
          Ten small compositions, one theme. Change anything on the right.
        </Text>
      </header>

      <div className="theme-wall-grid">
        <div className="theme-wall-col">
          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Create an account</Card.Title>
              <Badge variant="soft">Free</Badge>
            </Card.Header>
            <Card.Content>
              <Card.Description>
                Enter your email below to get started.
              </Card.Description>
              <div className="theme-wall-pair">
                <Button variant="outline" color="neutral">
                  <Mail size={16} aria-hidden="true" />
                  Magic link
                </Button>
                <Button variant="outline" color="neutral">
                  <span aria-hidden="true" className="theme-wall-g">
                    G
                  </span>
                  Google
                </Button>
              </div>
              <div className="theme-wall-or">
                <Separator />
                <Text size="sm" tone="muted">
                  or
                </Text>
                <Separator />
              </div>
              <Field.Root name="overview-email">
                <Field.Label>Email</Field.Label>
                <TextField type="email" placeholder="you@example.com" />
              </Field.Root>
              <Field.Root name="overview-password">
                <Field.Label>Password</Field.Label>
                <TextField type="password" defaultValue="playful-pixels" />
              </Field.Root>
              <Button
                className="theme-wall-wide"
                onClick={() => notify("Account created")}
              >
                Create account
              </Button>
            </Card.Content>
          </Card.Root>

          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Revenue</Card.Title>
              <Badge variant="soft" color="success">
                +12.4%
              </Badge>
            </Card.Header>
            <Card.Content>
              <strong className="theme-wall-figure">$15,231</strong>
              <Text size="sm" tone="muted">
                Up from $13,540 last month
              </Text>
              <Chart label="Monthly revenue, $k" data={revenue} />
            </Card.Content>
          </Card.Root>

          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Notifications</Card.Title>
            </Card.Header>
            <Card.Content>
              <Card.Description>Choose what reaches you.</Card.Description>
              {notifications.map((item) => (
                <label key={item.id} className="theme-wall-setting">
                  <span>
                    <Text size="sm" variant="label.sm">
                      {item.label}
                    </Text>
                    <Text size="sm" tone="muted">
                      {item.note}
                    </Text>
                  </span>
                  <Switch.Root defaultChecked={item.on}>
                    <Switch.Thumb />
                  </Switch.Root>
                </label>
              ))}
            </Card.Content>
          </Card.Root>
        </div>
        <div className="theme-wall-col">
          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Team</Card.Title>
              <Button
                size="sm"
                variant="soft"
                onClick={() => notify("Invite sent")}
              >
                <Plus size={14} aria-hidden="true" />
                Invite
              </Button>
            </Card.Header>
            <Card.Content>
              {team.map((person) => (
                <div key={person.initials} className="theme-wall-person">
                  <Avatar.Root size="sm">
                    <Avatar.Fallback>{person.initials}</Avatar.Fallback>
                  </Avatar.Root>
                  <span>
                    <Text size="sm" variant="label.sm">
                      {person.name}
                    </Text>
                    <Text size="sm" tone="muted">
                      {person.email}
                    </Text>
                  </span>
                  <Menu.Root>
                    <Menu.Trigger
                      render={
                        <Button
                          size="sm"
                          variant="ghost"
                          color="neutral"
                          aria-label={`${person.name}'s role: ${roleOf[person.initials]}`}
                        />
                      }
                    >
                      {roleOf[person.initials]}
                      <MoreHorizontal size={14} aria-hidden="true" />
                    </Menu.Trigger>
                    <Menu.Portal>
                      <Menu.Positioner sideOffset={6} align="end">
                        <Menu.Popup>
                          <Menu.RadioGroup
                            value={roleOf[person.initials]}
                            onValueChange={(role: string) =>
                              setRoleOf((all) => ({
                                ...all,
                                [person.initials]: role,
                              }))
                            }
                          >
                            {roles.map((role) => (
                              <Menu.RadioItem key={role} value={role}>
                                <Menu.RadioItemIndicator>
                                  <Check size={14} />
                                </Menu.RadioItemIndicator>
                                {role}
                              </Menu.RadioItem>
                            ))}
                          </Menu.RadioGroup>
                          <Menu.Separator />
                          <Menu.Item
                            color="danger"
                            onClick={() => notify(`${person.name} removed`)}
                          >
                            Remove
                          </Menu.Item>
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.Root>
                </div>
              ))}
            </Card.Content>
          </Card.Root>

          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Pro plan</Card.Title>
              <ToggleGroup
                aria-label="Billing period"
                attached
                value={billing}
                onValueChange={(next) => next.length && setBilling(next)}
              >
                <Toggle
                  value="monthly"
                  size="sm"
                  variant="soft"
                  color="neutral"
                >
                  Monthly
                </Toggle>
                <Toggle value="yearly" size="sm" variant="soft" color="neutral">
                  Yearly
                </Toggle>
              </ToggleGroup>
            </Card.Header>
            <Card.Content>
              <span className="theme-wall-price">
                <strong className="theme-wall-figure">
                  {yearly ? "$19" : "$24"}
                </strong>
                <Text size="sm" tone="muted">
                  per month{yearly ? ", billed yearly" : ""}
                </Text>
              </span>
              {["Unlimited projects", "Custom domains", "Priority support"].map(
                (feature) => (
                  <label key={feature} className="theme-wall-check">
                    <Checkbox.Root defaultChecked>
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                    {feature}
                  </label>
                ),
              )}
              <Button
                className="theme-wall-wide"
                onClick={() => notify("Welcome to Pro")}
              >
                Upgrade
              </Button>
            </Card.Content>
          </Card.Root>

          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Book a slot</Card.Title>
            </Card.Header>
            <Card.Content>
              <RangeCalendar.Root
                aria-label="Booking dates"
                className="theme-wall-calendar"
              >
                <div className="theme-wall-month">
                  <RangeCalendar.Button
                    slot="previous"
                    aria-label="Previous month"
                  />
                  <RangeCalendar.Heading />
                  <RangeCalendar.Button slot="next" aria-label="Next month" />
                </div>
                <RangeCalendar.Grid>
                  <RangeCalendar.GridHeader>
                    {(day) => (
                      <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                    )}
                  </RangeCalendar.GridHeader>
                  <RangeCalendar.GridBody>
                    {(date) => <RangeCalendar.Cell date={date} />}
                  </RangeCalendar.GridBody>
                </RangeCalendar.Grid>
              </RangeCalendar.Root>
            </Card.Content>
          </Card.Root>
        </div>
        <div className="theme-wall-col">
          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Filters</Card.Title>
              <Chip variant="soft" color="neutral">
                128 roles
              </Chip>
            </Card.Header>
            <Card.Content>
              <TagGroup.Root
                onRemove={(keys) =>
                  setTags((all) => all.filter((tag) => !keys.has(tag)))
                }
              >
                <TagGroup.Label>Looking for</TagGroup.Label>
                <TagGroup.List items={tags.map((id) => ({ id }))}>
                  {(item) => (
                    <TagGroup.Item id={item.id} textValue={item.id}>
                      {item.id}
                      <TagGroup.Remove slot="remove" aria-label="Remove" />
                    </TagGroup.Item>
                  )}
                </TagGroup.List>
              </TagGroup.Root>
              <Slider.Root defaultValue={[12, 30]} min={0} max={40}>
                <div className="theme-wall-slider-label">
                  <Slider.Label>Hours a week</Slider.Label>
                  <Slider.Value />
                </div>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                  </Slider.Track>
                  <Slider.Thumb index={0} aria-label="Fewest hours" />
                  <Slider.Thumb index={1} aria-label="Most hours" />
                </Slider.Control>
              </Slider.Root>
            </Card.Content>
          </Card.Root>

          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Verify it’s you</Card.Title>
            </Card.Header>
            <Card.Content>
              <label htmlFor="theme-wall-otp" className="theme-wall-label">
                We sent a code to •• 4821
              </label>
              <OTPField.Root
                id="theme-wall-otp"
                length={6}
                size="sm"
                onValueChange={setCode}
              >
                {Array.from({ length: 6 }, (_, index) => (
                  <OTPField.Input
                    key={index}
                    aria-label={index === 0 ? undefined : `Digit ${index + 1}`}
                  />
                ))}
              </OTPField.Root>
              <Text size="sm" tone="muted" role="status">
                {code.length === 6 ? "Code ready." : "Six digits, no spaces."}
              </Text>
            </Card.Content>
          </Card.Root>

          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Quick actions</Card.Title>
              <Kbd size="sm">⌘K</Kbd>
            </Card.Header>
            <Card.Content>
              <Command.Root<string>
                inline
                open
                items={commands}
                onValueChange={(value) => value && notify(value)}
              >
                <Command.Input
                  aria-label="Find an action"
                  placeholder="Type a command…"
                />
                <Command.List>
                  {(item) => (
                    <Command.Item key={item} value={item}>
                      {item}
                    </Command.Item>
                  )}
                </Command.List>
                <Command.Empty>Nothing matches.</Command.Empty>
              </Command.Root>
            </Card.Content>
          </Card.Root>

          <Card.Root className="theme-wall-card">
            <Card.Header>
              <Card.Title>Upload</Card.Title>
              <Badge variant="soft" color={uploading ? "accent" : "neutral"}>
                {uploading ? "2 left" : "Paused"}
              </Badge>
            </Card.Header>
            <Card.Content>
              <div className="theme-wall-file">
                <span className="theme-wall-glyph" aria-hidden="true">
                  <Upload size={16} />
                </span>
                <span>
                  <Text size="sm" variant="label.sm">
                    brand-kit.zip
                  </Text>
                  <Text size="sm" tone="muted">
                    48 of 68 MB
                  </Text>
                </span>
              </div>
              <Progress.Root value={70} aria-label="brand-kit.zip upload">
                <Progress.Track>
                  <Progress.Indicator />
                </Progress.Track>
              </Progress.Root>
              <div className="theme-wall-person">
                <AvatarGroup.Root size="sm" aria-label="Shared with">
                  {["AK", "MR", "JL"].map((initials) => (
                    <Avatar.Root key={initials}>
                      <Avatar.Fallback>{initials}</Avatar.Fallback>
                    </Avatar.Root>
                  ))}
                </AvatarGroup.Root>
                <IconButton
                  size="sm"
                  variant="ghost"
                  color="neutral"
                  aria-label="More upload options"
                >
                  <MoreHorizontal size={16} />
                </IconButton>
                <Button
                  size="sm"
                  variant="outline"
                  color="neutral"
                  onClick={() => setUploading((on) => !on)}
                >
                  {uploading ? "Pause" : "Resume"}
                </Button>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </div>

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

/** The playground's default preview: a wall of small compositions that shows one theme across many components. */
export function WorkspaceScene() {
  return (
    <Toast.Provider>
      <Wall />
    </Toast.Provider>
  );
}
