/**
 * Painters for the 2026-11 frames: drafting (Blueprint), riso (Riso Zine),
 * neon (Neon Night Market), sumi (Sumi Ink) and transit (Tokyo Transit).
 *
 * Every painter follows the shared contract: it draws only around the card
 * edge (the canvas is clipped away from content by the frame's safe insets),
 * reads its four inks from the frame palette, and animates only while
 * `playing` is true, so reduced motion gets a still frame.
 * Card space: origin at the card's top-left, the card spans 0..w × 0..h.
 * `p.at(d).t` is the clockwise tangent, so `t - π/2` points outward.
 */
import {
  anchor,
  paintState,
  rand,
  tau,
  trace,
  type OrganicPainter,
  type OrganicPalette,
} from "./organic-paint.ts";

const out = (t: number) => t - Math.PI / 2;

function glow(ctx: CanvasRenderingContext2D, color: string, blur: number) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}
function noGlow(ctx: CanvasRenderingContext2D) {
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

/* ───────────────────────── Blueprint ───────────────────────── */

function arrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size, -size * 0.38);
  ctx.lineTo(-size, size * 0.38);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function dimension(
  ctx: CanvasRenderingContext2D,
  colors: OrganicPalette,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  label: string,
  font: string,
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = colors.b;
  ctx.fillStyle = colors.b;
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  arrow(ctx, x1, y1, angle + Math.PI, 5);
  arrow(ctx, x2, y2, angle, 5);
  ctx.save();
  ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
  ctx.rotate(Math.abs(angle) > 1 ? -Math.PI / 2 : 0);
  ctx.font = font;
  const width = ctx.measureText(label).width + 8;
  ctx.fillStyle = colors.paper;
  ctx.fillRect(-width / 2, -6, width, 12);
  ctx.fillStyle = colors.c;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 0, 0.5);
  ctx.restore();
}

export const paintDraft: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  _limits,
  shown = settings.density,
) => {
  const state = paintState(settings),
    seed = state.seed + index * 719,
    quiet = state.style === "Quiet draft",
    font = `500 ${Math.round(7 + state.scale * 0.12)}px "IBM Plex Mono", ui-monospace, monospace`;
  // Inked outline plus a dashed construction line just outside it.
  trace(ctx, p);
  ctx.strokeStyle = colors.a;
  ctx.lineWidth = 0.6 + state.weight * 0.012;
  ctx.stroke();
  if (!quiet) {
    trace(ctx, p, 4);
    ctx.setLineDash([5, 3, 1, 3]);
    ctx.strokeStyle = colors.b;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  // Ruler ticks: every fifth tick is long, like a scale rule.
  if (state.style === "Ruler ticks" || state.style === "Dimensioned") {
    const step = 4 + (100 - shown) * 0.08,
      span = state.style === "Ruler ticks" ? p.total : p.total * 0.25;
    ctx.strokeStyle = colors.a;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let d = 0, k = 0; d < span; d += step, k++) {
      const q = p.at(d),
        len = k % 5 ? 2.5 : 6,
        n = out(q.t);
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(q.x + Math.cos(n) * len, q.y + Math.sin(n) * len);
    }
    ctx.stroke();
  }
  // Dimension lines with extension lines and a measured label.
  if (state.style === "Dimensioned" && w > 120) {
    const gap = 10 + state.drape * 0.1;
    ctx.strokeStyle = colors.b;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(0, -gap - 4);
    ctx.moveTo(w, -3);
    ctx.lineTo(w, -gap - 4);
    ctx.moveTo(-3, 0);
    ctx.lineTo(-gap - 4, 0);
    ctx.moveTo(-3, h);
    ctx.lineTo(-gap - 4, h);
    ctx.stroke();
    dimension(ctx, colors, 0, -gap, w, -gap, `${Math.round(w)}`, font);
    if (h > 90)
      dimension(ctx, colors, -gap, h, -gap, 0, `${Math.round(h)}`, font);
  }
  // Construction lines run past the corners; registration crosshairs mark them.
  if (!quiet) {
    const reach = 8 + state.drape * 0.22;
    ctx.strokeStyle = colors.b;
    ctx.globalAlpha = state.style === "Construction lines" ? 0.75 : 0.4;
    ctx.lineWidth = 0.45;
    ctx.beginPath();
    for (const [x, y, dx, dy] of [
      [0, 0, -1, 0],
      [0, 0, 0, -1],
      [w, 0, 1, 0],
      [w, 0, 0, -1],
      [0, h, -1, 0],
      [0, h, 0, 1],
      [w, h, 1, 0],
      [w, h, 0, 1],
    ]) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx * reach, y + dy * reach);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    const marks = Math.round((state.corners / 100) * 4);
    for (let k = 0; k < marks; k++) {
      const [x, y] = [
        [-6, -6],
        [w + 6, h + 6],
        [w + 6, -6],
        [-6, h + 6],
      ][k];
      const r = 2.5 + state.scale * 0.08;
      ctx.strokeStyle = colors.a;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, tau);
      ctx.moveTo(x - r * 1.8, y);
      ctx.lineTo(x + r * 1.8, y);
      ctx.moveTo(x, y - r * 1.8);
      ctx.lineTo(x, y + r * 1.8);
      ctx.stroke();
    }
    if (state.style === "Construction lines") {
      // Compass arcs swung from two corners.
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      const r = 14 + state.scale * 0.9;
      ctx.arc(0, 0, r, Math.PI, Math.PI * 1.5);
      ctx.moveTo(w + r, h);
      ctx.arc(w, h, r, 0, Math.PI / 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  // Plotter head: a small dot that travels the outline while animated.
  if (playing && state.motion > 0) {
    const q = p.at((((clock * state.motion) / 900 + rand(seed)) % 1) * p.total);
    ctx.fillStyle = colors.c;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 1.8, 0, tau);
    ctx.fill();
  }
};

