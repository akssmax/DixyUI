import type { MotionTransition } from "@dixy-ui/tokens";

/** Each component assigns intent; the shared motion foundation owns timing. */
export const componentMotion = {
  button: { feedback: "feedback" },
  checkbox: { feedback: "feedback", indicator: "feedback" },
  dialog: { enter: "enter", exit: "exit" },
  drawer: { enter: "navigation", exit: "exit" },
  menu: { feedback: "feedback", enter: "enter", exit: "exit" },
  switch: { feedback: "feedback", thumb: "feedback" },
  tabs: { feedback: "feedback", indicator: "enter" },
  radio: { feedback: "feedback", indicator: "feedback" },
  toggle: { feedback: "feedback" },
  select: { feedback: "feedback", enter: "enter", exit: "exit" },
  disclosure: { feedback: "feedback", reveal: "reveal" },
  field: { feedback: "feedback" },
  avatar: { enter: "enter" },
  floating: { enter: "enter", exit: "exit" },
  range: { feedback: "feedback" },
  toast: { enter: "enter", exit: "exit" },
  scrollArea: { feedback: "feedback" },
} as const satisfies Record<string, Record<string, MotionTransition>>;
