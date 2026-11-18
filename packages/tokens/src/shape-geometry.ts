/**
 * Expressive shape library. Shapes are rounded polygons: straight edges joined
 * by circular fillets, so corners are truly round instead of wobbly. Every
 * outline is resampled to the same number of points, evenly along its length,
 * starting at the top centre and running clockwise, so any two shapes can
 * morph point-for-point (CSS `clip-path: polygon()` or an SVG path `d`).
 *
 * Coordinates are in a 0–100 box; each shape keeps its aspect ratio and is
 * centred. Inspired by Material 3 Expressive's shape set; the geometry and
 * parameters are Dixy's own.
 */

type Vec = readonly [number, number];

/** Outline points per shape. Even spacing keeps morphs free of bunching. */
export const shapeSamples = 120;

interface Corner {
  /** Fillet radius in shape units (the shape spans about -1..1). */
  readonly radius: number;
}

function roundedPolygon(
  vertices: readonly Vec[],
  rounding: number | readonly number[],
): Vec[] {
  const n = vertices.length;
  const radii = vertices.map((_, i) =>
    typeof rounding === "number" ? rounding : (rounding[i] ?? 0),
  );
  const half = vertices.map((v, i) => {
    const a = unit(sub(vertices[(i - 1 + n) % n]!, v));
    const b = unit(sub(vertices[(i + 1) % n]!, v));
    return Math.acos(clamp(dot(a, b), -1, 1)) / 2;
  });
  // How far along each edge a fillet wants to reach (its tangent length).
  const wanted = half.map((h, i) =>
    h < 5e-5 || Math.PI / 2 - h < 5e-5 ? 0 : radii[i]! / Math.tan(h),
  );
  // Corners share each edge: when two fillets want more than the edge, both
  // shrink in proportion, so a sharp neighbour leaves room for a round one.
  const edgeScale = vertices.map((v, i) => {
    const j = (i + 1) % n;
    const need = wanted[i]! + wanted[j]!;
    const edge = len(sub(vertices[j]!, v));
    return need > edge ? edge / need : 1;
  });
  // Fillet each corner: tangent points on both edges plus the arc between them.
  const corners = vertices.map((v, i) => {
    const prev = vertices[(i - 1 + n) % n]!;
    const next = vertices[(i + 1) % n]!;
    const a = unit(sub(prev, v));
    const b = unit(sub(next, v));
    if (wanted[i] === 0)
      return { start: v, end: v, center: v, radius: 0, sweep: 0 };
    const h = half[i]!;
    const tangent =
      wanted[i]! * Math.min(edgeScale[i]!, edgeScale[(i - 1 + n) % n]!);
    const radius = tangent * Math.tan(h);
    const start = add(v, scale(a, tangent));
    const end = add(v, scale(b, tangent));
    const bisector = unit(add(a, b));
    const center = add(v, scale(bisector, radius / Math.sin(h)));
    let sweep =
      Math.atan2(end[1] - center[1], end[0] - center[0]) -
      Math.atan2(start[1] - center[1], start[0] - center[0]);
    if (sweep > Math.PI) sweep -= 2 * Math.PI;
    if (sweep < -Math.PI) sweep += 2 * Math.PI;
    return { start, end, center, radius, sweep };
  });
  // Dense outline: arc points at each corner, edges are implied between them.
  const out: Vec[] = [];
  for (const c of corners) {
    if (c.radius === 0) {
      out.push(c.start);
      continue;
    }
    const steps = Math.max(2, Math.ceil(Math.abs(c.sweep) * 24));
    const a0 = Math.atan2(c.start[1] - c.center[1], c.start[0] - c.center[0]);
    for (let s = 0; s <= steps; s++) {
      const t = a0 + (c.sweep * s) / steps;
      out.push([
        c.center[0] + c.radius * Math.cos(t),
        c.center[1] + c.radius * Math.sin(t),
      ]);
    }
  }
  return out;
}

const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1];
const len = (a: Vec) => Math.hypot(a[0], a[1]);
const unit = (a: Vec): Vec => scale(a, 1 / (len(a) || 1));
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** Regular polygon, first vertex at 12 o'clock unless turned. */
function regular(sides: number, turn = 0): Vec[] {
  return Array.from({ length: sides }, (_, i) => {
    const t = -Math.PI / 2 + turn + (i * 2 * Math.PI) / sides;
    return [Math.cos(t), Math.sin(t)] as Vec;
  });
}

/** Star: alternating outer and inner vertices. */
function star(points: number, inner: number, turn = 0): Vec[] {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 ? inner : 1;
    const t = -Math.PI / 2 + turn + (i * Math.PI) / points;
    return [r * Math.cos(t), r * Math.sin(t)] as Vec;
  });
}
/** Rounding list for a star: outer corners, then inner corners. */
const alternate = (points: number, outer: number, inner: number) =>
  Array.from({ length: points * 2 }, (_, i) => (i % 2 ? inner : outer));

