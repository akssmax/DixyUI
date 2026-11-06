"use client";

import { useId, type ReactNode } from "react";
import type {
  OrnamentLevel,
  MotionPreference,
  EffectsPreference,
} from "@dixy-ui/tokens";

/** Structural counterpart to core's optional ornament slot; no core runtime dependency. */
export interface OrnamentProps {
  part: "theme" | "card" | "dialog" | "switch-thumb";
  ornament: OrnamentLevel;
  motion: MotionPreference;
  effects: EffectsPreference;
  animate: boolean;
}

export function useOrnamentId(prefix: string) {
  return "dixy-" + prefix + "-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

export function OrnamentLayer({
  skin,
  children,
  ...props
}: OrnamentProps & { skin: string; children: ReactNode }) {
  if (props.effects === "reduced" || props.ornament === "quiet") return null;
  return (
    <span
      aria-hidden="true"
      className={`dixy-skin-ornament dixy-${skin}-ornament dixy-skin-ornament-${props.part}`}
      data-animated={
        props.animate && props.motion !== "reduced" ? "" : undefined
      }
      data-motion={props.motion}
      data-ornament={props.ornament}
    >
      {children}
    </span>
  );
}

/** Fixed-size hardware never stretches with the surrounding panel. */
export function Fasteners({
  id,
  dark = false,
}: {
  id: string;
  dark?: boolean;
}) {
  return (
    <>
      <svg width="0" height="0" className="dixy-skin-definitions">
        <defs>
          <radialGradient id={id + "-steel"} cx=".32" cy=".25">
            <stop stopColor={dark ? "#87918c" : "#fff"} />
            <stop offset=".45" stopColor={dark ? "#353d39" : "#b6b8b7"} />
            <stop offset="1" stopColor={dark ? "#101713" : "#676d6a"} />
          </radialGradient>
          <g id={id + "-screw"}>
            <circle
              cx="7"
              cy="7"
              r="6"
              fill={"url(#" + id + "-steel)"}
              stroke={dark ? "#050a07" : "#878c88"}
            />
            <circle
              cx="7"
              cy="7"
              r="4.5"
              fill="none"
              stroke="#ffffff"
              strokeOpacity=".24"
            />
            <path
              d="m4.5 8.4 5-2.8m-3.8-1 2.6 4.8"
              stroke={dark ? "#070d09" : "#4c524e"}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        </defs>
      </svg>
      {["tl", "tr", "bl", "br"].map((corner, i) => (
        <svg
          key={corner}
          className={"dixy-skin-fastener dixy-skin-fastener-" + corner}
          viewBox="0 0 14 14"
        >
          <use href={"#" + id + "-screw"} transform={`rotate(${i * 57} 7 7)`} />
        </svg>
      ))}
    </>
  );
}
