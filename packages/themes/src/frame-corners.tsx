import type { ReactNode } from "react";

/** Decorative paint only: corners never own content, focus or hit targets. */
export function FrameCorners({ children }: { children: ReactNode }) {
  return (
    <>
      {["tl", "tr", "bl", "br"].map((corner) => (
        <svg
          key={corner}
          className={`dixy-frame-corner dixy-frame-corner-${corner}`}
          viewBox="0 0 80 80"
          fill="none"
        >
          {children}
        </svg>
      ))}
    </>
  );
}
