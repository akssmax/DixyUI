import type {
  AccentColor,
  NeutralColor,
  Density,
  RadiusPreset,
  MotionPreference,
  Material,
  EffectsPreference,
  ShapePreset,
  Personality,
  MotionScheme,
  SkinDefinition,
  OrnamentLevel,
  SkinRelief,
} from "@dixy-ui/tokens";
import { personalityPresets } from "@dixy-ui/tokens";
import {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider";
import {
  createContext,
  useContext,
  Suspense,
  type ComponentType,
  type ComponentProps,
  type CSSProperties,
} from "react";

export interface SkinOrnamentProps {
  /** Surface decoration only. Button content and icons belong to the consumer. */
  part: "theme" | "card" | "dialog" | "switch-thumb";
  ornament: OrnamentLevel;
  motion: MotionPreference;
  effects: EffectsPreference;
  animate: boolean;
}
export type SkinOrnamentRenderer = ComponentType<SkinOrnamentProps>;

export interface ThemeProps extends Omit<ComponentProps<"div">, "color"> {
  /** Optional independently imported skin. Undefined inherits; null clears. */
  skin?: SkinDefinition | null;
  /** Optional code-rendered artwork from a separately imported skin entry. Null clears. */
  ornamentRenderer?: SkinOrnamentRenderer | null;
  /** Opt in to decorative skin animation; motion/effects reductions still win. @default false */
  animateOrnaments?: boolean;
  /** Decorative detail, separate from readable content. @default balanced */
  ornament?: OrnamentLevel;
  /** Surface relief; zero keeps borders and removes decorative depth. @default 1 */
  relief?: SkinRelief;
  /** Default finish for supported controls and Box. Import materials.css. @default matte */
  material?: Material;
  /** Optional rendering policy. Ancestor reduction always wins. @default static */
  effects?: EffectsPreference;
  /** Semantic geometry for supported controls and Box; no clipping. @default rounded */
  shape?: ShapePreset;
  /** Coordinated finish, geometry and response. Explicit props override the preset. */
  personality?: Personality;
  /** Semantic spacing density; control heights stay fixed. @default default */
  density?: Density;
  /** Respect the OS preference or reduce all Dixy motion. Reduction is inherited. @default system */
  motion?: MotionPreference;
  /** The color appearance. Nested themes inherit unspecified settings. @default light */
  appearance?: "light" | "dark";
  /** Base neutral family for surfaces, readable text and neutral actions. @default neutral */
  neutralColor?: NeutralColor;
  /** The brand accent; feedback roles stay independent. @default blue */
  accentColor?: AccentColor;
  /** Contextual control/card/overlay rounding; full keeps panels rectangular. @default md */
  radius?: RadiusPreset;
}

type ThemeSettings = Required<
  Pick<
    ThemeProps,
    | "appearance"
    | "accentColor"
    | "neutralColor"
    | "radius"
    | "density"
    | "motion"
    | "material"
    | "effects"
    | "shape"
    | "animateOrnaments"
  >
> & {
  skin: SkinDefinition | null;
  ornamentRenderer: SkinOrnamentRenderer | null;
  ornament: OrnamentLevel;
  relief: SkinRelief;
  materialOverride: boolean;
  personality?: Personality;
  motionScheme: MotionScheme;
  style?: CSSProperties;
};

const ThemeContext = createContext<ThemeSettings>({
  skin: null,
  ornamentRenderer: null,
  animateOrnaments: false,
  ornament: "balanced",
  relief: 1,
  materialOverride: false,
  appearance: "light",
  density: "default",
  motion: "system",
  accentColor: "blue",
  neutralColor: "neutral",
  radius: "md",
  material: "matte",
  shape: "rounded",
  effects: "static",
  motionScheme: "standard",
});

export function useThemeSettings() {
  return useContext(ThemeContext);
}

export function Theme({
  skin,
  ornamentRenderer,
  animateOrnaments,
  ornament,
  relief,
  density,
  motion,
  appearance,
  accentColor,
  neutralColor,
  radius,
  material,
  effects,
  shape,
  personality,
  className,
  style,
  children,
  ...props
}: ThemeProps) {
  const parent = useThemeSettings();
  const resolvedSkin = skin === undefined ? parent.skin : skin;
  const foundation =
    skin === undefined
      ? parent
      : {
          ...parent,
          accentColor: resolvedSkin?.defaults.accentColor ?? "blue",
          neutralColor: resolvedSkin?.defaults.neutralColor ?? "neutral",
          radius: resolvedSkin?.defaults.radius ?? "md",
          density: resolvedSkin?.defaults.density ?? "default",
          material: resolvedSkin?.defaults.material ?? "matte",
          shape: resolvedSkin?.defaults.shape ?? "rounded",
        };
  const preset = personality ? personalityPresets[personality] : undefined;
  const inheritedDirection = useDirection();
  const direction =
    props.dir === "rtl" || props.dir === "ltr" ? props.dir : inheritedDirection;
  // Theme tokens cross nested/portal boundaries; root layout styles do not.
  const tokenOverrides = Object.fromEntries(
    Object.entries(style ?? {}).filter(([name]) => name.startsWith("--")),
  );
  const settings: ThemeSettings = {
    skin: resolvedSkin,
    animateOrnaments: animateOrnaments ?? parent.animateOrnaments,
    ornamentRenderer:
      ornamentRenderer === undefined
        ? skin === undefined || skin?.id === parent.skin?.id
          ? parent.ornamentRenderer
          : null
        : ornamentRenderer,
    ornament: ornament ?? parent.ornament,
    relief: relief ?? parent.relief,
    materialOverride:
      material !== undefined ||
      (skin === undefined && foundation.materialOverride),
    density: density ?? foundation.density,
    motion: parent.motion === "reduced" ? "reduced" : (motion ?? parent.motion),
    appearance: appearance ?? parent.appearance,
    accentColor: accentColor ?? foundation.accentColor,
    neutralColor: neutralColor ?? foundation.neutralColor,
    radius: radius ?? preset?.radius ?? foundation.radius,
    material: material ?? preset?.material ?? foundation.material,
    shape: shape ?? preset?.shape ?? foundation.shape,
    effects:
      parent.effects === "reduced" ? "reduced" : (effects ?? parent.effects),
    personality: personality ?? parent.personality,
    motionScheme: preset?.motionScheme ?? parent.motionScheme,
    style: { ...parent.style, ...tokenOverrides },
  };

  return (
    <DirectionProvider direction={direction}>
      <ThemeContext.Provider value={settings}>
        <div
          {...props}
          dir={props.dir ?? direction}
          className={["dixy-theme", className].filter(Boolean).join(" ")}
          data-dixy-skin={settings.skin?.id ?? "none"}
          data-ornament={settings.ornament}
          data-relief={settings.relief}
          data-appearance={settings.appearance}
          data-accent={settings.accentColor}
          data-neutral={settings.neutralColor}
          data-radius={settings.radius}
          data-dixy-density={settings.density}
          data-motion={settings.motion}
          data-material-theme={settings.material}
          data-dixy-shape={settings.shape}
          data-effects={settings.effects}
          data-personality={settings.personality}
          style={{ ...settings.style, ...style }}
        >
          <SkinOrnament part="theme" />
          {children}
        </div>
      </ThemeContext.Provider>
    </DirectionProvider>
  );
}

/** Reapply the nearest theme to overlays portaled outside its DOM subtree. */
export function ThemeScope({ children }: { children: React.ReactNode }) {
  const settings = useThemeSettings();
  const direction = useDirection();
  return (
    <div
      className="dixy-theme dixy-portal-scope"
      data-dixy-skin={settings.skin?.id ?? "none"}
      data-ornament={settings.ornament}
      data-relief={settings.relief}
      dir={direction}
      data-appearance={settings.appearance}
      data-accent={settings.accentColor}
      data-neutral={settings.neutralColor}
      data-radius={settings.radius}
      data-dixy-density={settings.density}
      data-motion={settings.motion}
      data-material-theme={settings.material}
      data-dixy-shape={settings.shape}
      data-effects={settings.effects}
      data-personality={settings.personality}
      style={settings.style}
    >
      {children}
    </div>
  );
}

/** Optional artwork is independent of the primitive's refs, events and content. */
export function SkinOrnament({ part }: { part: SkinOrnamentProps["part"] }) {
  const settings = useThemeSettings();
  const Renderer = settings.ornamentRenderer;
  if (
    !settings.skin ||
    !Renderer ||
    settings.effects === "reduced" ||
    settings.ornament === "quiet"
  )
    return null;
  return (
    <Suspense fallback={null}>
      <Renderer
        part={part}
        ornament={settings.ornament}
        motion={settings.motion}
        effects={settings.effects}
        animate={settings.animateOrnaments}
      />
    </Suspense>
  );
}
