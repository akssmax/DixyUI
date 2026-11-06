import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { useMotionPreferences } from "./utilities/motion-preferences";

/** Optional Motion integration. Install motion; place inside the Theme it follows. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useMotionPreferences();
  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}
