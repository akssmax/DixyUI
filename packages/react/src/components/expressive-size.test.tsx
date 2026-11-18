import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it, vi } from "vitest";
import { act } from "react";
import {
  Avatar,
  ProgressCircle,
  Spinner,
  Box,
  Button,
  Combobox,
  IconButton,
  ListBox,
  Menu,
  Progress,
  Shape,
  Theme,
  Toggle,
  ToggleGroup,
} from "../index";

// Tests run from the package root (jsdom's import.meta.url isn't a file URL).
const families = readFileSync(
  resolve(process.cwd(), "src/styles/families.css"),
  "utf8",
);

it('ListBox size="xl" marks the root and keeps option semantics', () => {
  render(
    <Theme>
      <ListBox.Root aria-label="Language" size="xl" selectionMode="single">
        <ListBox.Item id="nl">Nederlands</ListBox.Item>
      </ListBox.Root>
    </Theme>,
  );
  expect(screen.getByRole("listbox")).toHaveAttribute("data-size", "xl");
  expect(screen.getByRole("option", { name: "Nederlands" })).toBeTruthy();
});

it('Menu items inside a size="xl" popup inherit it (no own data-size)', async () => {
  render(
    <Theme>
      <Menu.Root>
        <Menu.Trigger>Edit</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup size="xl">
              <Menu.Item>Copy</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Theme>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Edit" }));
  const item = await screen.findByRole("menuitem", { name: "Copy" });
  expect(item).not.toHaveAttribute("data-size");
  expect(item.closest('[data-size="xl"]')).not.toBeNull();
});

it('Combobox input group and input accept size="xl"', () => {
  render(
    <Theme>
      <Combobox.Root items={["Lima"]}>
        <Combobox.InputGroup size="xl">
          <Combobox.Input size="xl" aria-label="Where to?" />
        </Combobox.InputGroup>
      </Combobox.Root>
    </Theme>,
  );
  const input = screen.getByRole("combobox", { name: "Where to?" });
  expect(input).toHaveAttribute("data-size", "xl");
  expect(input.parentElement).toHaveAttribute("data-size", "xl");
});

it("xl maps to the fluid display.xl role, with per-element tracking", () => {
  expect(families).toMatch(
    /\[data-dixy-visual\]\[data-size="xl"\] \{[^}]*--dixy-component-font: var\(--dixy-font-display-xl\)/,
  );
  // Tracking is declared on descendants so em resolves at each element's size.
  expect(families).toMatch(
    /\[data-dixy-visual\]\[data-size="xl"\] :where\(\*\) \{\s*letter-spacing: var\(--dixy-font-display-xl-letter-spacing\)/,
  );
});

const components = readFileSync(
  resolve(process.cwd(), "src/styles/components.css"),
  "utf8",
);

it('Box surface="accent" marks the box and remaps content tokens', () => {
  render(
    <Theme>
      <Box surface="accent" data-testid="accent">
        inside
      </Box>
      <Box data-testid="plain">outside</Box>
    </Theme>,
  );
  expect(screen.getByTestId("accent")).toHaveAttribute(
    "data-surface",
    "accent",
  );
  expect(screen.getByTestId("plain")).not.toHaveAttribute("data-surface");
  const rule = components.slice(
    components.indexOf('.dixy-box[data-surface="accent"] {'),
  );
  for (const token of [
    "--dixy-color-text-primary",
    "--dixy-color-border-focus",
    "--dixy-skin-surface",
    "--dixy-button-primary-background",
    "--dixy-button-primary-foreground",
  ])
    expect(rule.slice(0, rule.indexOf("}"))).toContain(token);
});

it('Theme highlight="band" reaches portalled popups; option rules read the band first', async () => {
  render(
    <Theme highlight="band">
      <Menu.Root>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>Open</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Theme highlight="tint" data-testid="nested" />
    </Theme>,
  );
  await userEvent.click(screen.getByRole("button", { name: "File" }));
  const item = await screen.findByRole("menuitem", { name: "Open" });
  expect(item.closest(".dixy-portal-scope")).toHaveAttribute(
    "data-highlight",
    "band",
  );
  expect(screen.getByTestId("nested")).toHaveAttribute(
    "data-highlight",
    "tint",
  );
  expect(families).toMatch(
    /\)\[data-highlighted\]:not\(\[data-disabled\]\) \{[^}]*background: var\(\s*--dixy-highlight-band,/,
  );
  expect(components).toMatch(
    /\.dixy-theme\[data-highlight="band"\] \{\s*--dixy-highlight-band: var\(--dixy-color-base-12\);/,
  );
  expect(components).toMatch(
    /\.dixy-theme\[data-highlight="tint"\] \{\s*--dixy-highlight-band: initial;/,
  );
});

it("expressive Shape kinds share one path structure, so they can morph", () => {
  const { rerender } = render(
    <Theme>
      <Shape kind="cookie-9" data-testid="shape" />
    </Theme>,
  );
  const svg = screen.getByTestId("shape");
  const first = svg.querySelector("path")!.getAttribute("d")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg).toHaveAttribute("viewBox", "0 0 100 100");
  expect(svg.style.getPropertyValue("--dixy-shape-morph-easing")).toMatch(
    /^linear\(/,
  );
  rerender(
    <Theme>
      <Shape kind="heart" data-testid="shape" />
    </Theme>,
  );
  const second = svg.querySelector("path")!.getAttribute("d")!;
  expect(second).not.toBe(first);
  const commands = (d: string) => d.replace(/[^MLZ]/g, "");
  expect(commands(second)).toBe(commands(first));
  expect(components).toMatch(
    /\.dixy-shape\[data-kind\] path \{\s*transition: d /,
  );
});

it("legacy Shape kinds keep their hand-drawn paths", () => {
  render(<Shape kind="flower" label="Award" />);
  const svg = screen.getByRole("img", { name: "Award" });
  expect(svg).toHaveAttribute("viewBox", "-5 -5 110 110");
});

it("morph: Buttons and Toggles follow Theme.morph, can opt out, and attached groups keep corners", () => {
  render(
    <Theme morph="press" data-testid="theme">
      <Button>Save</Button>
      <IconButton aria-label="Play" morph={false} />
      <Toggle aria-label="Bold">B</Toggle>
      <ToggleGroup aria-label="Align">
        <Toggle value="left">L</Toggle>
      </ToggleGroup>
    </Theme>,
  );
  expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
    "data-morph",
    "",
  );
  expect(screen.getByRole("button", { name: "Play" })).not.toHaveAttribute(
    "data-morph",
  );
  expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
    "data-morph",
    "",
  );
  // The spring reaches CSS as variables on the Theme root.
  const theme = screen.getByTestId("theme");
  expect(theme.style.getPropertyValue("--dixy-motion-spring-press")).toMatch(
    /^linear\(/,
  );
  expect(
    theme.style.getPropertyValue("--dixy-motion-spring-press-duration"),
  ).toMatch(/ms$/);
  expect(components).toMatch(/@layer dixy\.expressive/);
  expect(components).toMatch(/\.dixy-toggle-group\[data-attached\]/);
});

it("Progress wave follows Theme.progress and exposes the filled fraction", () => {
  render(
    <Theme progress="wave">
      <Progress.Root value={30} aria-label="Upload" data-testid="wave">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root
        value={30}
        wave={false}
        aria-label="Flat"
        data-testid="flat"
      >
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </Theme>,
  );
  const wave = screen.getByTestId("wave");
  expect(wave).toHaveAttribute("data-wave", "");
  expect(wave.style.getPropertyValue("--dixy-progress-fraction")).toBe("0.3");
  expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute(
    "aria-valuenow",
    "30",
  );
  expect(screen.getByTestId("flat")).not.toHaveAttribute("data-wave");
  expect(components).toMatch(
    /prefers-reduced-motion[\s\S]*dixy-progress-root\[data-wave\][\s\S]*animation: none/,
  );
});

it('Theme progress="wave": Spinner and Button loading morph library shapes; ProgressCircle ripples', () => {
  render(
    <Theme progress="wave">
      <Spinner label="Syncing" />
      <Button loading>Pay</Button>
      <ProgressCircle aria-label="Goal" value={40} data-testid="ring" />
    </Theme>,
  );
  const status = screen.getByRole("status");
  expect(status).toHaveTextContent("Syncing");
  expect(status.querySelector(".dixy-shape-loader")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(status.querySelector(".dixy-spinner")).toBeNull();
  const pay = screen.getByRole("button", { name: /Pay/ });
  expect(pay).toHaveAttribute("aria-busy", "true");
  expect(pay.querySelector(".dixy-shape-loader")).not.toBeNull();
  const ring = screen.getByTestId("ring");
  expect(ring).toHaveAttribute("aria-valuenow", "40");
  const d = ring
    .querySelector("path.dixy-progress-ring-fill")!
    .getAttribute("d")!;
  expect(d.split("L").length).toBeGreaterThan(100);
});

it("ShapeLoader cycles shapes, and holds still under reduced motion", () => {
  vi.useFakeTimers();
  const { unmount } = render(
    <Theme progress="wave">
      <Spinner />
    </Theme>,
  );
  const shape = () =>
    screen
      .getByRole("status")
      .querySelector(".dixy-shape-loader")!
      .getAttribute("data-kind");
  const first = shape();
  act(() => vi.advanceTimersByTime(700));
  expect(shape()).not.toBe(first);
  unmount();
  render(
    <Theme progress="wave" motion="reduced">
      <Spinner />
    </Theme>,
  );
  const still = shape();
  act(() => vi.advanceTimersByTime(2000));
  expect(shape()).toBe(still);
  vi.useRealTimers();
});

it("morph themes connect attached and segmented groups; avatarShape clips Avatars", () => {
  render(
    <Theme morph="press" avatarShape="cookie-9">
      <ToggleGroup aria-label="Series" segmented data-testid="seg">
        <Toggle value="a">A</Toggle>
      </ToggleGroup>
      <ToggleGroup aria-label="Plain" data-testid="plain">
        <Toggle value="b">B</Toggle>
      </ToggleGroup>
      <Avatar.Root data-testid="avatar">
        <Avatar.Fallback>MO</Avatar.Fallback>
      </Avatar.Root>
    </Theme>,
  );
  expect(screen.getByTestId("seg")).toHaveAttribute("data-connected");
  expect(screen.getByTestId("plain")).not.toHaveAttribute("data-connected");
  const avatar = screen.getByTestId("avatar");
  expect(avatar).toHaveAttribute("data-shape", "cookie-9");
  expect(avatar.style.clipPath).toMatch(/^polygon\(/);
});
