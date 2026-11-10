import { organicOrnamentVariables } from "./organic-css.ts";
import { organicFrameRecipes, isOrganicFrame } from "./organic-settings.ts";
import { createColorPalette, colorThemeVariables } from "@dixy-ui/tokens";
import { frameStyles } from "./frame-styles.ts";
import { themeFoundationStyle } from "./foundations.ts";
import type { ResolvedThemeRecipe } from "./resolve.ts";
import { characterComponentCSS, characterTokenCSS } from "./character.ts";
const surfaces =
  ".dixy-card,.dixy-box,.dixy-dialog-popup,.dixy-alert-dialog-popup,.dixy-drawer-popup,.dixy-popover-popup,.dixy-preview-card-popup,.dixy-tooltip-popup,.dixy-select-popup,.dixy-combobox-popup,.dixy-autocomplete-popup,.dixy-menu-popup,.dixy-context-menu-popup,.dixy-navigation-menu-popup,.dixy-toast-root,.dixy-alert,.dixy-list-box,.dixy-calendar,.dixy-range-calendar";
const overlays =
  ".dixy-dialog-popup,.dixy-alert-dialog-popup,.dixy-drawer-popup,.dixy-popover-popup,.dixy-preview-card-popup,.dixy-tooltip-popup,.dixy-select-popup,.dixy-combobox-popup,.dixy-autocomplete-popup,.dixy-menu-popup,.dixy-context-menu-popup,.dixy-navigation-menu-popup";
const fields =
  ".dixy-input,.dixy-textarea,.dixy-native-select,.dixy-select-trigger,.dixy-input-group,.dixy-combobox-input-group,.dixy-autocomplete-input-group,.dixy-number-field-group,.dixy-otp-field-input";
const tracks = ".dixy-slider-track,.dixy-progress-track,.dixy-meter-track";
const fills =
  ".dixy-slider-indicator,.dixy-progress-indicator,.dixy-meter-indicator";
