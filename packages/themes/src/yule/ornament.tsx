"use client";
import { paintKnit } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function YuleOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="knit"
      skin="yule"
      painter={paintKnit}
    />
  );
}
export default YuleOrnament;
