import { createRef, type ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, it, expect, vi } from "vitest";
import { Icon, IconButton, Theme } from "../index";

function CustomIcon(
  props: ComponentProps<"svg"> & { artwork?: "outline" | "fill" },
) {
  const { artwork = "outline", ...svg } = props;
  return (
    <svg
      viewBox="0 0 32 32"
      fill={artwork === "fill" ? "currentColor" : "none"}
      {...svg}
    >
      <path d="M4 16 16 4 28 16 16 28Z" />
    </svg>
  );
}

describe("Icon's SVG composition contract", () => {
  it("hides decoration and removes an accidental SVG keyboard stop", () => {
    const { container } = render(
      <Icon render={<CustomIcon aria-label="Duplicate name" tabIndex={0} />} />,
    );
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("aria-label");
    expect(svg).not.toHaveAttribute("tabindex");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("exposes an explicitly named image even when the pack hides its SVG by default", () => {
    render(
      <>
        <span id="pack-title">A conflicting pack name</span>
        <Icon
          render={
            <CustomIcon aria-hidden="true" aria-labelledby="pack-title" />
          }
          label="  Changes saved  "
          color="success"
          size="lg"
        />
      </>,
    );
    const image = screen.getByRole("img", { name: "Changes saved" });
    expect(image).not.toHaveAttribute("aria-hidden");
    expect(image).toHaveAttribute("data-icon-color", "success");
    expect(image).toHaveAttribute("data-icon-size", "lg");
  });

  it("merges both SVG refs, classes, styles and event handlers without a wrapper", async () => {
    const ownRef = createRef<SVGSVGElement>();
    const packRef = createRef<SVGSVGElement>();
    const ownClick = vi.fn();
    const packClick = vi.fn();
    const { container } = render(
      <Icon
        ref={ownRef}
        className="consumer"
        style={{ opacity: 0.8 }}
        onClick={ownClick}
        render={
          <CustomIcon
            ref={packRef}
            className="pack"
            style={{ strokeWidth: 1.5 }}
            onClick={packClick}
          />
        }
      />,
    );
    expect(container.firstElementChild?.tagName.toLowerCase()).toBe("svg");
    expect(ownRef.current).toBe(packRef.current);
    expect(ownRef.current).toHaveClass("dixy-icon", "consumer", "pack");
    expect(ownRef.current?.style.strokeWidth).toBe("1.5");
    expect(ownRef.current?.style.opacity).toBe("0.8");
    await userEvent.click(ownRef.current!);
    expect(ownClick).toHaveBeenCalledTimes(1);
    expect(packClick).toHaveBeenCalledTimes(1);
  });

  it("preserves artwork and leaves an icon-only action's name on its button", async () => {
    const action = vi.fn();
    const user = userEvent.setup();
    render(
      <IconButton aria-label="Favorite" onClick={action}>
        <Icon render={<CustomIcon artwork="fill" />} />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Favorite" });
    expect(button.querySelector("svg")).toHaveAttribute("fill", "currentColor");
    expect(button.querySelector("svg")).not.toHaveAttribute("stroke-width");
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("renders SVG deterministically on the server without an icon registry or fetch", () => {
    const tree = (
      <Theme>
        <Icon
          render={<CustomIcon viewBox="0 0 64 64" />}
          label="A custom symbol"
        />
      </Theme>
    );
    const html = renderToString(tree);
    expect(html).toBe(renderToString(tree));
    expect(html).toContain('viewBox="0 0 64 64"');
    expect(html).toContain('aria-label="A custom symbol"');
    expect(html).toContain("<path");
  });
});
