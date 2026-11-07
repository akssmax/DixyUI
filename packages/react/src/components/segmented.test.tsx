import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import axe from "axe-core";
import { Tabs, Toggle, ToggleGroup } from "../index";

const audit = (container: HTMLElement) =>
  axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
    },
    // jsdom cannot verify rendered contrast; the thumb pairs text.primary with surface.raised.
    rules: { "color-contrast": { enabled: false } },
  });

it("renders segmented tabs with the same tab contract as other variants", async () => {
  const user = userEvent.setup();
  const view = render(
    <main>
      <Tabs.Root defaultValue="overview" variant="segmented" color="danger">
        <Tabs.List aria-label="Preview scene">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="email">Email</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value="overview">Overview scene</Tabs.Panel>
        <Tabs.Panel value="email">Email scene</Tabs.Panel>
      </Tabs.Root>
    </main>,
  );
  const list = screen.getByRole("tablist", { name: "Preview scene" });
  expect(list).toHaveAttribute("data-variant", "segmented");
  expect(view.container.querySelector(".dixy-tabs-indicator")).toHaveAttribute(
    "data-variant",
    "segmented",
  );

  await user.tab();
  await user.keyboard("{ArrowRight}{Enter}");
  const email = screen.getByRole("tab", { name: "Email" });
  expect(email).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel", { name: "Email" })).toHaveTextContent(
    "Email scene",
  );
  expect((await audit(view.container)).violations).toEqual([]);
});

it("draws a segmented ToggleGroup without changing selection or focus", async () => {
  const user = userEvent.setup();
  const view = render(
    <main>
      <ToggleGroup
        aria-label="Density"
        segmented
        attached
        defaultValue={["default"]}
      >
        <Toggle value="compact">Compact</Toggle>
        <Toggle value="default">Default</Toggle>
        <Toggle value="comfy">Comfy</Toggle>
      </ToggleGroup>
    </main>,
  );
  const group = screen.getByRole("group", { name: "Density" });
  expect(group).toHaveAttribute("data-segmented");
  // Segmented replaces attached: one track, no doubled outline.
  expect(group).not.toHaveAttribute("data-attached");

  await user.tab();
  // One tab stop for the group; arrows move between segments.
  expect(screen.getByRole("button", { name: "Compact" })).toHaveFocus();
  await user.keyboard("{ArrowRight}{ArrowRight} ");
  expect(screen.getByRole("button", { name: "Comfy" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("button", { name: "Default" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect((await audit(view.container)).violations).toEqual([]);
});
