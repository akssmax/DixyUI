import { typography } from "@dixy-ui/tokens";
import { chromeCSS, defaultChrome, type ThemeChrome } from "./chrome.ts";

/**
 * Character is the behavioural and control-level half of a theme. Materials and
 * frames paint surfaces; character reshapes the controls inside them, gives them
 * a motion signature, a typographic voice, state cues, small details and a page
 * backdrop. Everything compiles to scoped CSS on existing parts and state hooks:
 * no markup, labels, hit targets, refs or semantics change.
 */
export const controlStyles = [
  "standard",
  "botanical",
  "pixel",
  "instrument",
  "hardware",
  "glass",
  "stitched",
  "pearl",
  "clay",
  "brass",
  "chrome",
  "halo",
] as const;
export const motionStyles = [
  "standard",
  "snappy",
  "stepped",
  "springy",
  "weighted",
  "drift",
] as const;
export const stateStyles = [
  "standard",
  "led",
  "marching",
  "inlay",
  "glow",
  "stamp",
] as const;
export const focusStyles = [
  "ring",
  "double",
  "dashed",
  "glow",
  "offset",
  "halo",
] as const;
export const dividerStyles = [
  "line",
  "dashed",
  "dotted",
  "double",
  "groove",
] as const;
export const selectionStyles = ["accent", "inverse", "highlighter"] as const;
export const scrollbarStyles = ["native", "thin", "accent"] as const;
export const backdropPatterns = [
  "none",
  "grid",
  "scanlines",
  "sunburst",
  "caustics",
  "fibre",
  "dots",
  "topo",
  "halftone",
] as const;
export const headingCases = ["none", "uppercase", "small-caps"] as const;
export const headingWeights = [300, 400, 500, 600, 700, 800, 900] as const;
export const numeralStyles = ["proportional", "tabular", "oldstyle"] as const;

export type ControlStyle = (typeof controlStyles)[number];
export type MotionStyle = (typeof motionStyles)[number];
export type StateStyle = (typeof stateStyles)[number];
export type BackdropPattern = (typeof backdropPatterns)[number];

export interface ThemeCharacter {
  readonly controls: ControlStyle;
  readonly motion: {
    readonly style: MotionStyle;
    readonly press: number;
    readonly tempo: number;
  };
  readonly type: {
    readonly headingCase: (typeof headingCases)[number];
    readonly headingTracking: number;
    readonly headingWeight: (typeof headingWeights)[number];
    readonly numerals: (typeof numeralStyles)[number];
  };
  readonly states: StateStyle;
  readonly details: {
    readonly focus: (typeof focusStyles)[number];
    readonly divider: (typeof dividerStyles)[number];
    readonly selection: (typeof selectionStyles)[number];
    readonly scrollbar: (typeof scrollbarStyles)[number];
    readonly iconStroke: number;
  };
  readonly backdrop: {
    readonly pattern: BackdropPattern;
    readonly intensity: number;
    readonly scale: number;
  };
  /** Window structure: title bar, edge, display well and corners. */
  readonly chrome: ThemeChrome;
}

/** Neutral character: compiles to no extra rules, so migrated documents look unchanged. */
export const defaultCharacter: ThemeCharacter = {
  controls: "standard",
  motion: { style: "standard", press: 1, tempo: 1 },
  type: {
    headingCase: "none",
    headingTracking: 0,
    headingWeight: 600,
    numerals: "proportional",
  },
  states: "standard",
  details: {
    focus: "ring",
    divider: "line",
    selection: "accent",
    scrollbar: "native",
    iconStroke: 2,
  },
  backdrop: { pattern: "none", intensity: 0.5, scale: 1 },
  chrome: defaultChrome,
};

