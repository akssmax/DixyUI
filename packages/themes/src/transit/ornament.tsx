"use client";
import { paintTransit } from "../organic-paint-world.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function TransitOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="transit"
      skin="transit"
      painter={paintTransit}
    />
  );
}
export default TransitOrnament;
