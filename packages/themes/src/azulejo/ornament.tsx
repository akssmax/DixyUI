"use client";
import { paintAzulejo } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function AzulejoOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="azulejo"
      skin="azulejo"
      painter={paintAzulejo}
    />
  );
}
export default AzulejoOrnament;
