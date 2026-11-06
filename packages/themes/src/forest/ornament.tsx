"use client";
import { paintForest } from "../organic-paint.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function ForestOrnament(props: OrnamentProps) {
  if (
    props.part === "switch-thumb" &&
    props.ornament !== "quiet" &&
    props.effects !== "reduced"
  )
    return (
      <span
        aria-hidden="true"
        className="dixy-skin-ornament dixy-forest-ornament dixy-forest-ornament-switch-thumb"
      >
        <svg className="dixy-forest-control-leaf" viewBox="0 0 20 24">
          <path
            d="M3 22C-3 5 12 0 18 1C21 13 12 24 3 22Z"
            fill="currentColor"
          />
          <path d="M3 22L15 5" fill="none" stroke="#cfdfa0" strokeWidth=".8" />
        </svg>
      </span>
    );
  return (
    <OrganicOrnament
      {...props}
      kind="forest"
      skin="forest"
      painter={paintForest}
    />
  );
}
export default ForestOrnament;
