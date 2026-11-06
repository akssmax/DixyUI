"use client";
import { paintPanes } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function AnsiOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament {...props} kind="panes" skin="ansi" painter={paintPanes} />
  );
}
export default AnsiOrnament;
