import {
  font,
  space,
  spacing,
  motionLoops,
  type Density,
  type SpaceToken,
} from "@dixy-ui/tokens";
import "@dixy-ui/tokens/spacing.css";
import "@dixy-ui/tokens/typography.css";

const density: Density = "compact";
const token: SpaceToken = "200";
const sample = document.querySelector<HTMLElement>("#sample")!;
sample.style.paddingInline = space(token);
sample.style.paddingBlock = spacing("inset", "md");
sample.dataset.dixyDensity = density;
sample.dataset.progressCadence = String(motionLoops.progress);
// @ts-expect-error Negative spacing is outside the public contract.
space("-200");
// @ts-expect-error Numeric primitives and semantic sizes are distinct.
space("md");
// @ts-expect-error Section spacing has no xs step.
spacing("section", "xs");

sample.style.font = font("body.md");
// @ts-expect-error A raw size is not a semantic typography role.
font("16");

import {
  size,
  container,
  minWidth,
  layoutGutter,
  type ContainerSize,
  type ControlSize,
} from "@dixy-ui/tokens";
import "@dixy-ui/tokens/sizing.css";
import "@dixy-ui/tokens/layout.css";
const controlSize: ControlSize = "md";
const containerSize: ContainerSize = "lg";
sample.style.minBlockSize = size("control", controlSize);
sample.style.maxInlineSize = container(containerSize);
sample.style.paddingInline = layoutGutter;
sample.dataset.mediaQuery = minWidth("lg");
// @ts-expect-error Control sizes do not include icon xs.
size("control", "xs");
// @ts-expect-error Containers are finite contracts, not arbitrary pixels.
container("900");
// @ts-expect-error Breakpoints are typed identifiers.
minWidth("tablet");

import {
  color,
  semanticColor,
  createColorPalette,
  colorThemeVariables,
} from "@dixy-ui/tokens";
import "@dixy-ui/tokens/color.css";
sample.dataset.appearance = "dark";
sample.dataset.accent = "amber";
sample.dataset.neutral = "stone";
sample.style.background = semanticColor("background.canvas");
sample.style.color = semanticColor("text.primary");
const customPalette = createColorPalette([0.54, 0.18, 260]);
for (const [name, value] of Object.entries(
  colorThemeVariables(customPalette, "dark"),
))
  sample.style.setProperty(name, value);
color("purple", 12);
// @ts-expect-error Palettes have 12 stops, not 13.
color("blue", 13);
// @ts-expect-error Semantic roles have a finite typed vocabulary.
semanticColor("text.whatever");

import {
  radius,
  surfaceRadius,
  border,
  borderWidth,
  shadow,
  type RadiusPreset,
} from "@dixy-ui/tokens";
import "@dixy-ui/tokens/radius.css";
import "@dixy-ui/tokens/border.css";
import "@dixy-ui/tokens/shadow.css";
const preset: RadiusPreset = "full";
sample.dataset.radius = preset;
sample.style.border = border("strong");
sample.style.borderRadius = surfaceRadius("card");
sample.style.boxShadow = shadow("raised");
void radius("12");
void borderWidth("1");
// @ts-expect-error Semantic names are distinct from numeric radius primitives.
radius("md");
// @ts-expect-error Borders have a finite width contract.
borderWidth("3");
// @ts-expect-error Shadow roles do not expose arbitrary elevation numbers.
shadow("5");

import { overlayColor } from "@dixy-ui/tokens";
overlayColor("white", 12);
// @ts-expect-error Overlays only have black/white families.
overlayColor("gray", 9);

import {
  motionDuration,
  motionEasing,
  motionTransition,
  springTransition,
  tweenTransition,
} from "@dixy-ui/tokens";
import "@dixy-ui/tokens/motion.css";
sample.style.transition = `opacity ${motionTransition("enter")}`;
sample.dataset.motion = "reduced";
void motionDuration("normal");
void motionEasing("exit");
void springTransition("expressive", "spatial", "fast", true);
void tweenTransition("feedback", true);
// @ts-expect-error Motion speeds use semantic names.
springTransition("standard", "spatial", "120");
// @ts-expect-error Transition roles are finite.
motionTransition("anything");

import { materialImage, shapeRadius } from "@dixy-ui/tokens";
import "@dixy-ui/tokens/materials.css";
import "@dixy-ui/tokens/shapes.css";
void materialImage("metal");
void shapeRadius("control");
// @ts-expect-error Material identifiers are finite.
materialImage("chrome");
