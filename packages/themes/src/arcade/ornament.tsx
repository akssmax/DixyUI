"use client";
import { paintMarquee } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function ArcadeOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="marquee"
      skin="arcade"
      painter={paintMarquee}
    />
  );
}
export default ArcadeOrnament;
