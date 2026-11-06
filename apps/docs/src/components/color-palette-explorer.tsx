import { Button } from "@dixy-ui/react";
import { useState } from "react";
import { Theme, type ThemeProps } from "@dixy-ui/react";
import {
  neutralColorFamilies,
  accentColorFamilies,
  overlayFamilies,
  colorSteps,
  colorPalettes,
  color,
  overlayColor,
  overlayAlpha,
  toOklch,
  toOverlayColor,
  type ColorAppearance,
  type ColorFamily,
  type NeutralColor,
  type OverlayFamily,
  type ColorStep,
} from "@dixy-ui/tokens";
type PaletteKind = "neutrals" | "colors" | "overlays";
export function ColorPaletteExplorer({
  appearance,
  accent,
  neutral,
  radius,
  density,
  motion,
  dir,
}: {
  appearance: ColorAppearance;
  accent: ColorFamily;
  neutral: NeutralColor;
} & Pick<ThemeProps, "radius" | "density" | "motion" | "dir">) {
  const [kind, setKind] = useState<PaletteKind>("neutrals");
  const [family, setFamily] = useState<ColorFamily | OverlayFamily>("neutral");
  const [step, setStep] = useState<ColorStep>(9);
  const families =
    kind === "neutrals"
      ? neutralColorFamilies
      : kind === "colors"
        ? accentColorFamilies
        : overlayFamilies;
  const chooseKind = (value: PaletteKind) => {
    setKind(value);
    setFamily(
      value === "neutrals" ? neutral : value === "colors" ? "blue" : "black",
    );
  };
  const selectedValue =
    kind === "overlays"
      ? toOverlayColor(family as OverlayFamily, step)
      : toOklch(colorPalettes[family as ColorFamily][appearance][step]);
  return (
    <>
      <Theme
        appearance={appearance}
        accentColor={accent}
        neutralColor={neutral}
        radius={radius}
        density={density}
        motion={motion}
        dir={dir}
        className="color-palette-board"
      >
        <div
          className="color-palette-tabs"
          role="group"
          aria-label="Palette category"
        >
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            type="button"
            aria-pressed={kind === "neutrals"}
            onClick={() => chooseKind("neutrals")}
          >
            Neutrals <span>{neutralColorFamilies.length}</span>
          </Button>
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            type="button"
            aria-pressed={kind === "colors"}
            onClick={() => chooseKind("colors")}
          >
            Colors <span>{accentColorFamilies.length}</span>
          </Button>
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            type="button"
            aria-pressed={kind === "overlays"}
            onClick={() => chooseKind("overlays")}
          >
            Black &amp; white overlays
          </Button>
        </div>
        <div
          className="color-family-choices"
          role="group"
          aria-label="Palette family"
        >
          {families.map((value) => {
            const ramp =
              kind === "overlays"
                ? `linear-gradient(90deg, ${overlayColor(value as OverlayFamily, 1)}, ${overlayColor(value as OverlayFamily, 12)}), linear-gradient(90deg, var(--dixy-color-purple-9), var(--dixy-color-blue-9))`
                : `linear-gradient(90deg, ${color(value as ColorFamily, 2)}, ${color(value as ColorFamily, 8)}, ${color(value as ColorFamily, 12)})`;
            return (
              <Button
                variant="ghost"
                color="neutral"
                size="sm"
                type="button"
                key={value}
                aria-label={`Show ${value} palette`}
                aria-pressed={family === value}
                onClick={() => setFamily(value)}
              >
                <span
                  className="color-family-gradient"
                  style={{ background: ramp }}
                  aria-hidden="true"
                />
                <strong>{value}</strong>
              </Button>
            );
          })}
        </div>
        <div className="color-palette-row color-active-ramp">
          <strong>
            {family}{" "}
            <span>
              {kind === "overlays"
                ? "alpha overlay"
                : `${appearance} · 12 stops`}
            </span>
          </strong>
          <div className="color-ramp">
            {colorSteps.map((value) => (
              <Button
                variant="ghost"
                color="neutral"
                size="sm"
                type="button"
                key={value}
                className="color-stop"
                aria-label={`${family} ${kind === "overlays" ? "alpha " : ""}${value}`}
                aria-pressed={value === step}
                onClick={() => setStep(value)}
              >
                <span
                  className={kind === "overlays" ? "color-overlay-checker" : ""}
                  style={
                    kind === "overlays"
                      ? undefined
                      : { background: color(family as ColorFamily, value) }
                  }
                >
                  {kind === "overlays" && (
                    <i
                      style={{
                        background: overlayColor(
                          family as OverlayFamily,
                          value,
                        ),
                      }}
                    />
                  )}
                </span>
                <code>{value}</code>
              </Button>
            ))}
          </div>
        </div>
        {kind === "overlays" ? (
          <p className="color-step-legend">
            5% → 95% opacity. The colored base stays visible beneath each
            overlay.
          </p>
        ) : (
          <div className="color-step-legend">
            <span>1–2 · surfaces</span>
            <span>3–5 · subtle fills</span>
            <span>6–8 · borders</span>
            <span>9–10 · solid fills</span>
            <span>11–12 · text</span>
          </div>
        )}
      </Theme>
      <div className="color-inspector" role="status">
        <code>
          --dixy-color-{family}-{kind === "overlays" ? "a" : ""}
          {step}
        </code>
        <code>{selectedValue}</code>
        <span>
          {kind === "overlays"
            ? `${Math.round(overlayAlpha[step] * 100)}% opacity · surface dependent`
            : `${appearance} palette`}
        </span>
      </div>
    </>
  );
}