/** Material paint and frame geometry are emitted from independent inputs. */
export function compileThemeCSS(m: ResolvedThemeRecipe): string {
  const theme = `.dixy-theme[data-dixy-skin="${m.id}"]`;
  const S = (parts: string, state = "") =>
    `:is(${parts})[data-dixy-skin="${m.id}"]${state}`;
  const guard =
    ":not([data-dixy-material-override]):not(:where([data-dixy-material-override]) *)";
  const own = (parts: string, state = "") => S(parts, guard + state);
  const actions =
    ':is([data-variant="solid"],[data-variant="soft"],[data-variant="outline"]):not([data-disabled])';
  const p = m.parameters;
  const style = Object.entries(themeFoundationStyle(m.foundations))
    .map(
      ([key, value]) =>
        `${key === "fontFamily" ? "font-family" : key}:${value};`,
    )
    .join("\n");
  const organic = isOrganicFrame(m.frame) ? organicFrameRecipes[m.frame] : null;
  const ornamentVariables = Object.entries(
    organicOrnamentVariables(m.frame, m.ornament),
  )
    .map(([key, value]) => `${key}:${value};`)
    .join(" ");
  const colors = (appearance: "light" | "dark") =>
    organic
      ? organic[appearance]
          .map(
            (color, i) => `--dixy-organic-${["a", "b", "c", "d"][i]}:${color};`,
          )
          .join(" ")
      : "";
  const frameWidth = m.frame === "none" ? 0 : p.width;
  const radius = (role: string) =>
    p.cornerVariation === 0
      ? `calc(var(--dixy-radius-${role}) * ${p.cornerScale})`
      : [1, 3, 0.5, 2.5]
          .map(
            (factor) =>
              `calc(var(--dixy-radius-${role}) * ${p.cornerScale * (1 + p.cornerVariation * factor)})`,
          )
          .join(" ");
  const palette = m.foundations.customAccent
    ? createColorPalette([
        m.foundations.lightness,
        m.foundations.chroma,
        m.foundations.hue,
      ])
    : null;
  const paletteCSS = palette
    ? (["light", "dark"] as const)
        .map(
          (appearance) =>
            `${theme}[data-appearance="${appearance}"] { ${Object.entries(
              colorThemeVariables(palette, appearance),
            )
              .map(([key, value]) => `${key}:${value};`)
              .join(" ")} }`,
        )
        .join("\n")
    : "";
  // Card glass blurs and saturates whatever sits behind a translucent surface tint.
  const glass =
    m.backdropBlur > 0 || m.backdropSaturate > 100
      ? `blur(${m.backdropBlur}px) saturate(${m.backdropSaturate}%)`
      : "";
  const borderStyle = m.frame === "rails" ? "ridge" : "solid";
  // Overlays float over unrelated content, so a translucent material tint
  // alone leaves them unreadable. Mix in the opaque raised surface: mostly
  // opaque when the material blurs what is behind it, nearly solid when not.
  // Fields get their own edge: WCAG 1.4.11 needs 3:1 around them, and the
  // decorative material edge (white on glass) can be nearly invisible.
  // Base 8/9 at 50% measured >= 3.35:1 on every built-in theme.
  // Character rules sit after material rules and carry the theme ancestor, so they win over paint defaults.
  const C = (parts: string, state = "") =>
    `${theme} :is(${parts})[data-dixy-skin="${m.id}"]${state}`;
  return `
@layer dixy.tokens, dixy.components;
@layer dixy.tokens {
  ${theme} {
    ${style}
    --dixy-skin-edge:${m.edge};
    --dixy-skin-field-edge:color-mix(in oklab,var(--dixy-color-base-9) 50%,var(--dixy-color-base-8));
    ${ornamentVariables}
    ${colors("light")}
    ${m.inkTint ? `--dixy-color-text-primary:color-mix(in srgb,var(--dixy-color-base-12) ${100 - m.inkTint * 100}%,${m.tint[1]});` : ""}
    --dixy-skin-surface:color-mix(in srgb,var(--dixy-color-background-surface-raised) ${m.surfaceMix}%,${m.tint[0]});
    --dixy-skin-ground:color-mix(in srgb,var(--dixy-color-background-canvas) 65%,${m.tint[2]});
    --dixy-skin-card-inset:${p.paddingTop}px ${p.paddingInline}px ${p.paddingBottom}px;
    --dixy-skin-pad-top:${p.paddingTop}px;
    --dixy-skin-pad-inline:${p.paddingInline}px;
    --dixy-skin-frame-inset:${m.frame === "rails" ? `${p.inset}px 0 0` : `${p.inset}px`};
    --dixy-skin-frame-width:${frameWidth}px;
    --dixy-skin-finish:linear-gradient(${m.lightAngle}deg,rgb(255 255 255 / ${m.sheen * 0.3}),transparent 42%),${m.finish};
    --dixy-skin-grain:${m.grain};
    --dixy-skin-grain-size:${4 * m.textureScale}px;
    --dixy-skin-paint:var(--dixy-skin-grain),var(--dixy-skin-finish);
    --dixy-skin-canvas:${m.canvas};
    --dixy-skin-authored-shadow:${m.shadow};
    --dixy-skin-shadow:var(--dixy-skin-depth-shadow,var(--dixy-skin-authored-shadow));
    --dixy-skin-inset:${m.inset};
    --dixy-skin-control-edge:inset 0 1px 0 rgb(255 255 255 / ${0.1 + m.sheen * 0.5}),inset 0 -1px 0 #0002;
    --dixy-skin-cushion:inset 0 ${m.cushion * 3}px ${m.cushion * 5}px #ffffff66,inset 0 -${m.cushion * 5}px ${m.cushion * 8}px color-mix(in srgb,var(--dixy-skin-edge) ${m.cushion * 40}%,transparent),var(--dixy-skin-cushion-elevation);
    --dixy-skin-cushion-cast:0 ${m.cushion * 10}px ${m.cushion * 14}px color-mix(in srgb,var(--dixy-skin-edge) ${m.cushion * 28}%,transparent);
    --dixy-skin-panel-relief:${m.cushion ? "var(--dixy-skin-cushion)," : ""}var(--dixy-skin-shadow);
    --dixy-skin-control-relief:${m.cushion ? "var(--dixy-skin-cushion)," : ""}var(--dixy-skin-control-edge),var(--dixy-skin-shadow);
    --dixy-skin-thumb:${m.thumb};
    --dixy-skin-mark-opacity:1;
    ${characterTokenCSS(m.character)}
  }
  ${theme}[data-appearance="dark"] { ${colors("dark")} ${m.inkTint ? `--dixy-color-text-primary:color-mix(in srgb,var(--dixy-color-base-12) ${100 - m.inkTint * 100}%,${m.tint[0]});` : ""} --dixy-skin-edge:${m.darkEdge}; ${m.darkShadow ? `--dixy-skin-authored-shadow:${m.darkShadow};` : ""} ${m.darkInset ? `--dixy-skin-inset:${m.darkInset};` : ""} ${m.darkCanvas ? `--dixy-skin-canvas:${m.darkCanvas};` : ""} --dixy-skin-surface:color-mix(in srgb,var(--dixy-color-background-surface-raised) ${m.darkSurfaceMix}%,${m.tint[1]}); --dixy-skin-ground:color-mix(in srgb,var(--dixy-color-background-canvas) 65%,${m.tint[1]}); }
  ${m.deepSolid ? `${theme}:not([data-appearance="dark"]) { --dixy-color-brand-9:var(--dixy-color-brand-11); --dixy-color-brand-10:var(--dixy-color-brand-12); --dixy-color-brand-pressed:var(--dixy-color-brand-12); }` : ""}
  ${m.controlHeights ? `${theme} { --dixy-size-control-sm:${m.controlHeights[0]}; --dixy-size-control-md:${m.controlHeights[1]}; --dixy-size-control-lg:${m.controlHeights[2]}; --dixy-height-sm:${m.controlHeights[0]}; --dixy-height-md:${m.controlHeights[1]}; --dixy-height-lg:${m.controlHeights[2]}; }` : ""}
  ${m.monoAccent ? `${theme}[data-accent="neutral"] { --dixy-color-brand-9:var(--dixy-color-neutral-12); --dixy-color-brand-10:var(--dixy-color-neutral-11); --dixy-color-brand-11:var(--dixy-color-neutral-12); --dixy-color-brand-pressed:var(--dixy-color-neutral-11); --dixy-color-brand-on-solid:var(--dixy-color-neutral-1); --dixy-color-brand-focus:var(--dixy-color-blue-focus); }` : ""}
  ${theme}[data-relief="2"] { --dixy-skin-shadow:var(--dixy-skin-depth-shadow,var(--dixy-skin-authored-shadow)),0 10px 18px #0002; }
  ${theme}[data-relief="0"],${theme}[data-effects="reduced"] { --dixy-skin-shadow:none; --dixy-skin-inset:none; --dixy-skin-control-edge:none; --dixy-skin-panel-relief:none; --dixy-skin-control-relief:none; }
  ${theme}[data-effects="reduced"] { --dixy-skin-paint:none; --dixy-skin-finish:none; --dixy-skin-canvas:none; --dixy-skin-thumb:none; --dixy-skin-mark-opacity:0; }
  ${theme}[data-ornament="quiet"] { --dixy-skin-mark-opacity:0; }
  ${paletteCSS}
}
@layer dixy.components {
  ${theme} { position:relative; isolation:isolate; }
  ${theme}:not(.dixy-portal-scope) { background-color:var(--dixy-skin-ground); background-image:var(--dixy-skin-canvas); }
  ${S(surfaces)} { position:relative; border-radius:${radius("card")}; }
  ${S(overlays)} { border-radius:${radius("overlay")}; }
  ${S(".dixy-card,.dixy-dialog-popup")} { padding:var(--dixy-skin-card-inset); border:${frameWidth}px ${borderStyle} var(--dixy-skin-edge); }
  ${own(surfaces)} { background-image:var(--dixy-skin-paint); background-size:var(--dixy-skin-grain-size) var(--dixy-skin-grain-size),100% 100%,100% 100%,100% 100%; box-shadow:var(--dixy-skin-panel-relief); }
  ${own(surfaces, ':not([data-variant="solid"]):not([data-variant="soft"])')} { background-color:var(--dixy-skin-surface); }
  ${own(overlays, ':not([data-variant="solid"]):not([data-variant="soft"])')} { background-color:color-mix(in srgb,var(--dixy-color-background-surface-raised) ${glass ? 72 : 94}%,var(--dixy-skin-surface)); }
  ${S(fields)} { border-radius:calc(var(--dixy-radius-control) * ${p.cornerScale}); }
  ${S(".dixy-textarea")} { border-radius:calc(min(var(--dixy-radius-control), var(--dixy-radius-card)) * ${p.cornerScale}); }
  ${own(fields)} { border-width:var(--dixy-input-border-width); border-color:var(--dixy-skin-field-edge); background-image:var(--dixy-skin-paint); background-color:var(--dixy-color-background-canvas); background-size:var(--dixy-skin-grain-size) var(--dixy-skin-grain-size),100% 100%,100% 100%,100% 100%; box-shadow:var(--dixy-skin-inset); }
  /* materials.css styles [data-dixy-visual] surfaces at 0,5,0. Match the
     skin's paint to that so its image and grain size always land together;
     otherwise the material image is tiled at the grain size (stripes). */
  ${own(`${surfaces},${fields}`, "[data-dixy-visual][data-material]:not([data-disabled])")} { background-image:var(--dixy-skin-paint); }
  ${own(".dixy-button", actions)} { border-width:var(--dixy-button-border-width); border-color:var(--dixy-skin-edge); border-radius:calc(var(--dixy-shape-control) * ${p.cornerScale}); background-image:var(--dixy-skin-finish); box-shadow:var(--dixy-skin-control-relief); }
  ${m.tintActions ? `${own(".dixy-button", '[data-variant="solid"][data-color="accent"]:not([data-disabled])')} { background-color:var(--dixy-skin-surface); color:var(--dixy-color-text-action-primary); }` : ""}
  ${own(".dixy-button", actions + ":active")} { box-shadow:var(--dixy-skin-inset); }
  ${own(".dixy-tabs-list")} { background-color:var(--dixy-color-background-canvas); border:1px solid var(--dixy-skin-edge); box-shadow:var(--dixy-skin-inset); }
  /* Selected tabs and toggles are one flat colour, lifted by edge and relief only. A gradient behind the label (thumb art, sheen, material image) splits it across two colours. :not([data-variant="line"]) also outranks materials.css (0,3,0). */
  ${own(".dixy-tabs-indicator")} { box-shadow:var(--dixy-skin-control-relief); border:1px solid var(--dixy-skin-edge); }
  ${own(".dixy-tabs-indicator", ':not([data-variant="line"])')} { background-image:none; }
  /* Toggle groups read like tabs: a sunken track, the selected toggle a raised, flat thumb. */
  ${theme} .dixy-toggle-group:is([data-attached],[data-segmented])${guard} { background-color:var(--dixy-color-background-canvas); border:1px solid var(--dixy-skin-edge); box-shadow:var(--dixy-skin-inset); }
  ${own(".dixy-toggle", ':not([data-variant="solid"])[data-pressed]:not([data-disabled])')} { background-color:var(--dixy-color-background-surface-raised); background-image:none; box-shadow:var(--dixy-skin-control-relief); border-color:var(--dixy-skin-edge); color:var(--dixy-color-text-primary); }
  ${own(tracks)} { border:1px solid var(--dixy-skin-edge); background-color:var(--dixy-color-background-surface); box-shadow:var(--dixy-skin-inset); }
  ${own(fills)} { background-image:var(--dixy-skin-finish); }
  ${own(".dixy-switch-root,.dixy-checkbox-root,.dixy-radio-root")}::before { box-shadow:var(--dixy-skin-inset); }
  ${own(".dixy-checkbox-root,.dixy-radio-root", "[data-checked]")}::before { background-image:var(--dixy-skin-finish); }
  ${own(".dixy-switch-thumb")} { background-image:var(--dixy-skin-thumb); box-shadow:var(--dixy-skin-control-relief); border:1px solid var(--dixy-skin-edge); }
  ${own(".dixy-slider-thumb")}::before { background-image:var(--dixy-skin-thumb); box-shadow:var(--dixy-skin-control-relief); border:1px solid var(--dixy-skin-edge); }
  ${frameStyles(m, theme)}
  ${characterComponentCSS(m.character, theme, C)}
  ${glass ? `@supports(backdrop-filter:blur(1px)) { ${own(surfaces)} { backdrop-filter:${glass}; -webkit-backdrop-filter:${glass}; } }` : ""}
  @supports(backdrop-filter:blur(8px)) { ${theme}[data-effects="backdrop"] > .dixy-skin-backdrop { backdrop-filter:blur(8px); } }
  @media(prefers-reduced-transparency:reduce),(prefers-contrast:more),(forced-colors:active) {
    ${theme} { --dixy-skin-paint:none; --dixy-skin-finish:none; --dixy-skin-canvas:none; --dixy-skin-thumb:none; --dixy-skin-shadow:none; --dixy-skin-inset:none; --dixy-skin-panel-relief:none; --dixy-skin-control-relief:none; }
    ${theme} > .dixy-skin-backdrop, ${S(surfaces)} { backdrop-filter:none!important; -webkit-backdrop-filter:none!important; }
  }
}
`;
}