/* ───────────────────────── Riso Zine ───────────────────────── */

function tape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  color: string,
  seed: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const hh = 6.5;
  ctx.beginPath();
  ctx.moveTo(-length / 2, -hh);
  ctx.lineTo(length / 2, -hh);
  // Torn ends: a short zigzag rather than a clean cut.
  for (let k = 0; k <= 4; k++)
    ctx.lineTo(
      length / 2 + (k % 2 ? 2.2 : 0) + rand(seed + k) * 1.2,
      -hh + (hh * 2 * k) / 4,
    );
  ctx.lineTo(-length / 2, hh);
  for (let k = 4; k >= 0; k--)
    ctx.lineTo(
      -length / 2 - (k % 2 ? 2.2 : 0) - rand(seed + k + 9) * 1.2,
      -hh + (hh * 2 * k) / 4,
    );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.62;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function burst(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  spin: number,
) {
  ctx.beginPath();
  for (let k = 0; k < 16; k++) {
    const a = spin + (k / 16) * tau,
      rr = k % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

export const paintRiso: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  _limits,
  shown = settings.density,
) => {
  const state = paintState(settings),
    seed = state.seed + index * 719,
    clean = state.style === "Clean stamp",
    sway = playing ? Math.sin(clock * 0.9) * (state.motion / 100) : 0,
    shift = clean ? 0 : 2 + state.wild * 0.04 + sway;
  const weight = 1 + state.weight * 0.04;
  // Two inks printed on separate passes, slightly out of register.
  ctx.globalAlpha = 0.9;
  trace(ctx, p, 0, 0.25, seed);
  ctx.strokeStyle = colors.b;
  ctx.lineWidth = weight;
  ctx.stroke();
  ctx.save();
  ctx.translate(shift, shift * 0.6);
  trace(ctx, p, 0, 0.35, seed + 3);
  ctx.strokeStyle = colors.a;
  ctx.lineWidth = weight * 0.8;
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
  // Halftone dots fading out of the corners.
  if (state.style === "Halftone" || state.style === "Misprint") {
    const reach =
        14 + state.corners * (state.style === "Halftone" ? 0.42 : 0.22),
      step = 4.2;
    for (let k = 0; k < 4; k++) {
      const cx = k % 2 ? w : 0,
        cy = k > 1 ? h : 0,
        sx = k % 2 ? 1 : -1,
        sy = k > 1 ? 1 : -1;
      ctx.fillStyle = k % 2 ? colors.a : colors.b;
      for (let i = 0; i * step < reach; i++)
        for (let j = 0; j * step < reach; j++) {
          const x = cx + sx * (i * step + (j % 2) * step * 0.5 - reach * 0.3),
            y = cy + sy * (j * step - reach * 0.3),
            dist = Math.hypot(i * step, j * step) / reach;
          // Keep the dots off the card face: only the outside quarter.
          if ((x > 2 && x < w - 2 && y > 2 && y < h - 2) || dist > 1) continue;
          ctx.beginPath();
          ctx.arc(x, y, (1 - dist) * 1.7 + 0.2, 0, tau);
          ctx.fill();
        }
    }
  }
  // Masking tape on the corners.
  if (state.style === "Taped corners" || state.style === "Misprint") {
    const len = 26 + state.scale * 1.1,
      corners = state.style === "Taped corners" ? [0, 1, 2, 3] : [0, 3];
    for (const k of corners)
      tape(
        ctx,
        k % 2 ? w - 4 : 4,
        k > 1 ? h - 4 : 4,
        (k === 0 || k === 3 ? -0.75 : 0.75) + (rand(seed + k) - 0.5) * 0.3,
        len,
        colors.c,
        seed + k * 7,
      );
  }
  // Little print bursts along the edge, the zine's punctuation.
  if (!clean && state.style !== "Taped corners") {
    const count = Math.round(shown * 0.06);
    ctx.fillStyle = colors.d;
    for (let i = 0; i < count; i++) {
      const s = seed + i * 13,
        q = anchor(p, i, s, state),
        n = out(q.t),
        r = 2.5 + rand(s + 2) * state.scale * 0.18;
      ctx.globalAlpha = 0.85;
      burst(
        ctx,
        q.x + Math.cos(n) * (r + 3),
        q.y + Math.sin(n) * (r + 3),
        r,
        rand(s) * tau,
      );
    }
    ctx.globalAlpha = 1;
  }
};

/* ───────────────────────── Neon Night Market ───────────────────────── */

function signShape(
  ctx: CanvasRenderingContext2D,
  kind: number,
  x: number,
  y: number,
  r: number,
) {
  ctx.beginPath();
  if (kind === 0) {
    // Star
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k / 10) * tau,
        rr = k % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  } else if (kind === 1) {
    // Arrow
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r * 0.8, y);
    ctx.moveTo(x + r * 0.2, y - r * 0.6);
    ctx.lineTo(x + r * 0.8, y);
    ctx.lineTo(x + r * 0.2, y + r * 0.6);
  } else if (kind === 2) {
    // Ring
    ctx.arc(x, y, r * 0.8, 0, tau);
  } else {
    // Lightning
    ctx.moveTo(x + r * 0.2, y - r);
    ctx.lineTo(x - r * 0.4, y + r * 0.1);
    ctx.lineTo(x + r * 0.15, y + r * 0.1);
    ctx.lineTo(x - r * 0.25, y + r);
  }
  ctx.stroke();
}

