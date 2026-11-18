import { useEffect, useState } from "react";
import type { ExpressiveShape } from "@dixy-ui/tokens";
import { Shape } from "./shape";
import { useThemeSettings } from "../theme/theme";

/** The sequence the loader morphs through; every shape shares one outline structure. */
const loaderShapes: readonly ExpressiveShape[] = [
  "cookie-9",
  "pentagon",
  "pill",
  "very-sunny",
  "cookie-4",
  "oval",
  "bloom",
];

/**
 * Decorative expressive loader: a library shape that morphs to the next every
 * 650ms while it turns. Spinner and Button render it when Theme.progress is
 * "wave"; the accessible status stays with them. Reduced motion holds one shape.
 */
export function ShapeLoader({ className }: { className?: string }) {
  const { motion } = useThemeSettings();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (
      motion === "reduced" ||
      (typeof matchMedia === "function" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches)
    )
      return;
    const timer = setInterval(
      () => setIndex((n) => (n + 1) % loaderShapes.length),
      650,
    );
    return () => clearInterval(timer);
  }, [motion]);
  return (
    <Shape
      kind={loaderShapes[index]}
      className={["dixy-shape-loader", className].filter(Boolean).join(" ")}
    />
  );
}
