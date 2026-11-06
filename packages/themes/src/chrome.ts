/**
 * Window chrome: the structural half of a frame. A frame recipe draws ornament
 * art; chrome rebuilds the window itself out of existing Card parts:
 *
 *   Card.Header                      → title bar   (titlebar)
 *   Card.Root / Dialog popup         → window edge (edge, corners)
 *   Card.Content directly after it   → display well (well)
 *
 * Everything is CSS on existing elements and decorative pseudo-elements
 * (`content:""`, so nothing is announced). No markup, refs, events, focus order
 * or semantics change, and every chrome colour is either a palette token or a
 * fixed dark/light ground with a matching ink, so text keeps its contrast.
 */
export const titlebarStyles = [
  "none",
  "grip",
  "caption",
  "gradient",
  "tab",
  "glass",
  "chrome",
] as const;
export const edgeStyles = [
  "line",
  "bevel",
  "double",
  "pill",
  "stepped",
] as const;
export const wellStyles = [
  "none",
  "lcd",
  "recessed",
  "tinted",
  "paper",
  "glass",
  "sunken",
] as const;
export const cornerStyles = ["inherit", "pixel", "notched", "round"] as const;

/** The LCD well's fixed ground, shared by its CSS and its contrast traits. */
export const LCD_GROUND = "#060906";

/**
 * What each well paints behind its content, so tools can reason about it without parsing CSS.
 * - `surface`: no ground of its own; content sits on the card surface.
 * - `canvas`: repaints to the palette canvas, so it follows the appearance.
 * - `fixed`: a ground that stays put in both appearances, with its own ink (accent mixed with white
 *   at `inkAccent`%). `tone` says which appearance it belongs to; `substitute` is the closest
 *   appearance-following well, for tools that need the look to hold in both appearances.
 */
export type WellGround =
  | { readonly kind: "surface" }
  | { readonly kind: "canvas" }
  | {
      readonly kind: "fixed";
      readonly color: string;
      readonly tone: "light" | "dark";
      readonly inkAccent: number;
      readonly substitute: WellStyle;
    };

export const wellGrounds = {
  none: { kind: "surface" },
  lcd: {
    kind: "fixed",
    color: LCD_GROUND,
    tone: "dark",
    inkAccent: 70,
    substitute: "recessed",
  },
  recessed: { kind: "canvas" },
  tinted: { kind: "canvas" },
  paper: { kind: "canvas" },
  glass: { kind: "canvas" },
  sunken: { kind: "canvas" },
} as const satisfies Record<WellStyle, WellGround>;

export type TitlebarStyle = (typeof titlebarStyles)[number];
export type EdgeStyle = (typeof edgeStyles)[number];
export type WellStyle = (typeof wellStyles)[number];
export type CornerStyle = (typeof cornerStyles)[number];

export interface ThemeChrome {
  readonly titlebar: TitlebarStyle;
  readonly edge: EdgeStyle;
  readonly well: WellStyle;
  readonly corners: CornerStyle;
}

/** No chrome: compiles to nothing, so migrated documents keep their look. */
export const defaultChrome: ThemeChrome = {
  titlebar: "none",
  edge: "line",
  well: "none",
  corners: "inherit",
};

export const chromeLabels = {
  titlebar: {
    none: "None",
    grip: "Grip strip (media player)",
    caption: "Caption bar (classic desktop)",
    gradient: "Gradient header (social profile)",
    tab: "Paper tab",
    glass: "Glass strip (round lights)",
    chrome: "Brushed chrome (millennium)",
  },
  edge: {
    line: "Single line",
    bevel: "Pixel bevel stack",
    double: "Double rule",
    pill: "Thick two-tone",
    stepped: "Stepped inlay",
  },
  well: {
    none: "None",
    lcd: "LCD display",
    recessed: "Recessed with screws",
    tinted: "Tinted panel",
    paper: "Ruled paper",
    glass: "Frosted glass",
    sunken: "Soft sunken",
  },
  corners: {
    inherit: "From radius",
    pixel: "Pixel square",
    notched: "Notched",
    round: "Big round",
  },
} as const;

type Scope = (parts: string, state?: string) => string;

const ACCENT = "var(--dixy-color-background-action-primary)";
const EDGE = "var(--dixy-skin-edge)";
const SURFACE = "var(--dixy-skin-surface)";
const CANVAS = "var(--dixy-color-background-canvas)";
/** Wells that repaint to the canvas also reset text to its ink: a solid card's on-accent colour would vanish there. */
const GROUNDED = "color:var(--dixy-color-text-primary);";
const mix = (color: string, amount: number, other = "transparent") =>
  `color-mix(in srgb,${color} ${amount}%,${other})`;
