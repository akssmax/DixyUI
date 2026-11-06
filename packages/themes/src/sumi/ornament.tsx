"use client";
import { paintSumi } from "../organic-paint-world.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function SumiOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament {...props} kind="sumi" skin="sumi" painter={paintSumi} />
  );
}
export default SumiOrnament;
