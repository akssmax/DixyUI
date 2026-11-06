"use client";
import { paintNeon } from "../organic-paint-world.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function NeonOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament {...props} kind="neon" skin="neon" painter={paintNeon} />
  );
}
export default NeonOrnament;
