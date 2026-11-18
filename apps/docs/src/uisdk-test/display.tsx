import { useEffect, useRef } from "react";
import { Badge, useMotionPreferences } from "@dixy-ui/react";
import type { Player, Visualizer } from "./use-player";
import { formatTime, speakTime } from "./tracks";

const BARS = 19;

/** Fake spectrum and scope, drawn from the play clock. Decorative only. */
function VisualizerCanvas({
  mode,
  playing,
}: {
  mode: Visualizer;
  playing: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { reducedMotion } = useMotionPreferences();
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx || mode === "off") return;
    const peaks = new Array<number>(BARS).fill(0);
    let raf = 0;
    // Colors come from tokens (skins change them); re-read once a second.
    let ink = "#9cf";
    let warm = "#dc0";
    let hot = "#e43";
    let peak = "#bbb";
    let readAt = -Infinity;
    const draw = (t: number) => {
      const { width, height } = el;
      if (t - readAt > 1000) {
        const style = getComputedStyle(el);
        ink = style.getPropertyValue("--uisdk-lcd-ink").trim() || ink;
        warm = style.getPropertyValue("--uisdk-lcd-warm").trim() || warm;
        hot = style.getPropertyValue("--uisdk-lcd-hot").trim() || hot;
        peak = style.getPropertyValue("--uisdk-lcd-peak").trim() || peak;
        readAt = t;
      }
      ctx.clearRect(0, 0, width, height);
      const live = playing && !reducedMotion;
      if (mode === "spectrum") {
        const w = width / BARS;
        for (let i = 0; i < BARS; i++) {
          const target = live
            ? (0.25 + 0.75 * Math.abs(Math.sin(t / (380 + i * 37) + i * 1.7))) *
              (1 - i / (BARS * 1.4))
            : playing
              ? 0.35 * (1 - i / BARS)
              : 0;
          peaks[i] = Math.max(target, peaks[i]! - 0.02);
          const h = Math.round(target * height);
          // Segments light up by height, as on the classic analyser.
          for (let y = height - 2; y > height - h; y -= 3) {
            const level = 1 - y / height;
            ctx.fillStyle = level > 0.8 ? hot : level > 0.55 ? warm : ink;
            ctx.fillRect(i * w + 1, y, w - 2, 2);
          }
          ctx.fillStyle = peak;
          ctx.fillRect(
            i * w + 1,
            height - Math.round(peaks[i]! * height),
            w - 2,
            1,
          );
        }
      } else {
        ctx.strokeStyle = ink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const amp = live
            ? 0.35 * Math.sin(t / 90 + x / 6) * Math.sin(x / 23 + t / 400)
            : 0;
          const y = height / 2 + amp * height;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      if (live) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [mode, playing, reducedMotion]);
  if (mode === "off") return <div className="uisdk-vis" aria-hidden="true" />;
  return (
    <canvas
      ref={canvas}
      className="uisdk-vis"
      width={152}
      height={40}
      aria-hidden="true"
    />
  );
}

export function Display({
  player,
  visualizer,
  timeMode,
  onToggleTime,
}: {
  player: Player;
  visualizer: Visualizer;
  timeMode: "elapsed" | "remaining";
  onToggleTime: () => void;
}) {
  const { track, status, position, index } = player;
  const { reducedMotion } = useMotionPreferences();
  const shown =
    timeMode === "elapsed" ? position : Math.max(0, track.duration - position);
  const marquee = `${index + 1}. ${track.artist} - ${track.title} (${formatTime(track.duration)})`;
  return (
    <div className="uisdk-lcd" data-status={status}>
      <div className="uisdk-lcd-left">
        <span className="uisdk-lcd-state" aria-hidden="true">
          {status === "playing" ? "▶" : status === "paused" ? "❚❚" : "■"}
        </span>
        <button
          type="button"
          className="uisdk-lcd-time"
          onClick={onToggleTime}
          aria-label={`${timeMode === "elapsed" ? "Elapsed" : "Remaining"} ${speakTime(shown)}. Show ${timeMode === "elapsed" ? "remaining" : "elapsed"} time`}
        >
          {/* Unlit segments, as on a real LCD. Decorative. */}
          <span className="uisdk-lcd-ghost" aria-hidden="true">
            88:88
          </span>
          <span className="uisdk-lcd-digits">
            {timeMode === "remaining" && "-"}
            {status === "stopped" ? "0:00" : formatTime(shown)}
          </span>
        </button>
      </div>
      <div className="uisdk-lcd-info" aria-hidden="true">
        <span className="uisdk-lcd-label">KBPS</span>
        <Badge
          size="sm"
          variant="solid"
          color="neutral"
          className="uisdk-lcd-badge"
        >
          {track.kbps}
        </Badge>
        <span className="uisdk-lcd-label">KHZ</span>
        <Badge
          size="sm"
          variant="solid"
          color="neutral"
          className="uisdk-lcd-badge"
        >
          {track.khz}
        </Badge>
        <span className="uisdk-lcd-mode" data-on={!track.stereo || undefined}>
          MONO
        </span>
        <span className="uisdk-lcd-mode" data-on={track.stereo || undefined}>
          STEREO
        </span>
      </div>
      <VisualizerCanvas mode={visualizer} playing={status === "playing"} />
      <div
        className="uisdk-lcd-marquee"
        data-scrolling={(!reducedMotion && status === "playing") || undefined}
      >
        <span aria-hidden="true">
          {marquee}&nbsp;&nbsp;***&nbsp;&nbsp;{marquee}
          &nbsp;&nbsp;***&nbsp;&nbsp;
        </span>
        <span className="uisdk-visually-hidden">{marquee}</span>
      </div>
    </div>
  );
}
