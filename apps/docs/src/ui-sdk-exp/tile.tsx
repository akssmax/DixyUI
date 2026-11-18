import type { ReactNode } from "react";
import { Theme } from "@dixy-ui/react";
import type { AccentColor, Material } from "@dixy-ui/tokens";

/**
 * One experiment: a fixed-palette stage (its own Theme, so Dixy parts and
 * popups match it) and a caption naming which library does what.
 */
export function Tile({
  id,
  title,
  dixy,
  sdk,
  appearance,
  accent,
  material = "matte",
  children,
}: {
  id: string;
  title: string;
  dixy: string;
  sdk?: string;
  appearance: "light" | "dark";
  accent: AccentColor;
  material?: Material;
  children: ReactNode;
}) {
  return (
    <figure className="exp-tile" aria-labelledby={`${id}-title`}>
      <Theme
        appearance={appearance}
        accentColor={accent}
        material={material}
        radius="none"
        className={`exp-stage exp-stage-${id}`}
      >
        {children}
      </Theme>
      <figcaption className="exp-caption">
        <span id={`${id}-title`} className="exp-caption-title">
          {title}
        </span>
        <span className="exp-caption-libs">
          <span>
            <b>Dixy</b> {dixy}
          </span>
          {sdk && (
            <span>
              <b>UI SDK</b> {sdk}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
