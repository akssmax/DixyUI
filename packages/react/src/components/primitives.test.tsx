import { createRef, useState, type ComponentType, type ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import * as Dixy from "../index";
import {
  Theme,
  Checkbox,
  Switch,
  Tabs,
  Tooltip,
  Radio,
  RadioGroup,
  CheckboxGroup,
  Toggle,
  ToggleGroup,
  Accordion,
  Collapsible,
  NumberField,
  Slider,
  Select,
  Combobox,
  Autocomplete,
  Menu,
  Popover,
  AlertDialog,
  Drawer,
  Toast,
  Field,
  Form,
  TextField,
  Button,
  Progress,
  Meter,
  OTPField,
  Avatar,
  ScrollArea,
} from "../index";

const modules = {
  checkbox: "Checkbox",
  switch: "Switch",
  tabs: "Tabs",
  tooltip: "Tooltip",
  accordion: "Accordion",
  "alert-dialog": "AlertDialog",
  autocomplete: "Autocomplete",
  avatar: "Avatar",
  "checkbox-group": "CheckboxGroup",
  collapsible: "Collapsible",
  combobox: "Combobox",
  "context-menu": "ContextMenu",
  drawer: "Drawer",
  fieldset: "Fieldset",
  form: "Form",
  menu: "Menu",
  menubar: "Menubar",
  meter: "Meter",
  "navigation-menu": "NavigationMenu",
  "number-field": "NumberField",
  "otp-field": "OTPField",
  popover: "Popover",
  "preview-card": "PreviewCard",
  progress: "Progress",
  radio: "Radio",
  "radio-group": "RadioGroup",
  "scroll-area": "ScrollArea",
  select: "Select",
  separator: "Separator",
  slider: "Slider",
  toast: "Toast",
  toggle: "Toggle",
  "toggle-group": "ToggleGroup",
  toolbar: "Toolbar",
} as const;

describe("Base UI public coverage", () => {
  it("preserves every public part and helper in all added families", async () => {
    for (const [slug, name] of Object.entries(modules)) {
      const primitive = (
        await import(/* @vite-ignore */ `@base-ui/react/${slug}`)
      )[name];
      const wrapped = (Dixy as unknown as Record<string, unknown>)[name];
      expect(wrapped, name).toBeDefined();
      if (typeof primitive === "object" && !("$$typeof" in primitive)) {
        expect(Object.keys(wrapped!), name).toEqual(
          expect.arrayContaining(Object.keys(primitive)),
        );
      }
    }
    expect(Dixy.Field.Control).toBeDefined();
    expect(Dixy.Field.Item).toBeDefined();
    expect(Dixy.Dialog.createHandle).toBeDefined();
  });
});

describe("First learning slice", () => {
  it("keeps Checkbox controlled state, refs, callbacks and submitted values", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const change = vi.fn();
    function Example() {
      const [checked, setChecked] = useState(false);
      return (
        <form data-testid="form">
          <Checkbox.Root
            ref={ref}
            name="updates"
            value="yes"
            checked={checked}
            onCheckedChange={(next, details) => {
              setChecked(next);
              change(details.reason);
            }}
            className={(state) => (state.checked ? "selected" : "idle")}
            aria-label="Updates"
          >
            <Checkbox.Indicator />
          </Checkbox.Root>
        </form>
      );
    }
    render(<Example />);
    await user.tab();
    expect(ref.current).toHaveFocus();
    await user.keyboard(" ");
    expect(ref.current).toHaveAttribute("aria-checked", "true");
    expect(ref.current).toHaveClass("dixy-checkbox-root", "selected");
    expect(
      new FormData(screen.getByTestId("form") as HTMLFormElement).get(
        "updates",
      ),
    ).toBe("yes");
    expect(change).toHaveBeenCalled();
  });
  it("exposes mixed state and prevents disabled activation", async () => {
    const change = vi.fn();
    render(
      <Checkbox.Root
        indeterminate
        disabled
        aria-label="All projects"
        onCheckedChange={change}
      >
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
    await userEvent.click(screen.getByRole("checkbox"));
    expect(change).not.toHaveBeenCalled();
  });
  it("forwards render composition without adding a DOM wrapper", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Checkbox.Root
        render={<button data-testid="custom" />}
        nativeButton
        ref={ref}
        aria-label="Custom"
      />,
    );
    expect(ref.current).toBe(screen.getByTestId("custom"));
    expect(ref.current).toHaveClass("dixy-checkbox-root");
  });
  it("preserves Indicator refs, render state, custom content and keepMounted", () => {
    const ref = createRef<HTMLSpanElement>();
    const view = render(
      <Checkbox.Root checked={false} indeterminate aria-label="Projects">
        <Checkbox.Indicator
          ref={ref}
          keepMounted
          className={(state) => (state.indeterminate ? "mixed" : "binary")}
          render={(props, state) => (
            <span
              {...props}
              data-testid="indicator"
              data-mixed={state.indeterminate}
            />
          )}
        />
      </Checkbox.Root>,
    );
    const indicator = screen.getByTestId("indicator");
    expect(ref.current).toBe(indicator);
    expect(indicator).toHaveClass("dixy-checkbox-indicator", "mixed");
    expect(indicator).toHaveAttribute("data-indeterminate");
    expect(indicator.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    view.rerender(
      <Checkbox.Root checked={false} aria-label="Projects">
        <Checkbox.Indicator ref={ref} keepMounted>
          <span>Custom selection</span>
        </Checkbox.Indicator>
      </Checkbox.Root>,
    );
    expect(ref.current).toHaveAttribute("data-unchecked");
    expect(ref.current).toHaveTextContent("Custom selection");
    expect(ref.current?.querySelector("svg")).toBeNull();
    view.rerender(
      <Checkbox.Root checked aria-label="Projects">
        <Checkbox.Indicator ref={ref} keepMounted>
          {null}
        </Checkbox.Indicator>
      </Checkbox.Root>,
    );
    expect(ref.current).toBeEmptyDOMElement();
  });
  it("operates Switch with Space and exposes its checked state", async () => {
    render(
      <Switch.Root aria-label="Notifications">
        <Switch.Thumb />
      </Switch.Root>,
    );
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });
  it("moves between tabs and their correctly associated panels", async () => {
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>,
    );
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel"),
    );
  });
  it("uses RTL keyboard direction inside Theme", async () => {
    render(
      <Theme dir="rtl">
        <Tabs.Root defaultValue="one">
          <Tabs.List>
            <Tabs.Tab value="one">One</Tabs.Tab>
            <Tabs.Tab value="two">Two</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="one">First</Tabs.Panel>
          <Tabs.Panel value="two">Second</Tabs.Panel>
        </Tabs.Root>
      </Theme>,
    );
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
  });
  it("opens Tooltip on focus, inherits its theme through a portal and dismisses", async () => {
    render(
      <Theme
        appearance="dark"
        accentColor="cyan"
        density="comfortable"
        radius="full"
        motion="reduced"
        dir="rtl"
      >
        <Tooltip.Provider delay={0}>
          <Tooltip.Root>
            <Tooltip.Trigger>Save</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner>
                <Tooltip.Popup>Save your project</Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Theme>,
    );
    const user = userEvent.setup();
    await user.tab();
    const tip = await screen.findByText("Save your project");
    expect(tip).toHaveTextContent("Save your project");
    const scope = tip.closest(".dixy-portal-scope");
    expect(scope).toHaveAttribute("data-appearance", "dark");
    expect(scope).toHaveAttribute("data-accent", "cyan");
    expect(scope).toHaveAttribute("data-dixy-density", "comfortable");
    expect(scope).toHaveAttribute("data-radius", "full");
    expect(scope).toHaveAttribute("data-motion", "reduced");
    expect(scope).toHaveAttribute("dir", "rtl");
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Save your project")).not.toBeInTheDocument(),
    );
  });
});

