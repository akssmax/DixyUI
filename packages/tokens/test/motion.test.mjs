import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  motionDurations,
  motionEasings,
  motionSprings,
  motionTransitions,
  springTransition,
  tweenTransition,
  motionDuration,
  motionEasing,
  motionTransition,
  motionEffectsDuration,
  reducedEffectsMaxDuration,
} from "../src/motion.ts";

test("transition recipes resolve to bounded shared timing definitions", () => {
  for (const role of Object.keys(motionTransitions)) {
    const transition = tweenTransition(role);
    assert.ok(transition.duration >= 0 && transition.duration <= 0.4);
    assert.equal(transition.ease.length, 4);
    for (const coordinate of transition.ease)
      assert.ok(coordinate >= 0 && coordinate <= 1);
    assert.equal(tweenTransition(role, true).duration, 0);
    const fade = tweenTransition(role, true, "effects").duration;
    assert.ok(fade > 0 && fade <= reducedEffectsMaxDuration / 1000);
    assert.equal(
      tweenTransition(role, false, "effects").duration,
      transition.duration,
    );
  }
  assert.equal(motionDurations.fast, 120);
  assert.equal(motionDurations.normal, 200);
  assert.equal(tweenTransition("enter").duration, 0.2);
  for (const role of Object.keys(motionTransitions)) {
    if (role !== "page") assert.ok(tweenTransition(role).duration < 0.3);
  }
  assert.ok(tweenTransition("page").duration >= 0.3);
  assert.ok(tweenTransition("page").duration <= 0.4);
  const independent = tweenTransition("enter");
  independent.ease[0] = 1;
  assert.notEqual(independent.ease[0], motionEasings.enter[0]);
});

test("spring conversion preserves damping ratio and effects cannot overshoot", () => {
  for (const [scheme, kinds] of Object.entries(motionSprings)) {
    for (const [kind, speeds] of Object.entries(kinds)) {
      assert.ok(speeds.fast.stiffness > speeds.default.stiffness);
      assert.ok(speeds.default.stiffness > speeds.slow.stiffness);
      for (const [speed, definition] of Object.entries(speeds)) {
        const result = springTransition(scheme, kind, speed);
        assert.equal(result.type, "spring");
        const ratio =
          result.damping / (2 * Math.sqrt(result.stiffness * result.mass));
        assert.ok(Math.abs(ratio - definition.dampingRatio) < 1e-12);
        assert.ok(
          result.damping > 0 && result.restSpeed > 0 && result.restDelta > 0,
        );
        assert.ok(
          !("duration" in result) &&
            !("bounce" in result) &&
            !("velocity" in result),
        );
        if (kind === "effects" || scheme === "standard")
          assert.ok(ratio >= 1 - 1e-12);
        const reduced = springTransition(scheme, kind, speed, true);
        assert.equal(reduced.type, "tween");
        // Reduction removes movement; effects keep a short, bounded fade.
        if (kind === "spatial") assert.equal(reduced.duration, 0);
        else
          assert.ok(
            reduced.duration > 0 &&
              reduced.duration <= reducedEffectsMaxDuration / 1000,
          );
      }
    }
  }
});

test("CSS and JavaScript references share a complete reduction policy", () => {
  assert.equal(motionDuration("fast"), "var(--dixy-motion-duration-fast)");
  assert.equal(motionEasing("enter"), "var(--dixy-motion-easing-enter)");
  assert.equal(
    motionTransition("feedback"),
    "var(--dixy-motion-transition-feedback)",
  );
  const css = readFileSync(
    new URL("../src/motion.css", import.meta.url),
    "utf8",
  );
  const media = css.slice(
    css.indexOf("@media (prefers-reduced-motion: reduce)"),
  );
  const local = css.slice(
    css.indexOf('[data-motion="reduced"]'),
    css.indexOf("@media"),
  );
  assert.equal(
    motionEffectsDuration("fast"),
    "var(--dixy-motion-effects-duration-fast)",
  );
  for (const [name, ms] of Object.entries(motionDurations)) {
    assert.ok(media.includes(`--dixy-motion-duration-${name}: 0ms;`));
    assert.ok(local.includes(`--dixy-motion-duration-${name}: 0ms;`));
    const fade = `--dixy-motion-effects-duration-${name}: ${Math.min(ms, reducedEffectsMaxDuration)}ms;`;
    assert.ok(media.includes(fade), fade);
    assert.ok(local.includes(fade), fade);
  }
  execFileSync(process.execPath, ["scripts/generate-motion.mjs", "--check"], {
    cwd: new URL("../../../", import.meta.url),
    stdio: "pipe",
  });
});
