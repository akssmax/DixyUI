"use client";
import { paintPhosphor } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function PhosphorOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="crt"
      skin="phosphor"
      painter={paintPhosphor}
    />
  );
}
export default PhosphorOrnament;
