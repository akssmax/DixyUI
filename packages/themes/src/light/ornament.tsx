"use client";
import { FrameCorners } from "../frame-corners.tsx";
import { OrnamentLayer, type OrnamentProps } from "../ornament-parts.js";
export function LightOrnament(props: OrnamentProps) {
  if (props.part === "theme" || props.part === "switch-thumb") return null;
  return (
    <OrnamentLayer {...props} skin="light">
      <FrameCorners>
        <path
          className="dixy-skin-motion"
          d="M17 8Q28 4 42 7"
          stroke="var(--dixy-color-background-action-primary)"
          strokeOpacity=".28"
          strokeWidth=".7"
        />
      </FrameCorners>
    </OrnamentLayer>
  );
}
export default LightOrnament;
