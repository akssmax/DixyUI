import { createRef, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import axe from "axe-core";
import { Tabs, Theme } from "../index";

for (const motion of ["system", "reduced"] as const) {
  it(`preserves manual activation, disabled discoverability and panel associations with ${motion} motion`, async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Theme motion={motion}>
        <Tabs.Root defaultValue="one" variant="solid" onValueChange={change}>
          <Tabs.List aria-label="Project sections">
            <Tabs.Tab value="one">Overview</Tabs.Tab>
            <Tabs.Tab value="locked" disabled>
              Unavailable
            </Tabs.Tab>
            <Tabs.Tab value="two">Activity</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value="one" keepMounted>
            Overview content
          </Tabs.Panel>
          <Tabs.Panel value="two" keepMounted>
            Activity content
          </Tabs.Panel>
        </Tabs.Root>
      </Theme>,
    );
    await user.tab();
    const overview = screen.getByRole("tab", { name: "Overview" });
    const activity = screen.getByRole("tab", { name: "Activity" });
    expect(overview).toHaveFocus();
    await user.keyboard("{ArrowRight}{Enter}");
    expect(screen.getByRole("tab", { name: "Unavailable" })).toHaveFocus();
    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(change).not.toHaveBeenCalled();
    await user.keyboard("{ArrowRight}");
    expect(activity).toHaveFocus();
    expect(overview).toHaveAttribute("aria-selected", "true");
    await user.keyboard(" ");
    expect(activity).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel", { name: "Activity" });
    expect(activity).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", activity.id);
    expect(screen.getByText("Overview content")).toHaveAttribute("inert");
    await waitFor(() =>
      expect(screen.getByText("Overview content")).toHaveAttribute("hidden"),
    );
    await user.tab();
    expect(panel).toHaveFocus();
    expect(change).toHaveBeenCalledOnce();
  });
}

it("retains refs, render composition, controlled values and nested visual scopes", async () => {
  const rootRef = createRef<HTMLDivElement>();
  const listRef = createRef<HTMLDivElement>();
  const indicatorRef = createRef<HTMLSpanElement>();
  const tabRef = createRef<HTMLButtonElement>();
  const panelRef = createRef<HTMLDivElement>();
  const change = vi.fn();
  function Example({ override = false }) {
    const [value, setValue] = useState<string | number | null>("one");
    return (
      <Theme material="paper" radius="full">
        <Tabs.Root
          ref={rootRef}
          value={value}
          onValueChange={(next, details) => {
            setValue(next);
            change(details.reason);
          }}
          variant={override ? "outline" : "solid"}
          radius={override ? "none" : undefined}
          size={override ? "lg" : "sm"}
          color="success"
          render={<div data-composed="root" />}
        >
          <Tabs.List
            ref={listRef}
            aria-label="Outer"
            render={<div data-composed="list" />}
          >
            <Tabs.Tab ref={tabRef} value="one">
              One
            </Tabs.Tab>
            <Tabs.Tab value="two">Two</Tabs.Tab>
            <Tabs.Indicator
              ref={indicatorRef}
              render={<span data-composed="indicator" />}
            />
          </Tabs.List>
          <Tabs.Panel ref={panelRef} value="one" keepMounted>
            <Tabs.Root defaultValue="inner" variant="soft" material="metal">
              <Tabs.List aria-label="Inner">
                <Tabs.Tab value="inner">Inner</Tabs.Tab>
                <Tabs.Indicator data-testid="inner-indicator" />
              </Tabs.List>
              <Tabs.Panel value="inner">Nested content</Tabs.Panel>
            </Tabs.Root>
          </Tabs.Panel>
          <Tabs.Panel value="two">Second content</Tabs.Panel>
        </Tabs.Root>
      </Theme>
    );
  }
  const view = render(<Example />);
  const user = userEvent.setup();
  await user.tab();
  const originalRoot = rootRef.current,
    originalIndicator = indicatorRef.current;
  expect(rootRef.current).toHaveAttribute("data-radius", "full");
  expect(indicatorRef.current).toHaveAttribute("data-material", "paper");
  expect(screen.getByTestId("inner-indicator")).toHaveAttribute(
    "data-material",
    "metal",
  );
  expect(screen.getByTestId("inner-indicator")).toHaveAttribute(
    "data-variant",
    "soft",
  );
  view.rerender(<Example override />);
  expect(rootRef.current).toBe(originalRoot);
  expect(indicatorRef.current).toBe(originalIndicator);
  expect(tabRef.current).toHaveFocus();
  expect(rootRef.current).toHaveAttribute("data-radius", "none");
  expect(listRef.current).toHaveAttribute("data-composed", "list");
  expect(indicatorRef.current).toHaveAttribute("data-composed", "indicator");
  expect(panelRef.current).toHaveAttribute("role", "tabpanel");
  await user.keyboard("{End}{Enter}");
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(change).toHaveBeenCalledOnce();
});

it("keeps automatic vertical and RTL focus navigation owned by the primitive", async () => {
  const user = userEvent.setup();
  const view = render(
    <Theme dir="rtl">
      <Tabs.Root defaultValue="one" orientation="vertical" variant="soft">
        <Tabs.List aria-label="Settings" activateOnFocus loopFocus={false}>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value="one">First</Tabs.Panel>
        <Tabs.Panel value="two">Second</Tabs.Panel>
      </Tabs.Root>
    </Theme>,
  );
  await user.tab();
  await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
  view.unmount();
  render(
    <Theme dir="rtl">
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="RTL" activateOnFocus>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First</Tabs.Panel>
        <Tabs.Panel value="two">Second</Tabs.Panel>
      </Tabs.Root>
    </Theme>,
  );
  await user.tab();
  await user.keyboard("{ArrowLeft}");
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

it("passes the applicable axe structural checks in both orientations", async () => {
  for (const orientation of ["horizontal", "vertical"] as const) {
    const view = render(
      <main>
        <Tabs.Root defaultValue="one" orientation={orientation} variant="soft">
          <Tabs.List aria-label="Audited sections">
            <Tabs.Tab value="one">Overview</Tabs.Tab>
            <Tabs.Tab value="two">Activity</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value="one">Overview content</Tabs.Panel>
          <Tabs.Panel value="two">Activity content</Tabs.Panel>
        </Tabs.Root>
      </main>,
    );
    const result = await axe.run(view.container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
      rules: { "color-contrast": { enabled: false } },
    });
    // jsdom cannot verify rendered contrast, clipping, zoom, or screen-reader output.
    expect(result.violations).toEqual([]);
    view.unmount();
  }
});
