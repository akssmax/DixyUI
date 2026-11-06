import { DocsSelect, DocsSwitch } from "./docs-controls";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Theme } from "@dixy-ui/react";
import { useDocsAppearance } from "./docs-shell";

type Mode = "flat" | "static" | "backdrop";
interface Sample {
  mode: Mode;
  frames: number;
  p95Ms: number;
  maxMs: number;
  over20Ms: number;
  appliedFilter: string;
}
const modes: Mode[] = ["flat", "static", "backdrop"];

/** A finite comparison of the same scene, not a GPU trace or battery benchmark. */
export function MaterialPerformanceLab() {
  const appearance = useDocsAppearance();
  const [mode, setMode] = useState<Mode>("flat");
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [error, setError] = useState("");
  const scene = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  async function prepare() {
    try {
      await import("@dixy-ui/react/backdrop-pilot.css");
      setReady(true);
      return true;
    } catch {
      setError(
        "The optional glass stylesheet could not load. The opaque scene remains usable.",
      );
      return false;
    }
  }
  async function start() {
    if (!(await prepare())) return;
    setSamples([]);
    setMode("flat");
    setRunning(true);
  }
  useEffect(() => {
    if (!running) return;
    // Reduction does not permit scripted scrolling. The manual specimen remains available.
    if (
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setError(
        "Automatic scrolling is disabled by reduced motion. Compare the modes manually.",
      );
      setRunning(false);
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopOnReduction = () => {
      if (media.matches) {
        setRunning(false);
        setMode("flat");
        setError("Sampling stopped because reduced motion was enabled.");
      }
    };
    media.addEventListener("change", stopOnReduction);
    let frame = 0,
      phase = 0,
      settle = 2,
      startTime = 0,
      previous = 0;
    let deltas: number[] = [];
    function tick(now: number) {
      if (!scene.current) return;
      if (settle-- > 0) {
        previous = now;
        startTime = now;
        frame = requestAnimationFrame(tick);
        return;
      }
      deltas.push(now - previous);
      previous = now;
      const range = scene.current.scrollHeight - scene.current.clientHeight;
      scene.current.scrollTop = ((now - startTime) / 2000) * range;
      if (now - startTime < 2000) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const ordered = [...deltas].sort((a, b) => a - b);
      const filter = toolbar.current
        ? getComputedStyle(toolbar.current).backdropFilter
        : "unavailable";
      const sample: Sample = {
        mode: modes[phase]!,
        frames: deltas.length,
        p95Ms: Number(
          (
            ordered[Math.max(0, Math.ceil(ordered.length * 0.95) - 1)] ?? 0
          ).toFixed(2),
        ),
        maxMs: Number(Math.max(...deltas).toFixed(2)),
        over20Ms: deltas.filter((delta) => delta > 20).length,
        appliedFilter: filter || "none",
      };
      setSamples((current) => [...current, sample]);
      phase++;
      scene.current.scrollTop = 0;
      if (phase === modes.length) {
        setRunning(false);
        setMode("flat");
        return;
      }
      setMode(modes[phase]!);
      deltas = [];
      settle = 2;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", stopOnReduction);
    };
  }, [running, reduced]);
  return (
    <section
      className="material-performance-lab"
      aria-label="Material rendering comparison"
    >
      <p>
        Use the same scene with a flat surface, static finish, or experimental
        frosted toolbar. The pilot loads only when selected. Its 8px blur is
        capped to one small region; labels keep opaque backings.
      </p>
      <div className="foundation-toolbar expressive-controls">
        <label>
          Comparison mode
          <DocsSelect
            aria-label="Comparison mode"
            disabled={running}
            value={mode}
            onValueChange={async (nextValue) => {
              const next = nextValue as Mode;
              if (next !== "backdrop" || (await prepare())) setMode(next);
            }}
          >
            {modes.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          <DocsSwitch
            checked={reduced}
            onCheckedChange={(nextChecked) => {
              setReduced(nextChecked);
              if (running) setMode("flat");
            }}
          />
          Reduce effects and motion
        </label>
        <Button
          variant="outline"
          disabled={running || reduced}
          onClick={() => void start()}
        >
          Record 6-second comparison
        </Button>
        {running && (
          <Button
            variant="ghost"
            onClick={() => {
              setRunning(false);
              setMode("flat");
            }}
          >
            Stop sampling
          </Button>
        )}
      </div>
      <Theme
        appearance={appearance}
        effects={
          reduced
            ? "reduced"
            : mode === "backdrop" && ready
              ? "backdrop"
              : "static"
        }
        motion={reduced ? "reduced" : "system"}
        className="material-comparison-stage"
      >
        <div
          ref={scene}
          className="material-comparison-scroll"
          tabIndex={0}
          aria-label="Scrollable comparison scene"
        >
          {Array.from({ length: 18 }, (_, index) => (
            <div className="material-comparison-row" key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>Room for the next idea</strong>
                <p>
                  The same content, geometry, and scroll path in each sample.
                </p>
              </div>
            </div>
          ))}
        </div>
        <Box
          ref={toolbar}
          material={mode === "flat" ? "matte" : "glossy"}
          className={
            mode === "backdrop" && ready
              ? "material-comparison-toolbar dixy-backdrop-pilot"
              : "material-comparison-toolbar"
          }
          aria-label="Comparison toolbar"
        >
          <span>Project library</span>
          <Button material="matte" size="sm" variant="outline">
            View all
          </Button>
        </Box>
      </Theme>
      <p role="status">
        {error ||
          (running
            ? `Sampling ${mode}. Each mode runs for two seconds.`
            : samples.length === 3
              ? "Comparison complete. Frame intervals describe this browser session only."
              : "No sample is running. Glass remains experimental.")}
      </p>
      <p>
        Sampling uses requestAnimationFrame only during the explicit six-second
        run and stops on unmount, Stop, or reduced motion. Frame intervals
        include all browser work; they do not isolate paint, GPU, energy, or
        thermal cost. Background tabs can distort results. Mobile CPU emulation
        cannot establish real-device GPU performance.
      </p>
      {samples.length > 0 && (
        <pre
          className="material-sample-output"
          aria-label="Frame comparison results"
        >
          {JSON.stringify(samples, null, 2)}
        </pre>
      )}
    </section>
  );
}