const stretch = (vs: readonly Vec[], sx: number, sy: number): Vec[] =>
  vs.map(([x, y]) => [x * sx, y * sy]);

const rect = (w: number, h: number): Vec[] => [
  [-w, -h],
  [w, -h],
  [w, h],
  [-w, h],
];

/** Staircase outline from per-row half-widths (pixel shapes). */
function pixelRows(halfWidths: readonly number[]): Vec[] {
  const rows = halfWidths.length;
  const cell = 2 / rows;
  const right: Vec[] = [];
  halfWidths.forEach((w, i) => {
    const top = -1 + i * cell;
    right.push([w * cell, top], [w * cell, top + cell]);
  });
  const left = right.map(([x, y]) => [-x, y] as Vec).reverse();
  return [...right, ...left];
}

/** Wavy-bottomed rectangle (ghostish). */
function ghost(): Vec[] {
  const bottom: Vec[] = [];
  const waves = 3;
  for (let i = 0; i <= waves * 2; i++) {
    const x = 0.85 - (i * 1.7) / (waves * 2);
    bottom.push([x, i % 2 ? 0.72 : 1]);
  }
  return [[-0.85, -1], [0.85, -1], ...bottom];
}

type Recipe = () => Vec[];

const recipes = {
  circle: () => roundedPolygon(regular(48), 0),
  square: () => roundedPolygon(rect(1, 1), 0.32),
  slanted: () =>
    roundedPolygon(
      [
        [-0.75, -1],
        [1, -1],
        [0.75, 1],
        [-1, 1],
      ],
      0.3,
    ),
  dome: () => roundedPolygon(rect(1, 1), [1, 1, 0.22, 0.22]),
  semicircle: () => roundedPolygon(rect(1, 0.55), [1.1, 1.1, 0.12, 0.12]),
  fan: () => roundedPolygon(rect(1, 1), [0.18, 2, 0.18, 0.18]),
  oval: () => stretch(roundedPolygon(regular(48), 0), 1, 0.7),
  pill: () => roundedPolygon(rect(1, 0.5), 0.5),
  triangle: () => roundedPolygon(regular(3), 0.28),
  arrow: () =>
    roundedPolygon(
      [
        [0, -1],
        [1, 0.9],
        [0, 0.45],
        [-1, 0.9],
      ],
      [0.24, 0.24, 0.2, 0.24],
    ),
  diamond: () => roundedPolygon(stretch(regular(4), 0.85, 1.05), 0.26),
  "clam-shell": () =>
    roundedPolygon(stretch(regular(6, Math.PI / 6), 1, 0.72), 0.2),
  pentagon: () => roundedPolygon(regular(5), 0.26),
  gem: () => roundedPolygon(stretch(regular(6), 0.88, 1), 0.2),
  sunny: () => roundedPolygon(star(8, 0.8), alternate(8, 0.1, 0.1)),
  "very-sunny": () => roundedPolygon(star(8, 0.66), alternate(8, 0.11, 0.08)),
  "cookie-4": () =>
    roundedPolygon(star(4, 0.5, Math.PI / 4), alternate(4, 0.9, 0.2)),
  "cookie-6": () => roundedPolygon(star(6, 0.7), alternate(6, 0.5, 0.12)),
  "cookie-7": () => roundedPolygon(star(7, 0.74), alternate(7, 0.42, 0.1)),
  "cookie-9": () => roundedPolygon(star(9, 0.78), alternate(9, 0.3, 0.08)),
  "cookie-12": () => roundedPolygon(star(12, 0.83), alternate(12, 0.2, 0.06)),
  "clover-4": () =>
    roundedPolygon(star(4, 0.34, Math.PI / 4), alternate(4, 1.4, 0.02)),
  "clover-8": () => roundedPolygon(star(8, 0.7), alternate(8, 0.6, 0.02)),
  burst: () => roundedPolygon(star(12, 0.74), alternate(12, 0.05, 0.05)),
  "soft-burst": () => roundedPolygon(star(10, 0.74), alternate(10, 0.14, 0.12)),
  boom: () => roundedPolygon(star(15, 0.6), alternate(15, 0.03, 0.03)),
  "soft-boom": () => roundedPolygon(star(15, 0.64), alternate(15, 0.1, 0.06)),
  bloom: () => roundedPolygon(star(6, 0.5), alternate(6, 0.9, 0.03)),
  puffy: () =>
    stretch(roundedPolygon(star(12, 0.86), alternate(12, 0.24, 0.04)), 1, 0.86),
  "puffy-diamond": () =>
    roundedPolygon(
      Array.from({ length: 16 }, (_, i) => {
        const t = -Math.PI / 2 + (i * Math.PI) / 8;
        // Diamond silhouette (|x|+|y|=1) with scalloped edges.
        const d = 1 / (Math.abs(Math.cos(t)) + Math.abs(Math.sin(t)));
        const r = i % 2 ? d * 0.86 : d;
        return [r * Math.cos(t), r * Math.sin(t)] as Vec;
      }),
      alternate(8, 0.18, 0.05),
    ),
  "pixel-circle": () =>
    roundedPolygon(pixelRows([2, 4, 5, 5, 5, 5, 5, 5, 4, 2]), 0),
  "pixel-triangle": () =>
    roundedPolygon(pixelRows([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]), 0),
  bun: () =>
    roundedPolygon(
      [
        [-1, -0.7],
        [0, -0.48],
        [1, -0.7],
        [1, 0.7],
        [0, 0.48],
        [-1, 0.7],
      ],
      [0.6, 0.3, 0.6, 0.6, 0.3, 0.6],
    ),
  ghostish: () =>
    roundedPolygon(
      ghost(),
      [0.85, 0.85, 0.12, 0.14, 0.14, 0.14, 0.14, 0.14, 0.12],
    ),
  heart: () =>
    roundedPolygon(
      [
        [0, -0.5],
        [0.5, -0.95],
        [1, -0.42],
        [0, 0.95],
        [-1, -0.42],
        [-0.5, -0.95],
      ],
      [0.08, 0.55, 0.5, 0.16, 0.5, 0.55],
    ),
} satisfies Record<string, Recipe>;

