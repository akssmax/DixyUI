import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { Switch, Theme } from "../index";

it("preserves switch composition, root/thumb/input refs, events and form values with icons", async () => {
  const rootRef = createRef<HTMLElement>();
  const thumbRef = createRef<HTMLSpanElement>();
  const inputRef = createRef<HTMLInputElement>();
  const change = vi.fn();
  function Example() {
    const [checked, setChecked] = useState(false);
    return (
      <form data-testid="form">
        <label>
          <Switch.Root
            ref={rootRef}
            inputRef={inputRef}
            name="updates"
            value="yes"
            uncheckedValue="no"
            checked={checked}
            onCheckedChange={(next, details) => {
              setChecked(next);
              change(next, details.reason);
            }}
            size="lg"
            variant="soft"
            color="success"
            radius="none"
            material="metal"
            className={(state) => (state.checked ? "on" : "off")}
            render={<span data-composed="root" />}
          >
            <Switch.Thumb
              ref={thumbRef}
              render={<span data-composed="thumb" />}
              checkedIcon={
                <svg>
                  <title>On artwork</title>
                </svg>
              }
              uncheckedIcon={
                <svg>
                  <title>Off artwork</title>
                </svg>
              }
            />
          </Switch.Root>
          Updates
        </label>
      </form>
    );
  }
  render(<Example />);
  const control = screen.getByRole("switch", { name: "Updates" });
  const form = screen.getByTestId("form") as HTMLFormElement;
  expect(rootRef.current).toBe(control);
  expect(rootRef.current).toHaveAttribute("data-composed", "root");
  expect(thumbRef.current).toHaveAttribute("data-composed", "thumb");
  expect(inputRef.current).toHaveAttribute("name", "updates");
  expect(new FormData(form).get("updates")).toBe("no");
  const user = userEvent.setup();
  await user.tab();
  expect(control).toHaveFocus();
  await user.keyboard(" ");
  expect(control).toHaveAttribute("aria-checked", "true");
  expect(control).toHaveClass("dixy-switch-root", "on");
  expect(control).toHaveAccessibleName("Updates");
  expect(change).toHaveBeenCalledOnce();
  expect(new FormData(form).get("updates")).toBe("yes");
  expect(
    thumbRef.current?.querySelectorAll('[aria-hidden="true"]'),
  ).toHaveLength(2);
});

for (const motion of ["system", "reduced"] as const) {
  it(`keeps focus/state across visual changes and guards readOnly/disabled with ${motion} motion`, async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    function Example({
      locked = false,
      disabled = false,
    }: {
      locked?: boolean;
      disabled?: boolean;
    }) {
      return (
        <Theme motion={motion} material="paper" radius="none">
          <Switch.Root
            aria-label="Notifications"
            defaultChecked
            readOnly={locked}
            disabled={disabled}
            onCheckedChange={change}
          >
            <Switch.Thumb data-testid="thumb" checkedIcon={<svg />} />
          </Switch.Root>
        </Theme>
      );
    }
    const view = render(<Example />);
    const control = screen.getByRole("switch");
    const thumb = screen.getByTestId("thumb");
    await user.tab();
    view.rerender(<Example locked />);
    await user.keyboard(" ");
    expect(control).toHaveFocus();
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control).toHaveAttribute("data-material", "paper");
    expect(control).toHaveAttribute("data-radius", "none");
    expect(screen.getByTestId("thumb")).toBe(thumb);
    expect(change).not.toHaveBeenCalled();
    view.rerender(<Example disabled />);
    await user.click(control);
    expect(change).not.toHaveBeenCalled();
    view.rerender(<Example />);
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(change).toHaveBeenCalledOnce();
  });
}

it("allows local theme overrides and custom thumb content, including null", () => {
  const view = render(
    <Theme radius="none" material="metal">
      <Switch.Root
        radius="full"
        material="glossy"
        defaultChecked
        aria-label="Updates"
      >
        <Switch.Thumb data-testid="thumb" checkedIcon={<svg />}>
          <b>Custom</b>
        </Switch.Thumb>
      </Switch.Root>
    </Theme>,
  );
  expect(screen.getByRole("switch")).toHaveAttribute("data-radius", "full");
  expect(screen.getByRole("switch")).toHaveAttribute("data-material", "glossy");
  expect(screen.getByTestId("thumb")).toHaveTextContent("Custom");
  expect(screen.getByTestId("thumb").querySelector("svg")).toBeNull();
  view.rerender(
    <Switch.Root aria-label="Updates">
      <Switch.Thumb data-testid="thumb" checkedIcon={<svg />}>
        {null}
      </Switch.Thumb>
    </Switch.Root>,
  );
  expect(screen.getByTestId("thumb")).toBeEmptyDOMElement();
});
