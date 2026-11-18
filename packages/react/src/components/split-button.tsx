import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ButtonGroupContext } from "../utilities/visual-group-context";
import { withClassName } from "../utilities/class-name";
import { Mark } from "../utilities/default-artwork";
import { useThemeSettings } from "../theme/theme";
import { Button, type ButtonProps } from "./button";
import { Menu, type MenuPopupProps } from "./menu";

export interface SplitButtonRootProps extends Omit<
  ComponentProps<"div">,
  "color"
> {
  /** Both halves' height; the M3 split button comes in all five sizes. @default md */
  size?: ButtonProps["size"];
  /** Both halves' emphasis. @default solid */
  variant?: ButtonProps["variant"];
  /** Both halves' palette. @default accent */
  color?: ButtonProps["color"];
}

/**
 * M3 split button: a leading action and a trailing menu button, 2px apart,
 * round outside and tight inside. While the menu is open the trailing button
 * goes fully round and its chevron turns 180° (on the standard curve, as M3
 * specifies for this one). Each half is an ordinary tab stop.
 */
function Root({
  size = "md",
  variant = "solid",
  color = "accent",
  className,
  role = "group",
  ...props
}: SplitButtonRootProps) {
  const theme = useThemeSettings();
  return (
    <SplitSize.Provider value={size}>
      <ButtonGroupContext.Provider value={{ variant, color }}>
        <div
          {...props}
          role={role}
          data-size={size}
          data-dixy-skin={theme.skin?.id}
          className={["dixy-split-button", className].filter(Boolean).join(" ")}
        />
      </ButtonGroupContext.Provider>
    </SplitSize.Provider>
  );
}

const SplitSize = createContext<ButtonProps["size"]>("md");

export interface SplitButtonActionProps extends Omit<ButtonProps, "morph"> {}

/** The leading action: one or two words and an icon. */
function Action({ className, ...props }: SplitButtonActionProps) {
  return (
    <SizedButton
      {...props}
      className={withClassName("dixy-split-button-action", className)}
    />
  );
}

export interface SplitButtonMenuProps {
  /** Accessible name for the trailing menu button, e.g. "More send options". */
  "aria-label": string;
  /** Menu items (`Menu.Item`, groups, separators). */
  children: ReactNode;
  /** Menu alignment against the trailing button. @default end */
  align?: "start" | "center" | "end";
  /** Popup visuals. */
  popup?: Omit<MenuPopupProps, "children">;
  /** Controlled open state, passed to Menu.Root. */
  open?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: ComponentProps<typeof Menu.Root>["onOpenChange"];
  /** Trailing button props (variant, color, disabled). */
  trigger?: Omit<ButtonProps, "children" | "morph">;
}

/** The trailing menu button and its menu, 4px from the button (M3). */
function SplitMenu({
  "aria-label": label,
  children,
  align = "end",
  popup,
  open,
  onOpenChange,
  trigger,
}: SplitButtonMenuProps) {
  return (
    <Menu.Root open={open} onOpenChange={onOpenChange}>
      <Menu.Trigger
        render={
          <SizedButton
            {...trigger}
            aria-label={label}
            className={withClassName(
              "dixy-split-button-trigger",
              trigger?.className as string | undefined,
            )}
          />
        }
      >
        <Mark kind="chevron" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4} align={align}>
          <Menu.Popup {...popup}>{children}</Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

/** Both halves take the root's size (Button's group context stops at lg). */
function SizedButton(props: ButtonProps) {
  const size = useContext(SplitSize);
  return <Button size={size} {...props} morph={false} />;
}

/** Leading action plus a menu of related options. */
export const SplitButton = /* @__PURE__ */ (() => ({
  Root,
  Action,
  Menu: SplitMenu,
}))();
