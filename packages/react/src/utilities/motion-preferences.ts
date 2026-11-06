import { useSyncExternalStore } from "react";
import { useThemeSettings } from "../theme/theme";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const getSnapshot = () => window.matchMedia(query).matches;
// Render static on the server and until the client preference is known.
const getServerSnapshot = () => true;

/** OS reduction always wins; a Theme may request additional reduction. */
export function useMotionPreferences() {
  const { motion, motionScheme } = useThemeSettings();
  const systemReduced = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return {
    reducedMotion: motion === "reduced" || systemReduced,
    preference: motion,
    scheme: motionScheme,
  };
}
