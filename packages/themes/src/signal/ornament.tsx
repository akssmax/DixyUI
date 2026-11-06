"use client";

import type { CSSProperties } from "react";
import {
  Fasteners,
  OrnamentLayer,
  useOrnamentId,
  type OrnamentProps,
} from "../ornament-parts.js";
export type SignalOrnamentProps = OrnamentProps;

export function SignalOrnament(props: SignalOrnamentProps) {
  const id = useOrnamentId("signal");
  if (props.part === "theme") return null;
  const small = props.part === "switch-thumb";
  return (
    <OrnamentLayer {...props} skin="signal">
      {small ? (
        <svg className="dixy-skin-control-art" viewBox="0 0 16 18">
          <path d="M6 3h4v12H6Z" fill="currentColor" />
        </svg>
      ) : (
        <>
          <span className="dixy-signal-rail" />
          <Fasteners id={id} dark />
          <svg
            viewBox="0 0 70 14"
            className="dixy-signal-meter"
            shapeRendering="crispEdges"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <g key={i} transform={`translate(${i * 6} 0)`}>
                <path d="M0 0h4v13H0Z" fill="#050b06" />
                <g
                  className="dixy-skin-motion dixy-signal-bar"
                  style={
                    { "--dixy-detail-delay": -i * 0.17 + "s" } as CSSProperties
                  }
                >
                  {Array.from({ length: 2 + ((i * 7) % 5) }, (_, j) => (
                    <rect
                      key={j}
                      y={11 - j * 2}
                      width="4"
                      height="1.4"
                      fill="currentColor"
                    />
                  ))}
                </g>
              </g>
            ))}
          </svg>
        </>
      )}
    </OrnamentLayer>
  );
}
export default SignalOrnament;
