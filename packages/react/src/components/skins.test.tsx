import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import type { SkinDefinition } from "@dixy-ui/tokens";
import { Button, Card, Dialog, IconButton, TextField, Theme } from "../index";
import type { SkinOrnamentProps } from "../index";

const forest: SkinDefinition = {
  id: "test/forest",
  name: "Forest",
  version: 1,
  defaults: {
    accentColor: "grass",
    neutralColor: "sage",
    radius: "lg",
    density: "comfortable",
    material: "paper",
    shape: "rounded",
  },
};
const signal: SkinDefinition = {
  id: "test/signal",
  name: "Signal",
  version: 1,
  defaults: {
    accentColor: "lime",
    neutralColor: "olive",
    radius: "sm",
    density: "default",
    material: "metal",
    shape: "square",
  },
};

function Artwork({ part, animate, motion }: SkinOrnamentProps) {
  return (
    <svg
      aria-hidden="true"
      data-testid={"art-" + part}
      data-animate={String(animate)}
      data-motion={motion}
    />
  );
}

it("skins preserve consumer-owned button icons, content, refs and keyboard activation", async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLButtonElement>();
  let activations = 0;
  function Example({
    skin,
    loading = false,
  }: {
    skin: SkinDefinition;
    loading?: boolean;
  }) {
    return (
      <Theme skin={skin} ornamentRenderer={Artwork}>
        <Button ref={ref} loading={loading} onClick={() => activations++}>
          <svg aria-hidden="true" data-testid="consumer-icon" />
          Save changes
        </Button>
        <IconButton aria-label="Bookmark">
          <svg aria-hidden="true" data-testid="bookmark-icon" />
        </IconButton>
      </Theme>
    );
  }
  const { rerender } = render(<Example skin={forest} />);
  const button = screen.getByRole("button", { name: "Save changes" });
  expect(ref.current).toBe(button);
  expect(button.querySelectorAll("svg")).toHaveLength(1);
  expect(button.firstElementChild).toBe(screen.getByTestId("consumer-icon"));
  expect(button.querySelector("[data-testid^='art-']")).toBeNull();
  expect(
    screen.getByRole("button", { name: "Bookmark" }).children,
  ).toHaveLength(1);
  button.focus();
  await user.keyboard("{Enter}");
  expect(activations).toBe(1);
  rerender(<Example skin={signal} />);
  expect(ref.current).toBe(button);
  expect(button).toHaveFocus();
  expect(button.querySelectorAll("svg")).toHaveLength(1);
  rerender(<Example skin={signal} loading />);
  expect(button).toHaveAttribute("aria-busy", "true");
  expect(button).toBeDisabled();
  expect(button.querySelectorAll(".dixy-spinner")).toHaveLength(1);
  expect(button.querySelectorAll("svg")).toHaveLength(1);
});

it("attaches optional artwork to existing parts, clears it in nested themes, and preserves editable state", async () => {
  const user = userEvent.setup();
  function Example({ reduced = false }: { reduced?: boolean }) {
    return (
      <Theme
        skin={forest}
        ornamentRenderer={Artwork}
        animateOrnaments
        effects={reduced ? "reduced" : "static"}
      >
        <Card.Root>
          <TextField aria-label="Idea" defaultValue="Forest" />
        </Card.Root>
        <Theme skin={null}>
          <Card.Root data-testid="plain-art">Plain</Card.Root>
        </Theme>
      </Theme>
    );
  }
  const { rerender } = render(<Example />);
  expect(screen.getByTestId("art-card")).toHaveAttribute(
    "data-animate",
    "true",
  );
  expect(screen.getByTestId("plain-art").querySelector("svg")).toBeNull();
  const input = screen.getByRole("textbox");
  await user.type(input, " studio");
  rerender(<Example reduced />);
  expect(screen.queryByTestId("art-card")).toBeNull();
  expect(screen.getByRole("textbox")).toBe(input);
  expect(input).toHaveValue("Forest studio");
});

it("inherits or clears a skin while explicit component material, events, refs and values survive", async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLInputElement>();
  render(
    <Theme skin={forest} effects="reduced" motion="reduced">
      <Card.Root data-testid="card">
        <TextField ref={ref} aria-label="Project" defaultValue="Dixy" />
        <Button material="metal">Save</Button>
      </Card.Root>
      <Theme data-testid="inherited">
        <Button>Inherited</Button>
      </Theme>
      <Theme skin={null} data-testid="plain" effects="backdrop" motion="system">
        <Button>Plain</Button>
      </Theme>
    </Theme>,
  );
  expect(screen.getByTestId("card")).toHaveAttribute(
    "data-dixy-skin",
    forest.id,
  );
  expect(screen.getByTestId("inherited")).toHaveAttribute(
    "data-accent",
    "grass",
  );
  expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
    "data-dixy-material-override",
  );
  expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
    "data-material",
    "metal",
  );
  const plain = screen.getByTestId("plain");
  expect(plain).toHaveAttribute("data-dixy-skin", "none");
  expect(plain).toHaveAttribute("data-accent", "blue");
  expect(plain).toHaveAttribute("data-effects", "reduced");
  expect(plain).toHaveAttribute("data-motion", "reduced");
  const input = screen.getByRole("textbox");
  expect(ref.current).toBe(input);
  await user.type(input, " Studio");
  expect(input).toHaveValue("Dixy Studio");
});

it("updates an open portal's skin without remounting the input or dropping focus", async () => {
  const user = userEvent.setup();
  function Example({ skin }: { skin: SkinDefinition }) {
    return (
      <Theme skin={skin}>
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Viewport>
              <Dialog.Popup>
                <Dialog.Title>Project</Dialog.Title>
                <Dialog.Description>Local settings</Dialog.Description>
                <TextField aria-label="Name" defaultValue="Dixy" />
                <Dialog.Close render={<Button />}>Close</Dialog.Close>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
      </Theme>
    );
  }
  const { rerender } = render(<Example skin={forest} />);
  await user.click(screen.getByRole("button", { name: "Open" }));
  const input = await screen.findByRole("textbox", { name: "Name" });
  await user.type(input, " Studio");
  rerender(<Example skin={signal} />);
  expect(screen.getByRole("textbox")).toBe(input);
  expect(input).toHaveValue("Dixy Studio");
  expect(input).toHaveFocus();
  expect(input.closest(".dixy-portal-scope")).toHaveAttribute(
    "data-dixy-skin",
    signal.id,
  );
  expect(screen.getByRole("dialog")).toHaveAttribute(
    "data-dixy-skin",
    signal.id,
  );
  expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
    "data-material",
    "metal",
  );
  await user.keyboard("{Escape}");
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus(),
  );
});
