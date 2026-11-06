"use client";
import { paintHud } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function HudOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament {...props} kind="hud" skin="hud" painter={paintHud} />
  );
}
export default HudOrnament;
