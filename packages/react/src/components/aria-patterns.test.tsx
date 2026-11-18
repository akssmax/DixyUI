import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { AlertDialog, Dialog, Theme, Toolbar } from "../index";

function renderDialog(modal?: boolean | "trap-focus") {
  render(
    <Theme>
      <Dialog.Root modal={modal}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Viewport>
            <Dialog.Popup>
              <Dialog.Title>Settings</Dialog.Title>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </Theme>,
  );
}

it.each([
  [undefined, "true"],
  [true, "true"],
  ["trap-focus", "true"],
  [false, null],
] as const)("Dialog modal=%s sets aria-modal=%s", async (modal, expected) => {
  renderDialog(modal);
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  const dialog = await screen.findByRole("dialog", { name: "Settings" });
  expect(dialog.getAttribute("aria-modal")).toBe(expected);
});

it("AlertDialog is always aria-modal", async () => {
  render(
    <Theme>
      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Viewport>
            <AlertDialog.Popup>
              <AlertDialog.Title>Delete file?</AlertDialog.Title>
              <AlertDialog.Close>Cancel</AlertDialog.Close>
            </AlertDialog.Popup>
          </AlertDialog.Viewport>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Theme>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Delete" }));
  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveAttribute("aria-modal", "true");
});

it("Toolbar Home/End move focus and the tab stop, skipping non-focusable items", async () => {
  const user = userEvent.setup();
  const keyDown = vi.fn();
  render(
    <Theme>
      <Toolbar.Root aria-label="Format" onKeyDown={keyDown}>
        <Toolbar.Button disabled focusableWhenDisabled={false}>
          Undo
        </Toolbar.Button>
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
        <Toolbar.Input aria-label="Size" defaultValue="12" />
        <Toolbar.Button>Link</Toolbar.Button>
        <Toolbar.Button disabled focusableWhenDisabled={false}>
          Redo
        </Toolbar.Button>
      </Toolbar.Root>
    </Theme>,
  );
  const bold = screen.getByRole("button", { name: "Bold" });
  const link = screen.getByRole("button", { name: "Link" });
  await user.tab();
  expect(bold).toHaveFocus();

  await user.keyboard("{End}");
  expect(link).toHaveFocus();
  await waitFor(() => expect(link).toHaveAttribute("tabindex", "0"));
  expect(bold).toHaveAttribute("tabindex", "-1");
  expect(keyDown).toHaveBeenCalled();

  await user.keyboard("{Home}");
  expect(bold).toHaveFocus();

  // Inside a text field, Home/End keep moving the caret.
  const size = screen.getByRole("textbox", { name: "Size" });
  size.focus();
  await user.keyboard("{End}");
  expect(size).toHaveFocus();
});

it("Toolbar respects a consumer preventDefault on Home/End", async () => {
  const user = userEvent.setup();
  render(
    <Theme>
      <Toolbar.Root
        aria-label="Format"
        onKeyDown={(event) => event.key === "End" && event.preventDefault()}
      >
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Link</Toolbar.Button>
      </Toolbar.Root>
    </Theme>,
  );
  await user.tab();
  await user.keyboard("{End}");
  expect(screen.getByRole("button", { name: "Bold" })).toHaveFocus();
});
