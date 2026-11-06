"use client";

import {
  OrnamentLayer,
  useOrnamentId,
  type OrnamentProps,
} from "../ornament-parts.js";
export type AtelierOrnamentProps = OrnamentProps;

export function AtelierOrnament(props: AtelierOrnamentProps) {
  const id = useOrnamentId("atelier");
  const small = props.part === "switch-thumb";
  return (
    <OrnamentLayer {...props} skin="atelier">
      {small ? (
        <svg className="dixy-skin-control-art" viewBox="0 0 20 20">
          <path
            d="m10 3 7 7-7 7-7-7Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path d="M8 10h4m-2-2v4" stroke="currentColor" strokeWidth=".8" />
        </svg>
      ) : props.part === "theme" ? (
        <svg className="dixy-atelier-linen" width="100%" height="100%">
          <defs>
            <pattern
              id={id + "-weave"}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 1h6M1 0v6"
                stroke="#775f43"
                strokeOpacity=".1"
                strokeWidth=".6"
              />
              <path
                d="M0 2h6M2 0v6"
                stroke="#fff8df"
                strokeOpacity=".4"
                strokeWidth=".6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={"url(#" + id + "-weave)"} />
        </svg>
      ) : (
        <>
          <svg width="0" height="0" className="dixy-skin-definitions">
            <defs>
              <filter id={id + "-paper"} x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency=".78"
                  numOctaves="3"
                  seed="18"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <linearGradient id={id + "-walnut"} x2="0" y2="1">
                <stop stopColor="#ba9670" />
                <stop offset=".15" stopColor="#715032" />
                <stop offset=".5" stopColor="#a77d52" />
                <stop offset=".8" stopColor="#63452c" />
                <stop offset="1" stopColor="#c3a37b" />
              </linearGradient>
            </defs>
          </svg>
          <svg className="dixy-atelier-paper" width="100%" height="100%">
            <rect
              width="100%"
              height="100%"
              filter={"url(#" + id + "-paper)"}
              opacity=".16"
            />
          </svg>
          {["top", "bottom", "left", "right"].map((edge, i) => (
            <svg
              key={edge}
              className={"dixy-atelier-wood dixy-atelier-wood-" + edge}
              viewBox="0 0 1000 12"
              preserveAspectRatio="none"
            >
              <rect width="1000" height="12" fill={"url(#" + id + "-walnut)"} />
              {Array.from({ length: 9 }, (_, j) => (
                <path
                  key={j}
                  d={`M-10 ${j * 1.5}C${220 + i * 20} ${j * 1.5 - 2} 340 ${j * 1.5 + 4} 510 ${j * 1.5}S820 ${j * 1.5 - 3} 1010 ${j * 1.5 + 1}`}
                  fill="none"
                  stroke={j % 2 ? "#332212" : "#e4bf8e"}
                  strokeOpacity={j % 2 ? ".35" : ".25"}
                  strokeWidth=".65"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          ))}
          <span className="dixy-atelier-stitch" />
          <span className="dixy-atelier-gilt dixy-skin-motion" />
        </>
      )}
    </OrnamentLayer>
  );
}
export default AtelierOrnament;
