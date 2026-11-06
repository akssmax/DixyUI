import { boundedLeafLength, type BorderPath } from "./organic-geometry.ts";
import type { ThemeDocument } from "./theme-schema.ts";
export interface OrganicPalette {
  a: string;
  b: string;
  c: string;
  d: string;
  paper: string;
  line: string;
}
type LeafSpecies =
  | "ivy"
  | "oak"
  | "birch"
  | "willow"
  | "bud"
  | "fern"
  | "ginkgo"
  | "maple"
  | "eucalyptus"
  | "olive"
  | "clover"
  | "blossom"
  | "berry";
export type OrganicSettings = ThemeDocument["recipes"]["frame"]["ornament"];
const tau = Math.PI * 2;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const rand = (n: number) => {
  const x = Math.sin(n * 127.13 + 39.71) * 43758.5453;
  return x - Math.floor(x);
};
/**
 * The frame contract every painter shares: the outline follows the card's own rounded
 * rectangle, and hand-made character may waver it by at most this many pixels. Character
 * comes from ornaments, texture and colour, never from bending the edge away from the
 * crisp controls inside it.
 */
export const maxWaver = 1.5;
function trace(
  ctx: CanvasRenderingContext2D,
  p: BorderPath,
  offset = 0,
  waver = 0,
  seed = 0,
  phase = 0,
) {
  const noise = Math.min(Math.abs(waver), maxWaver);
  ctx.beginPath();
  for (let d = 0; d < p.total; d += 3) {
    const q = p.at(d),
      o =
        offset +
        noise *
          (Math.sin(d * 0.027 + seed) * 0.6 +
            Math.sin(d * 0.081 + seed * 2 + phase) * 0.4),
      x = q.x + Math.cos(q.t - Math.PI / 2) * o,
      y = q.y + Math.sin(q.t - Math.PI / 2) * o;
    if (!d) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}
function petal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  l: number,
  species: LeafSpecies,
  colors: OrganicPalette,
  seed: number,
  width = 1,
) {
  if (l < 0.25) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const bend = (rand(seed + 19) - 0.5) * l * 0.24;
  // Shapes taken from real plants. Each is drawn in leaf space: base at the origin, tip along +x.
  if (species === "ginkgo") {
    // Fan leaf on a long petiole, with the notch that gives ginkgo its two lobes.
    const stalk = l * 0.2,
      r = l * 0.62,
      spread = 0.78;
    ctx.strokeStyle = colors.d;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(stalk, bend * 0.2);
    ctx.stroke();
    ctx.translate(stalk, bend * 0.2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(-spread) * r, Math.sin(-spread) * r);
    for (let j = 0; j <= 16; j++) {
      const a = -spread + (spread * 2 * j) / 16,
        notch = Math.abs(a) < 0.1 ? 0.72 + Math.abs(a) * 2.8 : 1,
        wave = 1 + Math.sin(j * 2.3 + seed) * 0.035;
      ctx.lineTo(
        Math.cos(a) * r * notch * wave,
        Math.sin(a) * r * notch * wave,
      );
    }
    ctx.closePath();
    const fan = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    fan.addColorStop(0, colors.a);
    fan.addColorStop(1, rand(seed + 4) > 0.5 ? colors.c : colors.b);
    ctx.fillStyle = fan;
    ctx.fill();
    // Fine radiating veins, the ginkgo's signature.
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = colors.a;
    ctx.lineWidth = 0.4;
    for (let j = 1; j < 8; j++) {
      const a = -spread + (spread * 2 * j) / 8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }
  if (species === "maple") {
    // Palmate leaf: five pointed lobes with shallow serration and veins to each tip.
    const stalk = l * 0.14,
      R = l * 0.55;
    ctx.strokeStyle = colors.d;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(stalk, 0);
    ctx.stroke();
    ctx.translate(stalk + R * 0.18, 0);
    const lobes = [
      [-1.35, 0.62],
      [-0.68, 0.88],
      [0, 1],
      [0.68, 0.88],
      [1.35, 0.62],
    ];
    ctx.beginPath();
    ctx.moveTo(-R * 0.18, 0);
    for (const [k, [a, len]] of lobes.entries()) {
      const prev = k ? lobes[k - 1][0] : a - 0.6;
      const sinus = (a + prev) / 2;
      ctx.lineTo(Math.cos(sinus) * R * 0.38, Math.sin(sinus) * R * 0.38);
      ctx.lineTo(
        Math.cos(a - 0.16) * R * len * 0.72,
        Math.sin(a - 0.16) * R * len * 0.72,
      );
      ctx.lineTo(Math.cos(a) * R * len, Math.sin(a) * R * len);
      ctx.lineTo(
        Math.cos(a + 0.16) * R * len * 0.72,
        Math.sin(a + 0.16) * R * len * 0.72,
      );
    }
    ctx.lineTo(Math.cos(1.95) * R * 0.32, Math.sin(1.95) * R * 0.32);
    ctx.closePath();
    const g = ctx.createLinearGradient(-R * 0.2, -R, R, R);
    g.addColorStop(0, colors.b);
    g.addColorStop(1, colors.a);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = colors.c;
    ctx.lineWidth = 0.45;
    for (const [a, len] of lobes) {
      ctx.beginPath();
      ctx.moveTo(-R * 0.12, 0);
      ctx.lineTo(Math.cos(a) * R * len * 0.9, Math.sin(a) * R * len * 0.9);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }
  if (species === "eucalyptus") {
    // Silver-dollar sprig: round coin leaves in opposite pairs, shrinking toward the tip.
    ctx.strokeStyle = colors.d;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(l * 0.5, bend, l, bend * 0.4);
    ctx.stroke();
    for (let j = 0; j < 4; j++) {
      const u = 0.18 + j * 0.24,
        r = l * (0.17 - j * 0.03),
        y = bend * Math.sin(u * Math.PI) * 0.5;
      for (const sign of j === 3 ? [0] : [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(l * u, y + sign * r * 0.95, r, r * 0.92, 0, 0, tau);
        ctx.fillStyle = (j + sign) % 2 ? colors.c : colors.b;
        ctx.globalAlpha = 0.92;
        ctx.fill();
      }
    }
    ctx.restore();
    return;
  }
  if (species === "clover") {
    // Trefoil: three heart-shaped leaflets, each with the pale chevron clover carries.
    ctx.strokeStyle = colors.d;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(l * 0.16, bend * 0.1);
    ctx.stroke();
    ctx.translate(l * 0.16, bend * 0.1);
    const r = l * 0.26;
    for (const a of [-1.05, 0, 1.05]) {
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        r * 0.2,
        -r * 1.1,
        r * 1.5,
        -r * 0.9,
        r * 1.25,
        -r * 0.05,
      );
      ctx.lineTo(r * 1.1, 0);
      ctx.lineTo(r * 1.25, r * 0.05);
      ctx.bezierCurveTo(r * 1.5, r * 0.9, r * 0.2, r * 1.1, 0, 0);
      ctx.fillStyle = colors.b;
      ctx.fill();
      ctx.strokeStyle = colors.a;
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.strokeStyle = colors.c;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(r * 0.45, -r * 0.35);
      ctx.lineTo(r * 0.75, 0);
      ctx.lineTo(r * 0.45, r * 0.35);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    ctx.restore();
    return;
  }
  if (species === "blossom") {
    // Five-petal wildflower (dog rose / bramble): cream petals, warm centre.
    const r = l * 0.32;
    ctx.translate(l * 0.5, 0);
    for (let j = 0; j < 5; j++) {
      ctx.save();
      ctx.rotate((tau * j) / 5 + seed);
      ctx.beginPath();
      ctx.ellipse(r * 0.62, 0, r * 0.62, r * 0.42, 0, 0, tau);
      ctx.fillStyle = "rgba(255,250,238,.94)";
      ctx.fill();
      ctx.strokeStyle = colors.b;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 0.4;
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.28, 0, tau);
    ctx.fillStyle = "#d9a441";
    ctx.fill();
    ctx.restore();
    return;
  }
  if (species === "berry") {
    // A small hanging cluster, like rowan or elder.
    ctx.strokeStyle = colors.d;
    ctx.lineWidth = 0.5;
    const r = Math.max(1.4, l * 0.11);
    for (const [u, v] of [
      [0.55, -0.12],
      [0.7, 0.1],
      [0.62, 0.32],
      [0.82, -0.05],
    ]) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(l * u, l * v);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(l * u, l * v, r, 0, tau);
      ctx.fillStyle = "#a8473a";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(l * u - r * 0.35, l * v - r * 0.35, r * 0.3, 0, tau);
      ctx.fillStyle = "rgba(255,255,255,.45)";
      ctx.fill();
    }
    ctx.restore();
    return;
  }
  if (species === "fern") {
    ctx.strokeStyle = colors.c;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(l * 0.6, bend, l, bend * 0.5);
    ctx.stroke();
    for (let j = 1; j < 7; j++) {
      const u = j / 8,
        leafL = l * (1 - u) * 0.43;
      for (const sign of [-1, 1])
        petal(
          ctx,
          l * u,
          bend * Math.sin(u * Math.PI) * 0.6,
          sign * (0.75 + 0.25 * u),
          leafL,
          "willow",
          colors,
          seed + j + sign,
          0.8,
        );
    }
    ctx.restore();
    return;
  }
  const widths: Record<string, number> = {
      ivy: 0.38,
      oak: 0.32,
      birch: 0.35,
      willow: 0.16,
      bud: 0.22,
      olive: 0.13,
    },
    w = l * (widths[species] || 0.3) * width;
  const gradient = ctx.createLinearGradient(0, -w, l * 0.25, w);
  if (species === "olive") {
    // Olive leaves show a silvery underside along one edge.
    gradient.addColorStop(0, colors.c);
    gradient.addColorStop(0.5, colors.c);
    gradient.addColorStop(0.52, colors.a);
    gradient.addColorStop(1, colors.a);
  } else {
    gradient.addColorStop(0, colors.b);
    gradient.addColorStop(0.42, rand(seed + 4) > 0.65 ? colors.c : colors.b);
    gradient.addColorStop(1, colors.a);
  }
  ctx.beginPath();
  ctx.moveTo(0, 0);
  if (species === "ivy") {
    ctx.bezierCurveTo(
      l * 0.07,
      -w * 0.7,
      l * 0.2,
      -w * 1.15,
      l * 0.39,
      -w * 0.72,
    );
    ctx.quadraticCurveTo(l * 0.36, -w * 1.65, l * 0.59, -w * 0.8);
    ctx.quadraticCurveTo(l * 0.84, -w * 0.9, l, bend);
    ctx.quadraticCurveTo(l * 0.77, w * 0.6, l * 0.55, w * 0.8);
    ctx.quadraticCurveTo(l * 0.38, w * 1.65, l * 0.35, w * 0.66);
    ctx.bezierCurveTo(l * 0.12, w * 1.1, l * 0.05, w * 0.5, 0, 0);
  } else {
    for (let side = -1; side <= 1; side += 2) {
      for (
        let j = side === -1 ? 1 : 24;
        side === -1 ? j <= 24 : j >= 0;
        j += side === -1 ? 1 : -1
      ) {
        const u = j / 24;
        let bulge = Math.sin(Math.PI * u);
        if (species === "oak") bulge *= 0.68 + 0.32 * Math.cos(u * Math.PI * 9);
        if (species === "birch") bulge *= 1 + (j % 2 ? -0.08 : 0.08);
        ctx.lineTo(
          u * l,
          Math.sin(u * Math.PI) * bend +
            side * w * bulge * (1 + 0.08 * Math.sin(seed + j)),
        );
      }
    }
  }
  ctx.closePath();
  ctx.shadowColor = "rgba(0,0,0,.12)";
  ctx.shadowBlur = 1.5;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.globalAlpha = 0.52;
  ctx.strokeStyle = colors.c;
  ctx.lineWidth = 0.55;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(l * 0.55, bend, l * 0.94, bend * 0.15);
  ctx.stroke();
  for (let j = 1; j <= 4; j++) {
    const u = j / 6;
    ctx.beginPath();
    ctx.moveTo(l * u, bend * Math.sin(u * Math.PI) * 0.4);
    ctx.lineTo(l * (u + 0.14), -w * Math.sin(u * Math.PI) * 0.7 + bend * 0.3);
    ctx.moveTo(l * u, bend * Math.sin(u * Math.PI) * 0.4);
    ctx.lineTo(l * (u + 0.1), w * Math.sin(u * Math.PI) * 0.66 + bend * 0.3);
    ctx.stroke();
  }
  ctx.restore();
}

export interface ContentInsets {
  top: number;
  inline: number;
  bottom: number;
}
export type OrganicPainter = (
  ctx: CanvasRenderingContext2D,
  p: BorderPath,
  w: number,
  h: number,
  settings: OrganicSettings,
  colors: OrganicPalette,
  clock: number,
  playing: boolean,
  index: number,
  limits: ContentInsets,
  shown?: number,
) => void;
function paintState(settings: OrganicSettings) {
  return {
    amount: settings.density,
    corners: settings.cornerDensity,
    drape: settings.canopyDepth,
    wild: settings.variation,
    scale: settings.scale,
    weight: settings.stemWeight,
    motion: settings.motion,
    seed: settings.seed,
    style: settings.style,
    canopy: settings.canopy,
    stem: settings.stem,
  };
}
type PaintState = ReturnType<typeof paintState>;
function anchor(p: BorderPath, i: number, seed: number, state: PaintState) {
  const clustered = rand(seed + 1) < (state.corners / 100) * 0.72;
  const base = clustered
    ? p.corners[i % 4] + (rand(seed + 2) - 0.5) * (65 + state.wild * 0.6)
    : ((i * 0.61803398875 + rand(state.seed + 1) * 0.18) % 1) * p.total;
  return p.at(base);
}
function bead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  angle: number,
  fill: string,
  colors: OrganicPalette,
  glass = false,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const g = ctx.createRadialGradient(
    -rx * 0.25,
    -ry * 0.4,
    1,
    0,
    0,
    Math.max(rx, ry),
  );
  g.addColorStop(0, colors.paper);
  g.addColorStop(glass ? 0.25 : 0.1, fill);
  g.addColorStop(1, glass ? colors.a : fill);
  ctx.globalAlpha = glass ? 0.7 : 1;
  ctx.shadowColor = "rgba(0,0,0,.12)";
  ctx.shadowBlur = glass ? 4 : 2;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, tau);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.beginPath();
  ctx.ellipse(-rx * 0.2, -ry * 0.4, rx * 0.38, ry * 0.12, -0.2, 0, tau);
  ctx.fillStyle = colors.paper;
  ctx.globalAlpha = 0.55;
  ctx.fill();
  ctx.restore();
}

