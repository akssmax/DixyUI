import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Container, Inline, Stack, Theme } from "../index";

describe("semantic layouts", () => {
  it("preserves native semantics, refs, children, direction and style overrides", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Stack
        as="section"
        ref={ref}
        aria-label="Settings"
        gap="lg"
        dir="rtl"
        className="custom"
        style={{ gap: 7 }}
      >
        <button>Save</button>
      </Stack>,
    );
    const section = screen.getByRole("region", { name: "Settings" });
    expect(ref.current).toBe(section);
    expect(section).toHaveClass("dixy-stack", "custom");
    expect(section).toHaveAttribute("data-gap", "lg");
    expect(section).toHaveAttribute("dir", "rtl");
    expect(section).toHaveStyle({ gap: "7px" });
    expect(screen.getByRole("button").parentElement).toBe(section);
  });
  it("wraps Inline by default and forwards list semantics without extra wrappers", () => {
    render(
      <Inline as="ul" aria-label="Actions" align="end">
        <li>Save</li>
        <li>Cancel</li>
      </Inline>,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveClass("dixy-inline");
    expect(list).toHaveAttribute("data-wrap", "true");
    expect(list).toHaveAttribute("data-gap", "sm");
    expect(list).toHaveAttribute("data-align", "end");
    expect(list.children).toHaveLength(2);
  });
  it("inherits Theme density and supports explicit nested resets", () => {
    render(
      <Theme density="compact">
        <Theme data-testid="inherited">
          <Theme density="default" data-testid="reset">
            <span />
          </Theme>
        </Theme>
      </Theme>,
    );
    expect(screen.getByTestId("inherited")).toHaveAttribute(
      "data-dixy-density",
      "compact",
    );
    expect(screen.getByTestId("reset")).toHaveAttribute(
      "data-dixy-density",
      "default",
    );
  });
});

describe("Container composition", () => {
  it("forwards semantic element, typed ref, native events and style overrides", () => {
    const ref = createRef<HTMLElement>();
    const onClick = vi.fn();
    render(
      <Container
        as="section"
        size="sm"
        ref={ref}
        aria-label="Project"
        dir="rtl"
        className="custom"
        style={{ maxInlineSize: "50rem" }}
        onClick={onClick}
      >
        <button>Open project</button>
      </Container>,
    );
    const region = screen.getByRole("region", { name: "Project" });
    expect(ref.current).toBe(region);
    expect(region).toHaveClass("dixy-container", "custom");
    expect(region).toHaveAttribute("data-size", "sm");
    expect(region).toHaveAttribute("dir", "rtl");
    expect(region.style.maxInlineSize).toBe("50rem");
    const action = screen.getByRole("button", { name: "Open project" });
    expect(action.parentElement).toBe(region);
    action.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
