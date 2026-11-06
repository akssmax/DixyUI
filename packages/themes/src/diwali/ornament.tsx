"use client";
import { paintRangoli } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function DiwaliOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="rangoli"
      skin="diwali"
      painter={paintRangoli}
    />
  );
}
export default DiwaliOrnament;
