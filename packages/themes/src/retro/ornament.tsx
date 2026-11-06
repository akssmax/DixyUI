"use client";

import { OrnamentLayer, type OrnamentProps } from "../ornament-parts.js";
export type RetroOrnamentProps = OrnamentProps;

/** A pixel bevel on the existing frame, without simulated window actions. */
export function RetroOrnament(props: RetroOrnamentProps) {
  if (props.part !== "card" && props.part !== "dialog") return null;
  return (
    <OrnamentLayer {...props} skin="retro">
      <span className="dixy-retro-inlay dixy-skin-motion" />
    </OrnamentLayer>
  );
}
export default RetroOrnament;
