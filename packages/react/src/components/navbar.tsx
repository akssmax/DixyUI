import { Collapsible as Primitive } from "@base-ui/react/collapsible";
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type MouseEvent,
} from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useComponentVisuals } from "../utilities/component-visuals";
import { withClassName } from "../utilities/class-name";
import { nativePart, type NativePartProps } from "../utilities/native-part";
import { CloseGlyph, MenuGlyph } from "../utilities/inline-icons";
import { IconButton } from "./button";

type NavbarContextValue = { open: boolean; close: () => void };
const NavbarContext = createContext<NavbarContextValue | null>(null);

export interface NavbarProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "render"
> {
  /** Bar height and type size. @default md */
  size?: "sm" | "md" | "lg";
  /** Surface emphasis. @default outline */
  variant?: "outline" | "soft" | "ghost";
  /** Rounding for links and the toggle. @default Theme.radius */
  radius?: RadiusPreset;
  /** Optional static finish; import materials.css. @default Theme.material */
  material?: Material;
  /** Bar width below which Content hides and the Toggle and Menu appear. Actions stay visible. "never" always shows Content. @default md (48rem) */
  collapseBelow?: "sm" | "md" | "lg" | "never";
  /** Keep the bar at the top of its scroll container. @default false */
  sticky?: boolean;
}

/** A header landmark whose small-width menu is a Base UI Collapsible. */
function NavbarRoot({
  size,
  variant,
  radius,
  material,
  collapseBelow = "md",
  sticky = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: NavbarProps) {
  const visual = useComponentVisuals({ size, variant, radius, material });
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen: NonNullable<NavbarProps["onOpenChange"]> = (next, details) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next, details);
  };
  return (
    <NavbarContext.Provider
      value={{
        open,
        close: () => {
          if (openProp === undefined) setUncontrolled(false);
          // Mirror Base UI's signature for consumers that control open state.
          (onOpenChange as ((open: boolean) => void) | undefined)?.(false);
        },
      }}
    >
      <Primitive.Root
        {...props}
        {...visual}
        open={open}
        onOpenChange={setOpen}
        render={<header />}
        data-collapse={collapseBelow}
        data-sticky={sticky ? "" : undefined}
        className={withClassName("dixy-navbar", className)}
      />
    </NavbarContext.Provider>
  );
}

export interface NavbarContentProps extends NativePartProps<"nav", never> {
  /** Landmark name. @default Main */
  "aria-label"?: string;
}
function NavbarContent({
  children,
  "aria-label": label = "Main",
  className,
  ...props
}: NavbarContentProps) {
  return (
    <nav
      {...(props as ComponentProps<"nav">)}
      aria-label={label}
      className={["dixy-navbar-content", className].filter(Boolean).join(" ")}
    >
      <ul className="dixy-navbar-list">{children}</ul>
    </nav>
  );
}

export interface NavbarLinkProps extends NativePartProps<"a", never> {
  /** Marks the current page with aria-current="page". @default false */
  active?: boolean;
}
const LinkPart = /* @__PURE__ */ nativePart(
  "a",
  "dixy-navbar-link",
  [] as const,
);
function NavbarLink({ active = false, onClick, ...props }: NavbarLinkProps) {
  const navbar = useContext(NavbarContext);
  return (
    <LinkPart
      {...props}
      aria-current={active ? "page" : props["aria-current"]}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        // Following a link from the small-width menu closes it.
        if (!event.defaultPrevented && navbar?.open) navbar.close();
      }}
    />
  );
}

export interface NavbarToggleProps extends Omit<
  ComponentProps<typeof Primitive.Trigger>,
  "render"
> {
  /** Accessible name; aria-expanded conveys open state. @default Menu */
  "aria-label"?: string;
}
function NavbarToggle({
  "aria-label": label = "Menu",
  children,
  className,
  ...props
}: NavbarToggleProps) {
  const navbar = useContext(NavbarContext);
  return (
    <Primitive.Trigger
      {...props}
      className={withClassName("dixy-navbar-toggle", className)}
      render={<IconButton variant="ghost" color="neutral" aria-label={label} />}
    >
      {children ?? (navbar?.open ? <CloseGlyph /> : <MenuGlyph />)}
    </Primitive.Trigger>
  );
}

export interface NavbarMenuProps extends ComponentProps<
  typeof Primitive.Panel
> {
  /** Landmark name; matches Content because only one is visible at a time. @default Main */
  "aria-label"?: string;
}
function NavbarMenu({
  children,
  "aria-label": label = "Main",
  className,
  ...props
}: NavbarMenuProps) {
  return (
    <Primitive.Panel
      {...props}
      className={withClassName("dixy-navbar-menu", className)}
    >
      <nav aria-label={label}>
        <ul className="dixy-navbar-menu-list">{children as never}</ul>
      </nav>
    </Primitive.Panel>
  );
}

/** Responsive top navigation: Brand, Content, Actions, a Toggle and a Menu. */
export const Navbar = /* @__PURE__ */ (() => ({
  Root: NavbarRoot,
  Brand: /* @__PURE__ */ nativePart("div", "dixy-navbar-brand", [] as const),
  Content: NavbarContent,
  Item: /* @__PURE__ */ nativePart("li", "dixy-navbar-item", [] as const),
  Link: NavbarLink,
  Actions: /* @__PURE__ */ nativePart(
    "div",
    "dixy-navbar-actions",
    [] as const,
  ),
  Toggle: NavbarToggle,
  Menu: NavbarMenu,
}))();
