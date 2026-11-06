import { createRef, useState, type CSSProperties } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import {
  Button,
  Dialog,
  Field,
  Heading,
  IconButton,
  TextField,
  Text,
  Theme,
} from "../index";

describe("Button's public contract", () => {
  it("forwards its ref, native attributes and keyboard activation", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <Button ref={ref} name="save" onClick={onClick}>
        Save changes
      </Button>,
    );
    await user.tab();
    expect(ref.current).toHaveFocus();
    expect(ref.current).toHaveAttribute("name", "save");
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("communicates loading and blocks repeated activation", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save changes
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("preserves Base UI render composition and state-based classes", () => {
    render(
      <Button
        render={<a href="#destination" />}
        nativeButton={false}
        role="link"
        className={(state) =>
          state.disabled ? "disabled-class" : "ready-class"
        }
      >
        Read the guide
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Read the guide" });
    expect(link).toHaveAttribute("href", "#destination");
    expect(link).toHaveClass("dixy-button", "ready-class");
  });

  it("keeps an icon-only action named", () => {
    render(
      <IconButton aria-label="Close panel">
        <span aria-hidden="true">×</span>
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Close panel" })).toHaveClass(
      "dixy-icon-button",
    );
  });
});

describe("TextField's relationships", () => {
  it("connects a visible label and description to a controlled value", async () => {
    function Example() {
      const [value, setValue] = useState("");
      return (
        <Field.Root>
          <Field.Label>Project name</Field.Label>
          <TextField value={value} onValueChange={setValue} />
          <Field.Description>Visible to your team.</Field.Description>
        </Field.Root>
      );
    }
    render(<Example />);
    const input = screen.getByRole("textbox", { name: "Project name" });
    expect(input).toHaveAccessibleDescription("Visible to your team.");
    await userEvent.type(input, "Dixy");
    expect(input).toHaveValue("Dixy");
  });

  it("communicates an externally invalid field and its recovery message", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Project name</Field.Label>
        <TextField />
        <Field.Error match={true}>Choose another name.</Field.Error>
      </Field.Root>,
    );
    expect(
      screen.getByRole("textbox", { name: "Project name" }),
    ).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Choose another name.")).toBeVisible();
  });
});

describe("Dialog's focus and theme boundaries", () => {
  function Example({ controlled = false }: { controlled?: boolean }) {
    const [open, setOpen] = useState(false);
    return (
      <Theme appearance="dark">
        <Theme
          appearance="light"
          accentColor="green"
          radius="lg"
          density="compact"
          style={
            {
              "--dixy-spacing-inset-md": "20px",
              "--dixy-dialog-radius": "12px",
              "--dixy-shadow": "none",
              marginTop: 17,
            } as CSSProperties
          }
        >
          <Dialog.Root {...(controlled ? { open, onOpenChange: setOpen } : {})}>
            <Dialog.Trigger render={<Button />}>Edit project</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Viewport>
                <Dialog.Popup>
                  <Dialog.Title>Edit project details</Dialog.Title>
                  <Dialog.Description>
                    Update the name below.
                  </Dialog.Description>
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <TextField defaultValue="Dixy" />
                  </Field.Root>
                  <Dialog.Close render={<Button />}>Done</Dialog.Close>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
        </Theme>
      </Theme>
    );
  }

  it.each([false, true])(
    "moves focus into the dialog and restores it on Escape (controlled=%s)",
    async (controlled) => {
      const user = userEvent.setup();
      render(<Example controlled={controlled} />);
      const trigger = screen.getByRole("button", { name: "Edit project" });
      await user.click(trigger);
      const dialog = await screen.findByRole("dialog", {
        name: "Edit project details",
      });
      expect(dialog).toHaveAccessibleDescription("Update the name below.");
      await waitFor(() =>
        expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus(),
      );
      await user.keyboard("{Escape}");
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
      );
      await waitFor(() => expect(trigger).toHaveFocus());
    },
  );

  it("preserves the nearest appearance, accent, radius and inline overrides across its portal", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Edit project" }));
    const dialog = await screen.findByRole("dialog");
    const scope = dialog.closest(".dixy-theme");
    expect(scope).toHaveAttribute("data-appearance", "light");
    expect(scope).toHaveAttribute("data-accent", "green");
    expect(scope).toHaveAttribute("data-radius", "lg");
    expect(scope).toHaveAttribute("data-dixy-density", "compact");
    expect(
      (scope as HTMLElement).style.getPropertyValue("--dixy-spacing-inset-md"),
    ).toBe("20px");
    expect(
      (scope as HTMLElement).style.getPropertyValue("--dixy-dialog-radius"),
    ).toBe("12px");
    expect((scope as HTMLElement).style.getPropertyValue("--dixy-shadow")).toBe(
      "none",
    );
    expect((scope as HTMLElement).style.marginTop).toBe("");
  });
});

describe("Semantic and server rendering", () => {
  it("keeps heading meaning independent of visual scale", () => {
    render(
      <Heading as="h3" size="lg">
        A clear direction
      </Heading>,
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute(
      "data-size",
      "lg",
    );
  });

  it("keeps semantic type roles independent of the HTML element and size shorthand", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <>
        <Heading as="h4" size="lg" variant="title.sm">
          A compact heading
        </Heading>
        <Text as="span" ref={ref} size="lg" variant="caption">
          Supporting text
        </Text>
        <Text>Default reading text</Text>
      </>,
    );
    expect(screen.getByRole("heading", { level: 4 })).toHaveAttribute(
      "data-typography",
      "title.sm",
    );
    expect(ref.current?.tagName).toBe("SPAN");
    expect(ref.current).toHaveAttribute("data-typography", "caption");
    expect(screen.getByText("Default reading text")).toHaveAttribute(
      "data-typography",
      "body.md",
    );
  });

  it("renders deterministic theme and component markup without reading browser state", () => {
    const tree = (
      <Theme appearance="dark">
        <Button size="sm">Start</Button>
      </Theme>
    );
    const first = renderToString(tree);
    expect(first).toBe(renderToString(tree));
    expect(first).toContain('data-appearance="dark"');
    expect(first).toContain('data-size="sm"');
  });
});

describe("Color theme contracts", () => {
  it("uses blue by default and keeps the chosen violet family", () => {
    const { container, rerender } = render(
      <Theme>
        <Button color="success">Approve</Button>
      </Theme>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-accent", "blue");
    expect(screen.getByRole("button", { name: "Approve" })).toHaveAttribute(
      "data-color",
      "success",
    );
    rerender(
      <Theme accentColor="violet" neutralColor="stone">
        Theme
      </Theme>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "data-accent",
      "violet",
    );
  });
});
