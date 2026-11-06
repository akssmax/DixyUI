import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { Checkbox, CheckboxGroup, Field, Form, Theme } from "../index";

for (const motion of ["system", "reduced"] as const) {
  it(`preserves checkbox identity, focus and selection when visual settings change with ${motion} motion`, async () => {
    const rootRef = createRef<HTMLElement>();
    const inputRef = createRef<HTMLInputElement>();
    const indicatorRef = createRef<HTMLSpanElement>();
    const change = vi.fn();
    const user = userEvent.setup();
    function Example({ override = false, readOnly = false, disabled = false }) {
      return (
        <Theme radius="full" material="paper" motion={motion}>
          <label>
            <Checkbox.Root
              ref={rootRef}
              inputRef={inputRef}
              defaultChecked
              name="favorite"
              size={override ? "lg" : "sm"}
              color={override ? "success" : "accent"}
              variant={override ? "soft" : "solid"}
              radius={override ? "none" : undefined}
              material={override ? "metal" : undefined}
              readOnly={readOnly}
              disabled={disabled}
              onCheckedChange={change}
              render={<span data-composed="root" />}
            >
              <Checkbox.Indicator
                ref={indicatorRef}
                checkedIcon={
                  <svg>
                    <title>Heart artwork</title>
                  </svg>
                }
                indeterminateIcon={
                  <svg>
                    <title>Mixed artwork</title>
                  </svg>
                }
              />
            </Checkbox.Root>
            Favorite
          </label>
        </Theme>
      );
    }
    const view = render(<Example />);
    const control = screen.getByRole("checkbox", { name: "Favorite" });
    const indicator = indicatorRef.current;
    await user.tab();
    expect(control).toHaveFocus();
    expect(rootRef.current).toBe(control);
    expect(inputRef.current).toHaveAttribute("name", "favorite");
    expect(control).toHaveAttribute("data-radius", "full");
    expect(control).toHaveAttribute("data-material", "paper");
    view.rerender(<Example override />);
    expect(rootRef.current).toBe(control);
    expect(indicatorRef.current).toBe(indicator);
    expect(control).toHaveFocus();
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control).toHaveAttribute("data-radius", "none");
    expect(control).toHaveAttribute("data-material", "metal");
    expect(control).toHaveAttribute("data-composed", "root");
    expect(indicator?.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
    view.rerender(<Example override readOnly />);
    await user.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "true");
    view.rerender(<Example override disabled />);
    await user.click(control);
    expect(change).not.toHaveBeenCalled();
  });
}

it("keeps select-all mixed state and child selection owned by Base UI with styled indicators", async () => {
  const user = userEvent.setup();
  render(
    <CheckboxGroup
      allValues={["email", "app"]}
      defaultValue={["email"]}
      aria-label="Channels"
    >
      <Checkbox.Root parent color="success" variant="outline" aria-label="All">
        <Checkbox.Indicator />
      </Checkbox.Root>
      <Checkbox.Root value="email" aria-label="Email">
        <Checkbox.Indicator />
      </Checkbox.Root>
      <Checkbox.Root value="app" aria-label="In-app">
        <Checkbox.Indicator />
      </Checkbox.Root>
    </CheckboxGroup>,
  );
  const parent = screen.getByRole("checkbox", { name: "All" });
  expect(parent).toHaveAttribute("aria-checked", "mixed");
  await user.tab();
  await user.keyboard(" ");
  for (const control of screen.getAllByRole("checkbox"))
    expect(control).toHaveAttribute("aria-checked", "true");
  await user.keyboard(" ");
  for (const control of screen.getAllByRole("checkbox"))
    expect(control).toHaveAttribute("aria-checked", "false");
  await user.click(screen.getByRole("checkbox", { name: "In-app" }));
  expect(parent).toHaveAttribute("aria-checked", "mixed");
});

it("retains Field descriptions, required validation and submitted checkbox value", async () => {
  const submit = vi.fn((event) => event.preventDefault());
  const user = userEvent.setup();
  render(
    <Form onSubmit={submit} data-testid="form">
      <Field.Root name="agreement">
        <Field.Label>
          <Checkbox.Root required size="lg" variant="soft">
            <Checkbox.Indicator />
          </Checkbox.Root>
          Accept terms
        </Field.Label>
        <Field.Description>Required to continue.</Field.Description>
        <Field.Error match="valueMissing">Accept the terms.</Field.Error>
      </Field.Root>
      <button type="submit">Continue</button>
    </Form>,
  );
  const control = screen.getByRole("checkbox", { name: "Accept terms" });
  expect(control).toHaveAccessibleDescription("Required to continue.");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(submit).not.toHaveBeenCalled();
  expect(control).toHaveAttribute("data-invalid");
  expect(screen.getByText("Accept the terms.")).toBeVisible();
  await user.click(control);
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(
    new FormData(screen.getByTestId("form") as HTMLFormElement).get(
      "agreement",
    ),
  ).toBe("on");
});