/** Sets every text role inside a chrome part, so nested parts and app copy follow its ground. */
const ink = (color: string, muted = color) =>
  `color:${color}; --dixy-color-text-primary:${color}; --dixy-color-text-secondary:${color}; --dixy-color-text-muted:${muted};`;

/** Three small window buttons, painted as six gradient layers (shadow + face per button). */
function windowButtons(face: string, shade: string, size: number): string {
  const step = size + 2;
  const layers = [0, 1, 2].flatMap((i) => [
    `linear-gradient(${face},${face}) ${i * step}px 0/${size - 1}px ${size - 1}px no-repeat`,
    `linear-gradient(${shade},${shade}) ${i * step + 1}px 1px/${size - 1}px ${size - 1}px no-repeat`,
  ]);
  return layers.join(",");
}

function titlebarCSS(style: TitlebarStyle, bar: string, theme: string) {
  if (style === "none") return "";
  const common = `
  ${bar} { position:relative; z-index:2; display:flex; flex-wrap:wrap; align-items:center; column-gap:8px; row-gap:2px; margin:calc(var(--dixy-chrome-gap,0px) - var(--dixy-skin-pad-top,24px)) calc(var(--dixy-chrome-gap,0px) - var(--dixy-skin-pad-inline,24px)) 14px; padding:4px 8px; min-block-size:24px; border-radius:var(--dixy-chrome-bar-radius,0px) var(--dixy-chrome-bar-radius,0px) 0 0; }
  ${bar} > * { margin:0; }
  ${bar} :is(h1,h2,h3,h4,.dixy-card-title) { font-size:.875rem; line-height:1.3; }
  ${theme} .dixy-signal-rail { display:none; }
  @media (forced-colors:active) { ${bar} { background:Canvas; border-block-end:1px solid CanvasText; } ${bar}::before,${bar}::after { display:none; } }`;
  const buttons = (face: string, shade: string, size = 10) =>
    `${bar}::after { content:""; flex:none; margin-inline-start:auto; inline-size:${size * 3 + 4}px; block-size:${size}px; background:${windowButtons(face, shade, size)}; }`;
  switch (style) {
    case "grip": {
      // Media-player strip: grip lines either side of the label, buttons on the right.
      const ground = mix(EDGE, 35, "#090c0a");
      const lit = mix(ACCENT, 62, "#ffffff");
      const face = mix(EDGE, 30, "#c9cfcb");
      const grip = `repeating-linear-gradient(180deg,${mix(ACCENT, 55)} 0 1px,transparent 1px 3px)`;
      return `${common}
  ${bar} { flex-wrap:nowrap; background-color:${ground}; background-image:linear-gradient(180deg,#ffffff1c,transparent 60%); box-shadow:inset 0 1px 0 #ffffff26,inset 0 -1px 0 #000; ${ink(lit)} font-family:var(--dixy-font-title-md-family,var(--dixy-font-mono)); letter-spacing:.14em; text-transform:uppercase; }
  ${bar} > * { flex:0 1 auto; min-inline-size:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  ${bar}::before { content:""; flex:1 1 12px; min-inline-size:12px; block-size:8px; background:${grip}; }
  ${bar}::after { content:""; flex:1 1 52px; min-inline-size:52px; block-size:9px; background:${[0, 1, 2].map((i) => `linear-gradient(${face},${face}) right ${i * 11 + 1}px top 0/8px 8px no-repeat,linear-gradient(#000,#000) right ${i * 11}px top 1px/8px 8px no-repeat`).join(",")},${grip} 0 0/calc(100% - 40px) 100% no-repeat; }`;
    }
    case "caption":
      // Classic desktop caption: dark-to-light accent gradient, bold white title, three bevelled buttons.
      return `${common}
  ${bar} { background-image:linear-gradient(90deg,${mix(ACCENT, 35, "#06124a")},${mix(ACCENT, 42, "#0a1540")}); ${ink("#ffffff", "#e8ecff")} font-weight:700; padding-inline:6px 4px; }
  ${bar} :is(h1,h2,h3,h4,.dixy-card-title) { font-weight:700; }
  ${buttons("#d4d0c8", "#404040", 12)}`;
    case "gradient":
      // Social-profile header: glossy blue-to-violet band with a soft top light.
      return `${common}
  ${bar} { background-image:linear-gradient(180deg,#ffffff30,transparent 55%),linear-gradient(100deg,${mix("#3456c4", 85, ACCENT)},${mix("#7446c9", 85, ACCENT)}); ${ink("#ffffff", "#eef0ff")} font-weight:700; padding:6px 12px; min-block-size:30px; }`;
    case "glass": {
      // A light-catching strip with three round lights; text stays on palette tokens.
      const dot = (x: number, color: string) =>
        `radial-gradient(circle,${color} 0 3.5px,${mix(EDGE, 60)} 4px,transparent 4.5px) right ${x}px center/10px 10px no-repeat`;
      return `${common}
  ${bar} { background-image:linear-gradient(180deg,${mix("#ffffff", 34)},${mix("#ffffff", 6)}); border-block-end:1px solid ${mix(EDGE, 45)}; box-shadow:inset 0 1px 0 ${mix("#ffffff", 60)}; padding-inline:12px 8px; }
  ${bar}::after { content:""; flex:none; margin-inline-start:auto; inline-size:34px; block-size:10px; background:${dot(0, ACCENT)},${dot(12, mix(ACCENT, 50, SURFACE))},${dot(24, mix(EDGE, 70, SURFACE))}; }`;
    }
    case "chrome":
      // Brushed light metal with a fixed dark ink (about 9:1) and pill buttons tinted by the accent.
      return `${common}
  ${bar} { background-image:repeating-linear-gradient(90deg,#ffffff1a 0 1px,transparent 1px 3px),linear-gradient(180deg,#eef2f4,#c3ccd2 55%,#aab5bc); border-block-end:1px solid #6f7d86; box-shadow:inset 0 1px 0 #fff; ${ink("#0d1418", "#26333b")} font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
  ${bar}::after { content:""; flex:none; margin-inline-start:auto; inline-size:46px; block-size:10px; background:${[0, 16, 32].map((x) => `radial-gradient(5px 4px at 50% 50%,${mix(ACCENT, 80, "#ffffff")} 0 3px,#4f5d66 3.5px,transparent 4.5px) right ${x}px center/14px 10px no-repeat`).join(",")}; }`;
    case "tab":
      // A paper label hanging from the top edge, with a stitched rule.
      return `${common}
  ${bar} { inline-size:fit-content; max-inline-size:100%; margin-inline:calc(var(--dixy-skin-pad-inline,24px) * -1 + 18px) auto; padding:7px 16px 10px; background-color:${CANVAS}; background-image:repeating-linear-gradient(90deg,${mix(EDGE, 55)} 0 4px,transparent 4px 7px); background-size:calc(100% - 18px) 1px; background-position:9px calc(100% - 4px); background-repeat:no-repeat; border:1px solid ${mix(EDGE, 70)}; border-block-start:0; border-radius:0 0 10px 10px; box-shadow:0 2px 0 ${mix(EDGE, 22)}; }`;
  }
}

function edgeCSS(style: EdgeStyle, frame: string) {
  const relief = "var(--dixy-skin-panel-relief)";
  const hi = (n: number) => mix("#ffffff", n, SURFACE);
  const lo = (n: number) => mix("#000000", n, SURFACE);
  switch (style) {
    case "line":
      return "";
    case "bevel":
      // Four layers: dark outline, then light/dark pairs that read as a raised pixel window.
      return `${frame} { border:1px solid ${mix(EDGE, 60, "#000")}; --dixy-chrome-gap:3px; box-shadow:inset 1px 1px 0 ${hi(60)},inset -1px -1px 0 ${lo(70)},inset 2px 2px 0 ${hi(25)},inset -2px -2px 0 ${lo(35)},${relief}; }`;
    case "double":
      return `${frame} { border:1px solid ${EDGE}; box-shadow:0 0 0 3px ${SURFACE},0 0 0 4px ${EDGE},${relief}; }`;
    case "pill":
      return `${frame} { border:3px solid ${mix(ACCENT, 45, SURFACE)}; box-shadow:inset 0 0 0 2px ${hi(70)},0 0 0 1px ${mix(EDGE, 70)},${relief}; }`;
    case "stepped":
      return `${frame} { border:1px solid ${EDGE}; box-shadow:inset 0 0 0 4px ${SURFACE},inset 0 0 0 5px ${EDGE},inset 0 0 0 9px ${SURFACE},inset 0 0 0 10px ${mix(EDGE, 55)},${relief}; }`;
  }
}

function cornerCSS(style: CornerStyle, frame: string) {
  switch (style) {
    case "inherit":
      return "";
    case "pixel":
      return `${frame} { border-radius:0; --dixy-chrome-bar-radius:0px; }`;
    case "notched":
      // Clip-path also clips outer shadows, so notched windows lean on inset relief.
      return `${frame} { border-radius:0; --dixy-chrome-bar-radius:0px; clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px),0 10px); }`;
    case "round":
      return `${frame} { border-radius:16px; --dixy-chrome-bar-radius:13px; }`;
  }
}

function screw(x: string, y: string) {
  return `radial-gradient(circle at 50% 50%,#ffffffcc 0 1px,#9a9f9c 1.5px 2.5px,#4d524f 3px,transparent 3.5px) ${x} ${y}/8px 8px no-repeat`;
}

function wellCSS(style: WellStyle, well: string) {
  const common = `${well} { position:relative; padding:12px 14px; }`;
  switch (style) {
    case "none":
      return "";
    case "lcd": {
      // A display stays dark in both appearances. It re-points text, neutral-button and border tokens at its own ink,
      // so ghost/outline buttons inside it stay readable in a light theme too.
      const { color: ground, inkAccent } = wellGrounds.lcd;
      const lit = mix(ACCENT, inkAccent, "#ffffff");
      return `${common}
  ${well} { background-color:${ground}; background-image:repeating-linear-gradient(0deg,#ffffff08 0 1px,transparent 1px 3px); border:1px solid #000; border-radius:2px; box-shadow:inset 1px 1px 0 #000,inset -1px -1px 0 #ffffff24,0 1px 0 #ffffff12; ${ink(lit, mix(lit, 72, ground))} --dixy-color-background-canvas:${ground}; --dixy-color-background-surface:#0d120d; --dixy-color-border-default:${mix(lit, 35)}; --dixy-button-secondary-text:${lit}; --dixy-button-secondary-soft:${mix(lit, 14)}; --dixy-button-secondary-soft-hover:${mix(lit, 22)}; --dixy-button-secondary-soft-pressed:${mix(lit, 28)}; }
  ${well} :is(h1,h2,h3,h4,.dixy-card-title) { text-shadow:0 0 8px ${mix(ACCENT, 45)}; }
  @media (prefers-contrast:more) { ${well} :is(h1,h2,h3,h4,.dixy-card-title) { text-shadow:none; } }`;
    }
    case "recessed":
      return `${common}
  ${well} { ${GROUNDED} padding:16px 20px; background:${screw("5px", "5px")},${screw("right 5px", "5px")},${screw("5px", "bottom 5px")},${screw("right 5px", "bottom 5px")},${CANVAS}; border:1px solid ${mix(EDGE, 70)}; border-radius:6px; box-shadow:inset 0 2px 4px #0003,inset 0 -1px 0 #ffffff55; }`;
    case "tinted":
      return `${common}
  ${well} { ${GROUNDED} background-color:${mix(ACCENT, 9, CANVAS)}; border:1px solid ${mix(ACCENT, 28)}; border-radius:10px; }
  ${well} :is(ul,ol,[role="list"],tbody) > :nth-child(even),${well} > .dixy-button[data-variant="ghost"]:nth-of-type(even):not(:hover) { background-color:${mix(ACCENT, 8)}; }`;
    case "glass":
      // Translucent panel: the palette's own text stays readable on the surface beneath.
      return `${common}
  ${well} { ${GROUNDED} background-color:${mix(CANVAS, 62)}; background-image:linear-gradient(160deg,${mix("#ffffff", 22)},transparent 45%); border:1px solid ${mix("#ffffff", 40, "transparent")}; border-radius:14px; box-shadow:inset 0 1px 0 ${mix("#ffffff", 55)},0 1px 2px ${mix(EDGE, 25)}; }
  @media (prefers-reduced-transparency:reduce),(prefers-contrast:more) { ${well} { background-color:${CANVAS}; background-image:none; } }`;
    case "sunken":
      return `${common}
  ${well} { ${GROUNDED} background-color:${CANVAS}; border-radius:16px; box-shadow:inset 0 3px 8px ${mix(EDGE, 40)},inset 0 -2px 0 ${mix("#ffffff", 50)}; }`;
    case "paper":
      return `${common}
  ${well} { ${GROUNDED} background-color:${CANVAS}; background-image:repeating-linear-gradient(180deg,transparent 0 23px,${mix(EDGE, 22)} 23px 24px); background-position:0 10px; border-inline-start:2px solid ${mix("var(--dixy-color-border-danger)", 45)}; border-radius:2px; }`;
  }
}

/** Rules for the components layer. `C` scopes parts to this skin inside this theme. */
export function chromeCSS(c: ThemeChrome, theme: string, C: Scope): string {
  const frame = C(".dixy-card,.dixy-dialog-popup");
  const card = C(".dixy-card");
  return [
    edgeCSS(c.edge, frame),
    cornerCSS(c.corners, frame),
    titlebarCSS(c.titlebar, `${card} > .dixy-card-header`, theme),
    wellCSS(c.well, `${card} > .dixy-card-header + .dixy-card-content`),
  ]
    .filter((part) => part.trim())
    .join("\n  ");
}
