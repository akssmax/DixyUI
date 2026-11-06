import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Theme, useMotionPreferences } from "@dixy-ui/react";
import { MotionProvider } from "@dixy-ui/react/motion";
import { motion } from "motion/react";
function Sample() {
  const { reducedMotion } = useMotionPreferences();
  return createElement(
    motion.div,
    { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } },
    reducedMotion ? "Static before hydration" : "Animated",
  );
}
const html = renderToString(
  createElement(
    Theme,
    { motion: "system" },
    createElement(MotionProvider, null, createElement(Sample)),
  ),
);
assert.match(html, /Static before hydration/);
assert.match(html, /data-motion="system"/);
assert.match(html, /opacity:1/);
console.log("Optional Motion entry renders safely from the packed package.");
