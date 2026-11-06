/** Short web fallback patterns; these do not emulate native impact or Core Haptics. */
export const feedbackEvents = {
  selection: { description: "A discrete selection changed", vibration: [8] },
  toggle: { description: "A setting changed", vibration: [10] },
  snap: { description: "A meaningful detent was reached", vibration: [6] },
  success: { description: "An operation completed", vibration: [10, 40, 10] },
  warning: {
    description: "An action needs attention",
    vibration: [20, 50, 20],
  },
} as const;
export type FeedbackEvent = keyof typeof feedbackEvents;
