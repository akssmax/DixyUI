import {
  shaderPrograms,
  vertexSource,
  type ShaderProgramId,
} from "./shader-programs";

/** What the canvas is drawing at, for diagnostics. */
export interface ShaderFrameSize {
  width: number;
  height: number;
  /** Adaptive quality, 0.5–1, applied on top of the program's resolution. */
  quality: number;
}

export type ShaderStatus =
  | ({ state: "running"; fps: number } & ShaderFrameSize)
  | ({ state: "still"; reason: "reduced-motion" | "paused" } & ShaderFrameSize)
  | { state: "hidden" }
  | { state: "unsupported" }
  | { state: "lost" };

export interface ShaderBackdropOptions {
  program: ShaderProgramId;
  appearance: "light" | "dark";
  /** Time multiplier; 1 is the designed pace. @default 1 */
  speed?: number;
  /** Hold the current frame instead of animating. @default false */
  paused?: boolean;
  onStatus?: (status: ShaderStatus) => void;
}

export type ShaderBackdropSettings = Partial<
  Pick<ShaderBackdropOptions, "appearance" | "speed" | "paused">
>;

const uniformNames = [
  "uRes",
  "uTime",
  "uScale",
  "uDark",
  "uDeep",
  "uMid",
  "uLight",
] as const;
type Uniforms = Record<
  (typeof uniformNames)[number],
  WebGLUniformLocation | null
>;

const MAX_DPR = 1.5;
/** Adaptive quality never goes below this fraction of the program's resolution. */
const MIN_QUALITY = 0.5;
/** Frames averaged before deciding the GPU is falling behind the display. */
const QUALITY_WINDOW = 45;
/** A still frame is taken at this time so the frozen picture is a nice one. */
const STILL_TIME = 42;

/** Resolve any CSS colour (oklch, color-mix, hex…) to linear 0–1 RGB via a 1×1 canvas. */
function createColorReader() {
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  return (value: string): [number, number, number] => {
    if (!ctx || !value) return [0, 0, 0];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255];
  };
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost())
    throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compile failed");
  return shader;
}

/**
 * Draws one full-screen fragment shader into `canvas`, sized to `host`.
 * One canvas, one context: browsers cap live WebGL contexts (often ~16), so
 * this belongs on a page backdrop, never inside repeated components.
 */
