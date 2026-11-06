/**
 * Painters for the 2026-12 launch frames: terminal (crt, panes), extras
 * (swiss, azulejo, formwork, atomic), sci-fi (hud, hazard, orbit), festival
 * (rangoli, papercut, picado, gulal, knit) and Glass UI (liquid).
 *
 * Same contract as organic-paint-world.ts: card space spans 0..w × 0..h with a
 * 32px gutter; every painter clips itself away from the content box (`limits`),
 * outlines only follow the card's own rounded rectangle via `trace()`, and
 * motion runs only while `playing`, so reduced motion gets a still frame.
 */
import {
  paintState,
  rand,
  tau,
  trace,
  type ContentInsets,
  type OrganicPainter,
  type OrganicPalette,
} from "./organic-paint.ts";
import type { BorderPath } from "./organic-geometry.ts";

type Ctx = CanvasRenderingContext2D;
/** [x, y, sx, sy]: a card corner and the unit direction pointing into the card. */
type Corner = readonly [number, number, number, number];
const cornersOf = (w: number, h: number): Corner[] => [
  [0, 0, 1, 1],
  [w, 0, -1, 1],
  [w, h, -1, -1],
  [0, h, 1, -1],
];

/** Keep every mark out of the content box, whatever the painter draws. */
function clipFrame(ctx: Ctx, w: number, h: number, l: ContentInsets) {
  ctx.beginPath();
  ctx.rect(-32, -32, w + 64, h + 64);
  ctx.rect(
    l.inline,
    l.top,
    Math.max(0, w - l.inline * 2),
    Math.max(0, h - l.top - l.bottom),
  );
  ctx.clip("evenodd");
}

/** Light or dark surface, read from the computed paper colour. */
function isDark(color: string) {
  const n = (color.match(/-?[\d.]+/g) ?? []).map(Number);
  if (color.startsWith("color("))
    return luma(n[0] * 255, n[1] * 255, n[2] * 255);
  if (color.startsWith("oklch") || color.startsWith("oklab"))
    return n[0] < (color.includes("%") ? 50 : 0.5);
  if (n.length >= 4 && n[3] === 0) return false;
  return n.length >= 3 ? luma(n[0], n[1], n[2]) : false;
}
const luma = (r: number, g: number, b: number) =>
  0.2126 * r + 0.7152 * g + 0.0722 * b < 110;

function outline(
  ctx: Ctx,
  p: BorderPath,
  color: string,
  width = 1,
  alpha = 1,
  offset = 0,
) {
  trace(ctx, p, offset);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = alpha;
  ctx.stroke();
  ctx.globalAlpha = 1;
}
function glow(ctx: Ctx, color: string, blur: number) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}
function dot(ctx: Ctx, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.2, r), 0, tau);
  ctx.fillStyle = color;
  ctx.fill();
}
function label(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  font: string,
  color: string,
  align: CanvasTextAlign = "left",
) {
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  return ctx.measureText(text).width;
}
/** An n-point star with alternating radii, used for bursts and sparkles. */
function star(
  ctx: Ctx,
  x: number,
  y: number,
  outer: number,
  inner: number,
  points: number,
  turn = 0,
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer,
      a = turn + (i * Math.PI) / points - Math.PI / 2;
    if (i) ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    else ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
}
/** Run a painter body inside a saved, frame-clipped context. */
function framed(
  ctx: Ctx,
  w: number,
  h: number,
  l: ContentInsets,
  body: () => void,
) {
  ctx.save();
  clipFrame(ctx, w, h, l);
  body();
  ctx.restore();
}

/* ───────────────────────── Phosphor Terminal ───────────────────────── */

/**
 * Composition, not stamping. A wide "hero" card carries the full scene, a
 * regular card one accent, and a small card a single detail; each instance
 * picks its accent corner and ink from its own index, so a grid of cards never
 * reads as wallpaper.
 */
type Tier = "hero" | "card" | "small";
function tierOf(w: number, h: number): Tier {
  if (w >= 440 && h >= 160) return "hero";
  if (w < 300 || h < 140) return "small";
  return "card";
}
/** A deterministic per-instance choice in 0..n-1. */
function choose(index: number, seed: number, salt: number, n: number) {
  return Math.floor(rand(seed * 0.173 + index * 7.31 + salt * 3.7) * n) % n;
}
/** Distance from a point to the content box: soft marks are sized to stop short of it, never clipped by it. */
function room(x: number, y: number, w: number, h: number, l: ContentInsets) {
  const dx = Math.max(l.inline - x, 0, x - (w - l.inline)),
    dy = Math.max(l.top - y, 0, y - (h - l.bottom));
  return Math.hypot(dx, dy);
}

const vt = (size: number) =>
  `${size}px "VT323", "Share Tech Mono", ui-monospace, monospace`;

export const paintPhosphor: OrganicPainter = (
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
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      dark = isDark(colors.paper),
      tier = tierOf(w, h),
      quiet = s.style === "Quiet cursor";
    if (dark) glow(ctx, colors.a, 7);
    // A double rule just outside the edge, like ╔═╗ drawn in box characters.
    outline(ctx, p, colors.a, 1, dark ? 0.85 : 0.55, 3);
    if (!quiet) outline(ctx, p, colors.a, 1, dark ? 0.55 : 0.35, 6);
    if (!quiet) {
      const len = 8 + s.scale * 0.45 * (0.5 + s.corners / 100);
      ctx.strokeStyle = colors.a;
      ctx.lineWidth = 2;
      for (const [x, y, sx, sy] of cornersOf(w, h)) {
        const ox = x - sx * 6,
          oy = y - sy * 6;
        ctx.beginPath();
        ctx.moveTo(ox + sx * len, oy);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox, oy + sy * len);
        ctx.stroke();
      }
    }
    if (s.style === "Raster ticks" && tier === "hero") {
      ctx.strokeStyle = colors.b;
      ctx.lineWidth = 1;
      for (let x = 12, i = 0; x < w - 12; x += 8, i++) {
        ctx.beginPath();
        ctx.moveTo(x, -10);
        ctx.lineTo(x, i % 8 ? -13 : -17);
        ctx.stroke();
      }
    }
    // Status line inside the card's bottom margin; small cards keep only the cursor.
    const y = h - Math.min(11, limits.bottom / 2);
    let x = Math.max(8, limits.inline - 2);
    if (
      tier !== "small" &&
      (s.style === "Status line" || s.style === "Box corners")
    ) {
      x += label(ctx, "READY.", x, y, vt(16), colors.a) + 4;
      if (shown > 35 && tier === "hero")
        label(
          ctx,
          `MEM ${Math.round(64 * (shown / 100))}K  OK`,
          w - Math.max(8, limits.inline - 2),
          y,
          vt(15),
          colors.c,
          "right",
        );
    }
    if (!playing || clock % 1 < 0.55) {
      ctx.fillStyle = colors.a;
      ctx.fillRect(x, y - 6, 7, 12);
    }
    if (playing && s.motion > 0 && choose(index, s.seed, 1, 2) === 0) {
      const q = p.at((((clock * s.motion) / 300) % 1) * p.total);
      ctx.shadowBlur = dark ? 12 : 0;
      dot(
        ctx,
        q.x + Math.cos(q.t - Math.PI / 2) * 3,
        q.y + Math.sin(q.t - Math.PI / 2) * 3,
        1.8,
        colors.d,
      );
    }
  });