export const characterLabels = {
  controls: {
    standard: "Standard",
    botanical: "Botanical leaves",
    pixel: "Pixel bevel",
    instrument: "Instrument LEDs",
    hardware: "Machined knurl",
    glass: "Glass beads",
    stitched: "Hand stitched",
    pearl: "Pearl",
    clay: "Squishy clay",
    brass: "Brass levers",
    chrome: "Chrome chamfer",
    halo: "Porcelain halo",
  },
  motion: {
    standard: "Standard",
    snappy: "Snappy",
    stepped: "Stepped frames",
    springy: "Springy overshoot",
    weighted: "Weighted settle",
    drift: "Slow drift",
  },
  states: {
    standard: "Standard",
    led: "Lit LEDs",
    marching: "Marching ants",
    inlay: "Double inlay",
    glow: "Soft glow",
    stamp: "Stamped hatch",
  },
  backdrop: {
    none: "None",
    grid: "Drafting grid",
    scanlines: "Scanlines",
    sunburst: "Sunburst",
    caustics: "Caustic light",
    fibre: "Paper fibre",
    dots: "Dot grid",
    topo: "Topographic",
    halftone: "Halftone",
  },
} as const;

type Scope = (parts: string, state?: string) => string;

const ACCENT = "var(--dixy-color-background-action-primary)";
const EDGE = "var(--dixy-skin-edge)";
const SF = "var(--dixy-motion-spatial-factor)";
const mix = (color: string, amount: number, other = "transparent") =>
  `color-mix(in srgb,${color} ${amount}%,${other})`;

const checks = ".dixy-checkbox-root";
const radios = ".dixy-radio-root";
const choices = ".dixy-checkbox-root,.dixy-radio-root";
const thumbs = ".dixy-switch-thumb";
const sliderThumb = ".dixy-slider-thumb";
const trackParts = ".dixy-slider-track,.dixy-progress-track,.dixy-meter-track";
const fillParts =
  ".dixy-slider-indicator,.dixy-progress-indicator,.dixy-meter-indicator";
const fieldParts =
  ".dixy-input,.dixy-textarea,.dixy-native-select,.dixy-select-trigger,.dixy-input-group,.dixy-number-field-group";
const sliderFace = (S: Scope, transform: string, rules: string) =>
  `${S(sliderThumb)}::before { transform:translate(-50%,-50%) ${transform}; ${rules} }`;

