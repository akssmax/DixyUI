/**
 * Prototype shader programs for the /lab/shaders route.
 *
 * All are GLSL ES 1.0 (WebGL 1) so they run on every WebGL-capable browser.
 * Colors are not hard-coded: the runtime reads theme tokens from the page and
 * passes them in as uDeep / uMid / uLight, so a shader follows the skin, the
 * accent and light/dark without a rebuild.
 */

export type ShaderProgramId =
  "caustics" | "phosphor" | "neonRain" | "iridescence" | "bokeh" | "aurora";

export interface ShaderProgram {
  id: ShaderProgramId;
  fragment: string;
  /** Fraction of the device-pixel size the canvas renders at. */
  resolution: number;
  /** Token lookups for the three colour uniforms, per appearance. */
  colors: Record<
    "light" | "dark",
    { deep: string; mid: string; light: string }
  >;
}

export const vertexSource = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const common = `
// mediump is fp16 on Apple GPUs: uTime loses precision within minutes and the
// animation starts to step. highp is full rate there and safe elsewhere.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uScale;
uniform float uDark;
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uLight;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}
// Three octaves: enough for warp offsets, where fine detail is never seen.
float fbm3(vec2 p) {
  float v = 0.5 * noise(p);
  p = p * 2.03 + vec2(1.7, 9.2);
  v += 0.25 * noise(p);
  p = p * 2.03 + vec2(1.7, 9.2);
  return v + 0.125 * noise(p);
}
`;

/**
 * Ocean Depths: two layers of domain-warped noise. Where the warped field
 * crosses its midpoint we get thin bright ridges that read as caustic light,
 * plus slanted god rays that fade with depth.
 */
