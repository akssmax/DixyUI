"use client";
import { paintSunset } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function SunsetOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="sunset"
      skin="sunset"
      painter={paintSunset}
    />
  );
}
export default SunsetOrnament;
