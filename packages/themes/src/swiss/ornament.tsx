"use client";
import { paintSwiss } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function SwissOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="swiss"
      skin="swiss"
      painter={paintSwiss}
    />
  );
}
export default SwissOrnament;
