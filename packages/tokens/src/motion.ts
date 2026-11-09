/** Reference timings in milliseconds. CSS resolves these to zero for reduced motion. */
export const motionDurations = {
  instant: 0,
  fast: 120,
  normal: 200,
  deliberate: 280,
  slow: 400,
} as const;
export type MotionDuration = keyof typeof motionDurations;

/** Progress cadence is a functional loop, separate from finite UI transitions. */
export const motionLoops = { progress: 700 } as const;

export const motionEasings = {
  linear: [0, 0, 1, 1],
  standard: [0.2, 0.8, 0.2, 1],
  enter: [0.16, 1, 0.3, 1],
  // Exits also start fast: an ease-in exit lingers at the moment the user is watching.
  exit: [0.23, 1, 0.32, 1],
} as const;
export type MotionEasing = keyof typeof motionEasings;

export const motionTransitions = {
  feedback: { duration: "fast", easing: "standard" },
  enter: { duration: "normal", easing: "enter" },
  exit: { duration: "fast", easing: "exit" },
  navigation: { duration: "deliberate", easing: "standard" },
  reveal: { duration: "deliberate", easing: "enter" },
  page: { duration: "slow", easing: "standard" },
} as const satisfies Record<
  string,
  { duration: MotionDuration; easing: MotionEasing }
>;
export type MotionTransition = keyof typeof motionTransitions;
export type MotionPreference = "system" | "reduced";
export type MotionSpeed = "fast" | "default" | "slow";
export type MotionKind = "spatial" | "effects";

interface SpringDefinition {
  readonly stiffness: number;
  readonly dampingRatio: number;
  readonly mass: number;
}

// Dixy tuning, informed by M3's spatial/effects separation. These are not M3 tokens.
const effects = {
  fast: { stiffness: 1600, dampingRatio: 1, mass: 1 },
  default: { stiffness: 900, dampingRatio: 1, mass: 1 },
  slow: { stiffness: 400, dampingRatio: 1, mass: 1 },
} as const;
export const motionSprings = {
  standard: {
    spatial: {
      fast: { stiffness: 800, dampingRatio: 1, mass: 1 },
      default: { stiffness: 500, dampingRatio: 1, mass: 1 },
      slow: { stiffness: 280, dampingRatio: 1, mass: 1 },
    },
    effects,
  },
  expressive: {
    spatial: {
      fast: { stiffness: 800, dampingRatio: 0.8, mass: 1 },
      default: { stiffness: 500, dampingRatio: 0.8, mass: 1 },
      slow: { stiffness: 280, dampingRatio: 0.8, mass: 1 },
    },
    effects,
  },
} as const satisfies Record<
  string,
  Record<MotionKind, Record<MotionSpeed, SpringDefinition>>
>;
export type MotionScheme = keyof typeof motionSprings;

/** Convert damping ratio to Motion's damping coefficient: c = 2ζ√(km). */
export function springTransition(
  scheme: MotionScheme = "standard",
  kind: MotionKind = "spatial",
  speed: MotionSpeed = "default",
  reducedMotion = false,
) {
  if (reducedMotion) return { type: "tween" as const, duration: 0 };
  const { stiffness, dampingRatio, mass } = motionSprings[scheme][kind][speed];
  return {
    type: "spring" as const,
    stiffness,
    damping: 2 * dampingRatio * Math.sqrt(stiffness * mass),
    mass,
    restSpeed: 0.1,
    restDelta: 0.01,
  };
}

/** Motion consumes seconds and mutable tuples; definitions stay framework independent. */
export function tweenTransition(role: MotionTransition, reducedMotion = false) {
  const recipe = motionTransitions[role];
  return {
    type: "tween" as const,
    duration: reducedMotion ? 0 : motionDurations[recipe.duration] / 1000,
    ease: [...motionEasings[recipe.easing]] as [number, number, number, number],
  };
}

export function motionDuration<T extends MotionDuration>(
  token: T,
): `var(--dixy-motion-duration-${T})` {
  return `var(--dixy-motion-duration-${token})`;
}
export function motionEasing<T extends MotionEasing>(
  token: T,
): `var(--dixy-motion-easing-${T})` {
  return `var(--dixy-motion-easing-${token})`;
}
export function motionTransition<T extends MotionTransition>(
  role: T,
): `var(--dixy-motion-transition-${T})` {
  return `var(--dixy-motion-transition-${role})`;
}
