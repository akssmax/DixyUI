import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import {
  Checkbox,
  Dialog,
  Drawer,
  Menu,
  Tabs,
  TextField,
  Theme,
} from "../index";

it("Checkbox keeps focus, selection and indicator identity when motion changes", async () => {
  const ref = createRef<HTMLSpanElement>();
  const change = vi.fn();
  const user = userEvent.setup();
  function Example({ reduced }: { reduced: boolean }) {
    return (
      <Theme motion={reduced ? "reduced" : "system"}>
        <label>
          <Checkbox.Root defaultChecked onCheckedChange={change}>
            <Checkbox.Indicator ref={ref} />
          </Checkbox.Root>
          Updates
        </label>
      </Theme>
    );
  }
  const view = render(<Example reduced={false} />);
  const checkbox = screen.getByRole("checkbox", { name: "Updates" });
  const indicator = ref.current;
  await user.tab();
  for (const reduced of [true, false]) {
    view.rerender(<Example reduced={reduced} />);
    expect(checkbox).toHaveFocus();
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(checkbox).toHaveAccessibleName("Updates");
    expect(ref.current).toBe(indicator);
    expect(indicator?.closest("[data-motion]")).toHaveAttribute(
      "data-motion",
      reduced ? "reduced" : "system",
    );
  }
  await user.keyboard(" ");
  expect(checkbox).toHaveAttribute("aria-checked", "false");
  expect(change).toHaveBeenCalledOnce();
  await user.keyboard(" ");
  expect(checkbox).toHaveAttribute("aria-checked", "true");
  expect(change).toHaveBeenCalledTimes(2);
  expect(checkbox).toHaveFocus();
});

for (const [name, Popup] of [
  ["Dialog", Dialog],
  ["Drawer", Drawer],
] as const) {
  it(`${name} preserves the open input, ref and focus when motion changes`, async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    function Example({ reduced }: { reduced: boolean }) {
      return (
        <Theme motion={reduced ? "reduced" : "system"}>
          <Popup.Root>
            <Popup.Trigger>Open editor</Popup.Trigger>
            <Popup.Portal>
              <Popup.Backdrop />
              <Popup.Viewport>
                <Popup.Popup ref={ref}>
                  <Popup.Title>Project editor</Popup.Title>
                  <Popup.Description>Edit the project name.</Popup.Description>
                  <TextField aria-label="Project name" defaultValue="Dixy" />
                  <Popup.Close>Done</Popup.Close>
                </Popup.Popup>
              </Popup.Viewport>
            </Popup.Portal>
          </Popup.Root>
        </Theme>
      );
    }
    const view = render(<Example reduced={false} />);
    await user.click(screen.getByRole("button", { name: "Open editor" }));
    const popup = ref.current;
    const input = screen.getByRole("textbox", { name: "Project name" });
    await user.type(input, " Studio");
    for (const reduced of [true, false]) {
      view.rerender(<Example reduced={reduced} />);
      expect(ref.current).toBe(popup);
      expect(input).toHaveValue("Dixy Studio");
      expect(input).toHaveFocus();
      expect(popup?.closest("[data-motion]")).toHaveAttribute(
        "data-motion",
        reduced ? "reduced" : "system",
      );
    }
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: "Open editor" })).toHaveFocus();
  });
}

for (const motion of ["system", "reduced"] as const) {
  it(`Menu skips disabled choices and fires one keyboard action with ${motion} motion`, async () => {
    const action = vi.fn();
    const user = userEvent.setup();
    render(
      <Theme motion={motion}>
        <Menu.Root>
          <Menu.Trigger>Project actions</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item disabled>Unavailable</Menu.Item>
                <Menu.Item onClick={action}>Duplicate</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Theme>,
    );
    await user.tab();
    await user.keyboard("{ArrowDown}");
    const duplicate = await screen.findByRole("menuitem", {
      name: "Duplicate",
    });
    await waitFor(() => expect(duplicate).toHaveFocus());
    await user.keyboard("{Enter}");
    expect(action).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole("button", { name: "Project actions" }),
    ).toHaveFocus();
  });
  it(`vertical RTL Tabs activate by keyboard with ${motion} motion`, async () => {
    const user = userEvent.setup();
    render(
      <Theme motion={motion} dir="rtl">
        <Tabs.Root defaultValue="overview" orientation="vertical">
          <Tabs.List aria-label="Project sections">
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="disabled" disabled>
              Unavailable
            </Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value="overview">Project overview</Tabs.Panel>
          <Tabs.Panel value="activity">Recent activity</Tabs.Panel>
        </Tabs.Root>
      </Theme>,
    );
    await user.tab();
    await user.keyboard("{ArrowDown}{Enter}");
    // Base UI intentionally lets disabled tabs receive roving focus, but not activate.
    expect(screen.getByRole("tab", { name: "Unavailable" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("tabpanel", { name: "Activity" }),
    ).toHaveTextContent("Recent activity");
  });
}