export const paintNeon: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  _limits,
  shown = settings.density,
) => {
  const state = paintState(settings),
    seed = state.seed + index * 719,
    hum = state.style === "Low hum",
    broken = state.style === "Broken tubes",
    tube = 1.6 + state.weight * 0.03,
    bloom = hum ? 4 : 6 + state.drape * 0.14;
  const flicker = (k: number) =>
    playing &&
    state.motion > 0 &&
    !hum &&
    rand(Math.floor(clock * 9) * 3.1 + k + seed) < state.motion / 600
      ? 0.35
      : 1;
  // Tubes are drawn as runs between electrodes, so broken tubes leave real gaps.
  const runs: Array<[number, number]> = [];
  if (broken) {
    let d = rand(seed) * 30;
    while (d < p.total) {
      const len = 40 + rand(seed + d) * (60 + state.wild),
        gap = 7 + rand(seed + d + 1) * 10;
      runs.push([d, Math.min(p.total, d + len)]);
      d += len + gap;
    }
  } else runs.push([0, p.total]);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const offsetPath = (a: number, b: number, offset: number) => {
    ctx.beginPath();
    for (let d = a; d <= b; d += 3) {
      const q = p.at(Math.min(d, p.total - 0.01)),
        n = out(q.t);
      const x = q.x + Math.cos(n) * offset,
        y = q.y + Math.sin(n) * offset;
      if (d === a) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  };
  const tubes =
    state.wild > 50 && !hum
      ? [
          [3, colors.a],
          [8, colors.b],
        ]
      : [[3, colors.a]];
  tubes.forEach(([offset, color], t) =>
    runs.forEach(([a, b], k) => {
      ctx.globalAlpha = flicker(k + t * 31);
      offsetPath(a, b, offset as number);
      glow(ctx, color as string, bloom);
      ctx.strokeStyle = color as string;
      ctx.lineWidth = tube;
      ctx.stroke();
      noGlow(ctx);
      // The hot white core of the gas tube.
      ctx.strokeStyle = "rgba(255,255,255,.75)";
      ctx.lineWidth = tube * 0.35;
      ctx.stroke();
      if (broken) {
        ctx.fillStyle = colors.d;
        for (const d of [a, b]) {
          const q = p.at(Math.min(d, p.total - 0.01)),
            n = out(q.t);
          ctx.beginPath();
          ctx.arc(
            q.x + Math.cos(n) * (offset as number),
            q.y + Math.sin(n) * (offset as number),
            tube * 0.9,
            0,
            tau,
          );
          ctx.fill();
        }
      }
    }),
  );
  ctx.globalAlpha = 1;
  // Mounting clips holding the tube to the wall.
  if (!hum) {
    ctx.fillStyle = colors.d;
    const every = 70 + (100 - shown) * 1.2;
    for (let d = every / 2; d < p.total; d += every) {
      const q = p.at(d);
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate(q.t);
      ctx.fillRect(-1.5, -10, 3, 9);
      ctx.restore();
    }
  }
  // Sign shapes hung at the corners.
  if (!hum) {
    const count =
      state.style === "Sign shapes" ? 4 : Math.round((state.corners / 100) * 2);
    const spots = [
      [w - 6, -12],
      [-10, h * 0.32],
      [w + 10, h - 18],
      [18, h + 12],
    ];
    for (let k = 0; k < count; k++) {
      const [x, y] = spots[k],
        color = [colors.b, colors.c, colors.a, colors.c][k],
        r = 5 + state.scale * 0.32;
      ctx.globalAlpha = flicker(100 + k);
      glow(ctx, color, bloom);
      ctx.strokeStyle = color;
      ctx.lineWidth = tube;
      signShape(ctx, Math.floor(rand(seed + k * 5) * 4), x, y, r);
      noGlow(ctx);
      ctx.strokeStyle = "rgba(255,255,255,.7)";
      ctx.lineWidth = tube * 0.3;
      signShape(ctx, Math.floor(rand(seed + k * 5) * 4), x, y, r);
    }
    ctx.globalAlpha = 1;
  }
  // Light pooling on the wall under the bottom edge.
  const pool = ctx.createLinearGradient(0, h, 0, h + 26);
  pool.addColorStop(0, colors.a);
  pool.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = hum ? 0.06 : 0.12;
  ctx.fillStyle = pool;
  ctx.fillRect(8, h + 2, w - 16, 24);
  ctx.globalAlpha = 1;
};

/* ───────────────────────── Sumi Ink ───────────────────────── */

function brushLine(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  base: number,
  color: string,
  seed: number,
  dry: number,
) {
  // A brush stroke: width swells and tapers, and a dry brush skips and splits.
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  for (let i = 1; i < points.length; i++) {
    const u = i / points.length,
      taper = Math.sin(u * Math.PI) ** 0.6,
      ink = 0.55 + 0.45 * Math.sin(i * 0.21 + seed);
    if (dry > 0 && rand(seed + i * 0.7) < dry * (0.2 + u * 0.6)) continue;
    ctx.lineWidth = Math.max(0.35, base * taper * ink);
    ctx.beginPath();
    ctx.moveTo(points[i - 1][0], points[i - 1][1]);
    ctx.lineTo(points[i][0], points[i][1]);
    ctx.stroke();
    if (dry > 0 && i % 2) {
      // Bristle streaks beside the main stroke.
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 0.35;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(points[i - 1][0], points[i - 1][1] + side * base * 0.45);
        ctx.lineTo(points[i][0], points[i][1] + side * base * 0.45);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }
}

function bambooLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.35, -length * 0.14, length, 0);
  ctx.quadraticCurveTo(length * 0.35, length * 0.1, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function seal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  paper: string,
  seed: number,
) {
  // A hanko: a carved red square with abstract strokes (not real characters).
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rand(seed) - 0.5) * 0.08);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.roundRect(-size / 2, -size / 2, size, size, size * 0.12);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = paper;
  ctx.lineWidth = Math.max(0.8, size * 0.08);
  ctx.lineCap = "square";
  const q = size * 0.26;
  ctx.beginPath();
  ctx.moveTo(-q, -q);
  ctx.lineTo(q, -q);
  ctx.moveTo(0, -q);
  ctx.lineTo(0, q);
  ctx.moveTo(-q, q * 0.2);
  ctx.lineTo(-q * 0.2, q);
  ctx.moveTo(q, q * 0.2);
  ctx.lineTo(q * 0.3, q);
  ctx.stroke();
  ctx.restore();
}

