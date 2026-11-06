"use client";
import { paintRiso } from "../organic-paint-world.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function RisoOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament {...props} kind="riso" skin="riso" painter={paintRiso} />
  );
}
export default RisoOrnament;
