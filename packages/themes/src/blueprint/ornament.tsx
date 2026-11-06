"use client";
import { paintDraft } from "../organic-paint-world.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function BlueprintOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="drafting"
      skin="blueprint"
      painter={paintDraft}
    />
  );
}
export default BlueprintOrnament;
