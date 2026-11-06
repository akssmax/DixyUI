import { createContext, useCallback, useContext, type ReactNode } from "react";
import { feedbackEvents, type FeedbackEvent } from "@dixy-ui/tokens";
import { useThemeSettings } from "./theme/theme";
import { useMotionPreferences } from "./utilities/motion-preferences";

export type FeedbackAdapter = (event: FeedbackEvent) => void | Promise<void>;
export interface FeedbackProviderProps {
  children: ReactNode;
  /** Explicit user opt-in; nested providers cannot override a disabled ancestor. @default false */
  enabled?: boolean;
  /** Host integration; omitting it always produces a no-op. */
  adapter?: FeedbackAdapter;
}
const FeedbackContext = createContext<{
  enabled: boolean;
  adapter?: FeedbackAdapter;
} | null>(null);

export function FeedbackProvider({
  children,
  enabled = false,
  adapter,
}: FeedbackProviderProps) {
  const parent = useContext(FeedbackContext);
  return (
    <FeedbackContext.Provider
      value={{
        enabled: enabled && (parent?.enabled ?? true),
        adapter: adapter ?? parent?.adapter,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

/** Emit after a meaningful state change; adapter failure never changes application success. */
export function useFeedback() {
  const context = useContext(FeedbackContext);
  const { reducedMotion } = useMotionPreferences();
  const { effects } = useThemeSettings();
  return useCallback(
    (event: FeedbackEvent) => {
      if (
        !context?.enabled ||
        !context.adapter ||
        reducedMotion ||
        effects === "reduced" ||
        typeof window === "undefined"
      )
        return;
      try {
        void Promise.resolve(context.adapter(event)).catch(() => {});
      } catch {
        /* Feedback is best effort and cannot interrupt the action. */
      }
    },
    [context, reducedMotion, effects],
  );
}

/** Optional short web fallback; unsupported browsers do nothing. No native haptics equivalence. */
export const vibrationAdapter: FeedbackAdapter = (event) => {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  )
    navigator.vibrate([...feedbackEvents[event].vibration]);
};
