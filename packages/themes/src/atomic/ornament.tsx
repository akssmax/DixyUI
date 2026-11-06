"use client";
import { paintAtomic } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function AtomicOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="atomic"
      skin="atomic"
      painter={paintAtomic}
    />
  );
}
export default AtomicOrnament;
