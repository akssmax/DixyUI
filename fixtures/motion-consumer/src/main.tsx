import { createRoot } from "react-dom/client";
import { Theme, useMotionPreferences } from "@dixy-ui/react";
import { MotionProvider } from "@dixy-ui/react/motion";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { springTransition, tweenTransition } from "@dixy-ui/tokens";
import "@dixy-ui/react/styles.css";
function Sample() {
  const { reducedMotion } = useMotionPreferences();
  return (
    <m.div
      initial={false}
      animate={{ x: 40, opacity: 1 }}
      transition={{
        x: springTransition("expressive", "spatial", "fast", reducedMotion),
        opacity: tweenTransition("enter", reducedMotion),
      }}
    >
      Motion consumer
    </m.div>
  );
}
createRoot(document.getElementById("root")!).render(
  <Theme motion="reduced">
    <MotionProvider>
      <LazyMotion features={domAnimation} strict>
        <Sample />
      </LazyMotion>
    </MotionProvider>
  </Theme>,
);
// @ts-expect-error A child may request reduction, never disable the OS preference.
const invalidPreference = <Theme motion="never" />;
void invalidPreference;
