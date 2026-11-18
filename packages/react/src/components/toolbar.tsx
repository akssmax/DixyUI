import { Toolbar as Primitive } from "@base-ui/react/toolbar";
import type { ComponentProps } from "react";
import type { RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface ToolbarRootProps extends ComponentProps<
  typeof Primitive.Root
> {
  /** Proportions for contained toolbar controls. @default md */ size?:
    "sm" | "md" | "lg";
  /**
   * Toolbar surface. `floating` is the M3 floating toolbar: a raised pill
   * above content for contextual actions, kept fully on screen. `vibrant` is
   * its high-emphasis colour set, e.g. for an edit mode.
   * @default plain
   */
  variant?: "plain" | "outline" | "soft" | "floating" | "vibrant";
  /** Toolbar rounding. @default Theme.radius */ radius?: RadiusPreset;
}
const TEXT_ENTRY =
  "input:not([type=button],[type=checkbox],[type=radio]),textarea,[contenteditable]";

/** The roving items Home and End can reach: enabled, visible, in this toolbar. */
function rovingItems(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("[tabindex]")).filter(
    (item) =>
      item.closest('[role="toolbar"]') === root &&
      !item.matches(":disabled") &&
      !item.closest('[aria-hidden="true"],[inert]'),
  );
}

function Root({
  size,
  variant,
  radius,
  className,
  onKeyDown,
  ...props
}: ToolbarRootProps) {
  const visual = useComponentVisuals(
    { size, variant, radius },
    { variant: "plain" },
  );
  return (
    <Primitive.Root
      {...props}
      {...visual}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        // Base UI's Toolbar leaves Home/End off; the APG toolbar pattern uses
        // them. Focusing an item lets the composite move its tab stop.
        if (
          event.defaultPrevented ||
          (event.key !== "Home" && event.key !== "End") ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          (event.target as HTMLElement).matches(TEXT_ENTRY)
        ) {
          return;
        }
        const items = rovingItems(event.currentTarget);
        const next = event.key === "Home" ? items[0] : items.at(-1);
        if (!next) return;
        event.preventDefault();
        next.focus();
      }}
      className={withClassName("dixy-toolbar-root", className)}
    />
  );
}

/** Dixy token styles with the complete Base UI Toolbar contract. */
export const Toolbar = /* @__PURE__ */ (() => ({
  ...Primitive,
  Separator: /* @__PURE__ */ styledPrimitive(
    Primitive.Separator,
    "dixy-toolbar-separator",
  ),
  Root: Root,
  Group: /* @__PURE__ */ styledPrimitive(Primitive.Group, "dixy-toolbar-group"),
  Button: /* @__PURE__ */ styledPrimitive(
    Primitive.Button,
    "dixy-toolbar-button",
  ),
  Link: /* @__PURE__ */ styledPrimitive(Primitive.Link, "dixy-toolbar-link"),
  Input: /* @__PURE__ */ styledPrimitive(Primitive.Input, "dixy-toolbar-input"),
}))();
export type * from "@base-ui/react/toolbar";
