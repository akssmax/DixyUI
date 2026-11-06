export interface BorderPoint {
  x: number;
  y: number;
  t: number;
}
export interface CornerRadius {
  x: number;
  y: number;
}
export interface BorderPath {
  total: number;
  corners: number[];
  r: number;
  at(distance: number): BorderPoint;
}

/** One perimeter in CSS pixels, including four independently sized elliptical corners. */
export function roundedBorder(
  width: number,
  height: number,
  input: readonly CornerRadius[],
): BorderPath {
  const w = Math.max(1, width),
    h = Math.max(1, height);
  const radii = input.map(({ x, y }) => ({
    x: Math.max(0, x),
    y: Math.max(0, y),
  }));
  const fit = Math.min(
    1,
    w / Math.max(1, radii[0].x + radii[1].x),
    w / Math.max(1, radii[3].x + radii[2].x),
    h / Math.max(1, radii[0].y + radii[3].y),
    h / Math.max(1, radii[1].y + radii[2].y),
  );
  for (const radius of radii) {
    radius.x *= fit;
    radius.y *= fit;
  }
  const points: { x: number; y: number; d: number }[] = [];
  const add = (x: number, y: number) => {
    const prior = points.at(-1);
    const distance = prior ? Math.hypot(x - prior.x, y - prior.y) : 0;
    if (prior && distance < 1e-8) return;
    points.push({ x, y, d: (prior?.d ?? 0) + distance });
  };
  const corners: number[] = [];
  add(radii[0].x, 0);
  const arc = (index: number, cx: number, cy: number, start: number) => {
    const radius = radii[index];
    for (let step = 0; step <= 16; step++) {
      const angle = start + ((step / 16) * Math.PI) / 2;
      add(cx + Math.cos(angle) * radius.x, cy + Math.sin(angle) * radius.y);
      if (step === 8) corners.push(points.at(-1)!.d);
    }
  };
  add(w - radii[1].x, 0);
  arc(1, w - radii[1].x, radii[1].y, -Math.PI / 2);
  add(w, h - radii[2].y);
  arc(2, w - radii[2].x, h - radii[2].y, 0);
  add(radii[3].x, h);
  arc(3, radii[3].x, h - radii[3].y, Math.PI / 2);
  add(0, radii[0].y);
  arc(0, radii[0].x, radii[0].y, Math.PI);
  add(radii[0].x, 0);
  const total = points.at(-1)!.d;
  return {
    total,
    corners,
    r: Math.max(...radii.map((radius) => radius.x)),
    at(distance) {
      const d = ((distance % total) + total) % total;
      let low = 1,
        high = points.length - 1;
      while (low < high) {
        const mid = (low + high) >> 1;
        if (points[mid].d < d) low = mid + 1;
        else high = mid;
      }
      const end = points[low],
        start = points[low - 1],
        mix = (d - start.d) / (end.d - start.d);
      return {
        x: start.x + (end.x - start.x) * mix,
        y: start.y + (end.y - start.y) * mix,
        t: Math.atan2(end.y - start.y, end.x - start.x),
      };
    },
  };
}

export function cssCornerRadius(
  value: string,
  width: number,
  height: number,
): CornerRadius {
  const [x, y = x] = value.trim().split(/\s+/);
  const pixels = (part: string, size: number) =>
    (Number.parseFloat(part) || 0) * (part.endsWith("%") ? size / 100 : 1);
  return { x: pixels(x, width), y: pixels(y, height) };
}

/** Conservative leaf envelope, preventing amputated tips in the overflow gutter. */
export function boundedLeafLength(
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
  height: number,
  gutter = 28,
) {
  const dx = Math.abs(Math.cos(angle)),
    dy = Math.abs(Math.sin(angle));
  return Math.max(
    0,
    Math.min(
      length,
      Math.min(x + gutter, width + gutter - x) / (dx + 0.45 * dy),
      Math.min(y + gutter, height + gutter - y) / (dy + 0.45 * dx),
    ),
  );
}