const caustics = `${common}
float causticLayer(vec2 p, float t) {
  vec2 q = vec2(fbm3(p + vec2(0.0, t * 0.6)), fbm3(p + vec2(5.2, -t * 0.5)));
  float n = fbm(p + 3.0 * q + vec2(t * 0.15, 0.0));
  float ridge = 1.0 - abs(n * 2.0 - 1.0);
  return pow(ridge, 10.0);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = gl_FragCoord.xy / uRes.y * 3.2;
  float t = uTime * 0.18;

  float c = causticLayer(p, t) * 0.75 + causticLayer(p * 1.7 + 4.0, t * 1.3) * 0.45;

  // Rays come down from the surface at a slight angle and fade with depth.
  float rx = uv.x + (1.0 - uv.y) * 0.35;
  float rays = noise(vec2(rx * 9.0, t * 0.8)) * noise(vec2(rx * 23.0, t * 0.5 + 3.0));
  rays = pow(rays, 2.0) * smoothstep(0.1, 1.0, uv.y);

  // Deeper (lower) water is closer to the canvas token; the surface is tinted.
  vec3 col = mix(uDeep, uMid, smoothstep(0.0, 1.0, uv.y) * 0.85);
  float depthFade = mix(0.35, 1.0, uv.y);
  // Light water needs more gain: pale highlights over a pale tint barely read.
  float gain = mix(1.0, 0.55, uDark);
  col = mix(col, uLight, clamp((c * depthFade + rays * 0.6) * gain, 0.0, 1.0));

  float vig = smoothstep(1.4, 0.3, length(uv * 2.0 - 1.0));
  col *= mix(0.9, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Phosphor Terminal: a CRT glass. Scanlines and grain sit at device-pixel
 * scale, a soft refresh band rolls down, and a sparse field of 3×5 "glyphs"
 * blinks on and off. No full-screen flicker, so nothing flashes.
 */
const phosphor = `${common}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 c = uv * 2.0 - 1.0;
  vec2 cu = c * (1.0 + 0.06 * dot(c.yx, c.yx));
  vec2 suv = cu * 0.5 + 0.5;

  vec3 col = uDeep;

  float haze = fbm3(suv * 3.0 + vec2(0.0, uTime * 0.04));
  col = mix(col, uMid, haze * 0.22);

  // Sparse glyph field.
  vec2 cell = vec2(12.0, 20.0) * uScale;
  vec2 g = gl_FragCoord.xy / cell;
  vec2 id = floor(g);
  vec2 f = fract(g);
  float tick = floor(uTime * 1.5 + hash(id) * 9.0);
  float on = step(0.982, hash(id + tick * 0.37));
  vec2 bit = floor(f * vec2(3.0, 5.0));
  float b = step(0.42, hash(id * 7.1 + bit + tick));
  float inside = step(0.18, f.x) * step(f.x, 0.82) * step(0.14, f.y) * step(f.y, 0.86);
  col = mix(col, uLight, on * b * inside * 0.45);

  // Rolling refresh band, top to bottom.
  float bandY = 1.0 - fract(uTime * 0.07);
  float band = exp(-pow((uv.y - bandY) * 9.0, 2.0));
  col = mix(col, uLight, band * 0.07);

  // Scanlines at about 3 device pixels per line.
  float s = 0.5 + 0.5 * sin(gl_FragCoord.y * 3.14159 / (1.5 * uScale));
  col *= mix(0.8, 1.0, s);

  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.035;

  float vig = smoothstep(1.45, 0.4, length(cu));
  col *= mix(0.55, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Neon Night Market: rain streaks in columns at different speeds, two neon
 * glows drifting behind them, and a wet-street reflection at the bottom.
 */
const neonRain = `${common}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = gl_FragCoord.xy / uRes.y;
  float t = uTime;

  vec3 col = uDeep;
  // Two soft neon signs drifting behind the rain.
  vec2 a = vec2(0.25 + 0.08 * sin(t * 0.13), 0.7 + 0.05 * cos(t * 0.11));
  vec2 b = vec2(0.78 + 0.06 * cos(t * 0.09), 0.45 + 0.07 * sin(t * 0.12));
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  float ga = exp(-length((uv - a) * asp) * 4.0);
  float gb = exp(-length((uv - b) * asp) * 4.5);
  col = mix(col, uMid, ga * 0.55);
  col = mix(col, uLight, gb * 0.4);

  // Rain: thin columns, each with its own speed and phase.
  float columns = 90.0;
  float cx = floor(p.x * columns);
  float speed = 0.6 + hash(vec2(cx, 1.0)) * 0.9;
  float phase = hash(vec2(cx, 7.0));
  float y = fract(p.y * 0.6 + t * speed * 0.5 + phase);
  float streak = smoothstep(0.0, 0.2, y) * (1.0 - smoothstep(0.2, 0.24, y));
  float lane = 1.0 - smoothstep(0.0, 0.18, abs(fract(p.x * columns) - 0.5));
  float drops = streak * lane * step(0.55, hash(vec2(cx, 3.0)));
  col = mix(col, mix(uMid, uLight, 0.5), drops * 0.35);

  // Wet street: the glows reflect, rippled, in the bottom fifth.
  float floorMask = 1.0 - smoothstep(0.0, 0.22, uv.y);
  float ripple = noise(vec2(p.x * 40.0, p.y * 6.0 - t * 1.5));
  col = mix(col, uMid, floorMask * ga * 0.6 * ripple + floorMask * 0.06);
  col = mix(col, uLight, floorMask * gb * 0.5 * ripple);

  float vig = smoothstep(1.5, 0.3, length(uv * 2.0 - 1.0));
  col *= mix(0.75, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Prism Glass: thin-film iridescence. A slow warped field picks a hue along
 * a cosine spectrum, mixed gently into the theme's own tint.
 */
const iridescence = `${common}
vec3 spectrum(float x) {
  return 0.5 + 0.5 * cos(6.28318 * (x + vec3(0.0, 0.33, 0.67)));
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = gl_FragCoord.xy / uRes.y * 1.6;
  float t = uTime * 0.05;
  vec2 q = vec2(fbm3(p + t), fbm3(p - t + 4.0));
  float film = fbm(p * 1.3 + 2.5 * q + vec2(t * 2.0, 0.0));
  vec3 iri = spectrum(film * 1.6 + t * 3.0);

  vec3 base = mix(uDeep, uMid, uv.y);
  float sheen = smoothstep(0.35, 0.75, film);
  vec3 col = mix(base, iri, mix(0.55, 0.38, uDark) * sheen);
  // A soft specular streak across the glass.
  float streak = exp(-pow((uv.x + uv.y * 0.6 - 0.9 - 0.15 * sin(t * 4.0)) * 4.0, 2.0));
  col = mix(col, uLight, streak * 0.25);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Diwali Lights: three depths of out-of-focus lamps drifting upward. Each
 * grid cell owns one disc with a soft core and a brighter rim.
 */
const bokeh = `${common}
float lamps(vec2 p, float scale, float t, float seed) {
  p *= scale;
  p.y -= t;
  vec2 id = floor(p);
  vec2 f = fract(p) - 0.5;
  float h = hash(id + seed);
  if (h < 0.45) return 0.0;
  vec2 offset = (vec2(hash(id + seed + 1.3), hash(id + seed + 2.7)) - 0.5) * 0.5;
  float r = 0.18 + 0.2 * hash(id + seed + 5.1);
  float d = length(f - offset);
  float disc = 1.0 - smoothstep(r - 0.03, r, d);
  float rim = smoothstep(r - 0.08, r - 0.02, d) * disc;
  float twinkle = 0.75 + 0.25 * sin(t * 3.0 + h * 40.0);
  return (disc * 0.55 + rim * 0.45) * twinkle;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = gl_FragCoord.xy / uRes.y;
  float t = uTime * 0.05;
  vec3 col = mix(uDeep, uMid, (1.0 - uv.y) * 0.35);
  float far = lamps(p, 9.0, t * 0.6, 3.0);
  float midL = lamps(p, 5.0, t * 1.0, 11.0);
  float near = lamps(p, 2.6, t * 1.6, 23.0);
  float k = mix(0.8, 1.0, uDark);
  col = mix(col, uMid, far * 0.35 * k);
  col = mix(col, mix(uMid, uLight, 0.6), midL * 0.45 * k);
  col = mix(col, uLight, near * 0.35 * k);
  float vig = smoothstep(1.5, 0.3, length(uv * 2.0 - 1.0));
  col *= mix(0.8, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Solar Sail: twinkling stars and aurora curtains. Curtains are vertical
 * bands whose base line is bent by noise, fading upward.
 */
const aurora = `${common}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = gl_FragCoord.xy / uRes.y;
  float t = uTime * 0.08;
  vec3 col = mix(uDeep, uMid, uv.y * 0.25);

  // Stars: one per cell, most of them dark.
  vec2 cg = gl_FragCoord.xy / (14.0 * uScale);
  vec2 cell = floor(cg);
  vec2 sp = vec2(hash(cell + 9.1), hash(cell + 4.3)) * 0.8 + 0.1;
  float star = step(0.93, hash(cell)) * (1.0 - smoothstep(0.02, 0.09, length(fract(cg) - sp)));
  float tw = 0.5 + 0.5 * sin(uTime * (1.0 + hash(cell + 3.0) * 2.0) + hash(cell) * 30.0);
  col = mix(col, uLight, star * tw * 0.8 * uDark);

  float curtain = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float baseY = 0.45 + 0.12 * fi + 0.12 * (fbm3(vec2(p.x * 1.2 + fi * 3.0, t + fi)) - 0.5) * 2.0;
    float above = uv.y - baseY;
    float body = smoothstep(0.0, 0.02, above) * exp(-max(above, 0.0) * 5.0);
    float rays = 0.6 + 0.4 * noise(vec2(p.x * 30.0 + fi * 7.0, t * 6.0));
    curtain += body * rays * (0.7 - fi * 0.15);
  }
  col = mix(col, uLight, clamp(curtain * 1.3, 0.0, 1.0) * mix(0.6, 0.75, uDark));
  gl_FragColor = vec4(col, 1.0);
}
`;

export const shaderPrograms: Record<ShaderProgramId, ShaderProgram> = {
  caustics: {
    id: "caustics",
    fragment: caustics,
    resolution: 0.5,
    colors: {
      light: {
        deep: "--dixy-color-brand-6",
        mid: "--dixy-color-brand-3",
        light: "--dixy-color-background-surface-raised",
      },
      dark: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-4",
        light: "--dixy-color-brand-11",
      },
    },
  },
  phosphor: {
    id: "phosphor",
    fragment: phosphor,
    resolution: 1,
    colors: {
      light: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-4",
        light: "--dixy-color-brand-9",
      },
      dark: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-5",
        light: "--dixy-color-brand-11",
      },
    },
  },
  neonRain: {
    id: "neonRain",
    fragment: neonRain,
    resolution: 0.75,
    colors: {
      light: {
        deep: "--dixy-color-brand-3",
        mid: "--dixy-color-brand-7",
        light: "--dixy-color-brand-9",
      },
      dark: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-9",
        light: "--dixy-color-brand-11",
      },
    },
  },
  iridescence: {
    id: "iridescence",
    fragment: iridescence,
    resolution: 0.5,
    colors: {
      light: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-3",
        light: "--dixy-color-background-surface-raised",
      },
      dark: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-3",
        light: "--dixy-color-brand-11",
      },
    },
  },
  bokeh: {
    id: "bokeh",
    fragment: bokeh,
    resolution: 0.5,
    colors: {
      light: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-3",
        light: "--dixy-color-brand-6",
      },
      dark: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-8",
        light: "--dixy-color-brand-11",
      },
    },
  },
  aurora: {
    id: "aurora",
    fragment: aurora,
    resolution: 0.75,
    colors: {
      light: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-3",
        light: "--dixy-color-brand-8",
      },
      dark: {
        deep: "--dixy-color-background-canvas",
        mid: "--dixy-color-brand-3",
        light: "--dixy-color-brand-10",
      },
    },
  },
};
