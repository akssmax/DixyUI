/** Canonical spacing scale. Pixel references assume a 16px root font size. */
export const spacingPrimitives = {
  "0": 0,
  "025": 2,
  "050": 4,
  "075": 6,
  "100": 8,
  "150": 12,
  "200": 16,
  "250": 20,
  "300": 24,
  "400": 32,
  "500": 40,
  "600": 48,
  "800": 64,
  "1000": 80,
  "1200": 96,
  "2000": 160,
} as const;

export type SpaceToken = keyof typeof spacingPrimitives;

export const semanticSpacing = {
  inline: { xs: "025", sm: "050", md: "100", lg: "150", xl: "200" },
  stack: { xs: "050", sm: "100", md: "200", lg: "300", xl: "400" },
  section: { sm: "400", md: "600", lg: "800", xl: "1200" },
  inset: { xs: "100", sm: "150", md: "200", lg: "300", xl: "400" },
} as const satisfies Record<string, Record<string, SpaceToken>>;

export type SpacingFamily = keyof typeof semanticSpacing;
export type SpacingSize<F extends SpacingFamily> =
  keyof (typeof semanticSpacing)[F] & string;
type SemanticMap = {
  readonly [F in SpacingFamily]: {
    readonly [S in SpacingSize<F>]: SpaceToken;
  };
};

/** Explicit density mappings preserve primitives, inline spacing and section rhythm. */
export const spacingDensity = {
  compact: {
    ...semanticSpacing,
    stack: { xs: "025", sm: "075", md: "150", lg: "250", xl: "300" },
    inset: { xs: "075", sm: "100", md: "150", lg: "250", xl: "300" },
  },
  default: semanticSpacing,
  comfortable: {
    ...semanticSpacing,
    stack: { xs: "075", sm: "150", md: "250", lg: "400", xl: "500" },
    inset: { xs: "150", sm: "200", md: "250", lg: "400", xl: "500" },
  },
} as const satisfies Record<string, SemanticMap>;

export type Density = keyof typeof spacingDensity;

export function space<T extends SpaceToken>(
  token: T,
): `var(--dixy-space-${T})` {
  return `var(--dixy-space-${token})`;
}

export function spacing<F extends SpacingFamily>(
  family: F,
  size: SpacingSize<F>,
): `var(--dixy-spacing-${F}-${SpacingSize<F>})` {
  return `var(--dixy-spacing-${family}-${size})`;
}
