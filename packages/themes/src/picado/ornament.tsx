"use client";
import { paintPicado } from "../organic-paint-launch.js";
import { OrganicOrnament } from "../organic-ornament.js";
import type { OrnamentProps } from "../ornament-parts.js";
export function PicadoOrnament(props: OrnamentProps) {
  return (
    <OrganicOrnament
      {...props}
      kind="picado"
      skin="picado"
      painter={paintPicado}
    />
  );
}
export default PicadoOrnament;