export const paintSumi: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  _limits,
  shown = settings.density,
) => {
  const state = paintState(settings),
    seed = state.seed + index * 719,
    dry = state.style === "Dry brush" ? 0.55 : state.wild / 400,
    base = 1 + state.weight * 0.05;
  // The border itself, painted in four strokes like a calligrapher would.
  for (let side = 0; side < 4; side++) {
    const a = p.corners[side],
      b = p.corners[(side + 1) % 4] || p.total,
      span = (b - a + p.total) % p.total;
    const pts: Array<[number, number]> = [];
    for (let d = 0; d <= span; d += 3) {
      const q = p.at((a + d) % p.total),
        n = out(q.t),
        wob = Math.sin(d * 0.05 + seed + side) * 0.6;
      pts.push([q.x + Math.cos(n) * wob, q.y + Math.sin(n) * wob]);
    }
    brushLine(ctx, pts, base, colors.a, seed + side * 11, dry);
  }
  const sway = playing ? Math.sin(clock * 0.8) * 0.05 * (state.motion / 50) : 0;
  // Bamboo grows from the frame: a ground stroke continues the bottom border past the
  // corner, and one tapered stalk rises from it beside the left edge.
  if (state.style === "Bamboo") {
    const x0 = -9,
      top = h * (0.6 - state.drape / 250),
      lean = -2.5,
      at = (y: number) => x0 + lean * ((h - y) / (h - top)) ** 2;
    brushLine(
      ctx,
      [
        [-22, h + 0.6],
        [-14, h + 0.9],
        [-6, h + 0.5],
        [Math.min(p.r, 10), h],
      ],
      base * 1.4,
      colors.a,
      seed + 21,
      dry * 0.5,
    );
    ctx.strokeStyle = colors.b;
    ctx.lineCap = "round";
    for (let y = h; y > top; y -= 2) {
      ctx.lineWidth = 3.4 - ((h - y) / (h - top)) * 1.6;
      ctx.beginPath();
      ctx.moveTo(at(y), y);
      ctx.lineTo(at(Math.max(top, y - 2)), Math.max(top, y - 2));
      ctx.stroke();
    }
    const nodes: number[] = [];
    for (let y = h, k = 0; ; k++) {
      y -= 20 + rand(seed + k) * 12;
      if (y < top + 10) break;
      nodes.push(y);
    }
    // Node rings in the darker ink, slightly bowed, instead of gaps in the stalk.
    ctx.strokeStyle = colors.a;
    ctx.lineWidth = 1;
    for (const y of nodes) {
      const x = at(y),
        r = 2.2 - ((h - y) / (h - top)) * 0.7;
      ctx.beginPath();
      ctx.moveTo(x - r, y + 0.5);
      ctx.quadraticCurveTo(x, y - 0.9, x + r, y + 0.5);
      ctx.stroke();
    }
    // Leaves droop in fans from the upper nodes; most point away from the card, and the
    // few that cross the edge are short enough to stay in its padding.
    const fans = Math.min(nodes.length, Math.round(1 + shown * 0.035)),
      len = 11 + state.scale * 0.7;
    for (let i = 0; i < fans; i++) {
      const y = nodes[nodes.length - 1 - i],
        x = at(y),
        inward = i % 2 === 1,
        count = 2 + (rand(seed + i * 5) < 0.5 ? 1 : 0);
      for (let k = 0; k < count; k++) {
        const droop = 0.25 + k * 0.38 + (rand(seed + i * 7 + k) - 0.5) * 0.2;
        bambooLeaf(
          ctx,
          x + (inward ? 1 : -1),
          y - 1,
          (inward ? droop : Math.PI - droop) + sway,
          len * (inward ? 0.6 : 1) * (0.8 + rand(seed + i + k * 3) * 0.35),
          colors.b,
        );
      }
    }
    // The growing tip ends in a pair of young leaves.
    bambooLeaf(
      ctx,
      at(top),
      top,
      -Math.PI / 2 - 0.5 + sway,
      len * 0.55,
      colors.b,
    );
    bambooLeaf(
      ctx,
      at(top),
      top,
      -Math.PI / 2 + 0.35 + sway,
      len * 0.45,
      colors.b,
    );
  }
  // A plum branch along the top edge, blossoms in the accent ink.
  if (state.style === "Plum blossom") {
    // The branch leaves the frame at the top-left corner and arcs along the top edge.
    const root = p.r * 0.3,
      pts: Array<[number, number]> = [[root, root * 0.4]];
    const end = w * (0.3 + state.drape / 220);
    for (let x = root + 6; x < end; x += 8 + rand(seed + x) * 8) {
      const u = (x - root) / (end - root);
      pts.push([x, -Math.sin(u * Math.PI) * 7 - rand(seed + x * 0.3) * 2]);
    }
    brushLine(ctx, pts, base * 1.6, colors.a, seed + 4, 0.15);
    const blooms = Math.round(2 + shown * 0.07);
    for (let i = 0; i < blooms; i++) {
      const [bx, by] = pts[Math.floor(rand(seed + i * 3) * pts.length)],
        r = 2 + state.scale * 0.09,
        dropY = playing && i === 0 ? (clock * 6) % 40 : 0;
      ctx.fillStyle = colors.c;
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * tau + rand(seed + i);
        ctx.beginPath();
        ctx.arc(
          bx + Math.cos(a) * r,
          by - 3 + Math.sin(a) * r + dropY,
          r * 0.75,
          0,
          tau,
        );
        ctx.fill();
      }
      ctx.fillStyle = colors.d;
      ctx.beginPath();
      ctx.arc(bx, by - 3 + dropY, r * 0.35, 0, tau);
      ctx.fill();
    }
  }
  // Ensō: one open circle, never closed.
  if (state.style === "Ensō") {
    const r = 10 + state.scale * 0.7,
      cx = w + 2,
      cy = h + 2,
      pts: Array<[number, number]> = [];
    for (let a = 0.35; a < tau - 0.25; a += 0.12)
      pts.push([cx + Math.cos(a + 1.2) * r, cy + Math.sin(a + 1.2) * r]);
    brushLine(ctx, pts, base * 2.4, colors.a, seed + 9, 0.25);
  }
  // The artist's seal, stamped on one corner.
  if (state.corners > 25)
    seal(
      ctx,
      w - 10,
      h + 10,
      9 + state.scale * 0.35,
      colors.d,
      colors.paper,
      seed,
    );
};

