import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it, vi } from "vitest";
import { act } from "react";
import {
  Button,
  ButtonGroup,
  FabMenu,
  Menu,
  Progress,
  ProgressCircle,
  SplitButton,
  Spinner,
  Theme,
  Toggle,
  ToggleGroup,
  Toolbar,
} from "../index";

const css = readFileSync(
  resolve(process.cwd(), "src/styles/components.css"),
  "utf8",
);

it("connected groups change shape only: no width growth, equal segments", () => {
  const connected = css.slice(css.indexOf("Connected button group (M3)"));
  const block = connected.slice(0, connected.indexOf("A segmented group"));
  expect(block).not.toMatch(/flex-grow/);
  expect(block).toMatch(/flex: 1 1 0/);
  expect(block).toMatch(/inline-size: 100%/);
});

it("separate groups under morph are M3 standard groups", () => {
  render(
    <Theme morph="press">
      <ToggleGroup aria-label="View" data-testid="tg">
        <Toggle value="a">A</Toggle>
      </ToggleGroup>
      <ToggleGroup aria-label="Joined" attached data-testid="joined">
        <Toggle value="a">A</Toggle>
      </ToggleGroup>
      <ButtonGroup attached={false} aria-label="Actions" data-testid="bg">
        <Button>One</Button>
      </ButtonGroup>
    </Theme>,
  );
  expect(screen.getByTestId("tg")).toHaveAttribute("data-expressive");
  expect(screen.getByTestId("joined")).not.toHaveAttribute("data-expressive");
  expect(screen.getByTestId("joined")).toHaveAttribute("data-connected");
  expect(screen.getByTestId("bg")).toHaveAttribute("data-expressive");
});

it("Button and Toggle take the xs and xl ends of the size scale", () => {
  render(
    <Theme>
      <Button size="xs">Small</Button>
      <Button size="xl">Hero</Button>
      <Toggle size="xl" aria-label="Big" />
    </Theme>,
  );
  expect(screen.getByRole("button", { name: "Small" })).toHaveAttribute(
    "data-size",
    "xs",
  );
  expect(screen.getByRole("button", { name: "Hero" })).toHaveAttribute(
    "data-size",
    "xl",
  );
  expect(screen.getByRole("button", { name: "Big" })).toHaveAttribute(
    "data-size",
    "xl",
  );
});

it("a shaped Toggle morphs its container shape with the selection", async () => {
  render(
    <Theme>
      <Toggle aria-label="Like" shapes={["circle", "cookie-9"]} />
    </Theme>,
  );
  const toggle = screen.getByRole("button", { name: "Like" });
  const shape = () => toggle.querySelector(".dixy-toggle-shape");
  expect(toggle).toHaveAttribute("data-shaped");
  expect(toggle).not.toHaveAttribute("data-morph");
  expect(shape()).toHaveAttribute("data-kind", "circle");
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(shape()).toHaveAttribute("data-kind", "cookie-9");
});

it("wave progress draws one round-capped SVG path; flat progress draws none", () => {
  const { rerender } = render(
    <Theme>
      <Progress.Root wave value={2} aria-label="Upload">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </Theme>,
  );
  const path = () =>
    screen.getByRole("progressbar").querySelector(".dixy-progress-wave path");
  expect(path()).toHaveAttribute("stroke-linecap", "round");
  expect(path()?.closest("svg")).toHaveAttribute("aria-hidden", "true");
  rerender(
    <Theme>
      <Progress.Root value={40} aria-label="Upload">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </Theme>,
  );
  expect(path()).toBeNull();
  expect(css).toMatch(/Wave stop indicator/);
  expect(css).not.toMatch(/--dixy-wave-mask/);
});

it("a wave under reduced motion draws once and never requests frames", () => {
  const frame = vi.spyOn(globalThis, "requestAnimationFrame");
  try {
    render(
      <Theme motion="reduced">
        <Progress.Root wave value={50} aria-label="Sync">
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      </Theme>,
    );
    expect(frame).not.toHaveBeenCalled();
  } finally {
    frame.mockRestore();
  }
});

it("Spinner can be contained and delayed, with its status present throughout", () => {
  vi.useFakeTimers();
  try {
    render(
      <Theme progress="wave">
        <Spinner contained delay={200} label="Saving" />
      </Theme>,
    );
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Saving");
    expect(status).toHaveAttribute("data-contained");
    expect(status).toHaveAttribute("data-waiting");
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(status).not.toHaveAttribute("data-waiting");
  } finally {
    vi.useRealTimers();
  }
});

it("ProgressCircle can show its value as a decorative numeral", () => {
  render(
    <Theme progress="wave">
      <ProgressCircle aria-label="Goal" value={42} showValue size="lg" />
    </Theme>,
  );
  const ring = screen.getByRole("progressbar", { name: "Goal" });
  expect(ring).toHaveAttribute("aria-valuenow", "42");
  expect(ring.querySelector(".dixy-progress-circle-value")).toHaveTextContent(
    "42",
  );
});

it("SplitButton: two tab stops, the trailing one opens a menu", async () => {
  const onStart = vi.fn();
  render(
    <Theme>
      <SplitButton.Root size="lg" aria-label="Timer">
        <SplitButton.Action onClick={onStart}>Start</SplitButton.Action>
        <SplitButton.Menu aria-label="Timer options">
          <Menu.Item>Intervals</Menu.Item>
        </SplitButton.Menu>
      </SplitButton.Root>
    </Theme>,
  );
  expect(screen.getByRole("group", { name: "Timer" })).toHaveAttribute(
    "data-size",
    "lg",
  );
  await userEvent.click(screen.getByRole("button", { name: "Start" }));
  expect(onStart).toHaveBeenCalledOnce();
  const trigger = screen.getByRole("button", { name: "Timer options" });
  expect(trigger).toHaveAttribute("data-size", "lg");
  await userEvent.click(trigger);
  expect(
    await screen.findByRole("menuitem", { name: "Intervals" }),
  ).toBeTruthy();
  expect(trigger).toHaveAttribute("data-popup-open");
});

it("FabMenu: the FAB becomes Close and items are menu items", async () => {
  const onSelect = vi.fn();
  render(
    <Theme>
      <FabMenu.Root aria-label="Create">
        <FabMenu.Item onClick={onSelect}>Note</FabMenu.Item>
        <FabMenu.Item>List</FabMenu.Item>
      </FabMenu.Root>
    </Theme>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Create" }));
  const item = await screen.findByRole("menuitem", { name: "Note" });
  expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await userEvent.click(item);
  expect(onSelect).toHaveBeenCalledOnce();
});

it("Toolbar has floating and vibrant surfaces", () => {
  render(
    <Theme>
      <Toolbar.Root aria-label="Edit" variant="vibrant">
        <Toolbar.Button>Bold</Toolbar.Button>
      </Toolbar.Root>
    </Theme>,
  );
  expect(screen.getByRole("toolbar")).toHaveAttribute(
    "data-variant",
    "vibrant",
  );
});