/* ───────────────────────── ANSI Panes ───────────────────────── */

const jb = (size: number, weight = 700) =>
  `${weight} ${size}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
const paneTitles = [
  "main",
  "logs",
  "files",
  "branches",
  "status",
  "jobs",
  "diff",
];
const spinner = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

export const paintPanes: OrganicPainter = (
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
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      seed = s.seed + index * 37,
      bare = s.style === "Bare panes";
    // A single-line pane box just outside the card, like ┌─┐.
    outline(ctx, p, colors.d, 1, 0.7, 5);
    if (bare) return;
    // Title cut into the top rule: "─ branches ─".
    const title = paneTitles[Math.floor(rand(seed) * paneTitles.length)];
    ctx.font = jb(11);
    const tw = ctx.measureText(title).width + 12,
      tx = Math.max(14, p.r + 8);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(tx - 2, -9, tw + 4, 8);
    ctx.restore();
    label(ctx, title, tx + 6, -5, jb(11), colors.a);
    // Pane numbers on the right of the rule; the focused one is reverse video.
    const panes = 1 + Math.round((shown / 100) * 3),
      focus = Math.floor(rand(seed + 3) * panes);
    for (let i = 0; i < panes; i++) {
      const bx = w - 14 - (panes - i) * 18;
      ctx.fillStyle = i === focus ? colors.b : "transparent";
      if (i === focus) ctx.fillRect(bx - 1, -11, 14, 12);
      label(
        ctx,
        String(i + 1),
        bx + 6,
        -5,
        jb(10),
        i === focus ? colors.paper || "#000" : colors.d,
        "center",
      );
    }
    // Activity spinner at the top-right corner.
    const frame =
      playing && s.motion > 0 ? Math.floor(clock * 10) % spinner.length : 0;
    label(
      ctx,
      playing ? spinner[frame] : "●",
      w - 6,
      -5,
      jb(10, 400),
      colors.c,
      "center",
    );
    if (s.style === "Split panes") {
      // Tee junctions where a split would meet the frame: ├ and ┤.
      ctx.strokeStyle = colors.d;
      ctx.lineWidth = 1;
      for (const x of [-5, w + 5]) {
        ctx.beginPath();
        ctx.moveTo(x, h / 2);
        ctx.lineTo(x + (x < 0 ? 8 : -8), h / 2);
        ctx.stroke();
      }
    }
    if (
      (s.style === "Key hints" || s.style === "Pane titles") &&
      w > 240 &&
      limits.bottom >= 14
    ) {
      // Keyboard hints sit in the card's own bottom margin, so dense grids
      // never collide with the next card; narrow cards skip them.
      const hints: Array<[string, string]> = [
        ["↑↓", "move"],
        ["⏎", "open"],
        ["/", "find"],
        ["?", "help"],
        ["q", "quit"],
      ];
      let x = Math.max(8, limits.inline - 2);
      const y = h - Math.min(11, limits.bottom / 2);
      for (const [key, text] of hints) {
        ctx.font = jb(10);
        const kw = ctx.measureText(key).width + 6;
        ctx.font = jb(10, 400);
        const lw = ctx.measureText(text).width;
        if (x + kw + lw + 4 > w) break;
        ctx.fillStyle = colors.d;
        ctx.fillRect(x, y - 6, kw, 12);
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        label(ctx, key, x + kw / 2, y, jb(10), "#000", "center");
        ctx.restore();
        label(ctx, text, x + kw + 4, y, jb(10, 400), colors.d);
        x += kw + lw + 14;
      }
    }
  });

/* ───────────────────────── Swiss Poster ───────────────────────── */

export const paintSwiss: OrganicPainter = (
  ctx,
  _p,
  w,
  h,
  settings,
  colors,
  _clock,
  _playing,
  index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      len = 8 + s.scale * 0.25;
    // Crop marks are the system: every sheet gets them.
    ctx.strokeStyle = colors.d;
    ctx.lineWidth = 1;
    for (const [x, y, sx, sy] of cornersOf(w, h)) {
      ctx.beginPath();
      ctx.moveTo(x, y - sy * 6);
      ctx.lineTo(x, y - sy * (6 + len));
      ctx.moveTo(x - sx * 6, y);
      ctx.lineTo(x - sx * (6 + len), y);
      ctx.stroke();
    }
    if (s.style === "Bare grid") return;
    // The red block is an event, not a pattern: the hero always, other cards rarely.
    const block =
      s.style === "Red block" ||
      tier === "hero" ||
      (tier === "card" && choose(index, s.seed, 2, 3) === 0);
    if (block) {
      const bh = Math.min(limits.top - 4, 6 + s.weight * 0.14),
        bw = w * (0.18 + (shown / 100) * 0.22),
        left = choose(index, s.seed, 3, 2) === 0 && tier !== "hero";
      if (bh > 2) {
        ctx.fillStyle = colors.a;
        ctx.fillRect(left ? 0 : w - bw, 0, bw, bh);
      }
    }
    if (
      (s.style === "Grid ticks" || s.style === "Crop marks") &&
      tier === "hero"
    ) {
      for (let i = 0; i <= 6; i++) {
        const x = (w * i) / 6;
        ctx.beginPath();
        ctx.moveTo(x, h + 6);
        ctx.lineTo(x, h + 11);
        ctx.stroke();
        if (i < 6)
          label(
            ctx,
            String(i + 1).padStart(2, "0"),
            x + 3,
            h + 16,
            '600 8px "Inter Variable", Inter, sans-serif',
            colors.c,
          );
      }
      const x = w + 12,
        y = h + 12,
        r = 5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, tau);
      ctx.moveTo(x - r - 3, y);
      ctx.lineTo(x + r + 3, y);
      ctx.moveTo(x, y - r - 3);
      ctx.lineTo(x, y + r + 3);
      ctx.stroke();
    }
  });

/* ───────────────────────── Azulejo Tile ───────────────────────── */

function tile(
  ctx: Ctx,
  x: number,
  y: number,
  size: number,
  colors: OrganicPalette,
  rosette: boolean,
) {
  const r = size / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = colors.d;
  ctx.strokeStyle = colors.a;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(-r, -r, size, size);
  ctx.fill();
  ctx.stroke();
  ctx.save();
  ctx.clip();
  // Quarter circles in each corner join into rings when tiles meet.
  ctx.lineWidth = Math.max(1, size * 0.07);
  for (const [cx, cy] of [
    [-r, -r],
    [r, -r],
    [r, r],
    [-r, r],
  ]) {
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.3, 0, tau);
    ctx.stroke();
  }
  // Four-petal flower (eight on a rosette).
  const petals = rosette ? 8 : 4;
  ctx.fillStyle = colors.b;
  for (let i = 0; i < petals; i++) {
    ctx.save();
    ctx.rotate((i * tau) / petals);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.42, r * 0.16, r * 0.34, 0, 0, tau);
    ctx.fill();
    ctx.restore();
  }
  dot(ctx, 0, 0, r * 0.18, colors.c);
  // Glaze highlight.
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-r * 0.2, -r * 0.2, r * 0.75, Math.PI * 1.05, Math.PI * 1.45);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

export const paintAzulejo: OrganicPainter = (
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
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      size = 14 + s.scale * 0.5,
      corners = cornersOf(w, h),
      at = choose(index, s.seed, 1, 4),
      rosette = s.style === "Floral rosette";
    outline(ctx, p, colors.a, 1, 0.5, 4);
    const corner = (k: number, scale: number) => {
      const [x, y, sx, sy] = corners[k],
        t = size * scale;
      tile(ctx, x - sx * t * 0.15, y - sy * t * 0.15, t, colors, rosette);
    };
    if (tier === "hero" || s.style === "Border run") {
      // A frieze: a run of tiles along the top edge, finished by a corner tile at each end.
      const small = size * 0.62,
        step = small + 1;
      const run = Math.max(
        0,
        Math.floor((w - size * 2) / step) * (shown / 100),
      );
      const start = (w - run * step) / 2 + step / 2;
      for (let i = 0; i < Math.floor(run); i++)
        tile(ctx, start + i * step, -small / 2 - 4, small, colors, false);
      corner(0, 1);
      corner(1, 1);
    } else if (tier === "card") {
      // One corner tile, with two smaller tiles trailing along the edge.
      corner(at, 1);
      const [x, y, sx, sy] = corners[at],
        small = size * 0.55;
      for (let i = 1; i <= 2; i++)
        tile(
          ctx,
          x + sx * (size * 0.5 + i * (small + 1)),
          y - sy * (small / 2 + 4),
          small,
          colors,
          false,
        );
    } else if (s.style !== "Single tile" || at % 2 === 0) corner(at, 0.75);
    if (playing && s.motion > 0 && tier === "hero") {
      const x = ((clock * s.motion * 0.6) % (w + 80)) - 40;
      const g = ctx.createLinearGradient(x - 20, 0, x + 20, 0);
      g.addColorStop(0, "#ffffff00");
      g.addColorStop(0.5, "#ffffff66");
      g.addColorStop(1, "#ffffff00");
      ctx.fillStyle = g;
      ctx.fillRect(x - 20, -32, 40, 32);
    }
  });

/* ───────────────────────── Brutalist Concrete ───────────────────────── */

function tieHole(
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  colors: OrganicPalette,
) {
  dot(ctx, x, y + 0.8, r + 0.8, "rgba(255,255,255,.35)");
  dot(ctx, x, y, r, colors.a);
  dot(ctx, x - r * 0.25, y - r * 0.25, r * 0.45, "rgba(0,0,0,.35)");
}

export const paintFormwork: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  _clock,
  _playing,
  index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      r = 2 + s.scale * 0.06,
      inset = Math.max(6, Math.min(11, limits.top / 2, limits.inline / 2));
    outline(ctx, p, colors.b, 1, 0.4, 3);
    if (s.style === "Bare concrete") return;
    // Tie holes follow the formwork grid: corners always, a row on wider pours.
    for (const [x, y, sx, sy] of cornersOf(w, h))
      tieHole(ctx, x + sx * inset, y + sy * inset, r, colors);
    if (tier !== "small") {
      const bays = Math.max(
        1,
        Math.round((w - inset * 2) / (90 + (100 - shown))),
      );
      for (let i = 1; i < bays; i++) {
        const x = inset + ((w - inset * 2) * i) / bays;
        tieHole(ctx, x, inset, r, colors);
        tieHole(ctx, x, h - inset, r, colors);
      }
    }
    if (
      s.style === "Board seams" ||
      (s.style === "Tie holes" && tier === "hero")
    ) {
      ctx.strokeStyle = colors.b;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1;
      for (let y = 18; y < h - 6; y += 18) {
        ctx.beginPath();
        ctx.moveTo(-3, y);
        ctx.lineTo(-7 - s.weight * 0.06, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (
      tier !== "small" &&
      (s.style === "Stencil marks" || s.style === "Tie holes")
    ) {
      // Each pour gets its own stencil code; only the hero carries a survey level.
      const code =
        "ABCDEF"[choose(index, s.seed, 1, 6)] +
        "-0" +
        (1 + choose(index, s.seed, 2, 9));
      label(
        ctx,
        code,
        Math.max(8, limits.inline - 2),
        h - Math.min(11, limits.bottom / 2),
        '400 11px "Archivo Black", "Arial Black", sans-serif',
        colors.d,
      );
      if (tier === "hero") {
        const x = w - limits.inline - 46,
          y = h - Math.min(11, limits.bottom / 2);
        ctx.fillStyle = colors.c;
        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x - 5, y - 4);
        ctx.lineTo(x + 5, y - 4);
        ctx.closePath();
        ctx.fill();
        label(ctx, "+4.20", x + 9, y, mono(11), colors.d);
      }
    }
  });

/* ───────────────────────── Atomic Lounge ───────────────────────── */

export const paintAtomic: OrganicPainter = (
  ctx,
  _p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      seed = s.seed + index * 53,
      spin = playing ? clock * (s.motion / 400) : 0,
      big = 9 + s.scale * 0.5,
      corners = cornersOf(w, h),
      at = choose(index, s.seed, 1, 4),
      inks = [colors.a, colors.c, colors.b];
    const burst = (
      x: number,
      y: number,
      r: number,
      color: string,
      turn: number,
    ) => {
      star(ctx, x, y, r, r * 0.28, 8, turn);
      ctx.fillStyle = color;
      ctx.fill();
      star(ctx, x, y, r * 0.55, r * 0.2, 4, turn + Math.PI / 8);
      ctx.fill();
    };
    const boomerang = (
      x: number,
      y: number,
      size: number,
      turn: number,
      color: string,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(turn);
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.quadraticCurveTo(0, -size * 0.9, size, 0);
      ctx.quadraticCurveTo(0, -size * 0.35, -size, 0);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.restore();
    };
    const atom = (x: number, y: number, r: number) => {
      ctx.strokeStyle = colors.b;
      ctx.lineWidth = 1.2;
      for (let k = 0; k < 3; k++) {
        const rot = (k * Math.PI) / 3,
          a = spin * 6 + k * 2,
          ex = Math.cos(a) * r,
          ey = Math.sin(a) * r * 0.35;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.35, rot, 0, tau);
        ctx.stroke();
        dot(
          ctx,
          x + ex * Math.cos(rot) - ey * Math.sin(rot),
          y + ex * Math.sin(rot) + ey * Math.cos(rot),
          1.8,
          colors.a,
        );
      }
      dot(ctx, x, y, 3, colors.c);
    };
    const [cx, cy, sx, sy] = corners[at];
    if (tier === "hero") {
      // A little constellation: burst on one top corner, an atom on the other,
      // a boomerang swinging under the opposite bottom corner, sparkles between.
      const top = at % 2;
      burst(top ? w - 4 : 4, -4, big, colors.a, spin);
      if (s.style !== "Lone star") {
        atom(top ? 10 : w - 10, -8, big);
        boomerang(
          top ? 18 : w - 18,
          h + 8,
          big * 1.2,
          top ? 0.2 : Math.PI - 0.2,
          colors.b,
        );
        const count = Math.round((shown / 100) * 7);
        for (let i = 0; i < count; i++) {
          const x = 40 + rand(seed + i) * (w - 80),
            y = -8 - rand(seed + i + 9) * 12;
          star(ctx, x, y, 2.5 + rand(seed + i + 2) * 3, 1, 4, spin * 2);
          ctx.fillStyle = i % 2 ? colors.b : colors.a;
          ctx.fill();
        }
      }
    } else if (tier === "card") {
      const ink = inks[choose(index, s.seed, 2, 3)];
      if (s.style === "Orbit atoms") atom(cx - sx * 4, cy - sy * 4, big);
      else if (s.style === "Boomerangs")
        boomerang(
          cx + sx * 14,
          cy - sy * 6,
          big * 1.1,
          sy < 0 ? Math.PI : 0,
          colors.b,
        );
      else burst(cx - sx * 4, cy - sy * 4, big * 0.8, ink, spin);
      star(ctx, cx + sx * (big * 2.4), cy - sy * 9, 3, 1, 4, spin * 2);
      ctx.fillStyle = colors.b;
      ctx.fill();
    } else {
      star(ctx, cx - sx * 4, cy - sy * 4, 5, 1.6, 4, spin * 2);
      ctx.fillStyle = inks[choose(index, s.seed, 2, 3)];
      ctx.fill();
    }
  });

/* ───────────────────────── Orbital HUD ───────────────────────── */

const mono = (size: number) =>
  `${size}px "Share Tech Mono", ui-monospace, monospace`;

export const paintHud: OrganicPainter = (
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
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      dark = isDark(colors.paper),
      seed = s.seed + index * 11,
      len = 10 + s.scale * 0.45 * (0.6 + s.corners / 100);
    if (dark) glow(ctx, colors.a, 6);
    // Target brackets are the instrument's grammar: every panel has them.
    ctx.strokeStyle = colors.a;
    ctx.lineWidth = 2;
    for (const [x, y, sx, sy] of cornersOf(w, h)) {
      const ox = x - sx * 5,
        oy = y - sy * 5;
      ctx.beginPath();
      ctx.moveTo(ox + sx * len, oy);
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox, oy + sy * len);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    outline(ctx, p, colors.b, 1, 0.35, 2);
    if (s.style === "Clean brackets") return;
    // Telemetry lives on the main display; other panels show one readout each.
    const jitter = playing ? Math.floor(clock * 4) : 0,
      readouts = ["SYS", "PWR", "O₂", "LNK", "THR", "NAV"],
      name = readouts[choose(index, s.seed, 1, readouts.length)],
      value = (0.9 + rand(seed + jitter) * 0.09).toFixed(2);
    if (tier !== "small")
      label(ctx, `${name} ${value}`, len + 10, -10, mono(10), colors.a);
    if (
      tier === "hero" &&
      (s.style === "Telemetry" || s.style === "Target brackets")
    ) {
      ctx.strokeStyle = colors.b;
      ctx.lineWidth = 1;
      for (let y = len + 12, i = 0; y < h - len - 12; y += 6, i++) {
        ctx.beginPath();
        ctx.moveTo(-6, y);
        ctx.lineTo(i % 5 ? -9 : -13, y);
        ctx.stroke();
      }
      const dv = (3 + rand(seed + jitter + 1) * 0.4).toFixed(1);
      if (shown > 30)
        label(
          ctx,
          `Δv ${dv} KM/S`,
          w - len - 10,
          h + 11,
          mono(10),
          colors.a,
          "right",
        );
    }
    // One reticle locks onto one panel at a time.
    if (
      s.style === "Reticle" ||
      tier === "hero" ||
      choose(index, s.seed, 2, 4) === 0
    ) {
      const x = w + 6,
        y = -6,
        r = 6 + s.scale * 0.25,
        turn = playing ? clock * (s.motion / 60) : 0;
      ctx.strokeStyle = colors.c;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.45, 0, tau);
      ctx.stroke();
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.arc(x, y, r, turn + (k * tau) / 3, turn + (k * tau) / 3 + 1.2);
        ctx.stroke();
      }
    }
    if (playing && s.motion > 0 && tier === "hero") {
      const span = w - len * 2,
        x = len + ((clock * s.motion * 1.2) % span);
      ctx.strokeStyle = colors.d;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, -2);
      ctx.lineTo(Math.min(w - len, x + 24), -2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });

/* ───────────────────────── Freighter ───────────────────────── */

function stripes(
  ctx: Ctx,
  x: number,
  y: number,
  bw: number,
  bh: number,
  a: string,
  b: string,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, bw, bh);
  ctx.clip();
  ctx.fillStyle = a;
  ctx.fillRect(x, y, bw, bh);
  ctx.fillStyle = b;
  for (let i = -bh; i < bw + bh; i += 14) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + bh);
    ctx.lineTo(x + i + bh, y);
    ctx.lineTo(x + i + bh + 7, y);
    ctx.lineTo(x + i + 7, y + bh);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}
function rivet(
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  colors: OrganicPalette,
) {
  dot(ctx, x, y + 0.7, r, "rgba(0,0,0,.35)");
  dot(ctx, x, y, r, colors.d);
  dot(ctx, x - r * 0.3, y - r * 0.3, r * 0.4, "rgba(255,255,255,.55)");
}

export const paintHazard: OrganicPainter = (
  ctx,
  _p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      band = 6 + s.weight * 0.06,
      inset = Math.max(6, Math.min(8, limits.top / 2, limits.inline / 2)),
      r = 1.6 + s.scale * 0.04,
      left = choose(index, s.seed, 1, 2) === 0;
    // Rivets hold every plate; seams only on the big hull panels.
    for (const [x, y, sx, sy] of cornersOf(w, h))
      rivet(ctx, x + sx * inset, y + sy * inset, r, colors);
    if (tier === "hero" && s.style !== "Clean plate") {
      const step = 22 + (100 - shown) * 0.4;
      for (let x = inset + step; x < w - inset - step / 2; x += step) {
        rivet(ctx, x, inset, r * 0.8, colors);
        rivet(ctx, x, h - inset, r * 0.8, colors);
      }
    }
    if (s.style === "Clean plate") return;
    if (tier === "hero") {
      stripes(ctx, 0, -band - 3, w, band, colors.a, colors.b);
      label(
        ctx,
        "BAY 02",
        w - 4,
        h + 14,
        '400 12px "Archivo Black", "Arial Black", sans-serif',
        colors.d,
        "right",
      );
    } else if (tier === "card") {
      // A strip of hazard tape wrapped round one top corner.
      const tw = Math.min(90, w * 0.4);
      stripes(ctx, left ? 0 : w - tw, -band - 3, tw, band, colors.a, colors.b);
      label(
        ctx,
        "MAX " + (20 + choose(index, s.seed, 2, 5) * 10) + "T",
        left ? w : 0,
        -7,
        mono(10),
        colors.d,
        left ? "right" : "left",
      );
    }
    // A warning beacon on the hero only.
    if (tier === "hero" && (!playing || s.motion === 0 || clock % 1.2 < 0.6)) {
      glow(ctx, colors.c, 8);
      dot(ctx, w + 8, -8, 3, colors.c);
      ctx.shadowBlur = 0;
    }
  });

/* ───────────────────────── Solar Sail ───────────────────────── */

export const paintOrbit: OrganicPainter = (
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
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      seed = s.seed + index * 17,
      at = choose(index, s.seed, 1, 4),
      [cx, cy] = cornersOf(w, h)[at];
    outline(ctx, p, colors.b, 1, 0.45, 3);
    const stars = (count: number) => {
      for (let i = 0; i < count; i++) {
        const q = p.at(rand(seed + i) * p.total),
          o = 5 + rand(seed + i + 3) * 20,
          tw = playing ? 0.5 + 0.5 * Math.sin(clock * 2 + i) : 1;
        ctx.globalAlpha = 0.35 + tw * 0.6;
        dot(
          ctx,
          q.x + Math.cos(q.t - Math.PI / 2) * o,
          q.y + Math.sin(q.t - Math.PI / 2) * o,
          0.6 + rand(seed + i + 5) * 0.9,
          colors.c,
        );
      }
      ctx.globalAlpha = 1;
    };
    if (tier === "small") return stars(Math.round((shown / 100) * 6));
    const rings =
        tier === "hero" && s.style !== "Single orbit"
          ? 2 + Math.round((s.drape / 100) * 2)
          : 1,
      sun = tier === "hero" || s.style === "Gold foil";
    if (sun) {
      const r = 10 + s.scale * 0.35,
        g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      g.addColorStop(0, colors.b);
      g.addColorStop(0.45, colors.a);
      g.addColorStop(0.6, "#fff6d8");
      g.addColorStop(1, colors.a);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, tau);
      ctx.fill();
    }
    ctx.strokeStyle = colors.a;
    ctx.lineWidth = 1;
    for (let k = 0; k < rings; k++) {
      // Rings stop short of the content box, so they read as orbits, not clipped arcs.
      const r = Math.min(
        22 + k * (10 + s.scale * 0.3),
        room(cx, cy, w, h, limits) - 2,
      );
      if (r < 8) break;
      ctx.globalAlpha = 0.85 - k * 0.15;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, tau);
      ctx.stroke();
      if (k === rings - 1) {
        const a =
          Math.PI * 0.75 +
          (playing ? clock * (s.motion / 300) : 0) +
          rand(seed) * tau;
        dot(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.4, colors.d);
      }
    }
    ctx.globalAlpha = 1;
    if (tier === "hero" || s.style === "Star field")
      stars(Math.round((shown / 100) * 22));
  });

/* ───────────────────────── Diwali Lights ───────────────────────── */

function rangoli(
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  colors: OrganicPalette,
  turn: number,
) {
  const ring = (
    n: number,
    radius: number,
    len: number,
    wide: number,
    color: string,
    offset: number,
  ) => {
    ctx.fillStyle = color;
    for (let i = 0; i < n; i++) {
      const a = turn + offset + (i * tau) / n;
      ctx.save();
      ctx.translate(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
      ctx.rotate(a + Math.PI / 2);
      ctx.beginPath();
      ctx.ellipse(0, 0, wide, len, 0, 0, tau);
      ctx.fill();
      ctx.restore();
    }
  };
  ring(12, r * 0.78, r * 0.26, r * 0.1, colors.d, Math.PI / 12);
  ring(8, r * 0.55, r * 0.3, r * 0.16, colors.a, 0);
  ring(8, r * 0.3, r * 0.18, r * 0.1, colors.b, Math.PI / 8);
  dot(ctx, x, y, r * 0.14, colors.c);
}
function diya(
  ctx: Ctx,
  x: number,
  y: number,
  size: number,
  colors: OrganicPalette,
  flicker: number,
  dark: boolean,
) {
  // Clay bowl.
  ctx.fillStyle = "#b5562b";
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 0.45, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = "#d9773f";
  ctx.fillRect(x - size, y - 1, size * 2, 2);
  // Flame.
  const fh = size * (1.1 + flicker * 0.25);
  const g = ctx.createRadialGradient(
    x,
    y - fh * 0.35,
    0.5,
    x,
    y - fh * 0.35,
    fh * 0.7,
  );
  g.addColorStop(0, "#fffbe6");
  g.addColorStop(0.4, colors.c);
  g.addColorStop(1, colors.b);
  if (dark) glow(ctx, colors.b, 10);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y - fh);
  ctx.quadraticCurveTo(x + size * 0.45, y - fh * 0.35, x, y - 1);
  ctx.quadraticCurveTo(x - size * 0.45, y - fh * 0.35, x, y - fh);
  ctx.fill();
  ctx.shadowBlur = 0;
}

export const paintRangoli: OrganicPainter = (
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
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      dark = isDark(colors.paper),
      r = 12 + s.scale * 0.55,
      turn = playing ? clock * (s.motion / 2000) : 0,
      at = choose(index, s.seed, 1, 4),
      corners = cornersOf(w, h),
      flicker = (i: number) =>
        playing && s.motion > 0 ? Math.sin(clock * 8 + i * 1.7) : 0,
      dsize = 5.5 + s.scale * 0.12,
      // Lamps stand on the card's own floor, inside its bottom padding.
      floor = h - Math.max(6, limits.bottom * 0.45);
    // Everything lives inside this card's rounded rectangle, decorating its
    // padding like a doorway, so neighbouring cards can never collide.
    trace(ctx, p, 0);
    ctx.closePath();
    ctx.clip();
    const corner = (k: number, size: number) => {
      // Centre the motif just inside the rounded corner so its heart stays visible.
      const [x, y, sx, sy] = corners[k],
        cx = x + sx * 7,
        cy = y + sy * 7;
      rangoli(
        ctx,
        cx,
        cy,
        Math.min(size, room(cx, cy, w, h, limits) * 1.3),
        colors,
        turn,
      );
    };
    const toran = () => {
      // A marigold toran hung from the top edge: swags with mango leaves between them.
      const swags = Math.max(2, Math.round(w / 120)),
        span = (w - 24) / swags,
        sag = Math.max(3, Math.min(8, limits.top / 2 - 6));
      for (let k = 0; k < swags; k++) {
        for (let t = 0; t <= 1.001; t += 0.1) {
          const x = 12 + k * span + t * span,
            y = 3 + Math.sin(t * Math.PI) * sag;
          dot(ctx, x, y, 2.4, Math.round(t * 10) % 2 ? colors.b : colors.c);
        }
        if (k < swags - 1) {
          ctx.fillStyle = colors.d;
          ctx.beginPath();
          ctx.ellipse(12 + (k + 1) * span, 9, 2.2, 5.5, 0, 0, tau);
          ctx.fill();
        }
      }
    };
    if (tier === "hero") {
      if (s.style !== "Single diya") toran();
      // One rangoli anchors the composition on a bottom corner, lamps along the floor.
      const k = at % 2 ? 2 : 3,
        x = corners[k][0];
      if (s.style !== "Single diya") corner(k, r * 1.6);
      if (s.style !== "Marigold string") {
        const step = 34 + (100 - shown) * 0.5;
        for (
          let x2 = limits.inline, i = 0;
          x2 < w - limits.inline / 2;
          x2 += step, i++
        ) {
          if (Math.abs(x2 - x) < r * 1.8) continue;
          diya(ctx, x2, floor, dsize, colors, flicker(i), dark);
        }
      }
    } else if (tier === "card") {
      // A corner rangoli on this card's own corner; one lamp on the opposite side.
      if (s.style !== "Single diya") corner(at, r * 1.25);
      const right = corners[at][0] === 0;
      diya(
        ctx,
        right ? w - limits.inline / 2 - 4 : limits.inline / 2 + 4,
        floor,
        dsize,
        colors,
        flicker(index),
        dark,
      );
    } else if (s.style === "Single diya") {
      const right = at % 2 === 1;
      diya(
        ctx,
        right ? w - limits.inline / 2 - 4 : limits.inline / 2 + 4,
        floor,
        dsize,
        colors,
        flicker(index),
        dark,
      );
    } else corner(at, r);
  });

/* ───────────────────────── Lunar New Year ───────────────────────── */

function lantern(
  ctx: Ctx,
  x: number,
  y: number,
  size: number,
  colors: OrganicPalette,
  sway: number,
) {
  ctx.save();
  ctx.translate(x, -22);
  ctx.rotate(sway);
  const cy = y + 22;
  ctx.strokeStyle = colors.b;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, cy - size * 1.1);
  ctx.stroke();
  ctx.fillStyle = colors.a;
  ctx.beginPath();
  ctx.ellipse(0, cy, size * 0.9, size, 0, 0, tau);
  ctx.fill();
  // Ribs and gold caps.
  ctx.strokeStyle = "rgba(0,0,0,.18)";
  for (const k of [-0.45, 0, 0.45]) {
    ctx.beginPath();
    ctx.ellipse(0, cy, size * 0.9 * Math.abs(k) + 0.1, size, 0, 0, tau);
    ctx.stroke();
  }
  ctx.fillStyle = colors.b;
  ctx.fillRect(-size * 0.45, cy - size - 2, size * 0.9, 3);
  ctx.fillRect(-size * 0.45, cy + size - 1, size * 0.9, 3);
  // Tassel.
  ctx.strokeStyle = colors.b;
  ctx.beginPath();
  ctx.moveTo(0, cy + size + 2);
  ctx.lineTo(0, cy + size + 8);
  ctx.stroke();
  ctx.restore();
}

export const paintPapercut: OrganicPainter = (
  ctx,
  _p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      seed = s.seed + index * 23,
      at = choose(index, s.seed, 1, 4),
      corners = cornersOf(w, h),
      size = 8 + s.scale * 0.15,
      sway = (k: number) =>
        playing && s.motion > 0
          ? Math.sin(clock * 1.6 + k + rand(seed)) * 0.05 * (s.motion / 50)
          : 0;
    // A paper-cut fan opening outward from a corner: scalloped, with punched holes.
    const fan = (k: number, R: number) => {
      const [x, y, sx, sy] = corners[k],
        mid = Math.atan2(-sy, -sx),
        n = 8;
      ctx.save();
      ctx.translate(x + sx * 2, y + sy * 2);
      ctx.fillStyle = colors.a;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let i = 0; i <= n; i++) {
        const a = mid - Math.PI / 4 + (i / n) * (Math.PI / 2),
          rr = i % 2 ? R * 0.84 : R;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      for (let i = 1; i < 4; i++) {
        const a = mid - Math.PI / 4 + (i / 4) * (Math.PI / 2);
        dot(
          ctx,
          Math.cos(a) * R * 0.6,
          Math.sin(a) * R * 0.6,
          R * 0.09,
          "#000",
        );
      }
      dot(
        ctx,
        Math.cos(mid) * R * 0.3,
        Math.sin(mid) * R * 0.3,
        R * 0.07,
        "#000",
      );
      ctx.restore();
    };
    if (tier === "hero") {
      if (s.style !== "Single lantern") {
        const R = 3 + s.scale * 0.1,
          step = R * 2.4;
        ctx.fillStyle = colors.a;
        for (let x = R; x < w - R / 2; x += step) {
          ctx.beginPath();
          ctx.arc(x, -2, R, Math.PI, tau);
          ctx.fill();
        }
      }
      const right = at % 2 === 1,
        count =
          s.style === "Single lantern" ? 1 : 1 + Math.round((shown / 100) * 2);
      for (let k = 0; k < count; k++) {
        const x = right ? w - 22 - k * 30 : 22 + k * 30;
        lantern(
          ctx,
          x,
          -size + 4 + (k % 2) * 4,
          size * (k ? 0.82 : 1),
          colors,
          sway(k),
        );
      }
      fan(right ? 3 : 2, 18 + s.scale * 0.3);
    } else if (tier === "card") {
      const top = at < 2 ? at : at - 2;
      lantern(
        ctx,
        top ? w - 22 : 22,
        -size + 4,
        size * 0.9,
        colors,
        sway(index),
      );
      fan(top ? 3 : 2, 14 + s.scale * 0.25);
    } else fan(at, 12 + s.scale * 0.2);
  });

/* ───────────────────────── Papel Picado ───────────────────────── */

export const paintPicado: OrganicPainter = (
  ctx,
  _p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      seed = s.seed + index * 29,
      inks = [colors.a, colors.b, colors.c, colors.d],
      fw = 8 + s.scale * 0.2,
      fh = fw * 1.15,
      ink0 = choose(index, s.seed, 2, 4),
      right = choose(index, s.seed, 1, 2) === 1;
    const flag = (x: number, y: number, i: number) => {
      const flutter =
        playing && s.motion > 0
          ? Math.sin(clock * 3 + i) * 0.06 * (s.motion / 50)
          : 0;
      ctx.save();
      ctx.translate(x, y);
      ctx.transform(1, 0, flutter, 1, 0, 0);
      ctx.beginPath();
      ctx.moveTo(-fw / 2, 0);
      ctx.lineTo(fw / 2, 0);
      ctx.lineTo(fw / 2, fh * 0.8);
      for (let k = 4; k >= 0; k--)
        ctx.lineTo(-fw / 2 + (k * fw) / 4, fh * (k % 2 ? 1 : 0.8));
      ctx.closePath();
      ctx.fillStyle = inks[(i + ink0) % 4];
      ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      dot(ctx, 0, fh * 0.42, fw * 0.16, "#000");
      for (const [dx, dy] of [
        [-0.28, 0.2],
        [0.28, 0.2],
        [-0.28, 0.64],
        [0.28, 0.64],
      ])
        dot(ctx, dx * fw, dy * fh, fw * 0.06, "#000");
      ctx.restore();
    };
    // A string between two points with a natural sag, flags hung along it.
    const string = (
      x0: number,
      x1: number,
      top: number,
      sag: number,
      count: number,
    ) => {
      ctx.strokeStyle = colors.d;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x0, top);
      ctx.quadraticCurveTo((x0 + x1) / 2, top + sag * 2, x1, top);
      ctx.stroke();
      for (let i = 0; i < count; i++) {
        const t = (i + 0.5) / count,
          x = x0 + (x1 - x0) * t,
          y = top + sag * 4 * t * (1 - t);
        flag(x, y, i);
      }
    };
    const sag = 4 + s.drape * 0.06;
    if (tier === "hero") {
      const step = fw + 4 + (100 - shown) * 0.12;
      string(-8, w + 8, -19, sag, Math.floor((w + 16) / step));
      if (s.style === "Paper confetti" || s.style === "Bunting") {
        const count = Math.round((shown / 100) * 10);
        for (let i = 0; i < count; i++) {
          const x = rand(seed + i) * w,
            fall = playing
              ? (clock * s.motion * 0.15 + rand(seed + i + 7) * 20) % 20
              : rand(seed + i + 7) * 20;
          ctx.save();
          ctx.translate(x, h + 6 + fall * 0.6);
          ctx.rotate(rand(seed + i + 3) * tau + (playing ? clock : 0));
          ctx.fillStyle = inks[i % 4];
          ctx.fillRect(-2.5, -1.5, 5, 3);
          ctx.restore();
        }
      }
    } else if (tier === "card") {
      // A short string tied off at one corner, drooping toward the middle.
      const span = w * 0.55,
        x0 = right ? w + 6 : -6,
        x1 = right ? w - span : span;
      string(Math.min(x0, x1), Math.max(x0, x1), -19, sag * 0.8, 4);
    } else {
      // Two flags pinned to one corner.
      const x = right ? w - 14 : 14;
      flag(x - fw * 0.6, -16, 0);
      flag(x + fw * 0.6, -15, 1);
    }
  });

/* ───────────────────────── Holi Colours ───────────────────────── */

export const paintGulal: OrganicPainter = (
  ctx,
  _p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      seed = s.seed + index * 41,
      inks = [colors.a, colors.b, colors.c, colors.d],
      drift = playing ? clock * (s.motion / 200) : 0,
      haze = s.style === "Soft haze",
      corners = cornersOf(w, h),
      at = choose(index, s.seed, 1, 4),
      ink = choose(index, s.seed, 2, 4);
    // A powder cloud pushed outward from a corner. Its radius stops before the
    // content box, so the soft edge is never sliced by the frame clip.
    const cloud = (k: number, color: string, scale: number) => {
      const [x, y, sx, sy] = corners[k],
        base = (18 + s.scale * 0.9) * scale,
        ox = Math.sin(drift + k) * 2,
        oy = Math.cos(drift * 0.8 + k) * 2;
      for (let j = 0; j < 5; j++) {
        const jx =
            x -
            sx * (6 + rand(seed + k * 7 + j) * 10) +
            ox +
            (rand(seed + k + j * 3) - 0.5) * base * 0.6,
          jy = y - sy * (6 + rand(seed + k * 7 + j + 3) * 10) + oy,
          r = Math.min(
            base * (0.6 + rand(seed + j) * 0.4),
            room(jx, jy, w, h, limits) - 1,
          );
        if (r < 4) continue;
        const g = ctx.createRadialGradient(jx, jy, 0, jx, jy, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = haze ? 0.28 : 0.5;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(jx, jy, r, 0, tau);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    // Dry powder thrown along an edge, thinning away from its corner.
    const speckle = (k: number, color: string, count: number) => {
      const [x, y, sx, sy] = corners[k];
      for (let i = 0; i < count; i++) {
        const along = rand(seed + i + k * 13) ** 1.6 * Math.min(w, h) * 0.6,
          off = 3 + rand(seed + i + 1) * 18,
          edge = i % 2,
          px = edge ? x + sx * along : x - sx * off,
          py = edge ? y - sy * off : y + sy * along;
        if (room(px, py, w, h, limits) < 2) continue;
        ctx.globalAlpha = 0.5 + rand(seed + i + 2) * 0.45;
        dot(
          ctx,
          px,
          py,
          0.6 + rand(seed + i + 3) * (s.style === "Splashes" ? 2.2 : 1.3),
          color,
        );
      }
      ctx.globalAlpha = 1;
    };
    const count = Math.round((shown / 100) * 40);
    if (tier === "hero") {
      if (s.style !== "Speckle dust") {
        cloud(at, inks[ink], 1.1);
        cloud((at + 2) % 4, inks[(ink + 2) % 4], 0.9);
      }
      if (!haze) {
        speckle(at, inks[ink], count);
        speckle((at + 2) % 4, inks[(ink + 2) % 4], count);
        speckle((at + 1) % 4, inks[(ink + 1) % 4], count / 3);
      }
    } else if (tier === "card") {
      if (s.style !== "Speckle dust") cloud(at, inks[ink], 0.85);
      if (!haze) speckle(at, inks[ink], count * 0.7);
    } else {
      if (s.style !== "Speckle dust") cloud(at, inks[ink], 0.6);
      if (!haze) speckle(at, inks[ink], count * 0.4);
    }
  });

/* ───────────────────────── Yule Knit ───────────────────────── */

function snowflake(
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  color: string,
  turn: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(turn);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    ctx.rotate(tau / 6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r);
    ctx.moveTo(0, -r * 0.55);
    ctx.lineTo(r * 0.25, -r * 0.8);
    ctx.moveTo(0, -r * 0.55);
    ctx.lineTo(-r * 0.25, -r * 0.8);
    ctx.stroke();
  }
  ctx.restore();
}

export const paintKnit: OrganicPainter = (
  ctx,
  _p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      tier = tierOf(w, h),
      seed = s.seed + index * 61,
      cell = 5 + s.scale * 0.08,
      at = choose(index, s.seed, 1, 4);
    const vStitch = (x: number, y: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = cell * 0.36;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x - cell * 0.28, y - cell * 0.3);
      ctx.lineTo(x, y + cell * 0.25);
      ctx.lineTo(x + cell * 0.28, y - cell * 0.3);
      ctx.stroke();
    };
    const flakes = (count: number, side: number) => {
      for (let i = 0; i < count; i++) {
        const fall =
            playing && s.motion > 0
              ? (clock * s.motion * 0.12 + rand(seed + i) * 30) % 30
              : rand(seed + i) * 30,
          x = side
            ? w + 6 + rand(seed + i + 2) * 16
            : -6 - rand(seed + i + 2) * 16,
          y = 8 + rand(seed + i + 4) * Math.min(h * 0.5, 120) + fall;
        snowflake(
          ctx,
          x,
          y,
          3 + rand(seed + i + 5) * 3,
          colors.d,
          playing ? clock * 0.3 + i : i,
        );
      }
    };
    if (tier === "hero") {
      if (s.style === "Fair Isle band" || s.style === "Snowflakes") {
        // The yoke: a Fair Isle band across the top of the main panel only.
        const rows = 3,
          top = -rows * cell - 4;
        ctx.fillStyle = colors.a;
        ctx.fillRect(0, top - cell * 0.5, w, rows * cell + cell * 0.5);
        for (let r = 0; r < rows; r++)
          for (let x = cell / 2, i = 0; x < w; x += cell, i++)
            if (Math.abs((i % 4) - 2) === r || (r === 1 && i % 4 === 0))
              vStitch(x, top + r * cell + cell / 2, colors.c);
        ctx.fillStyle = colors.b;
        ctx.fillRect(0, -4, w, 2.5);
        ctx.fillRect(0, top - cell * 0.5 - 2.5, w, 2.5);
      }
      if (s.style === "Cable stitch") {
        ctx.strokeStyle = colors.a;
        ctx.lineWidth = 2.4;
        for (const phase of [0, Math.PI]) {
          ctx.beginPath();
          for (let y = 0; y <= h; y += 2) {
            const xx = -9 + Math.sin(y / 9 + phase) * 4;
            if (y) ctx.lineTo(xx, y);
            else ctx.moveTo(xx, y);
          }
          ctx.stroke();
        }
      }
      flakes(Math.round((shown / 100) * 3), at % 2);
    } else if (tier === "card") {
      // A ribbed cuff at the hem, and a patch of snow on one side.
      ctx.fillStyle = colors.a;
      const cuff = 7 + s.weight * 0.05;
      ctx.fillRect(0, h + 3, w, cuff);
      ctx.strokeStyle = colors.c;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      for (let x = 3; x < w; x += 4) {
        ctx.beginPath();
        ctx.moveTo(x, h + 4);
        ctx.lineTo(x, h + 2 + cuff);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      flakes(2, at % 2);
    } else {
      // A tiny knitted label: three stitches and a flake.
      const x0 = at % 2 ? w - 4 - cell * 3 : 4;
      for (let i = 0; i < 3; i++)
        vStitch(x0 + cell / 2 + i * cell, -8, i === 1 ? colors.b : colors.a);
      snowflake(
        ctx,
        at % 2 ? w + 10 : -10,
        14,
        4,
        colors.d,
        playing ? clock * 0.3 : 0,
      );
    }
  });

/* ───────────────────────── Glass UI ───────────────────────── */

export const paintLiquid: OrganicPainter = (
  ctx,
  p,
  w,
  h,
  settings,
  colors,
  clock,
  playing,
  _index,
  limits,
  shown = settings.density,
) =>
  framed(ctx, w, h, limits, () => {
    const s = paintState(settings),
      dark = isDark(colors.paper),
      // The light source drifts slowly while animated, like tilting the device.
      angle =
        -0.9 +
        (playing && s.motion > 0
          ? Math.sin(clock * (s.motion / 120)) * 0.6
          : 0),
      lx = w / 2 + Math.cos(angle) * w,
      ly = h / 2 + Math.sin(angle) * h;
    if (s.style === "Clear") {
      outline(ctx, p, colors.a, 1, dark ? 0.25 : 0.6, 0.5);
      return;
    }
    // Specular rim: a gradient stroke that is brightest where it faces the light.
    const rim = ctx.createLinearGradient(lx, ly, w - lx, h - ly);
    rim.addColorStop(0, colors.a);
    rim.addColorStop(0.45, "rgba(255,255,255,0)");
    rim.addColorStop(0.75, "rgba(255,255,255,0)");
    rim.addColorStop(1, colors.a);
    trace(ctx, p, 0.5);
    ctx.closePath();
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.2 + s.weight * 0.012;
    ctx.globalAlpha = dark ? 0.7 : 0.95;
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (s.style === "Refraction" || s.style === "Specular rim") {
      // Refraction: a thin chromatic fringe hugging the inner edge.
      for (const [color, off] of [
        [colors.b, -2.2],
        [colors.c, -3.6],
      ] as const) {
        ctx.globalAlpha = 0.18 + (shown / 100) * 0.25;
        outline(ctx, p, color, 1.2, ctx.globalAlpha, off);
      }
      ctx.globalAlpha = 1;
    }
    if (s.style === "Light catch" || s.style === "Specular rim") {
      // A soft caustic just below the top edge, where light enters the glass.
      const g = ctx.createRadialGradient(
        lx * 0.4 + w * 0.3,
        0,
        0,
        lx * 0.4 + w * 0.3,
        0,
        w * 0.35,
      );
      g.addColorStop(
        0,
        dark ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.55)",
      );
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, -6, w, Math.min(18, limits.top));
    }
    // A faint drop shadow line below, so the slab reads as lifted.
    ctx.strokeStyle = colors.d;
    ctx.globalAlpha = dark ? 0.35 : 0.12;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.r, h + 3);
    ctx.lineTo(w - p.r, h + 3);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

export const launchPainters = {
  crt: paintPhosphor,
  panes: paintPanes,
  swiss: paintSwiss,
  azulejo: paintAzulejo,
  formwork: paintFormwork,
  atomic: paintAtomic,
  hud: paintHud,
  hazard: paintHazard,
  orbit: paintOrbit,
  rangoli: paintRangoli,
  papercut: paintPapercut,
  picado: paintPicado,
  gulal: paintGulal,
  knit: paintKnit,
  liquid: paintLiquid,
} as const;