/* ───────────────────────── Tokyo Transit ───────────────────────── */

const lineLetters = ["G", "M", "H", "T", "C", "Y", "Z", "N", "F"];

function roundel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  ink: string,
  code: string,
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, tau);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = Math.max(1.6, r * 0.24);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(r * 0.62)}px "Zen Kaku Gothic New", "Hiragino Sans", ui-sans-serif, sans-serif`;
  ctx.fillText(code[0], x, y - r * 0.24);
  ctx.font = `700 ${Math.round(r * 0.5)}px "Zen Kaku Gothic New", "Hiragino Sans", ui-sans-serif, sans-serif`;
  ctx.fillText(code.slice(1), x, y + r * 0.34);
}

export const paintTransit: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  _limits,
  shown = settings.density,
) => {
  const state = paintState(settings),
    seed = state.seed + index * 719,
    quiet = state.style === "Quiet line",
    band = 2 + state.weight * 0.04,
    lineColors = [colors.a, colors.b, colors.c];
  trace(ctx, p);
  ctx.strokeStyle = colors.d;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 0.75;
  ctx.stroke();
  ctx.globalAlpha = 1;
  // Route lines: parallel bands along the top that bend 45° down a side,
  // the way metro maps draw them.
  const lines = quiet ? 1 : state.style === "Line map" ? 3 : 2,
    drop = Math.min(h - 20, 30 + state.drape * 1.4);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let k = 0; k < lines; k++) {
    const o = 5 + k * (band + 1.6),
      start = p.r + 6 + k * 3;
    ctx.beginPath();
    ctx.moveTo(start, -o);
    ctx.lineTo(w - o * 0.4 - 8, -o);
    ctx.lineTo(w + o, -o + o * 1.4 + 8);
    ctx.lineTo(w + o, drop + k * 6);
    ctx.strokeStyle = lineColors[k];
    ctx.lineWidth = band;
    ctx.stroke();
  }
  if (!quiet) {
    // Stations: white ticks with a dark ring; interchanges span every line.
    const step = 60 + (100 - shown) * 1.1;
    for (let x = p.r + 26, i = 0; x < w - 30; x += step, i++) {
      const interchange = lines > 1 && i % 3 === 1;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = colors.d;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      if (interchange) {
        const top = -5 - (lines - 1) * (band + 1.6) - band;
        ctx.roundRect(x - 3.2, top - 1.5, 6.4, -top - 5 + band + 3, 3.2);
      } else ctx.arc(x, -5, band * 0.9 + 0.8, 0, tau);
      ctx.fill();
      ctx.stroke();
    }
  }
  // Numbered station roundels on the corners.
  const roundels =
    state.style === "Station roundels"
      ? 4
      : quiet
        ? 0
        : Math.round((state.corners / 100) * 2);
  const spots = [
    [-4, -4],
    [w + 4, h + 4],
    [-4, h + 4],
    [w + 4, -4],
  ];
  for (let k = 0; k < roundels; k++) {
    const [x, y] = spots[k],
      code =
        lineLetters[Math.floor(rand(seed + k) * lineLetters.length)] +
        String(1 + Math.floor(rand(seed + k + 4) * 28)).padStart(2, "0");
    roundel(
      ctx,
      x,
      y,
      7 + state.scale * 0.28,
      lineColors[k % 3],
      colors.d,
      code,
    );
  }
  // Platform edge: the tactile yellow strip with raised dots, below the card.
  if (state.style === "Platform edge") {
    const y = h + 5,
      depth = 6 + state.scale * 0.2;
    ctx.fillStyle = "#e9b616";
    ctx.fillRect(p.r, y, w - p.r * 2, depth);
    ctx.fillStyle = "rgba(0,0,0,.22)";
    for (let x = p.r + 3; x < w - p.r - 2; x += 4)
      for (let yy = y + 2; yy < y + depth - 1; yy += 4) {
        ctx.beginPath();
        ctx.arc(x, yy, 0.8, 0, tau);
        ctx.fill();
      }
    ctx.strokeStyle = "#ffffff";
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.r, y + depth + 3);
    ctx.lineTo(w - p.r, y + depth + 3);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // A train glides along the top line while animated.
  if (playing && state.motion > 0) {
    const span = w - p.r - 14,
      x = p.r + 6 + ((clock * state.motion * 0.5 + rand(seed) * span) % span);
    ctx.fillStyle = colors.a;
    ctx.beginPath();
    ctx.roundRect(x - 7, -5 - band / 2 - 1.5, 14, band + 3, 2.5);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 2.5, -5 - band / 2, 2.5, band);
  }
};

export const worldPainters = {
  drafting: paintDraft,
  riso: paintRiso,
  neon: paintNeon,
  sumi: paintSumi,
  transit: paintTransit,
} as const;
