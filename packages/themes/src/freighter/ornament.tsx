"use client";
import { paintHazard } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function FreighterOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="hazard"
      skin="freighter"
      painter={paintHazard}
    />
  );
}
export default FreighterOrnament;
