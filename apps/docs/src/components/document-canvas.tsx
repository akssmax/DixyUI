import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Paints the page's themed canvas onto <html>.
 *
 * Dixy themes are scoped to a `.dixy-theme` wrapper, so <html> stays the
 * browser default (white). On macOS the rubber-band overscroll and iOS
 * pull-to-refresh reveal <html>, flashing white behind a dark starter. This
 * copies the outermost wrapper's resolved background and colour scheme to the
 * root, and keeps it in sync when the starter, appearance or route changes.
 */
export function DocumentCanvas() {
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let observed: Element | null = null;

    const sync = () => {
      frame = 0;
      const wrapper = document.body.querySelector(".dixy-theme");
      if (wrapper !== observed) {
        themeObserver.disconnect();
        observed = wrapper;
        if (wrapper) {
          themeObserver.observe(wrapper, {
            attributes: true,
            attributeFilter: ["data-appearance", "data-dixy-skin", "class"],
          });
        }
      }
      if (!wrapper) return;
      const { backgroundColor } = getComputedStyle(wrapper);
      const transparent =
        backgroundColor === "transparent" ||
        backgroundColor === "rgba(0, 0, 0, 0)";
      root.style.backgroundColor = transparent ? "" : backgroundColor;
      const appearance = wrapper.getAttribute("data-appearance");
      root.style.colorScheme =
        appearance === "dark" || appearance === "light" ? appearance : "";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    const themeObserver = new MutationObserver(schedule);
    // Starter stylesheets load lazily into <head>; the colour changes when
    // they land, not when the attribute flips.
    const headObserver = new MutationObserver(schedule);
    headObserver.observe(document.head, { childList: true });

    sync();
    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      headObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
