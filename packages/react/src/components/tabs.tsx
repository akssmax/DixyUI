import { Tabs as Primitive } from "@base-ui/react/tabs";
import { createContext, useContext, type ComponentProps } from "react";
import type { Material, RadiusPreset } from "@dixy-ui/tokens";
import { useThemeSettings } from "../theme/theme";
import { withClassName } from "../utilities/class-name";
import { styledPrimitive } from "../utilities/styled-primitive";

export interface TabsRootProps extends Omit<
  ComponentProps<typeof Primitive.Root>,
  "color"
> {
  /** Trigger proportions; preserves the shared minimum interaction target. @default md */
  size?: "sm" | "md" | "lg";
  /**
   * Selected emphasis. Line preserves Dixy's original underline treatment.
   * Segmented draws a sunken track with a raised surface thumb for dense
   * view switchers; it stays neutral, so `color` does not tint it.
   * @default line
   */
  variant?: "line" | "solid" | "soft" | "outline" | "segmented";
  /** Selected semantic color; inactive labels stay neutral. @default accent */
  color?: "accent" | "neutral" | "danger" | "success";
  /** Trigger and selected-surface rounding. @default Theme.radius */
  radius?: RadiusPreset;
  /** Static selected-surface finish for filled variants; import materials.css. @default Theme.material */
  material?: Material;
  /** Align content inside each trigger. @default center */
  align?: "start" | "center" | "end";
  /** Expand horizontal triggers to fill the list. @default false */
  fullWidth?: boolean;
}

const VisualContext = createContext<{
  variant: NonNullable<TabsRootProps["variant"]>;
  material: Material;
  fullWidth: boolean;
  materialOverride: boolean;
}>({
  variant: "line",
  material: "matte",
  fullWidth: false,
  materialOverride: false,
});

function Root({
  size = "md",
  variant = "line",
  color = "accent",
  radius,
  material,
  align = "center",
  fullWidth = false,
  className,
  ...props
}: TabsRootProps) {
  const theme = useThemeSettings();
  return (
    <VisualContext.Provider
      value={{
        variant,
        material: material ?? theme.material,
        fullWidth,
        materialOverride: material !== undefined || theme.materialOverride,
      }}
    >
      <Primitive.Root
        {...props}
        className={withClassName("dixy-tabs-root", className)}
        data-dixy-skin={theme.skin?.id}
        data-dixy-material-override={
          material !== undefined || theme.materialOverride ? "" : undefined
        }
        data-size={size}
        data-variant={variant}
        data-color={color}
        data-radius={radius ?? theme.radius}
        data-align={align}
      />
    </VisualContext.Provider>
  );
}

function List({ className, ...props }: ComponentProps<typeof Primitive.List>) {
  const { variant, fullWidth } = useContext(VisualContext);
  const theme = useThemeSettings();
  return (
    <Primitive.List
      {...props}
      className={withClassName("dixy-tabs-list", className)}
      data-dixy-skin={theme.skin?.id}
      data-variant={variant}
      data-full-width={fullWidth || undefined}
    />
  );
}

function Indicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Indicator>) {
  const { variant, material, materialOverride } = useContext(VisualContext);
  const theme = useThemeSettings();
  const classes = withClassName("dixy-tabs-indicator", className);
  return (
    <Primitive.Indicator
      aria-hidden="true"
      {...props}
      className={(state) =>
        [
          typeof classes === "function" ? classes(state) : classes,
          state.activeTabSize &&
          state.activeTabSize.width > 0 &&
          state.activeTabSize.height > 0
            ? "dixy-tabs-indicator-ready"
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      }
      data-variant={variant}
      data-material={material}
      data-dixy-material-override={materialOverride ? "" : undefined}
      data-dixy-skin={theme.skin?.id}
    />
  );
}

/** Styles extend the primitive; Base UI retains selection, focus, refs and presence. */
export const Tabs = /* @__PURE__ */ (() => ({
  ...Primitive,
  Root,
  List,
  Indicator,
  Tab: /* @__PURE__ */ styledPrimitive(Primitive.Tab, "dixy-tabs-tab"),
  Panel: /* @__PURE__ */ styledPrimitive(Primitive.Panel, "dixy-tabs-panel"),
}))();
export type * from "@base-ui/react/tabs";
