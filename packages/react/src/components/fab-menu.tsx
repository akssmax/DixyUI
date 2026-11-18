import { useState, type ReactNode } from "react";
import { withClassName } from "../utilities/class-name";
import { Mark } from "../utilities/default-artwork";
import { Button, type ButtonProps } from "./button";
import { Menu, type MenuItemProps } from "./menu";

export interface FabMenuRootProps {
  /** Accessible name for the closed FAB, e.g. "Create". The open FAB is named "Close". */
  "aria-label": string;
  /** 2–6 closely related FabMenu.Item actions, each with a label (M3). */
  children: ReactNode;
  /** The FAB's icon when closed. @default plus */
  icon?: ReactNode;
  /** FAB size: lg for compact windows, xl for large ones. @default lg */
  size?: "md" | "lg" | "xl";
  /** Colour set shared by the FAB and its items. @default accent */
  color?: ButtonProps["color"];
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Class for the FAB. */
  className?: string;
}

/**
 * M3 FAB menu. The FAB turns into the menu's close button (square to round,
 * plus to close) and its labelled items fan out above it, aligned to the
 * trailing edge. Built on Menu, so focus, arrow keys, typeahead and Escape
 * are Base UI's. Don't pair it with a toolbar or navigation rail.
 */
function Root({
  "aria-label": label,
  children,
  icon,
  size = "lg",
  color = "accent",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
}: FabMenuRootProps) {
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  return (
    <Menu.Root
      open={open}
      onOpenChange={(next) => {
        setOwn(next);
        onOpenChange?.(next);
      }}
    >
      <Menu.Trigger
        render={
          <Button
            size={size}
            color={color}
            morph={false}
            aria-label={open ? "Close" : label}
            className={withClassName("dixy-fab", className)}
          />
        }
      >
        <span className="dixy-fab-icon" data-open={open || undefined}>
          {open ? <Mark kind="close" /> : (icon ?? <Mark kind="plus" />)}
        </span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="top" align="end" sideOffset={8}>
          <Menu.Popup className="dixy-fab-menu-popup" data-color={color}>
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export interface FabMenuItemProps extends Omit<MenuItemProps, "size"> {
  /** Leading icon; keep it, it tells items apart (M3). */
  icon?: ReactNode;
}

/** A labelled pill that hugs its content. */
function Item({ icon, children, className, ...props }: FabMenuItemProps) {
  return (
    <Menu.Item
      {...props}
      className={withClassName("dixy-fab-menu-item", className)}
    >
      {icon && (
        <span className="dixy-fab-menu-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Menu.Item>
  );
}

/** Floating action button that opens 2–6 related actions. */
export const FabMenu = /* @__PURE__ */ (() => ({ Root, Item }))();
