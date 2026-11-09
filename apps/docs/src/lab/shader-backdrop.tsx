import { useEffect, useRef } from "react";
import type { ShaderProgramId } from "./shader-programs";
import { startShaderBackdrop, type ShaderStatus } from "./shader-runtime";

export interface ShaderBackdropProps {
  program: ShaderProgramId;
  appearance: "light" | "dark";
  /** Changes when the skin's tokens change, so colours are re-read. */
  tokenKey: string;
  /** Time multiplier; 1 is the designed pace. @default 1 */
  speed?: number;
  /** Hold the current frame. @default false */
  paused?: boolean;
  /** Change this number to jump back to the first frame. */
  restartKey?: number;
  onStatus?: (status: ShaderStatus) => void;
}

/**
 * Decorative only: hidden from assistive tech, no pointer events, and the
 * page underneath must already look finished without it.
 */
export function ShaderBackdrop({
  program,
  appearance,
  tokenKey,
  speed = 1,
  paused = false,
  restartKey = 0,
  onStatus,
}: ShaderBackdropProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<ReturnType<typeof startShaderBackdrop>>(null);
  const status = useRef(onStatus);
  status.current = onStatus;

  useEffect(() => {
    const element = canvas.current;
    const host = element?.parentElement;
    if (!element || !host) return;
    controller.current = startShaderBackdrop(element, host, {
      program,
      appearance,
      speed,
      paused,
      onStatus: (next) => status.current?.(next),
    });
    return () => {
      controller.current?.destroy();
      controller.current = null;
    };
    // A new program needs a new context; appearance changes go through refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  useEffect(() => {
    // Wait a frame so a freshly injected skin stylesheet has applied.
    const id = requestAnimationFrame(() =>
      controller.current?.refresh({ appearance }),
    );
    return () => cancelAnimationFrame(id);
  }, [appearance, tokenKey]);

  useEffect(() => {
    controller.current?.configure({ speed, paused });
  }, [speed, paused]);

  useEffect(() => {
    if (restartKey) controller.current?.restart();
  }, [restartKey]);

  return (
    <canvas ref={canvas} className="shader-lab-canvas" aria-hidden="true" />
  );
}
