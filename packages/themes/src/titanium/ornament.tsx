"use client";
import { FrameCorners } from "../frame-corners.tsx";
import {
  OrnamentLayer,
  Fasteners,
  useOrnamentId,
  type OrnamentProps,
} from "../ornament-parts.js";
export function TitaniumOrnament(props: OrnamentProps) {
  const id = useOrnamentId("titanium");
  if (props.part === "theme" || props.part === "switch-thumb") return null;
  return (
    <OrnamentLayer {...props} skin="titanium">
      <Fasteners id={id} />
      <FrameCorners>
        <path
          className="dixy-skin-motion"
          d="M32 5H58L65 12H76"
          stroke="var(--dixy-color-background-action-primary)"
          strokeWidth="2"
        />
        {Array.from({ length: 15 }, (_, i) => (
          <g key={i}>
            <circle
              cx={8 + (i % 5) * 3}
              cy={51 + Math.floor(i / 5) * 5}
              r="1.2"
              fill="#000"
              opacity=".25"
            />
            <circle
              cx={8 + (i % 5) * 3}
              cy={51.7 + Math.floor(i / 5) * 5}
              r="1.2"
              stroke="#fff"
              strokeOpacity=".3"
              strokeWidth=".4"
            />
          </g>
        ))}
      </FrameCorners>
    </OrnamentLayer>
  );
}
export default TitaniumOrnament;
