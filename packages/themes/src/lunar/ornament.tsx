"use client";
import { paintPapercut } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function LunarOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="papercut"
      skin="lunar"
      painter={paintPapercut}
    />
  );
}
export default LunarOrnament;
