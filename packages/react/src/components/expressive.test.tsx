import { createRef, useState } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Shape,
  Theme,
  useMotionPreferences,
} from "../index";
import { FeedbackProvider, useFeedback, vibrationAdapter } from "../feedback";

describe("expressive foundations", () => {
  it("preserves composed button semantics, ref, keyboard action and loading guard with material and shape", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    const { rerender } = render(
      <Theme personality="playful">
        <Button
          ref={ref}
          material="metal"
          shape="square"
          render={<button data-custom="kept" />}
          onClick={click}
        >
          Save
        </Button>
      </Theme>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("data-custom", "kept");
    expect(button).toHaveAttribute("data-material", "metal");
    expect(button).toHaveAttribute("data-dixy-shape", "square");
    button.focus();
    await user.keyboard(" ");
    expect(click).toHaveBeenCalledTimes(1);
    rerender(
      <Theme personality="playful">
        <Button loading onClick={click}>
          Save
        </Button>
      </Theme>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    await user.click(screen.getByRole("button"));
    expect(click).toHaveBeenCalledTimes(1);
  });
  it("forwards Box element, style, ref and events without wrapping its children", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLElement>();
    const click = vi.fn();
    render(
      <Theme personality="tactile">
        <Box
          as="section"
          ref={ref}
          aria-label="Surface"
          style={{ padding: 12 }}
          onClick={click}
        >
          <button>Act</button>
        </Box>
      </Theme>,
    );
    const box = screen.getByRole("region", { name: "Surface" });
    expect(ref.current).toBe(box);
    expect(box).toHaveAttribute("data-material", "soft");
    expect(box).toHaveStyle({ padding: "12px" });
    expect(box.firstElementChild).toBe(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(click).toHaveBeenCalledTimes(1);
  });
  it("reapplies personality and effects to an already-open portal without remounting or losing focus", async () => {
    const user = userEvent.setup();
    function Example({
      reduced,
      personality,
    }: {
      reduced: boolean;
      personality: "playful" | "tactile";
    }) {
      return (
        <Theme
          personality={personality}
          effects={reduced ? "reduced" : "static"}
        >
          <Theme effects="backdrop">
            <Dialog.Root>
              <Dialog.Trigger>Open</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Viewport>
                  <Dialog.Popup>
                    <Dialog.Title>Project</Dialog.Title>
                    <Dialog.Description>Settings</Dialog.Description>
                    <input aria-label="Name" defaultValue="Dixy" />
                    <Dialog.Close render={<Button />}>Close</Dialog.Close>
                  </Dialog.Popup>
                </Dialog.Viewport>
              </Dialog.Portal>
            </Dialog.Root>
          </Theme>
        </Theme>
      );
    }
    const { rerender } = render(
      <Example reduced={false} personality="playful" />,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const input = await screen.findByRole("textbox");
    input.focus();
    await user.type(input, " Studio");
    rerender(<Example reduced personality="tactile" />);
    expect(screen.getByRole("textbox")).toBe(input);
    expect(input).toHaveFocus();
    expect(input).toHaveValue("Dixy Studio");
    const scope = input.closest(".dixy-portal-scope");
    expect(scope).toHaveAttribute("data-effects", "reduced");
    expect(scope).toHaveAttribute("data-personality", "tactile");
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
      "data-material",
      "soft",
    );
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Open" })).toHaveFocus(),
    );
  });
  it("keeps explicit overrides and ancestor reduction above preset defaults", () => {
    function Inspector() {
      const preferences = useMotionPreferences();
      return (
        <output>
          {preferences.scheme}:{String(preferences.reducedMotion)}
        </output>
      );
    }
    render(
      <Theme effects="reduced" motion="reduced">
        <Theme
          personality="playful"
          radius="sm"
          effects="backdrop"
          motion="system"
          data-testid="scope"
        >
          <IconButton aria-label="Favorite">★</IconButton>
          <Inspector />
        </Theme>
      </Theme>,
    );
    expect(screen.getByTestId("scope")).toHaveAttribute("data-radius", "sm");
    expect(screen.getByTestId("scope")).toHaveAttribute(
      "data-effects",
      "reduced",
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-material",
      "glossy",
    );
    expect(screen.getByRole("status")).toHaveTextContent("expressive:true");
  });
  it("renders deterministic SSR and keeps artwork decorative unless named", () => {
    const html = renderToString(
      <Theme personality="tactile">
        <Box>
          <Button>Save</Button>
          <Shape />
          <Shape label="Award" kind="clover" />
        </Box>
      </Theme>,
    );
    expect(html).toContain('data-effects="static"');
    expect(html).not.toContain("backdrop-filter");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('aria-label="Award"');
  });
});

function FeedbackAction() {
  const feedback = useFeedback();
  const [saved, setSaved] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setSaved(true);
          feedback("success");
        }}
      >
        Save
      </button>
      <output>{saved ? "Saved" : "Ready"}</output>
    </>
  );
}
describe("optional feedback", () => {
  it("requires opt-in and isolates both throwing and rejecting adapters from the action", async () => {
    const user = userEvent.setup();
    const adapter = vi.fn();
    const { rerender } = render(
      <FeedbackProvider adapter={adapter}>
        <FeedbackAction />
      </FeedbackProvider>,
    );
    await user.click(screen.getByRole("button"));
    expect(adapter).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    for (const fail of [
      () => {
        throw new Error("host unavailable");
      },
      () => Promise.reject(new Error("device unavailable")),
    ]) {
      adapter.mockImplementation(fail);
      rerender(
        <FeedbackProvider enabled adapter={adapter}>
          <FeedbackAction />
        </FeedbackProvider>,
      );
      await user.click(screen.getByRole("button"));
      await act(async () => {});
      expect(screen.getByRole("status")).toHaveTextContent("Saved");
    }
    expect(adapter).toHaveBeenCalledTimes(2);
  });
  it("honors inherited disable, reduced effects and reduced motion", async () => {
    const user = userEvent.setup();
    const adapter = vi.fn();
    const { rerender } = render(
      <FeedbackProvider enabled={false}>
        <FeedbackProvider enabled adapter={adapter}>
          <FeedbackAction />
        </FeedbackProvider>
      </FeedbackProvider>,
    );
    await user.click(screen.getByRole("button"));
    rerender(
      <Theme effects="reduced">
        <FeedbackProvider enabled adapter={adapter}>
          <FeedbackAction />
        </FeedbackProvider>
      </Theme>,
    );
    await user.click(screen.getByRole("button"));
    rerender(
      <Theme motion="reduced">
        <FeedbackProvider enabled adapter={adapter}>
          <FeedbackAction />
        </FeedbackProvider>
      </Theme>,
    );
    await user.click(screen.getByRole("button"));
    expect(adapter).not.toHaveBeenCalled();
    rerender(
      <Theme>
        <FeedbackProvider enabled adapter={adapter}>
          <FeedbackAction />
        </FeedbackProvider>
      </Theme>,
    );
    await user.click(screen.getByRole("button"));
    expect(adapter).toHaveBeenCalledOnce();
    expect(adapter).toHaveBeenCalledWith("success");
  });
  it("does nothing without browser vibration and forwards bounded fallback patterns when available", () => {
    expect(() => vibrationAdapter("selection")).not.toThrow();
    const vibrate = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: vibrate,
    });
    vibrationAdapter("success");
    expect(vibrate).toHaveBeenCalledWith([10, 40, 10]);
    Reflect.deleteProperty(navigator, "vibrate");
  });
});
