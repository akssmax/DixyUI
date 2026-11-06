/** Reference pixels at a 16px root. Density does not change sizing. */
export const sizing = {
  control: { sm: 32, md: 40, lg: 48 },
  icon: { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, "2xl": 48 },
  target: { minimum: 24, comfortable: 44 },
} as const;

export type SizeFamily = keyof typeof sizing;
export type SizeToken<F extends SizeFamily> = keyof (typeof sizing)[F] & string;
export type ControlSize = SizeToken<"control">;
export type IconSize = SizeToken<"icon">;
export type TargetSize = SizeToken<"target">;

export function size<F extends SizeFamily>(
  family: F,
  token: SizeToken<F>,
): `var(--dixy-size-${F}-${SizeToken<F>})` {
  return `var(--dixy-size-${family}-${token})`;
}
