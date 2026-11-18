import { useCallback, useEffect, useMemo, useState } from "react";
import { tracks } from "./tracks";

export type Status = "playing" | "paused" | "stopped";
export type Visualizer = "spectrum" | "oscilloscope" | "off";

const TICK = 250;

/** Simulated playback: a clock that advances while playing. No audio. */
export function usePlayer() {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("stopped");
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(72);
  const [balance, setBalance] = useState(0);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number | null>>({
    t1: 4,
    t3: 5,
  });

  const track = tracks[index]!;

  const nextIndex = useCallback(
    (from: number, direction: 1 | -1) => {
      if (shuffle && tracks.length > 1) {
        let pick = from;
        while (pick === from) pick = Math.floor(Math.random() * tracks.length);
        return pick;
      }
      const raw = from + direction;
      if (raw >= tracks.length) return repeat ? 0 : null;
      if (raw < 0) return repeat ? tracks.length - 1 : 0;
      return raw;
    },
    [repeat, shuffle],
  );

  const playIndex = useCallback((i: number) => {
    setIndex(i);
    setPosition(0);
    setStatus("playing");
  }, []);

  const actions = useMemo(
    () => ({
      play: () => {
        if (status === "stopped") setPosition(0);
        setStatus("playing");
      },
      /** Pause toggles, as on the classic player. */
      pause: () =>
        setStatus(
          status === "playing"
            ? "paused"
            : status === "paused"
              ? "playing"
              : status,
        ),
      stop: () => {
        setStatus("stopped");
        setPosition(0);
      },
      previous: () => {
        // Like the classic player: past 3s, restart the track instead.
        if (position > 3) return setPosition(0);
        const i = nextIndex(index, -1);
        if (i !== null) setIndex(i);
        setPosition(0);
      },
      next: () => {
        const i = nextIndex(index, 1);
        if (i === null) {
          setStatus("stopped");
          setPosition(0);
          return;
        }
        setIndex(i);
        setPosition(0);
      },
      seek: (seconds: number) =>
        setPosition(Math.min(track.duration, Math.max(0, seconds))),
      playIndex,
      playId: (id: string) => {
        const i = tracks.findIndex((t) => t.id === id);
        if (i >= 0) playIndex(i);
      },
      setVolume,
      setBalance,
      setMuted,
      setRepeat,
      setShuffle,
      rate: (id: string, value: number | null) =>
        setRatings((r) => ({ ...r, [id]: value })),
    }),
    [index, nextIndex, playIndex, position, status, track.duration],
  );

  useEffect(() => {
    if (status !== "playing") return;
    // Advance by real elapsed time, so throttled timers don't slow the clock.
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;
      setPosition((p) => p + delta);
    }, TICK);
    return () => window.clearInterval(timer);
  }, [status]);

  // Track end: advance, loop or stop.
  useEffect(() => {
    if (position < track.duration) return;
    const i = nextIndex(index, 1);
    if (i === null) {
      setStatus("stopped");
      setPosition(0);
    } else {
      setIndex(i);
      setPosition(0);
    }
  }, [position, track.duration, index, nextIndex]);

  return {
    index,
    track,
    status,
    position,
    volume,
    balance,
    muted,
    repeat,
    shuffle,
    ratings,
    ...actions,
  };
}

export type Player = ReturnType<typeof usePlayer>;
