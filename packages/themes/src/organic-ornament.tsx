"use client";
import { useEffect, useId, useRef } from "react";
import type { OrnamentProps } from "./ornament-parts.js";
import type { OrganicFrame } from "./organic-settings.js";
import { mountOrganicCanvas } from "./organic-runtime.js";

import type { OrganicPainter } from "./organic-paint.js";

/** Optional decoration; never owns a primitive's hit targets, content or semantics. */
export function OrganicOrnament({
  kind,
  skin,
  painter,
  ...props
}: OrnamentProps & {
  kind: OrganicFrame;
  skin: string;
  painter: OrganicPainter;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    id = useId();
  const instance = [...id].reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) % 997,
    0,
  );
  useEffect(() => {
    if (!canvas.current) return;
    return mountOrganicCanvas(
      canvas.current,
      kind,
      painter,
      instance,
      props.animate,
      props.motion,
    );
  }, [
    kind,
    painter,
    instance,
    props.animate,
    props.motion,
    props.effects,
    props.ornament,
  ]);
  if (
    props.part === "theme" ||
    props.part === "switch-thumb" ||
    props.effects === "reduced" ||
    props.ornament === "quiet"
  )
    return null;
  return (
    <span
      aria-hidden="true"
      className={`dixy-skin-ornament dixy-${skin}-ornament dixy-skin-ornament-${props.part} dixy-${skin}-ornament-${props.part} dixy-organic-ornament`}
      data-animated={(props.animate && props.motion !== "reduced") || undefined}
      data-motion={props.motion}
      data-ornament={props.ornament}
    >
      <canvas ref={canvas} className="dixy-organic-canvas" aria-hidden="true" />
    </span>
  );
}
