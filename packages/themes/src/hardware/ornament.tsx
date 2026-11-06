"use client";

import {
  Fasteners,
  OrnamentLayer,
  useOrnamentId,
  type OrnamentProps,
} from "../ornament-parts.js";
export type HardwareOrnamentProps = OrnamentProps;

export function HardwareOrnament(props: HardwareOrnamentProps) {
  const id = useOrnamentId("hardware");
  if (props.part === "theme") return null;
  return (
    <OrnamentLayer {...props} skin="hardware">
      {props.part === "switch-thumb" ? (
        <svg className="dixy-skin-control-art" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".15"
          />
          {Array.from({ length: 32 }, (_, i) => (
            <path
              key={i}
              d="M12 3v8"
              transform={`rotate(${i * 11.25} 12 12)`}
              stroke="currentColor"
              strokeWidth=".25"
              opacity=".28"
            />
          ))}
          <circle cx="12" cy="4" r="1" fill="currentColor" />
        </svg>
      ) : (
        <>
          <Fasteners id={id} />
          <span className="dixy-hardware-seam" />
          <svg className="dixy-hardware-registration" viewBox="0 0 90 12">
            <path
              d="M0 5h12m-6-5v10M23 5h40"
              stroke="currentColor"
              strokeWidth=".6"
            />
            {Array.from({ length: 5 }, (_, i) => (
              <circle
                key={i}
                className={i === 0 ? "dixy-skin-motion" : undefined}
                cx={70 + i * 4}
                cy="5"
                r=".8"
                fill="currentColor"
              />
            ))}
          </svg>
        </>
      )}
    </OrnamentLayer>
  );
}
export default HardwareOrnament;