export type ExpressiveShape = keyof typeof recipes;
export const expressiveShapes = Object.keys(recipes) as ExpressiveShape[];

/** Resample a dense outline: `count` points, even arc length, from top centre, clockwise. */
function resample(dense: readonly Vec[], count: number): Vec[] {
  // Clockwise on screen (y down) means a positive shoelace area.
  let area = 0;
  for (let i = 0; i < dense.length; i++) {
    const a = dense[i]!;
    const b = dense[(i + 1) % dense.length]!;
    area += a[0] * b[1] - b[0] * a[1];
  }
  const loop = area < 0 ? [...dense].reverse() : [...dense];
  // Start where the outline crosses the vertical centre line above the middle.
  const xs = loop.map((p) => p[0]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const ys = loop.map((p) => p[1]);
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  // Long straight edges have no points mid-edge, so find the exact crossing on
  // the topmost segment rather than the nearest stored point.
  let best = -1;
  let crossing: Vec = loop[0]!;
  loop.forEach((a, i) => {
    const b = loop[(i + 1) % loop.length]!;
    if ((a[0] - cx) * (b[0] - cx) > 0 || a[0] === b[0]) return;
    const t = (cx - a[0]) / (b[0] - a[0]);
    const y = a[1] + (b[1] - a[1]) * t;
    if (y < cy && (best < 0 || y < crossing[1])) {
      best = i;
      crossing = [cx, y];
    }
  });
  const start =
    best < 0
      ? loop
      : [crossing, ...loop.slice(best + 1), ...loop.slice(0, best + 1)];
  const lengths = [0];
  for (let i = 1; i <= start.length; i++)
    lengths.push(
      lengths[i - 1]! + len(sub(start[i % start.length]!, start[i - 1]!)),
    );
  const total = lengths[lengths.length - 1]!;
  const out: Vec[] = [];
  let seg = 1;
  for (let k = 0; k < count; k++) {
    const target = (k / count) * total;
    while (lengths[seg]! < target) seg++;
    const a = start[seg - 1]!;
    const b = start[seg % start.length]!;
    const span = lengths[seg]! - lengths[seg - 1]!;
    const t = span ? (target - lengths[seg - 1]!) / span : 0;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

const outlines = new Map<ExpressiveShape, readonly Vec[]>();

/** The shape's outline: `shapeSamples` points in a 0–100 box, aspect kept, centred. */
export function shapeOutline(name: ExpressiveShape): readonly Vec[] {
  const hit = outlines.get(name);
  if (hit) return hit;
  const points = resample(recipes[name](), shapeSamples);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX;
  const h = Math.max(...ys) - minY;
  const span = Math.max(w, h);
  const fitted = points.map(
    ([x, y]) =>
      [
        round(((x - minX + (span - w) / 2) / span) * 100),
        round(((y - minY + (span - h) / 2) / span) * 100),
      ] as Vec,
  );
  outlines.set(name, fitted);
  return fitted;
}

const round = (v: number) => Math.round(v * 100) / 100;

/** SVG path data (`M … L … Z`) for a 0 0 100 100 viewBox. Same command list for every shape, so `d` can transition. */
export function shapeSvgPath(name: ExpressiveShape): string {
  return (
    shapeOutline(name)
      .map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`)
      .join("") + "Z"
  );
}

/** CSS `polygon()` for `clip-path`; any two shapes transition point-for-point. */
export function shapePolygon(name: ExpressiveShape): string {
  return `polygon(${shapeOutline(name)
    .map(([x, y]) => `${x}% ${y}%`)
    .join(",")})`;
}
