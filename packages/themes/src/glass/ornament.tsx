"use client";
import { paintLiquid } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function GlassOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="liquid"
      skin="glass"
      painter={paintLiquid}
    />
  );
}
export default GlassOrnament;
