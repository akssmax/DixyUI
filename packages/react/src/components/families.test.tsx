import { createRef, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import {
  Avatar,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Theme,
  Toggle,
} from "../index";

it("keeps visual attributes, refs and render callbacks separate from primitive state", async () => {
  const ref = createRef<HTMLButtonElement>();
  const user = userEvent.setup();
  render(
    <Theme material="paper" radius="full">
      <Toggle
        ref={ref}
        size="lg"
        color="success"
        variant="solid"
        className={(state) => (state.pressed ? "is-pressed" : undefined)}
        render={<button data-composed="toggle" />}
      >
        Bold
      </Toggle>
      <Avatar.Root data-testid="avatar" size="sm">
        <Avatar.Fallback role="img" aria-label="Akshay">
          AS
        </Avatar.Fallback>
      </Avatar.Root>
      <RadioGroup
        aria-label="Plan"
        defaultValue="personal"
        orientation="horizontal"
      >
        <Radio.Root value="personal" aria-label="Personal">
          <Radio.Indicator />
        </Radio.Root>
        <Radio.Root value="team" aria-label="Team">
          <Radio.Indicator />
        </Radio.Root>
      </RadioGroup>
    </Theme>,
  );
  expect(ref.current).toHaveAttribute("data-material", "paper");
  expect(ref.current).toHaveAttribute("data-radius", "full");
  expect(ref.current).toHaveAttribute("data-size", "lg");
  expect(ref.current).not.toHaveAttribute("material");
  expect(screen.getByTestId("avatar")).toHaveAttribute("data-radius", "full");
  await user.click(screen.getByRole("button", { name: "Bold" }));
  expect(ref.current).toHaveAttribute("aria-pressed", "true");
  expect(ref.current).toHaveClass("is-pressed");
  expect(ref.current).toHaveAttribute("data-composed", "toggle");
  await user.click(screen.getByRole("radio", { name: "Team" }));
  expect(screen.getByRole("radio", { name: "Team" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
});

it("retains typed object selection, cancellation, focus and default/custom decorative artwork", async () => {
  const items = [
    { id: 1, label: "Personal" },
    { id: 2, label: "Team" },
  ];
  const change = vi.fn();
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState<(typeof items)[number] | null>(
      items[0]!,
    );
    return (
      <Theme motion="reduced" material="metal">
        <Select.Root
          items={items.map((value) => ({ label: value.label, value }))}
          value={value}
          itemToStringLabel={(item) => item.label}
          onValueChange={(next, details) => {
            if (next?.id === 2) {
              details.cancel();
              change(next.id);
            } else setValue(next);
          }}
        >
          <Select.Trigger aria-label="Plan" radius="none" size="sm">
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup size="lg">
                <Select.List>
                  {items.map((item) => (
                    <Select.Item key={item.id} value={item}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </Theme>
    );
  }
  const view = render(<Example />);
  const trigger = screen.getByRole("combobox", { name: "Plan" });
  expect(trigger.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  await user.click(trigger);
  await user.click(await screen.findByRole("option", { name: "Team" }));
  expect(change).toHaveBeenCalledWith(2);
  expect(trigger).toHaveTextContent("Personal");
  view.unmount();
  render(
    <Select.Root>
      <Select.Trigger aria-label="Custom">
        <Select.Icon>
          <span>Custom artwork</span>
        </Select.Icon>
      </Select.Trigger>
    </Select.Root>,
  );
  expect(screen.getByText("Custom artwork")).toBeInTheDocument();
  expect(screen.getByRole("combobox").querySelector("svg")).toBeNull();
});

it("preserves scalar and range slider callbacks with visual settings", async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  render(
    <Theme>
      <Slider.Root
        defaultValue={[25, 75]}
        onValueChange={(value) => change(value[0])}
        size="sm"
        color="success"
        radius="full"
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb index={0} aria-label="Minimum" />
          <Slider.Thumb index={1} aria-label="Maximum" />
        </Slider.Control>
      </Slider.Root>
    </Theme>,
  );
  await user.tab();
  await user.keyboard("{ArrowRight}");
  await waitFor(() => expect(change).toHaveBeenCalledWith(26));
  expect(screen.getByRole("slider", { name: "Maximum" })).toHaveAttribute(
    "aria-valuenow",
    "75",
  );
});