export function startShaderBackdrop(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  options: ShaderBackdropOptions,
) {
  const program = shaderPrograms[options.program];
  const readColor = createColorReader();
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  let gl: WebGLRenderingContext | null = null;
  const owned: {
    program?: WebGLProgram;
    shaders: WebGLShader[];
    buffer?: WebGLBuffer | null;
  } = { shaders: [] };
  let uniforms = {} as Uniforms;
  let frame = 0;
  let last = 0;
  let elapsed = 0;
  let visible = true;
  let destroyed = false;
  let fpsFrames = 0;
  let fpsStart = 0;
  // Cached so the frame loop never reads layout or re-uploads static uniforms.
  let hostWidth = host.clientWidth;
  let hostHeight = host.clientHeight;
  let sizeDirty = true;
  let uniformsDirty = true;
  let quality = 1;
  let bestInterval = Infinity;
  let slowSum = 0;
  let slowCount = 0;
  let colors = { deep: [0, 0, 0], mid: [0, 0, 0], light: [0, 0, 0] };
  const report = options.onStatus ?? (() => {});

  function readColors() {
    const style = getComputedStyle(host);
    const map = program.colors[options.appearance];
    colors = {
      deep: readColor(style.getPropertyValue(map.deep).trim()),
      mid: readColor(style.getPropertyValue(map.mid).trim()),
      light: readColor(style.getPropertyValue(map.light).trim()),
    };
    uniformsDirty = true;
  }

  function setup(): boolean {
    gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: "low-power",
      // Lets the browser swap buffers instead of copying them every frame.
      preserveDrawingBuffer: false,
    });
    if (!gl) return false;
    const shaderProgram = gl.createProgram()!;
    const shaders = [
      compile(gl, gl.VERTEX_SHADER, vertexSource),
      compile(gl, gl.FRAGMENT_SHADER, program.fragment),
    ];
    for (const shader of shaders) gl.attachShader(shaderProgram, shader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    const buffer = gl.createBuffer();
    Object.assign(owned, { program: shaderProgram, shaders, buffer });
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    uniforms = Object.fromEntries(
      uniformNames.map((name) => [
        name,
        gl!.getUniformLocation(shaderProgram, name),
      ]),
    ) as Uniforms;
    sizeDirty = uniformsDirty = true;
    return true;
  }

  function draw(time: number) {
    if (!gl || gl.isContextLost()) return;
    if (sizeDirty) {
      const scale =
        Math.min(devicePixelRatio || 1, MAX_DPR) * program.resolution * quality;
      const width = Math.max(1, Math.round(hostWidth * scale));
      const height = Math.max(1, Math.round(hostHeight * scale));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uniforms.uRes, width, height);
      gl.uniform1f(uniforms.uScale, scale);
      sizeDirty = false;
    }
    if (uniformsDirty) {
      gl.uniform1f(uniforms.uDark, options.appearance === "dark" ? 1 : 0);
      gl.uniform3fv(uniforms.uDeep, colors.deep);
      gl.uniform3fv(uniforms.uMid, colors.mid);
      gl.uniform3fv(uniforms.uLight, colors.light);
      uniformsDirty = false;
    }
    gl.uniform1f(uniforms.uTime, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /**
   * If frames keep arriving well behind the display's own interval, the GPU
   * is the bottleneck: render fewer pixels rather than drop frames. It only
   * steps down, so quality never oscillates.
   */
  function adaptQuality(delta: number) {
    if (delta < bestInterval) bestInterval = delta;
    slowSum += delta;
    if (++slowCount < QUALITY_WINDOW) return;
    const average = slowSum / slowCount;
    slowSum = slowCount = 0;
    if (average > bestInterval * 1.35 && quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality * 0.8);
      sizeDirty = true;
    }
  }

  // No frame cap: requestAnimationFrame already runs at the display's refresh
  // rate (120 Hz on ProMotion). Animation speed is time-based, not per-frame.
  function tick(now: number) {
    frame = 0;
    if (destroyed) return;
    if (last) {
      const delta = now - last;
      // Clamp the step so a stalled frame does not jump the animation.
      elapsed += (Math.min(delta, 100) / 1000) * (options.speed ?? 1);
      adaptQuality(delta);
    }
    last = now;
    draw(elapsed);
    fpsFrames++;
    if (now - fpsStart >= 1000) {
      report({
        state: "running",
        fps: Math.round((fpsFrames * 1000) / (now - fpsStart)),
        ...frameSize(),
      });
      fpsFrames = 0;
      fpsStart = now;
    }
    frame = requestAnimationFrame(tick);
  }

  function frameSize(): ShaderFrameSize {
    return { width: canvas.width, height: canvas.height, quality };
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }

  /** Decide between animating, a single still frame, or nothing. */
  function update() {
    stop();
    if (destroyed || !gl || gl.isContextLost()) return;
    if (motionQuery.matches) {
      draw(STILL_TIME);
      report({ state: "still", reason: "reduced-motion", ...frameSize() });
      return;
    }
    if (options.paused) {
      draw(elapsed);
      report({ state: "still", reason: "paused", ...frameSize() });
      return;
    }
    if (!visible || document.hidden) {
      report({ state: "hidden" });
      return;
    }
    fpsStart = performance.now();
    fpsFrames = 0;
    slowSum = slowCount = 0;
    frame = requestAnimationFrame(tick);
  }

  function onLost(event: Event) {
    event.preventDefault();
    stop();
    report({ state: "lost" });
  }
  function onRestored() {
    if (setup()) update();
  }

  const inert = { refresh() {}, configure() {}, restart() {}, destroy() {} };
  try {
    if (!setup()) {
      report({ state: "unsupported" });
      return inert;
    }
  } catch {
    report({ state: "unsupported" });
    return inert;
  }

  readColors();
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    update();
  });
  observer.observe(host);
  const resizer = new ResizeObserver(([entry]) => {
    if (entry) {
      hostWidth = entry.contentRect.width;
      hostHeight = entry.contentRect.height;
    }
    sizeDirty = true;
    if (!frame) update();
  });
  resizer.observe(host);
  document.addEventListener("visibilitychange", update);
  motionQuery.addEventListener("change", update);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  update();

  return {
    /** Re-read tokens after the skin, accent or appearance changes. */
    refresh(next?: Pick<ShaderBackdropSettings, "appearance">) {
      if (next?.appearance) options.appearance = next.appearance;
      readColors();
      if (!frame) draw(motionQuery.matches ? STILL_TIME : elapsed);
    },
    /** Change playback without rebuilding the GL program. */
    configure(next: Pick<ShaderBackdropSettings, "speed" | "paused">) {
      const wasPaused = Boolean(options.paused);
      if (next.speed !== undefined) options.speed = next.speed;
      if (next.paused !== undefined) options.paused = next.paused;
      if (Boolean(options.paused) !== wasPaused) update();
    },
    /** Jump back to the first frame. */
    restart() {
      elapsed = 0;
      if (!frame) draw(motionQuery.matches ? STILL_TIME : elapsed);
    },
    destroy() {
      destroyed = true;
      stop();
      observer.disconnect();
      resizer.disconnect();
      document.removeEventListener("visibilitychange", update);
      motionQuery.removeEventListener("change", update);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      // Free GPU objects but keep the context: React can remount onto the
      // same canvas, and a deliberately lost context would not come back.
      if (gl && !gl.isContextLost()) {
        if (owned.program) gl.deleteProgram(owned.program);
        for (const shader of owned.shaders) gl.deleteShader(shader);
        if (owned.buffer) gl.deleteBuffer(owned.buffer);
      }
    },
  };
}