/** Each control language reshapes switch, choices, slider, tracks and button press. */
function controlCSS(style: ControlStyle, S: Scope): string {
  switch (style) {
    case "standard":
      return "";
    case "botanical":
      return `
  ${S(thumbs)} { border-radius:60% 4% 60% 4%; }
  ${S(".dixy-switch-root")}::before { border-radius:999px; }
  ${S(checks)}::before { border-radius:3px 55% 3px 55%; }
  ${S(radios)}::before { box-shadow:inset 0 0 0 2px var(--dixy-color-background-surface),inset 0 0 0 3px ${mix(EDGE, 45)}; }
  ${sliderFace(S, "rotate(45deg)", "border-radius:60% 4% 60% 4%;")}
  ${S(trackParts)} { border-radius:999px; }
  ${S(fillParts)} { background-image:linear-gradient(90deg,${mix(ACCENT, 70, "#e8d58a")},${ACCENT}); }`;
    case "pixel":
      return `
  ${S(".dixy-switch-root")}::before { border-radius:0; box-shadow:inset -2px -2px 0 #0003,inset 2px 2px 0 #fff8; }
  ${S(thumbs)} { border-radius:0; box-shadow:2px 2px 0 ${EDGE}; }
  ${S(choices)}::before { box-shadow:2px 2px 0 ${EDGE}; }
  ${S(checks)}::before { border-radius:0; }
  ${S(radios)}::before { border-radius:30%; }
  ${sliderFace(S, "", "border-radius:0; inline-size:calc(var(--dixy-slider-thumb-size) * .6); box-shadow:2px 2px 0 " + EDGE + ";")}
  ${S(trackParts)} { border-radius:0; }
  ${S(fillParts)} { border-radius:0; -webkit-mask:repeating-linear-gradient(90deg,#000 0 8px,transparent 8px 10px); mask:repeating-linear-gradient(90deg,#000 0 8px,transparent 8px 10px); }
  ${S(".dixy-button", ':is([data-variant="solid"],[data-variant="outline"],[data-variant="soft"]):not([data-disabled])')} { box-shadow:3px 3px 0 ${EDGE}; }
  ${S(".dixy-button", ':is([data-variant="solid"],[data-variant="outline"],[data-variant="soft"]):not([data-disabled]):active')} { box-shadow:0 0 0 ${EDGE}; transform:translate(calc(3px * ${SF}),calc(3px * ${SF})); }`;
    case "instrument":
      return `
  ${S(".dixy-switch-root")}::before { border-radius:3px; background-color:${mix("var(--dixy-color-base-12)", 88, ACCENT)}; }
  ${S(thumbs)} { border-radius:2px; }
  ${S(thumbs)}::after { content:""; position:absolute; inset:50% auto auto 50%; inline-size:6px; block-size:6px; translate:-50% -50%; border-radius:50%; background:${mix("var(--dixy-color-base-12)", 40, "var(--dixy-color-base-6)")}; }
  ${S(thumbs, "[data-checked]")}::after { background:${ACCENT}; box-shadow:0 0 6px 1px ${ACCENT}; }
  ${S(checks)}::before { border-radius:2px; }
  ${S(choices, "[data-checked]")}::before { box-shadow:0 0 8px ${mix(ACCENT, 70)}; }
  ${sliderFace(S, "", `border-radius:2px; inline-size:calc(var(--dixy-slider-thumb-size) * .55); block-size:calc(var(--dixy-slider-thumb-size) * 1.25); background-image:repeating-linear-gradient(0deg,transparent 0 2px,#0004 2px 3px),var(--dixy-skin-thumb);`)}
  ${S(trackParts)} { border-radius:2px; background-color:${mix("var(--dixy-color-base-12)", 90, ACCENT)}; }
  ${S(fillParts)} { border-radius:1px; box-shadow:0 0 8px ${mix(ACCENT, 80)}; -webkit-mask:repeating-linear-gradient(90deg,#000 0 4px,transparent 4px 6px); mask:repeating-linear-gradient(90deg,#000 0 4px,transparent 4px 6px); }`;
    case "hardware":
      return `
  ${S(".dixy-switch-root")}::before { border-radius:7px; box-shadow:inset 0 2px 4px #0003; }
  ${S(thumbs)} { border-radius:5px; background-image:repeating-linear-gradient(90deg,transparent 0 2px,#0002 2px 3px),var(--dixy-skin-thumb); }
  ${S(checks)}::before { border-radius:4px; box-shadow:inset 0 1px 2px #0003; }
  ${S(choices, "[data-checked]")}::before { box-shadow:inset 0 2px 3px #0004; }
  ${sliderFace(S, "", `border-width:2px; background-image:linear-gradient(90deg,transparent 46%,${EDGE} 46% 54%,transparent 54%),repeating-conic-gradient(from 0deg,transparent 0 7deg,#0002 7deg 14deg),radial-gradient(circle at 35% 30%,#fff 0 18%,#d9d9d4 60%,#a9aaa5);`)}
  ${S(trackParts)} { border-radius:3px; box-shadow:inset 0 2px 3px #0003; }`;
    case "glass":
      return `
  ${S(thumbs)} { background-color:${mix("#fff", 62)}; box-shadow:inset 0 1px 0 #fff,0 4px 14px ${mix(ACCENT, 35)}; }
  ${S(".dixy-switch-root", "[data-checked]")}::before { box-shadow:0 0 0 4px ${mix(ACCENT, 16)}; }
  ${S(choices, "[data-checked]")}::before { box-shadow:0 0 0 4px ${mix(ACCENT, 16)},inset 0 1px 0 #fff8; }
  ${sliderFace(S, "", `background-color:${mix("#fff", 70)}; box-shadow:inset 0 1px 0 #fff,0 0 0 4px ${mix(ACCENT, 18)},0 6px 16px ${mix(ACCENT, 30)};`)}
  ${S(fillParts)} { background-image:linear-gradient(90deg,${mix(ACCENT, 55, "#fff")},${ACCENT}); box-shadow:0 0 12px ${mix(ACCENT, 45)}; }
  ${S(trackParts)} { border-radius:999px; background-color:${mix("#fff", 35)}; }`;
    case "stitched":
      return `
  ${S(".dixy-switch-root")}::before { outline:1px dashed ${mix(EDGE, 70)}; outline-offset:-4px; }
  ${S(checks)}::before { outline:1px dashed ${mix(EDGE, 70)}; outline-offset:-4px; border-radius:3px; }
  ${S(choices, "[data-checked]")}::before { outline-color:${mix("#fff", 75)}; }
  ${sliderFace(S, "", `outline:1px dashed ${mix("#fff", 80)}; outline-offset:-4px;`)}
  ${S(trackParts)} { border-style:dashed; }
  ${S(fieldParts)} { border-style:dashed; }`;
    case "pearl": {
      const pearl = `radial-gradient(circle at 32% 28%,#fff 0 14%,${mix(ACCENT, 18, "#fff")} 42%,${mix(ACCENT, 45, "#f4efe6")} 100%)`;
      return `
  ${S(thumbs)} { border-radius:999px; background-image:${pearl}; box-shadow:0 3px 8px ${mix(ACCENT, 30)},inset 0 -2px 3px ${mix(ACCENT, 25)}; }
  ${S(".dixy-switch-root")}::before { border-radius:999px; }
  ${S(radios, "[data-checked]")}::before { background-image:${pearl}; }
  ${sliderFace(S, "", `background-image:${pearl}; box-shadow:0 3px 10px ${mix(ACCENT, 35)};`)}
  ${S(trackParts)} { border-radius:999px; }
  ${S(fillParts)} { background-image:linear-gradient(90deg,${mix(ACCENT, 60, "#bfe9e4")},${ACCENT},${mix(ACCENT, 60, "#f2d7e8")}); }`;
    }
    case "clay":
      return `
  ${S(thumbs)} { border-radius:999px; transition:transform var(--dixy-switch-motion-thumb),scale var(--dixy-motion-duration-fast) var(--dixy-motion-easing-spatial,var(--dixy-motion-easing-standard)); }
  ${S(".dixy-switch-root")}::before { border-radius:999px; }
  ${S(".dixy-switch-root", ":active:not([data-disabled])")} .dixy-switch-thumb { scale:1 calc(1 - .18 * ${SF}); }
  ${S(checks)}::before { border-radius:42%; }
  ${S(choices, ":active:not([data-disabled])")}::before { scale:calc(1 + .1 * ${SF}) calc(1 - .1 * ${SF}); }
  ${S(sliderThumb, ":active")}::before { scale:calc(1 + .18 * ${SF}) calc(1 - .16 * ${SF}); }
  ${S(".dixy-button", ":active:not([data-disabled])")} { scale:calc(1 + .04 * ${SF}) calc(1 - .07 * ${SF}); }
  ${S(".dixy-button")} { transition:background-color var(--dixy-button-motion-feedback),color var(--dixy-button-motion-feedback),border-color var(--dixy-button-motion-feedback),transform var(--dixy-button-motion-feedback-duration) var(--dixy-motion-easing-spatial,var(--dixy-motion-easing-standard)),scale var(--dixy-motion-duration-fast) var(--dixy-motion-easing-spatial,var(--dixy-motion-easing-standard)); }
  ${S(trackParts)} { border-radius:999px; }`;
    case "brass": {
      // Switch thumbs travel with `transform`, which CSS applies after `rotate`/`scale`;
      // a rotated or x-scaled thumb would slide diagonally or overshoot, so shape it with clip-path.
      const brass = "linear-gradient(135deg,#f6e3a1,#c79b48 48%,#7c5b22)";
      return `
  ${S(checks)}::before { transform:rotate(45deg) scale(.76); border-radius:1px; border-width:1.5px; }
  ${S(radios)}::before { box-shadow:0 0 0 2px var(--dixy-color-background-surface),0 0 0 3px ${EDGE}; }
  ${S(".dixy-switch-root")}::before { border-radius:2px; }
  ${S(thumbs)} { clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%); border-radius:0; background-image:${brass}; }
  ${sliderFace(S, "rotate(45deg) scale(.8)", `border-radius:1px; background-image:${brass};`)}
  ${S(trackParts)} { border-radius:0; box-shadow:0 0 0 1px ${EDGE},inset 0 1px 2px #0004; }
  ${S(fillParts)} { background-image:${brass}; }`;
    }
    case "chrome": {
      const chamfer =
        "polygon(4px 0,calc(100% - 4px) 0,100% 4px,100% calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,0 calc(100% - 4px),0 4px)";
      const brushed =
        "repeating-linear-gradient(90deg,#fff3 0 1px,#0001 1px 2px),linear-gradient(180deg,#f4f7f9,#aab6bd)";
      return `
  ${S(".dixy-switch-root")}::before { border-radius:0; clip-path:${chamfer}; }
  ${S(thumbs)} { border-radius:0; clip-path:${chamfer}; background-image:${brushed}; }
  ${S(checks)}::before { border-radius:0; clip-path:${chamfer}; }
  ${sliderFace(S, "", `border-radius:0; clip-path:${chamfer}; background-image:${brushed};`)}
  ${S(fillParts)} { background-image:linear-gradient(90deg,${ACCENT},${mix(ACCENT, 45, "#c8fbff")}); box-shadow:0 0 10px ${mix(ACCENT, 70)}; }
  ${S(trackParts)} { border-radius:2px; }`;
    }
    case "halo":
      return `
  ${S(".dixy-switch-root")}::before { border-radius:999px; }
  ${S(".dixy-switch-root", "[data-checked]")}::before { border-color:transparent; }
  ${S(thumbs)} { border-radius:999px; box-shadow:0 1px 3px #0002,0 2px 8px #0001; }
  ${S(thumbs, "[data-checked]")} { box-shadow:0 0 0 4px ${mix(ACCENT, 16)},0 2px 6px #0002; }
  ${S(checks)}::before { border-radius:6px; }
  ${S(choices, ":hover:not([data-disabled])")}::before { box-shadow:0 0 0 6px ${mix(ACCENT, 12)}; }
  ${sliderFace(S, "", `box-shadow:0 0 0 5px ${mix(ACCENT, 14)},0 2px 6px #0002;`)}
  ${S(trackParts)} { border-radius:999px; }`;
  }
}

const durations = { fast: 120, normal: 200, deliberate: 280, slow: 400 };
/**
 * `easing` drives every feedback transition, including colours, so it must
 * never overshoot: an overshooting curve extrapolates colours past their
 * target (a hover tint briefly flashes white). Bouncy curves belong in
 * `spatial`, which only reaches transform/scale/indicator motion.
 */
const motionRecipes: Record<
  MotionStyle,
  { easing?: string; enter?: string; spatial?: string; scale: number }
> = {
  standard: { scale: 1 },
  snappy: { easing: "cubic-bezier(0.2,0,0,1)", scale: 0.7 },
  stepped: { easing: "steps(3,end)", enter: "steps(4,end)", scale: 1.2 },
  springy: {
    easing: "cubic-bezier(0.22,1,0.36,1)",
    spatial: "linear(0,0.22 8%,0.72 22%,1.06 38%,1.12 48%,1.03 64%,0.99 78%,1)",
    scale: 1.4,
  },
  weighted: { easing: "cubic-bezier(0.5,0,0.1,1)", scale: 1.3 },
  drift: { easing: "cubic-bezier(0.25,0.1,0.25,1)", scale: 1.7 },
};

/** Component easing tokens whose transitions move things but never paint colour. */
const spatialEasingTokens = [
  "--dixy-switch-motion-thumb-easing",
  "--dixy-checkbox-motion-indicator-easing",
  "--dixy-radio-motion-indicator-easing",
  "--dixy-tabs-motion-indicator-easing",
];

/** Durations only grow when motion is allowed, so reduced-motion scopes still resolve to 0ms. */
function motionCSS(c: ThemeCharacter, theme: string): string {
  const recipe = motionRecipes[c.motion.style];
  const k = recipe.scale * c.motion.tempo;
  // Movement-only tokens may take the bouncy curve; colour-carrying ones may not.
  const spatial = recipe.spatial
    ? `--dixy-motion-easing-spatial:${recipe.spatial}; ${spatialEasingTokens
        .map((token) => `${token}:${recipe.spatial};`)
        .join(" ")}`
    : "";
  const easing = recipe.easing
    ? `--dixy-motion-easing-standard:${recipe.easing}; --dixy-motion-easing-enter:${recipe.enter ?? recipe.spatial ?? recipe.easing}; ${spatial}`
    : "";
  const timing =
    k === 1
      ? ""
      : `@media (prefers-reduced-motion:no-preference) { ${theme}:not([data-motion="reduced"]) { ${Object.entries(
          durations,
        )
          .map(
            ([name, ms]) =>
              `--dixy-motion-duration-${name}:${Math.round(ms * k)}ms;`,
          )
          .join(" ")} } }`;
  const press =
    c.motion.press === 1
      ? ""
      : `--dixy-personality-press-distance:${c.motion.press}px;`;
  return `${easing || press ? `${theme} { ${easing} ${press} }` : ""}\n  ${timing}`;
}

const headingRoles = Object.keys(typography).filter(
  (role) =>
    role.startsWith("display.") ||
    role.startsWith("heading.") ||
    role.startsWith("title."),
);
function typeVariables(c: ThemeCharacter): string {
  const t = c.type;
  if (
    t.headingWeight === defaultCharacter.type.headingWeight &&
    t.headingTracking === 0
  )
    return "";
  return headingRoles
    .map((role) => {
      const key = role.replaceAll(".", "-");
      return `--dixy-font-${key}-weight:${t.headingWeight}; ${
        t.headingTracking
          ? `--dixy-font-${key}-letter-spacing:${t.headingTracking}em;`
          : ""
      }`;
    })
    .join(" ");
}
function typeCSS(c: ThemeCharacter, theme: string): string {
  const t = c.type;
  const rules: string[] = [];
  if (t.headingCase === "uppercase")
    rules.push(
      `${theme} :is(h1,h2,h3,.dixy-heading) { text-transform:uppercase; }`,
    );
  if (t.headingCase === "small-caps")
    rules.push(
      `${theme} :is(h1,h2,h3,.dixy-heading) { font-variant-caps:all-small-caps; }`,
    );
  if (t.headingTracking)
    rules.push(
      `${theme} :is(h1,h2,h3,.dixy-heading) { letter-spacing:${t.headingTracking}em; }`,
    );
  if (t.headingWeight !== defaultCharacter.type.headingWeight)
    rules.push(
      `${theme} :is(h1,h2,h3,.dixy-heading) { font-weight:${t.headingWeight}; }`,
    );
  if (t.numerals !== "proportional")
    rules.push(
      `${theme} { font-variant-numeric:${t.numerals === "tabular" ? "tabular-nums" : "oldstyle-nums"}; }`,
    );
  return rules.join("\n  ");
}

const DANGER = "var(--dixy-color-border-danger)";
const invalid = ':is([data-invalid],[aria-invalid="true"])';
function stateCSS(style: StateStyle, S: Scope, theme: string): string {
  const busy = '[aria-busy="true"]';
  const tab = ".dixy-tabs-indicator";
  const animate = (rule: string) =>
    `@media (prefers-reduced-motion:no-preference) { ${theme}:not([data-motion="reduced"]):not([data-effects="reduced"]) ${rule} }`;
  switch (style) {
    case "standard":
      return "";
    case "led":
      return `
  ${S(tab)} { box-shadow:0 0 10px ${mix(ACCENT, 55)},inset 0 0 0 1px ${mix(ACCENT, 60)}; }
  ${S(fieldParts, invalid)} { box-shadow:0 0 0 3px ${mix(DANGER, 25)},0 0 10px ${mix(DANGER, 35)}; }
  ${S(".dixy-button", busy)} { box-shadow:0 0 12px ${mix(ACCENT, 60)}; }`;
    case "marching":
      return `
  ${S(tab)} { border-style:dashed; }
  ${S(fieldParts, invalid)} { border-style:dashed; border-color:${DANGER}; }
  ${S(".dixy-button", busy)} { background-image:repeating-linear-gradient(-45deg,#fff3 0 6px,transparent 6px 12px); background-size:17px 17px; }
  ${animate(`.dixy-button${busy}[data-dixy-skin] { animation:dixy-character-march 600ms linear infinite; }`)}
  @keyframes dixy-character-march { to { background-position:17px 0; } }`;
    case "inlay":
      return `
  ${S(tab)} { box-shadow:inset 0 0 0 1px ${EDGE},inset 0 0 0 3px var(--dixy-color-background-surface),inset 0 0 0 4px ${EDGE}; }
  ${S(fieldParts, invalid)} { border-style:double; border-width:3px; border-color:${DANGER}; }`;
    case "glow":
      return `
  ${S(tab)} { box-shadow:0 4px 18px ${mix(ACCENT, 30)}; }
  ${S(fieldParts, invalid)} { box-shadow:0 0 0 4px ${mix(DANGER, 18)}; }
  ${S(".dixy-button", busy)} { box-shadow:0 0 0 4px ${mix(ACCENT, 20)}; }`;
    case "stamp":
      return `
  ${S(tab)} { border:2px solid ${EDGE}; }
  ${S(fieldParts, invalid)} { background-image:repeating-linear-gradient(-45deg,${mix(DANGER, 14)} 0 4px,transparent 4px 9px); border-color:${DANGER}; }
  ${S(".dixy-button", busy)} { background-image:repeating-linear-gradient(-45deg,#0002 0 4px,transparent 4px 9px); }`;
  }
}

function detailCSS(c: ThemeCharacter, S: Scope, theme: string): string {
  const d = c.details;
  const rules: string[] = [];
  // Raised specificity so the skin's focus treatment wins over component defaults; width never drops below 2px.
  const focus = `${theme} [data-dixy-skin]:focus-visible, ${theme} [data-dixy-skin] :focus-visible`;
  if (d.focus === "double")
    rules.push(
      `${focus} { outline-style:double; outline-width:4px; outline-offset:2px; }`,
    );
  if (d.focus === "dashed")
    rules.push(
      `${focus} { outline-style:dashed; outline-width:2px; outline-offset:3px; }`,
    );
  if (d.focus === "glow")
    rules.push(
      `${focus} { outline-width:2px; outline-offset:2px; box-shadow:0 0 0 6px ${mix("var(--dixy-color-border-focus)", 28)}; }`,
    );
  if (d.focus === "offset")
    rules.push(`${focus} { outline-width:2px; outline-offset:5px; }`);
  // High-contrast: a solid 3px ring plus a yellow halo outside it, visible on any surface.
  // Skin and material rules set box-shadow at higher specificity (fields at 0,5,0), so the
  // halo is important: a focus indicator has to win over decoration.
  if (d.focus === "halo")
    rules.push(
      `${focus} { --dixy-focus-halo:0 0 0 8px var(--dixy-color-yellow-9); outline-style:solid; outline-width:3px; outline-offset:2px; box-shadow:var(--dixy-focus-halo) !important; }`,
    );
  const lines = {
    dashed: (a: string) =>
      `repeating-linear-gradient(${a},${EDGE} 0 6px,transparent 6px 10px)`,
    dotted: (a: string) =>
      `repeating-linear-gradient(${a},${EDGE} 0 2px,transparent 2px 5px)`,
    double: (a: string) =>
      `linear-gradient(${a === "90deg" ? "180deg" : "90deg"},${EDGE} 0 1px,transparent 1px calc(100% - 1px),${EDGE} calc(100% - 1px))`,
    groove: (a: string) =>
      `linear-gradient(${a === "90deg" ? "180deg" : "90deg"},${mix(EDGE, 80)} 0 50%,${mix("#fff", 60)} 50%)`,
  } as const;
  if (d.divider !== "line") {
    const thick =
      d.divider === "double" ? "4px" : d.divider === "groove" ? "2px" : "";
    rules.push(
      `${S(".dixy-separator", ':not([aria-orientation="vertical"])')} { background:${lines[d.divider]("90deg")}; ${thick ? `block-size:${thick};` : ""} }`,
      `${S(".dixy-separator", '[aria-orientation="vertical"]')} { background:${lines[d.divider]("180deg")}; ${thick ? `inline-size:${thick};` : ""} }`,
    );
  }
  if (d.selection === "inverse")
    rules.push(
      `${theme} ::selection { background:var(--dixy-color-base-12); color:var(--dixy-color-base-1); }`,
    );
  if (d.selection === "highlighter")
    rules.push(
      `${theme} ::selection { background:${mix(ACCENT, 30, "#ffe96b")}; color:var(--dixy-color-base-12); }`,
    );
  if (d.scrollbar === "thin")
    rules.push(
      `${theme} { scrollbar-width:thin; scrollbar-color:${EDGE} transparent; }`,
    );
  if (d.scrollbar === "accent")
    rules.push(`${theme} { scrollbar-color:${ACCENT} ${mix(ACCENT, 12)}; }`);
  if (d.iconStroke !== 2)
    rules.push(
      `${theme} svg[stroke="currentColor"]:not(.dixy-skin-ornament svg) { stroke-width:${d.iconStroke}; }`,
    );
  return rules.join("\n  ");
}

/** Gradient-only patterns: no image requests, and removed by reduced effects/contrast/transparency preferences. */
function backdropImage(pattern: BackdropPattern, s: number): string {
  const ink = "var(--dixy-skin-pattern-ink)";
  const px = (n: number) => `${Math.round(n * s * 10) / 10}px`;
  switch (pattern) {
    case "none":
      return "";
    case "grid":
      return `background-image:linear-gradient(${ink} 1px,transparent 1px),linear-gradient(90deg,${ink} 1px,transparent 1px); background-size:${px(28)} ${px(28)};`;
    case "scanlines":
      return `background-image:repeating-linear-gradient(0deg,${ink} 0 1px,transparent 1px ${px(4)});`;
    case "sunburst":
      return `background-image:repeating-conic-gradient(from 0deg at 50% 0%,${ink} 0 3deg,transparent 3deg ${Math.round(12 * s)}deg); -webkit-mask:radial-gradient(ellipse at 50% 0%,#000,transparent 75%); mask:radial-gradient(ellipse at 50% 0%,#000,transparent 75%);`;
    case "caustics":
      return `background-image:radial-gradient(ellipse 30% 18% at 20% 30%,${ink},transparent 70%),radial-gradient(ellipse 22% 30% at 70% 20%,${ink},transparent 70%),radial-gradient(ellipse 34% 20% at 55% 75%,${ink},transparent 70%),radial-gradient(ellipse 18% 26% at 15% 80%,${ink},transparent 70%); background-size:${px(520)} ${px(420)};`;
    case "fibre":
      return `background-image:repeating-linear-gradient(35deg,${ink} 0 1px,transparent 1px ${px(7)}),repeating-linear-gradient(-55deg,${ink} 0 1px,transparent 1px ${px(11)});`;
    case "dots":
      return `background-image:radial-gradient(${ink} 1.2px,transparent 1.7px); background-size:${px(20)} ${px(20)};`;
    case "topo":
      return `background-image:repeating-radial-gradient(circle at 28% 36%,transparent 0 ${px(14)},${ink} ${px(14)} ${px(15)}),repeating-radial-gradient(circle at 78% 72%,transparent 0 ${px(18)},${ink} ${px(18)} ${px(19)});`;
    case "halftone":
      return `background-image:radial-gradient(${ink} 32%,transparent 34%); background-size:${px(10)} ${px(10)}; -webkit-mask:linear-gradient(160deg,#000,transparent 70%); mask:linear-gradient(160deg,#000,transparent 70%);`;
  }
}
function backdropCSS(c: ThemeCharacter, theme: string): string {
  const image = backdropImage(c.backdrop.pattern, c.backdrop.scale);
  if (!image) return "";
  return `
  ${theme}:not(.dixy-portal-scope)::before { content:""; position:absolute; inset:0; z-index:-1; pointer-events:none; border-radius:inherit; opacity:${c.backdrop.intensity}; --dixy-skin-pattern-ink:${mix(EDGE, 40)}; ${image} }
  ${theme}[data-effects="reduced"]::before { display:none; }
  @media (prefers-reduced-transparency:reduce),(prefers-contrast:more),(forced-colors:active) { ${theme}::before { display:none; } }`;
}

/** An explicit Square radius beats a control language's own corner shapes. */
function squareCSS(style: ControlStyle, theme: string): string {
  if (style === "standard") return "";
  const square = `${theme}[data-radius="none"]`;
  return `${square} :is(.dixy-switch-thumb,${trackParts},${fillParts})[data-dixy-skin], ${square} :is(.dixy-switch-root,${checks},${sliderThumb})[data-dixy-skin]::before { border-radius:0; }`;
}

/** Variables for the tokens layer (inherited by every part). */
export function characterTokenCSS(c: ThemeCharacter): string {
  return typeVariables(c);
}

/** Rules for the components layer, all scoped to the skin's own parts. */
export function characterComponentCSS(
  c: ThemeCharacter,
  theme: string,
  S: Scope,
): string {
  return [
    controlCSS(c.controls, S),
    squareCSS(c.controls, theme),
    motionCSS(c, theme),
    typeCSS(c, theme),
    stateCSS(c.states, S, theme),
    detailCSS(c, S, theme),
    backdropCSS(c, theme),
    chromeCSS(c.chrome, theme, S),
  ]
    .filter((part) => part.trim())
    .join("\n  ");
}
