"use client";

import {
  OrnamentLayer,
  useOrnamentId,
  type OrnamentProps,
} from "../ornament-parts.js";
export type PrismOrnamentProps = OrnamentProps;

export function PrismOrnament(props: PrismOrnamentProps) {
  const id = useOrnamentId("prism");
  const small = props.part === "switch-thumb";
  return (
    <OrnamentLayer {...props} skin="prism">
      {small ? (
        <svg className="dixy-skin-control-art" viewBox="0 0 20 20">
          <path
            d="M10 1q0 9 9 9-9 0-9 9 0-9-9-9 9 0 9-9Z"
            fill="currentColor"
            opacity=".9"
          />
        </svg>
      ) : props.part === "theme" ? (
        <svg
          className="dixy-prism-atmosphere"
          viewBox="0 0 1200 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter
              id={id + "-diffusion"}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="28" />
            </filter>
            <radialGradient id={id + "-blue"}>
              <stop stopColor="#7799ff" stopOpacity=".8" />
              <stop offset=".4" stopColor="#6054ff" stopOpacity=".45" />
              <stop offset="1" stopColor="#4242c0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id + "-rose"}>
              <stop stopColor="#ffcbba" stopOpacity=".85" />
              <stop offset=".4" stopColor="#eb86c6" stopOpacity=".5" />
              <stop offset="1" stopColor="#cb6ed2" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={id + "-beam"}>
              <stop stopColor="#8b9fff" stopOpacity="0" />
              <stop offset=".45" stopColor="#c2dfff" stopOpacity=".7" />
              <stop offset=".52" stopColor="#d7edff" stopOpacity=".9" />
              <stop offset="1" stopColor="#5442df" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g
            className="dixy-skin-motion dixy-prism-drift"
            filter={"url(#" + id + "-diffusion)"}
          >
            <ellipse
              cx="380"
              cy="340"
              rx="600"
              ry="580"
              fill={"url(#" + id + "-blue)"}
            />
            <ellipse
              cx="1120"
              cy="690"
              rx="650"
              ry="470"
              fill={"url(#" + id + "-rose)"}
            />
            <path
              d="M170-200C580 180 330 540 840 1100L1100 1000C460 490 720 120 420-200Z"
              fill={"url(#" + id + "-beam)"}
              opacity=".55"
            />
          </g>
          {Array.from({ length: 18 }, (_, i) => (
            <circle
              key={i}
              cx={(i * 173 + 97) % 1200}
              cy={(i * 137 + 61) % 900}
              r={i % 3 === 0 ? 1.3 : 0.65}
              fill="#e5edff"
              opacity=".3"
            />
          ))}
        </svg>
      ) : (
        <>
          <span className="dixy-prism-caustic dixy-skin-motion" />
          <svg className="dixy-prism-facet" viewBox="0 0 80 80">
            <defs>
              <linearGradient id={id + "-facet"} x2="1" y2="1">
                <stop stopColor="#d8f5ff" stopOpacity=".65" />
                <stop offset=".5" stopColor="#ba9bff" stopOpacity=".1" />
                <stop offset="1" stopColor="#ffd4b7" stopOpacity=".4" />
              </linearGradient>
            </defs>
            <path d="M0 0h80v80Q62 20 0 0Z" fill={"url(#" + id + "-facet)"} />
            <path
              d="M0 .5Q60 15 79.5 80"
              stroke="#e0dbff"
              strokeOpacity=".3"
              fill="none"
            />
          </svg>
        </>
      )}
    </OrnamentLayer>
  );
}
export default PrismOrnament;