export const paintForest: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) => {
  const state = paintState(settings);

  const tender = state.stem === "Tender shoots",
    woody = state.stem === "Woody branches",
    mossy = state.stem === "Mossy roots";
  const weight =
      (1.15 + state.weight * 0.035) *
      (tender ? 0.5 : woody ? 1.5 : mossy ? 1.8 : 1),
    vari = state.wild / 100,
    seed = state.seed + index * 719;
  trace(ctx, p, -0.5, vari * (woody ? 3.2 : 2.2), seed);
  ctx.strokeStyle = tender ? colors.b : colors.d;
  ctx.lineWidth = weight + (tender ? 0.2 : 1.2);
  ctx.stroke();
  if (!tender) {
    trace(ctx, p, 1.3, vari * 2.4, seed + 1);
    ctx.strokeStyle = colors.b;
    ctx.lineWidth = weight * 0.6;
    ctx.stroke();
  }
  trace(ctx, p, 0, vari, seed);
  ctx.strokeStyle = colors.a;
  ctx.lineWidth = 0.65;
  ctx.stroke();
  if (woody || mossy)
    for (let j = 0; j < p.total; j += mossy ? 7 : 15) {
      const q = p.at(j);
      if (mossy) {
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.ellipse(
          q.x + Math.sin(j) * 2,
          q.y + Math.cos(j) * 2,
          1.3 + rand(j) * 2,
          0.9,
          q.t,
          0,
          tau,
        );
        ctx.fillStyle = rand(j) > 0.6 ? colors.b : colors.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        ctx.moveTo(q.x - Math.cos(q.t + 1) * 2, q.y - Math.sin(q.t + 1) * 2);
        ctx.lineTo(q.x + Math.cos(q.t + 1) * 2, q.y + Math.sin(q.t + 1) * 2);
        ctx.strokeStyle = colors.d;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  const maxCanopy = Math.max(0, limits.top - state.scale - 6),
    depth = Math.min(state.drape * 0.48, maxCanopy),
    stems = [],
    stemCount =
      state.canopy === "Open crown"
        ? 2
        : state.canopy === "Corner cascades"
          ? 4
          : state.canopy === "Long tendrils"
            ? 8
            : state.canopy === "Overhead boughs"
              ? 3
              : 6;
  for (let k = 0; k < stemCount; k++) {
    let fraction = (k + 0.45) / stemCount + (rand(seed + k) - 0.5) * 0.08;
    if (state.canopy === "Corner cascades")
      fraction = [0.02, 0.13, 0.87, 0.98][k];
    if (state.canopy === "Open crown") fraction = k ? 0.97 : 0.03;
    const x = p.r + 8 + (w - 2 * p.r - 16) * fraction,
      len = Math.min(
        maxCanopy,
        (state.canopy === "Long tendrils" ? 20 : 8) +
          depth * (0.35 + rand(seed + k + 4) * 0.65),
      );
    const bend =
      (rand(seed + k + 9) - 0.5) *
      (state.canopy === "Overhead boughs"
        ? 64
        : state.canopy === "Long tendrils"
          ? 10
          : 22);
    stems.push({ x, len, bend });
    if (state.drape > 0 && shown > 0) {
      // One gentle arc, like a stem hanging under its own weight (no S-wiggle).
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(
        x + bend * 0.3,
        len * 0.3,
        x + bend,
        len * 0.65,
        x + bend * 0.8,
        len,
      );
      ctx.lineCap = "round";
      ctx.strokeStyle = colors.d;
      ctx.lineWidth = weight * 0.42;
      ctx.stroke();
    }
  }
  const total = clamp(shown / 100) * 160;
  const mixes: Record<string, LeafSpecies[]> = {
      "Woodland mix": [
        "ivy",
        "birch",
        "oak",
        "willow",
        "fern",
        "ivy",
        "birch",
        "bud",
      ],
      "Wild ivy": ["ivy", "ivy", "ivy", "birch", "bud"],
      "Fern grove": ["fern", "fern", "birch", "willow"],
      "Willow canopy": ["willow", "willow", "willow", "birch", "bud"],
      "Oak & moss": ["oak", "oak", "fern", "birch"],
      "Spring growth": ["bud", "birch", "ivy", "bud", "willow"],
      "Ginkgo fans": ["ginkgo", "ginkgo", "ginkgo", "bud"],
      "Maple grove": ["maple", "maple", "birch", "maple", "bud"],
      Eucalyptus: ["eucalyptus", "eucalyptus", "willow"],
      "Olive branch": ["olive", "olive", "olive", "willow", "berry"],
      "Clover meadow": ["clover", "clover", "blossom", "fern", "clover"],
      "Wildflower hedge": [
        "ivy",
        "blossom",
        "birch",
        "berry",
        "ivy",
        "fern",
        "blossom",
        "clover",
      ],
    },
    mix = mixes[state.style] ?? mixes["Woodland mix"];
  for (let i = 0; i < Math.ceil(total); i++) {
    const s = seed + i * 31.23,
      grow = clamp(total - i);
    let q = anchor(p, i, s, state),
      tipX: number,
      tipY: number,
      angle: number;
    if (
      rand(s + 3) <
      (state.drape / 100) *
        (state.canopy === "Open crown"
          ? 0.14
          : state.canopy === "Overhead boughs"
            ? 0.48
            : 0.32)
    ) {
      const st = stems[i % stems.length],
        u = 0.2 + rand(s + 9) * 0.8,
        v = 1 - u;
      // Point and tangent on the hanging stem's actual bezier, so leaves sit on it.
      const bx = [
          st.x,
          st.x + st.bend * 0.3,
          st.x + st.bend,
          st.x + st.bend * 0.8,
        ],
        by = [0, st.len * 0.3, st.len * 0.65, st.len];
      const at = (c: number[]) =>
          v * v * v * c[0] +
          3 * v * v * u * c[1] +
          3 * v * u * u * c[2] +
          u * u * u * c[3],
        slope = (c: number[]) =>
          3 * v * v * (c[1] - c[0]) +
          6 * v * u * (c[2] - c[1]) +
          3 * u * u * (c[3] - c[2]);
      const t = Math.atan2(slope(by), slope(bx));
      q = { x: at(bx), y: at(by), t };
      // Leaves angle down-and-out from the stem, alternating sides like real nodes.
      angle = t + (i % 2 ? 1 : -1) * (0.55 + rand(s + 7) * 0.35);
      tipX = q.x;
      tipY = q.y;
    } else {
      // A real side shoot leaves the vine at a slant, in the vine's growth direction,
      // then arcs outward. The leaf continues the twig's last direction, so there is no kink.
      const side = rand(s + 5) > 0.24 ? -1 : 1,
        lean = (rand(s + 8) > 0.5 ? 1 : -1) * (0.35 + rand(s + 6) * 0.5),
        out = q.t + side * (Math.PI / 2 - lean),
        start = q.t + side * (Math.PI / 2 - lean * 1.7),
        twig = (2.5 + rand(s + 7) * 6) * (0.6 + vari * 0.5);
      tipX = q.x + Math.cos(out) * twig;
      tipY = q.y + Math.sin(out) * twig;
      const cx = q.x + Math.cos(start) * twig * 0.55,
        cy = q.y + Math.sin(start) * twig * 0.55;
      angle = Math.atan2(tipY - cy, tipX - cx) + (rand(s + 4) - 0.5) * 0.3;
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.quadraticCurveTo(cx, cy, tipX, tipY);
      ctx.strokeStyle = colors.d;
      ctx.lineCap = "round";
      ctx.lineWidth = 0.5 + rand(s) * 0.35;
      ctx.stroke();
    }
    const sway =
      ((Math.sin(clock * 1.25 + s * 0.08) * 0.14 +
        Math.sin(clock * 0.72 + i) * 0.06) *
        state.motion) /
      100;
    angle += sway;
    let len = state.scale * (0.53 + rand(s + 12) * 0.83) * grow,
      form = mix[Math.floor(rand(s + 20) * mix.length)];
    if (form === "fern") len *= 1.3;
    if (form === "bud") len *= 0.58;
    if (form === "eucalyptus" || form === "ginkgo") len *= 1.15;
    if (form === "blossom" || form === "berry") len *= 0.7;
    len = boundedLeafLength(tipX, tipY, angle, len, w, h);
    const dx = Math.abs(Math.cos(angle)) + 0.45 * Math.abs(Math.sin(angle)),
      dy = Math.abs(Math.sin(angle)) + 0.45 * Math.abs(Math.cos(angle));
    const innerX =
      tipX < limits.inline
        ? limits.inline - tipX
        : Math.max(0, tipX - (w - limits.inline));
    const innerY =
      tipY < limits.top
        ? limits.top - tipY
        : Math.max(0, tipY - (h - limits.bottom));
    len = Math.min(len, Math.max(innerX / dx, innerY / dy));
    petal(
      ctx,
      tipX,
      tipY,
      angle,
      len,
      form,
      colors,
      s,
      0.85 + rand(s + 23) * 0.3,
    );
    if (state.style === "Spring growth" && i % 17 === 0) {
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2, 0, tau);
      ctx.fillStyle = colors.c;
      ctx.fill();
    }
  }
};

export const paintClay: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) => {
  const state = paintState(settings);
  const seed = state.seed + index * 719,
    twist = state.style === "Twisted rope",
    thick = 5 + state.weight * 0.11,
    phase = clock * state.motion * 0.008;
  trace(ctx, p, -1, 1 + state.wild * 0.025, seed, phase);
  ctx.strokeStyle = colors.b;
  ctx.lineWidth = thick + 5;
  ctx.lineJoin = "round";
  ctx.stroke();
  trace(ctx, p, 2, 1 + state.wild * 0.025, seed, phase);
  ctx.strokeStyle = colors.c;
  ctx.lineWidth = thick * 0.55;
  ctx.stroke();
  trace(ctx, p, 3, 1 + state.wild * 0.02, seed, phase);
  ctx.strokeStyle = colors.paper;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.65;
  ctx.stroke();
  ctx.globalAlpha = 1;
  const count = shown * (twist ? 1.2 : 0.65);
  for (let i = 0; i < Math.ceil(count); i++) {
    const s = seed + i * 29,
      q = twist
        ? p.at((i / Math.max(1, count)) * p.total)
        : anchor(p, i, s, state),
      wave = ((Math.sin(clock * 2 + i * 0.8) * state.motion) / 100) * 0.08,
      squish =
        1 + ((Math.sin(clock * 1.8 + i * 0.6) * state.drape) / 100) * 0.08,
      l = state.scale * (0.28 + rand(s + 3) * 0.35) * clamp(count - i),
      fill = [colors.a, colors.b, colors.c, colors.d][i % 4];
    if (
      state.style === "Piped petals" &&
      rand(s + 2) < (state.corners / 100) * 0.6
    ) {
      for (let j = 0; j < 5; j++) {
        const a = (j * tau) / 5 + q.t;
        bead(
          ctx,
          q.x + Math.cos(a) * l * 0.5,
          q.y + Math.sin(a) * l * 0.5,
          l * 0.55,
          l * 0.3,
          a,
          fill,
          colors,
        );
      }
      bead(ctx, q.x, q.y, l * 0.26, l * 0.26, 0, colors.d, colors);
    } else if (state.style === "Ribbon folds") {
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate(q.t + wave);
      ctx.beginPath();
      ctx.moveTo(-l, -l * 0.5);
      ctx.bezierCurveTo(0, l * 0.8, 0, -l, l, l * 0.5);
      ctx.lineTo(l, l);
      ctx.bezierCurveTo(0, -l * 0.5, 0, l * 1.3, -l, 0);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    } else
      bead(
        ctx,
        q.x,
        q.y,
        l * (twist ? 1.15 : 1) * squish,
        (l * (twist ? 0.55 : 0.8)) / squish,
        q.t + (twist ? 0.6 : rand(s) * 2) + wave,
        fill,
        colors,
      );
  }
};

