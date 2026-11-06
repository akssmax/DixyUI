"use client";
import { paintClay } from "../organic-paint.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function ClayOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="cushion"
      skin="clay"
      painter={paintClay}
    />
  );
}
export default ClayOrnament;
