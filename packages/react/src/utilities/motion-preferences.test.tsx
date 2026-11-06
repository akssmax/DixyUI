import { act, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Dialog, Theme, useMotionPreferences } from "../index";

const originalMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = originalMatchMedia;
});
function Preference() {
  const { reducedMotion } = useMotionPreferences();
  return <output>{reducedMotion ? "Reduced" : "System motion"}</output>;
}

it("responds to live OS preference changes and removes its listener", () => {
  let matches = false;
  const listeners = new Set<() => void>();
  const removeEventListener = vi.fn((_event: string, callback: () => void) =>
    listeners.delete(callback),
  );
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches,
    addEventListener: (_event: string, callback: () => void) =>
      listeners.add(callback),
    removeEventListener,
  }));
  const view = render(
    <Theme>
      <Preference />
    </Theme>,
  );
  expect(screen.getByText("System motion")).toBeInTheDocument();
  act(() => {
    matches = true;
    listeners.forEach((callback) => callback());
  });
  expect(screen.getByText("Reduced")).toBeInTheDocument();
  act(() => {
    matches = false;
    listeners.forEach((callback) => callback());
  });
  expect(screen.getByText("System motion")).toBeInTheDocument();
  view.unmount();
  expect(listeners.size).toBe(0);
  expect(removeEventListener).toHaveBeenCalled();
});

it("inherits reduction through nested themes and Dialog portals without allowing an escape", async () => {
  render(
    <Theme motion="reduced">
      <Theme motion="system">
        <Dialog.Root>
          <Dialog.Trigger>Open preference</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Viewport>
              <Dialog.Popup>
                <Dialog.Title>Motion preference</Dialog.Title>
                <Dialog.Description>
                  Reduction crosses the portal.
                </Dialog.Description>
                <Preference />
                <Dialog.Close>Close</Dialog.Close>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
      </Theme>
    </Theme>,
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Open preference" }),
  );
  const dialog = screen.getByRole("dialog");
  expect(dialog.closest("[data-motion]")).toHaveAttribute(
    "data-motion",
    "reduced",
  );
  expect(screen.getByText("Reduced")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Open preference" }),
    ).toHaveFocus(),
  );
});

it("renders static on the server before the OS preference is available", () => {
  const markup = renderToString(
    <Theme>
      <Preference />
    </Theme>,
  );
  expect(markup).toContain("Reduced");
  expect(markup).toContain('data-motion="system"');
});