it("keeps checkbox groups and radio groups distinct in form serialization", async () => {
  render(
    <form data-testid="choices">
      <CheckboxGroup defaultValue={["mail"]}>
        <Checkbox.Root name="channel" value="mail" aria-label="Mail" />
      </CheckboxGroup>
      <RadioGroup name="plan" defaultValue="solo">
        <Radio.Root value="solo" aria-label="Solo" />
        <Radio.Root value="team" aria-label="Team" />
      </RadioGroup>
    </form>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("radio", { name: "Team" }));
  const data = new FormData(screen.getByTestId("choices") as HTMLFormElement);
  expect(data.get("channel")).toBe("mail");
  expect(data.get("plan")).toBe("team");
});
it("updates grouped toggle pressed state", async () => {
  render(
    <ToggleGroup aria-label="Formatting">
      <Toggle value="bold">Bold</Toggle>
      <Toggle value="italic">Italic</Toggle>
    </ToggleGroup>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Bold" }));
  expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await userEvent.click(screen.getByRole("button", { name: "Italic" }));
  expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});
it("keeps disclosure state and visible content aligned", async () => {
  render(
    <>
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>Question</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Answer</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Collapsible.Root>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Panel>Extra details</Collapsible.Panel>
      </Collapsible.Root>
    </>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Question" }));
  expect(screen.getByRole("button", { name: "Question" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(screen.getByText("Answer")).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "Details" }));
  expect(screen.getByText("Extra details")).toBeVisible();
});
it("enforces NumberField bounds using stepper buttons", async () => {
  render(
    <NumberField.Root defaultValue={1} min={1} max={2}>
      <NumberField.Group>
        <NumberField.Decrement aria-label="Less" />
        <NumberField.Input aria-label="Seats" />
        <NumberField.Increment aria-label="More" />
      </NumberField.Group>
    </NumberField.Root>,
  );
  await userEvent.click(screen.getByRole("button", { name: "More" }));
  expect(screen.getByRole("textbox", { name: "Seats" })).toHaveValue("2");
  expect(screen.getByRole("button", { name: "More" })).toBeDisabled();
});
it("adjusts Slider with keyboard steps", async () => {
  render(
    <Slider.Root defaultValue={40} step={5}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        <Slider.Thumb aria-label="Volume" />
      </Slider.Control>
    </Slider.Root>,
  );
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "45");
});
it("exposes task progress separately from scalar measurement", () => {
  render(
    <>
      <Progress.Root value={30} aria-label="Upload">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Meter.Root value={70} aria-label="Storage">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </>,
  );
  expect(screen.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "30",
  );
  expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "70");
});
it("retains Field validation and native Form submit", async () => {
  const submit = vi.fn((e) => e.preventDefault());
  render(
    <Form onSubmit={submit}>
      <Field.Root name="workspace">
        <Field.Label>Name</Field.Label>
        <TextField name="workspace" required />
        <Field.Error />
      </Field.Root>
      <Button type="submit">Save</Button>
    </Form>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save" }));
  expect(submit).not.toHaveBeenCalled();
  await user.type(screen.getByRole("textbox"), "Dixy");
  await user.click(screen.getByRole("button", { name: "Save" }));
  expect(submit).toHaveBeenCalledOnce();
});
it("coordinates OTP paste across the field", async () => {
  const changed = vi.fn();
  render(
    <>
      <label htmlFor="otp-first">Verification code</label>
      <OTPField.Root id="otp-first" length={4} onValueChange={changed}>
        {[1, 2, 3, 4].map((n) => (
          <OTPField.Input
            key={n}
            aria-label={n === 1 ? undefined : `Digit ${n}`}
          />
        ))}
      </OTPField.Root>
    </>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("textbox", { name: "Verification code" }));
  await user.paste("1234");
  expect(changed).toHaveBeenLastCalledWith("1234", expect.anything());
});
it("provides Avatar fallback and a reachable scroll viewport", async () => {
  render(
    <>
      <Avatar.Root>
        <Avatar.Fallback>AS</Avatar.Fallback>
      </Avatar.Root>
      <ScrollArea.Root style={{ height: 100 }}>
        <ScrollArea.Viewport tabIndex={0} aria-label="Activity">
          <ScrollArea.Content>Milestone</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </>,
  );
  expect(await screen.findByText("AS")).toBeVisible();
  await userEvent.tab();
  expect(screen.getByLabelText("Activity")).toHaveFocus();
});

for (const [name, Primitive] of [
  ["Popover", Popover],
  ["AlertDialog", AlertDialog],
  ["Drawer", Drawer],
] as const) {
  it(`${name} preserves dismissal, focus restoration and themed portals`, async () => {
    const Root = Primitive.Root as ComponentType<{ children: ReactNode }>;
    render(
      <Theme appearance="dark">
        <Root>
          <Primitive.Trigger>Open {name}</Primitive.Trigger>
          <Primitive.Portal>
            {"Backdrop" in Primitive && <Primitive.Backdrop />}
            {name === "Popover" ? (
              <Popover.Positioner>
                <Popover.Popup>
                  <Popover.Title>Details</Popover.Title>
                  <Popover.Close>Close</Popover.Close>
                </Popover.Popup>
              </Popover.Positioner>
            ) : name === "Drawer" ? (
              <Drawer.Viewport>
                <Drawer.Popup>
                  <Drawer.Title>Details</Drawer.Title>
                  <Drawer.Close>Close</Drawer.Close>
                </Drawer.Popup>
              </Drawer.Viewport>
            ) : (
              <AlertDialog.Viewport>
                <AlertDialog.Popup>
                  <AlertDialog.Title>Details</AlertDialog.Title>
                  <AlertDialog.Close>Close</AlertDialog.Close>
                </AlertDialog.Popup>
              </AlertDialog.Viewport>
            )}
          </Primitive.Portal>
        </Root>
      </Theme>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: `Open ${name}` }));
    const heading = await screen.findByText("Details");
    expect(heading.closest(".dixy-portal-scope")).toHaveAttribute(
      "data-appearance",
      "dark",
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(screen.queryByText("Details")).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: `Open ${name}` })).toHaveFocus();
  });
}
it("keeps Menu keyboard selection and close behavior", async () => {
  const action = vi.fn();
  render(
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item onClick={action}>Duplicate</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>,
  );
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard("{ArrowDown}");
  await waitFor(() => expect(screen.getByRole("menuitem")).toHaveFocus());
  await user.keyboard("{Enter}");
  expect(action).toHaveBeenCalledOnce();
});
it("Select preserves keyboard selection and generic values", async () => {
  render(
    <Select.Root defaultValue="one">
      <Select.Trigger aria-label="Plan">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              <Select.Item value="one">
                <Select.ItemText>One</Select.ItemText>
              </Select.Item>
              <Select.Item value="two">
                <Select.ItemText>Two</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>,
  );
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard("{ArrowDown}");
  await screen.findByRole("listbox");
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "One" })).toHaveFocus(),
  );
  await user.keyboard("{End}");
  expect(screen.getByRole("option", { name: "Two" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("combobox")).toHaveTextContent("two");
});
for (const [name, Primitive] of [
  ["Combobox", Combobox],
  ["Autocomplete", Autocomplete],
] as const) {
  it(`${name} filters suggestions without breaking input typing`, async () => {
    const Root = Primitive.Root as ComponentType<{
      items: string[];
      children: ReactNode;
    }>;
    render(
      <Root items={["React", "Vue"]}>
        <Primitive.Input aria-label="Framework" />
        <Primitive.Portal>
          <Primitive.Positioner>
            <Primitive.Popup>
              <Primitive.List>
                {(item: string) => (
                  <Primitive.Item key={item} value={item}>
                    {item}
                  </Primitive.Item>
                )}
              </Primitive.List>
            </Primitive.Popup>
          </Primitive.Positioner>
        </Primitive.Portal>
      </Root>,
    );
    await userEvent.type(screen.getByRole("combobox"), "Re");
    expect(await screen.findByRole("option", { name: "React" })).toBeVisible();
    expect(
      screen.queryByRole("option", { name: "Vue" }),
    ).not.toBeInTheDocument();
  });
}
it("Toast queues an announcement and supports explicit dismissal", async () => {
  function Notifications() {
    const manager = Toast.useToastManager();
    return (
      <>
        <Button onClick={() => manager.add({ title: "Saved", timeout: 0 })}>
          Save
        </Button>
        <Toast.Portal>
          <Toast.Viewport>
            {manager.toasts.map((toast) => (
              <Toast.Root key={toast.id} toast={toast}>
                <Toast.Title />
                <Toast.Close>Dismiss</Toast.Close>
              </Toast.Root>
            ))}
          </Toast.Viewport>
        </Toast.Portal>
      </>
    );
  }
  render(
    <Theme>
      <Toast.Provider>
        <Notifications />
      </Toast.Provider>
    </Theme>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByText("Saved")).toBeVisible();
  const close = screen.getByText("Dismiss");
  await userEvent.click(close);
  await waitFor(() =>
    expect(screen.queryByText("Saved")).not.toBeInTheDocument(),
  );
});
it("renders deterministic initial control markup on the server", () => {
  const element = (
    <Theme>
      <Checkbox.Root defaultChecked aria-label="Updates">
        <Checkbox.Indicator />
      </Checkbox.Root>
      <Switch.Root aria-label="Setting">
        <Switch.Thumb />
      </Switch.Root>
    </Theme>
  );
  expect(renderToString(element).replaceAll(/id="[^"]*"/g, "")).toContain(
    "dixy-checkbox-root",
  );
  expect(renderToString(element)).toContain('aria-checked="true"');
});

it("keeps a labeled checkbox's accessible name stable across indicator states", async () => {
  render(
    <label>
      <Checkbox.Root>
        <Checkbox.Indicator />
      </Checkbox.Root>
      Product updates
    </label>,
  );
  const checkbox = screen.getByRole("checkbox", {
    name: "Product updates",
  });
  await userEvent.click(checkbox);
  expect(checkbox).toHaveAttribute("aria-checked", "true");
  expect(checkbox).toHaveAccessibleName("Product updates");
});
