"use client";
import { paintOrbit } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function SailOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="orbit"
      skin="sail"
      painter={paintOrbit}
    />
  );
}
export default SailOrnament;
