"use client";
import { paintBrass } from "../organic-paint.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function DecoOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament {...props} kind="deco" skin="deco" painter={paintBrass} />
  );
}
export default DecoOrnament;