export const paintGlass: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) => {
  const state = paintState(settings);
  const seed = state.seed + index * 719,
    phase = clock * state.motion * 0.012,
    quiet = state.style === "Quiet currents",
    layers = quiet ? 3 : 5;
  // Strands share one current so they stay parallel, like contour lines, instead of crossing.
  for (let j = 0; j < layers; j++) {
    trace(
      ctx,
      p,
      (j - (layers - 1) / 2) * 1.6,
      0.4 + state.drape * 0.015,
      seed,
      phase + j * 0.15,
    );
    ctx.strokeStyle = [colors.a, colors.b, colors.c, colors.d, colors.paper][j];
    ctx.lineWidth = 2 + state.weight * 0.035;
    ctx.globalAlpha = 0.4 + j * 0.08;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const count =
    shown * (quiet ? 0.12 : state.style === "Seafoam beads" ? 0.9 : 0.45);
  for (let i = 0; i < Math.ceil(count); i++) {
    const s = seed + i * 37,
      q = anchor(p, i, s, state),
      move = Math.sin(clock * 0.8 + i) * state.motion * 0.012,
      n = q.t - Math.PI / 2,
      spread = (rand(s + 5) - 0.5) * state.drape * 0.05,
      l = state.scale * (0.16 + rand(s + 3) * 0.28) * clamp(count - i);
    bead(
      ctx,
      q.x + Math.cos(n) * (spread + move),
      q.y + Math.sin(n) * (spread + move),
      l,
      l * (state.style === "Glass droplets" ? 1.4 : 0.8),
      q.t,
      [colors.b, colors.c, colors.d][i % 3],
      colors,
      true,
    );
  }
};

export const paintBrass: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) => {
  const state = paintState(settings);
  const seed = state.seed + index * 719,
    weight = 1.1 + state.weight * 0.055;
  trace(ctx, p, 0, 0.2 + state.wild * 0.005, seed);
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, colors.c);
  g.addColorStop(0.28, colors.a);
  g.addColorStop(0.6, colors.b);
  g.addColorStop(1, colors.d);
  ctx.shadowColor = colors.d;
  ctx.shadowOffsetY = state.drape * 0.02;
  ctx.shadowBlur = state.drape * 0.025;
  ctx.strokeStyle = g;
  ctx.lineWidth = weight;
  ctx.stroke();
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  trace(ctx, p, -4);
  ctx.strokeStyle = colors.b;
  ctx.lineWidth = 0.65;
  ctx.stroke();
  const quiet = state.style === "Quiet gilding",
    count = shown * (quiet ? 0.15 : 0.8);
  for (let i = 0; i < Math.ceil(count); i++) {
    const s = seed + i * 41,
      q = anchor(p, i, s, state),
      n = q.t - Math.PI / 2,
      l = state.scale * (0.12 + rand(s) * 0.17) * clamp(count - i);
    ctx.save();
    ctx.translate(q.x, q.y);
    ctx.rotate(q.t);
    ctx.strokeStyle = rand(s + 3) > 0.6 ? colors.c : colors.a;
    ctx.lineWidth = 0.7;
    if (state.style === "Art deco") {
      ctx.beginPath();
      ctx.moveTo(-l, 0);
      ctx.lineTo(-l, -l);
      ctx.lineTo(l, -l);
      ctx.lineTo(l, 0);
      ctx.stroke();
    } else if (state.style === "Hammered edge")
      bead(ctx, 0, 0, l * 0.35, l * 0.5, rand(s) * tau, colors.b, colors);
    else {
      ctx.beginPath();
      ctx.ellipse(0, -l * 0.35, l, l * 0.55, -0.45, 0, tau);
      ctx.stroke();
    }
    ctx.restore();
  }
  if (!quiet)
    for (let j = 0; j < 4; j++) {
      const q = p.at(p.corners[j]),
        a = q.t + Math.PI / 2,
        sz = 7 + state.corners * 0.18;
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate(a);
      ctx.strokeStyle = colors.b;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      for (let k = 0; k < 80; k++) {
        const t = (k / 80) * tau * 1.4,
          rad = (1 - k / 90) * sz * 0.48;
        const x = Math.cos(t) * rad,
          y = Math.sin(t) * rad;
        if (!k) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  if (playing && state.motion > 0) {
    const q = p.at(((clock * 0.025) % 1) * p.total);
    const shine = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 14);
    shine.addColorStop(0, colors.c);
    shine.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shine;
    ctx.globalAlpha = 0.65;
    ctx.fillRect(q.x - 14, q.y - 14, 28, 28);
    ctx.globalAlpha = 1;
  }
};

/** Shared drawing primitives for painters in other modules (organic-paint-world.ts). */
export { tau, clamp, rand, trace, anchor, paintState, bead };
