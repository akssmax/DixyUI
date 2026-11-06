"use client";
import { paintGlass } from "../organic-paint.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function OceanOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="coral"
      skin="ocean"
      painter={paintGlass}
    />
  );
}
export default OceanOrnament;
