"use client";
import { paintGulal } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function HoliOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="gulal"
      skin="holi"
      painter={paintGulal}
    />
  );
}
export default HoliOrnament;
