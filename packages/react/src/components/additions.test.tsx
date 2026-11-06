import { createRef, useState } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import {
  Button,
  ButtonGroup,
  Avatar,
  AvatarGroup,
  Card,
  Textarea,
  NativeSelect,
  Resizable,
  ListBox,
  TagGroup,
  DateField,
  LocaleProvider,
  parseDate,
  Carousel,
  ProgressCircle,
  Chart,
  ColorPicker,
  parseColor,
  Command,
} from "../index";

it("inherits group visuals while retaining explicit overrides, native Tab stops and independent siblings", async () => {
  const user = userEvent.setup();
  render(
    <>
      <ButtonGroup
        size="sm"
        variant="soft"
        color="success"
        aria-label="Actions"
      >
        <Button>Save</Button>
        <Button size="lg" color="danger">
          Delete
        </Button>
      </ButtonGroup>
      <Button>Outside</Button>
      <AvatarGroup.Root size="lg" color="neutral">
        <Avatar.Root data-testid="member">
          <Avatar.Fallback>AS</Avatar.Fallback>
        </Avatar.Root>
      </AvatarGroup.Root>
    </>,
  );
  expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
    "data-size",
    "sm",
  );
  expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
    "data-color",
    "success",
  );
  expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute(
    "data-size",
    "lg",
  );
  expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute(
    "data-color",
    "danger",
  );
  expect(screen.getByRole("button", { name: "Outside" })).toHaveAttribute(
    "data-color",
    "accent",
  );
  expect(screen.getByTestId("member")).toHaveAttribute("data-size", "lg");
  await user.tab();
  expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
});
it("preserves textarea/select native values, refs, disabled options and semantic heading composition", async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLTextAreaElement>();
  render(
    <form data-testid="form">
      <Card.Title as="h4">Notes</Card.Title>
      <label>
        Notes
        <Textarea ref={ref} name="notes" />
      </label>
      <label>
        Plan
        <NativeSelect name="plan">
          <option value="team">Team</option>
          <option value="disabled" disabled>
            Disabled
          </option>
        </NativeSelect>
      </label>
    </form>,
  );
  await user.type(
    screen.getByRole("textbox", { name: "Notes" }),
    "First{Enter}Second",
  );
  expect(ref.current?.value).toBe("First\nSecond");
  expect(
    new FormData(screen.getByTestId("form") as HTMLFormElement).get("notes"),
  ).toBe("First\nSecond");
  expect(
    screen.getByRole("heading", { name: "Notes", level: 4 }),
  ).toBeVisible();
  expect(screen.getByRole("option", { name: "Disabled" })).toBeDisabled();
});
it("bounds separator keyboard resizing, honors cancellation and leaves controlled values with the owner", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <Resizable.Root defaultValue={50} min={20} max={80} onValueChange={change}>
      <Resizable.Panel side="start">A</Resizable.Panel>
      <Resizable.Handle aria-label="Split" />
      <Resizable.Panel side="end">B</Resizable.Panel>
    </Resizable.Root>,
  );
  const handle = screen.getByRole("separator", { name: "Split" });
  handle.focus();
  await user.keyboard("{End}");
  expect(handle).toHaveAttribute("aria-valuenow", "80");
  await user.keyboard("{Home}{ArrowLeft}");
  expect(handle).toHaveAttribute("aria-valuenow", "20");
  expect(
    document.getElementById(handle.getAttribute("aria-controls")!),
  ).toHaveTextContent("A");
  rerender(
    <Resizable.Root
      value={50}
      onValueChange={change}
      style={{ direction: "rtl" }}
    >
      <Resizable.Panel side="start">A</Resizable.Panel>
      <Resizable.Handle aria-label="Split" />
      <Resizable.Panel side="end">B</Resizable.Panel>
    </Resizable.Root>,
  );
  handle.focus();
  await user.keyboard("{ArrowLeft}");
  expect(change).toHaveBeenLastCalledWith(51);
  expect(handle).toHaveAttribute("aria-valuenow", "50");
  rerender(
    <Resizable.Root key="cancel">
      <Resizable.Handle
        aria-label="Split"
        onKeyDown={(event) => event.preventDefault()}
      />
    </Resizable.Root>,
  );
  const cancelled = screen.getByRole("separator", { name: "Split" });
  cancelled.focus();
  await user.keyboard("{End}");
  expect(cancelled).toHaveAttribute("aria-valuenow", "50");
});
it("retains React Aria collection callbacks and disabled-option keyboard behavior", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ListBox.Root
      aria-label="Plan"
      selectionMode="single"
      disabledKeys={["locked"]}
      onSelectionChange={change}
    >
      <ListBox.Item id="personal">Personal</ListBox.Item>
      <ListBox.Item id="locked">Locked</ListBox.Item>
      <ListBox.Item id="team">Team</ListBox.Item>
    </ListBox.Root>,
  );
  await user.click(screen.getByRole("option", { name: "Personal" }));
  expect(change).toHaveBeenCalled();
  expect(screen.getByRole("option", { name: "Locked" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await user.keyboard("{End}{Enter}");
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "Team" })).toHaveAttribute(
      "aria-selected",
      "true",
    ),
  );
});
it("removes a tag through its primitive callback and recovers focus", async () => {
  const user = userEvent.setup();
  function Tags() {
    const [items, setItems] = useState(["Design", "Code"]);
    return (
      <TagGroup.Root
        onRemove={(keys) => setItems(items.filter((item) => !keys.has(item)))}
      >
        <TagGroup.Label>Skills</TagGroup.Label>
        <TagGroup.List items={items.map((id) => ({ id }))}>
          {(item) => (
            <TagGroup.Item id={item.id} textValue={item.id}>
              {item.id}
              <TagGroup.Remove slot="remove" aria-label="Remove">
                ×
              </TagGroup.Remove>
            </TagGroup.Item>
          )}
        </TagGroup.List>
      </TagGroup.Root>
    );
  }
  render(<Tags />);
  await user.click(screen.getByRole("button", { name: "Remove Design" }));
  await waitFor(() =>
    expect(
      screen.queryByRole("button", { name: "Remove Design" }),
    ).not.toBeInTheDocument(),
  );
  expect(
    screen.getByRole("button", { name: "Remove Code" }),
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByRole("row", { name: "Code" })).toHaveFocus(),
  );
});
it("keeps typed calendar values and segment keyboard editing with the locale primitive", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <LocaleProvider locale="en-US">
      <DateField.Root defaultValue={parseDate("2026-10-15")} onChange={change}>
        <DateField.Label>Appointment</DateField.Label>
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
      </DateField.Root>
    </LocaleProvider>,
  );
  const month = screen.getByRole("spinbutton", { name: /month/i });
  month.focus();
  await user.keyboard("{ArrowUp}");
  expect(change).toHaveBeenCalled();
  expect(change.mock.lastCall?.[0].toString()).toBe("2026-11-15");
});
it("keeps native carousel scrolling available without automatic rotation and exposes chart data", () => {
  render(
    <>
      <Carousel.Root aria-label="Principles">
        <Carousel.Viewport>
          <Carousel.Item aria-label="1 of 2">Clarity</Carousel.Item>
          <Carousel.Item aria-label="2 of 2">Consistency</Carousel.Item>
        </Carousel.Viewport>
        <Carousel.Previous />
        <Carousel.Next />
      </Carousel.Root>
      <ProgressCircle aria-label="Upload" value={150} />
      <Chart label="Monthly work" data={[{ label: "January", value: 12 }]} />
    </>,
  );
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next slide" })).not.toBeDisabled();
  expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  fireEvent.click(screen.getByText("View chart data"));
  expect(
    screen.getByRole("table", { name: "Monthly work" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("cell", { name: "12" })).toBeInTheDocument();
});
it("preserves color-field editing and emits Color values rather than strings", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ColorPicker.Root defaultValue={parseColor("#7e4deb")} onChange={change}>
      <ColorPicker.Field>
        <ColorPicker.Label>Accent</ColorPicker.Label>
        <ColorPicker.Input />
      </ColorPicker.Field>
    </ColorPicker.Root>,
  );
  const input = screen.getByRole("textbox", { name: "Accent" });
  await user.clear(input);
  await user.type(input, "#ff0000");
  await user.tab();
  await waitFor(() => expect(change).toHaveBeenCalled());
  expect(change.mock.lastCall?.[0].toString("hex")).toBe("#FF0000");
});

it("keeps the inline command list logically open for filtered keyboard activation", async () => {
  const user = userEvent.setup();
  const choose = vi.fn();
  render(
    <Command.Root<string>
      items={["New project", "Settings"]}
      onValueChange={choose}
    >
      <Command.Input aria-label="Command" />
      <Command.List>
        {(item) => (
          <Command.Item value={item} key={item}>
            {item}
          </Command.Item>
        )}
      </Command.List>
    </Command.Root>,
  );
  const input = screen.getByRole("combobox", { name: "Command" });
  await user.type(input, "sett");
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "Settings" })).toHaveAttribute(
      "data-highlighted",
    ),
  );
  await user.keyboard("{Enter}");
  await waitFor(() =>
    expect(choose).toHaveBeenCalledWith("Settings", expect.anything()),
  );
});
