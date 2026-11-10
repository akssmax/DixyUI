import { DocsSelect, DocsSwitch } from "./docs-controls";
import { ExpressiveGroupLab } from "./expressive-group-lab";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Inline,
  Theme,
  useMotionPreferences,
} from "@dixy-ui/react";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import {
  motionDurations,
  motionEasings,
  motionTransitions,
  motionSprings,
  springTransition,
  type MotionScheme,
  type MotionKind,
  type MotionSpeed,
} from "@dixy-ui/tokens";
import MotionExample from "../demos/motion-example";
import source from "../demos/motion-example?raw";
import { configureExample } from "../lib/example-source";
import { CodeBlock } from "./code-block";
import { useDocsAppearance } from "./docs-shell";
import { ComponentMotionExamples } from "./component-motion-examples";

const references = [
  [
    "Material 3 Expressive",
    "https://m3.material.io/styles/motion/overview/how-it-works",
    "Interruptible springs; spatial and effects families, each with three speeds.",
    "Keep the model. Use critically damped standard motion; reserve gentle overshoot for expressive spatial changes.",
  ],
  [
    "Material web specs",
    "https://m3.material.io/styles/motion/overview/specs",
    "Spring-to-curve approximations are available for web animation without gestures or interruption.",
    "Use real springs in Motion. Retain compact CSS timing recipes for controls and Base UI presence.",
  ],
  [
    "Radix animation",
    "https://www.radix-ui.com/primitives/docs/guides/animation",
    "Primitive presence and exit lifecycles must be coordinated with the animation engine.",
    "Keep Base UI responsible for Dialog presence and focus. Do not add a competing AnimatePresence lifecycle to it.",
  ],
  [
    "Apple motion",
    "https://developer.apple.com/design/human-interface-guidelines/motion",
    "Purposeful, brief feedback should remain optional and cancellable.",
    "No entrance on page load, autoplay, perpetual demo loops, or animation that blocks an action.",
  ],
  [
    "Motion accessibility",
    "https://motion.dev/docs/react-accessibility",
    "MotionConfig suppresses transform/layout motion; other effects need explicit policy.",
    "Use one Theme preference, a live OS subscription, zero-duration movement with short effect fades, and explicit loop cancellation.",
  ],
] as const;

export default function MotionFoundation() {
  const [recipe, setRecipe] = useState<"retarget" | "presence" | "sequence">(
    "retarget",
  );
  const [scheme, setScheme] = useState<MotionScheme>("standard");
  const [speed, setSpeed] = useState<MotionSpeed>("default");
  const [kind, setKind] = useState<MotionKind>("spatial");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const appearance = useDocsAppearance();
  const state = { recipe, scheme, speed, kind, reduceMotion, rtl };
  const code = configureExample(source, state, {
    appearance,
    accentColor: "blue",
    radius: "md",
  });
  const spring = motionSprings[scheme][kind][speed];
  const converted = springTransition(scheme, kind, speed);
  function reset() {
    setRecipe("retarget");
    setScheme("standard");
    setSpeed("default");
    setKind("spatial");
    setReduceMotion(false);
    setRtl(false);
    setResetKey((key) => key + 1);
  }
  return (
    <>
      <h2>A spring system, with room for quiet feedback</h2>
      <p>
        Motion works well here: it handles retargeting, presence and sequencing,
        while ordinary hover/focus feedback stays in CSS. The animation library
        lives behind an optional public entry point; importing a Button or the
        tokens does not load Motion.
      </p>
      <p>
        Our middle ground keeps the existing 120ms feedback and 200ms entrance
        timing. Standard spatial springs settle without overshoot. Expressive
        spatial springs add a small, deliberate bounce; effects remain
        critically damped in both schemes. These are Dixy values, not a
        reproduction of native platform constants.
      </p>
      <h2>Try it, then interrupt it</h2>
      <div className="foundation-toolbar motion-controls">
        <label>
          Recipe
          <DocsSelect
            value={recipe}
            onValueChange={(nextValue) => {
              setRecipe(nextValue as typeof recipe);
              setResetKey((key) => key + 1);
            }}
          >
            <option value="retarget">Retarget</option>
            <option value="presence">Presence</option>
            <option value="sequence">Sequence</option>
          </DocsSelect>
        </label>
        <label>
          Scheme
          <DocsSelect
            value={scheme}
            onValueChange={(nextValue) => setScheme(nextValue as MotionScheme)}
          >
            {Object.keys(motionSprings).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Speed
          <DocsSelect
            value={speed}
            onValueChange={(nextValue) => setSpeed(nextValue as MotionSpeed)}
          >
            {Object.keys(motionSprings.standard.spatial).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </DocsSelect>
        </label>
        <label>
          Property
          <DocsSelect
            value={kind}
            disabled={recipe !== "retarget"}
            onValueChange={(nextValue) => setKind(nextValue as MotionKind)}
          >
            <option value="spatial">Spatial · position</option>
            <option value="effects">Effects · opacity</option>
          </DocsSelect>
        </label>
        <label>
          <DocsSwitch
            checked={reduceMotion}
            onCheckedChange={(nextChecked) => setReduceMotion(nextChecked)}
          />
          Preview reduced motion
        </label>
        <label>
          <DocsSwitch
            checked={rtl}
            onCheckedChange={(nextChecked) => setRtl(nextChecked)}
          />
          Right to left
        </label>
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          type="button"
          className="sizing-reset"
          onClick={reset}
        >
          Reset motion
        </Button>
      </div>
      <Theme
        appearance={appearance}
        accentColor="blue"
        className="motion-preview"
      >
        <MotionExample key={resetKey} {...state} />
      </Theme>
      <p>
        The preview follows your OS setting even when the reduced-motion preview
        is unchecked. Change targets rapidly to feel spring continuity.
        Switching to reduced motion snaps an active visual to its current target
        and keeps only short fades; controls remain usable. Reset restores the
        controls and clears example state.
      </p>
      <CodeBlock code={code} filename="motion-example.tsx" collapsible />
      <ComponentMotionExamples />
      <ExpressiveGroupLab />
      <h2>What the physics mean</h2>
      <p>
        Stiffness pulls toward the target; mass resists acceleration; damping
        removes energy. A damping ratio of 1 settles without bounce. A ratio
        below 1 permits overshoot. Motion expects a damping coefficient, so
        convert the ratio using <code>c = 2ζ√(km)</code>. Passing Material’s
        ratio directly as Motion’s damping would create a very different
        animation.
      </p>
      <div
        className="motion-physics-readout"
        aria-label="Selected spring parameters"
      >
        <div>
          <span>Stiffness · k</span>
          <strong>{spring.stiffness}</strong>
        </div>
        <div>
          <span>Damping ratio · ζ</span>
          <strong>{spring.dampingRatio}</strong>
        </div>
        <div>
          <span>Mass · m</span>
          <strong>{spring.mass}</strong>
        </div>
        <div>
          <span>Motion damping · c</span>
          <strong>
            {converted.type === "spring" ? converted.damping.toFixed(2) : "0"}
          </strong>
        </div>
      </div>
      <CodeBlock
        code={JSON.stringify(converted, null, 2)}
        language="json"
        filename="selected-spring.json"
      />
      <p>
        A physical spring has a settling time rather than a fixed duration. We
        keep velocity under Motion’s control and do not mix
        stiffness/damping/mass with duration/bounce. Effects never overshoot
        opacity or color. The standard and expressive schemes share stiffness,
        isolating their difference to spatial damping.
      </p>
      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Dixy spring tokens"
      >
        <table className="api-table motion-token-table">
          <thead>
            <tr>
              <th>Scheme / kind</th>
              <th>Speed</th>
              <th>Stiffness</th>
              <th>Ratio</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(motionSprings) as MotionScheme[]).flatMap((name) =>
              (["spatial", "effects"] as MotionKind[]).flatMap((family) =>
                (["fast", "default", "slow"] as MotionSpeed[]).map((pace) => (
                  <tr key={`${name}-${family}-${pace}`}>
                    <th scope="row">
                      {name} / {family}
                    </th>
                    <td>{pace}</td>
                    <td>{motionSprings[name][family][pace].stiffness}</td>
                    <td>{motionSprings[name][family][pace].dampingRatio}</td>
                  </tr>
                )),
              ),
            )}
          </tbody>
        </table>
      </div>
      <h2>Durations, easing and transition recipes</h2>
      <h3>Duration guidelines</h3>
      <p>
        Keep ordinary UI animations under 300ms. Start at the lower end for
        frequent or small changes. Occasional page transitions are the explicit
        300–400ms exception; never delay navigation or block input while waiting
        for them. These ranges are Dixy design guidance, not platform mandates.
      </p>
      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Duration guidelines"
      >
        <table className="api-table motion-token-table">
          <thead>
            <tr>
              <th>Element type</th>
              <th>Duration</th>
              <th>Dixy recipe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Micro-interactions</th>
              <td>100–150ms</td>
              <td>
                feedback ·{" "}
                {motionDurations[motionTransitions.feedback.duration]}ms
              </td>
            </tr>
            <tr>
              <th scope="row">Standard UI · tooltips, dropdowns</th>
              <td>150–250ms</td>
              <td>
                enter · {motionDurations[motionTransitions.enter.duration]}ms
              </td>
            </tr>
            <tr>
              <th scope="row">Modals, drawers</th>
              <td>200–300ms</td>
              <td>
                enter · {motionDurations[motionTransitions.enter.duration]}ms;
                navigation ·{" "}
                {motionDurations[motionTransitions.navigation.duration]}ms
              </td>
            </tr>
            <tr>
              <th scope="row">Page transitions · occasional</th>
              <td>300–400ms</td>
              <td>
                page · {motionDurations[motionTransitions.page.duration]}ms
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Shorter exits can sit below the entrance range: Dialog exits use 120ms.
        Physical springs do not promise a fixed duration; inspect how quickly
        the content becomes usable and how long any residual movement lasts. Use
        a timing recipe when an exact deadline matters. Reduced motion takes
        priority over every range: movement becomes immediate, and opacity or
        colour changes keep a fade of 200ms or less.
      </p>
      <h3>The frequency principle</h3>
      <p>
        Estimate how often a person will encounter the animation before choosing
        its expression.
      </p>
      <ul className="motion-frequency-rules">
        <li>
          <strong>100+ times a day:</strong> use no animation or drastically
          reduce it. Prefer immediate state changes; keep only brief feedback
          that helps the person act.
        </li>
        <li>
          <strong>Occasional use:</strong> use standard motion with the smallest
          timing or spatial change that explains the result.
        </li>
        <li>
          <strong>Rare or first-time use:</strong> a restrained expressive
          moment may add delight, with a clear purpose and a reduced-motion
          equivalent.
        </li>
      </ul>
      <p>
        The 100+ threshold is a design-review prompt, not a measured universal
        limit or a request to track people. Repetition is a reason to remove
        flourish. Never make completion depend on seeing an animation.
      </p>
      <p>
        CSS durations use milliseconds; the Motion helpers convert them to
        seconds. Both read the same definitions. Recipes contain timing only, so
        each component explicitly lists the properties it animates. Avoid{" "}
        <code>transition: all</code>.
      </p>
      <div className="motion-duration-scale">
        {Object.entries(motionDurations).map(([name, ms]) => (
          <div key={name}>
            <code>{name}</code>
            <strong>{ms}ms</strong>
            <span style={{ inlineSize: `${Math.max(2, ms / 4)}%` }} />
          </div>
        ))}
      </div>
      <Theme
        appearance={appearance}
        motion={reduceMotion ? "reduced" : "system"}
      >
        <TimingExamples key={resetKey} />
      </Theme>
      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Motion transition recipes"
      >
        <table className="api-table motion-token-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Duration</th>
              <th>Easing</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(motionTransitions).map(([role, timing]) => (
              <tr key={role}>
                <th scope="row">
                  <code>{role}</code>
                </th>
                <td>{motionDurations[timing.duration]}ms</td>
                <td>{timing.easing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CodeBlock
        language="css"
        filename="feedback.css"
        code={
          '@import "@dixy-ui/tokens/motion.css";\n\n.control {\n  transition: background-color var(--dixy-motion-transition-feedback);\n}\n.panel {\n  transition: opacity var(--dixy-motion-transition-enter),\n    transform var(--dixy-motion-transition-enter);\n}'
        }
      />
      <h2>Presence belongs to the primitive</h2>
      <Theme
        appearance={appearance}
        motion={reduceMotion ? "reduced" : "system"}
        className="motion-css-example"
      >
        <Inline gap="sm">
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant="outline" />}>
              Open motion dialog
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Viewport>
                <Dialog.Popup>
                  <Dialog.Title>Keep the context</Dialog.Title>
                  <Dialog.Description>
                    Base UI owns presence, Escape, focus trapping and
                    restoration. Shared CSS tokens provide a 200ms entrance and
                    a shorter 120ms exit.
                  </Dialog.Description>
                  <Dialog.Close render={<Button />}>
                    Back to motion
                  </Dialog.Close>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
          <LoadingPreview key={resetKey} />
        </Inline>
      </Theme>
      <p>
        Dialog keeps its existing Base UI lifecycle and starting/ending
        attributes. Motion powers the custom recipes above; it does not compete
        with the primitive’s mount/unmount handling. The spinner stays static
        when motion is reduced, while its accessible loading state remains. The
        loading preview starts only on request and stops automatically after
        four seconds.
      </p>
      <h2>One reduction policy for CSS and JavaScript</h2>
      <p>
        <code>Theme motion="system"</code> respects the OS preference.{" "}
        <code>motion="reduced"</code> requests additional reduction and is
        inherited through nested themes and portals. A child cannot turn motion
        back on. The hook subscribes to live preference changes and renders
        static on the server until the client preference is known.
      </p>
      <CodeBlock
        filename="motion-policy.tsx"
        code={
          'import { Theme, useMotionPreferences } from "@dixy-ui/react";\nimport { MotionProvider } from "@dixy-ui/react/motion";\nimport { springTransition } from "@dixy-ui/tokens";\n\n// Install motion separately. Place the provider inside its Theme.\n<Theme motion="system">\n  <MotionProvider>{/* Motion components */}</MotionProvider>\n</Theme>;\n\n// Inside a component:\nconst { reducedMotion } = useMotionPreferences();\nconst transition = springTransition("standard", "spatial", "default", reducedMotion);'
        }
      />
      <p>
        The optional provider sets MotionConfig’s reduction policy. Use the hook
        for opacity, color, sequencing delays, imperative animations and any
        loops too. Our recipes become immediate, sequence delays become zero,
        and no preview autoplays. There is no device or battery heuristic:
        reductions follow the person’s preference. Legacy{" "}
        <code>--dixy-duration-fast</code>, <code>--dixy-duration-normal</code>{" "}
        and <code>--dixy-ease</code> aliases remain available; prefer the
        explicit motion namespace for new work.
      </p>
      <h2>Reference decisions</h2>
      <div
        className="table-scroll"
        tabIndex={0}
        aria-label="Motion reference decisions"
      >
        <table className="api-table motion-reference-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Principle</th>
              <th>Dixy decision</th>
            </tr>
          </thead>
          <tbody>
            {references.map(([name, url, principle, choice]) => (
              <tr key={name}>
                <th scope="row">
                  <a href={url} target="_blank" rel="noreferrer">
                    {name} ↗
                  </a>
                </th>
                <td>{principle}</td>
                <td>{choice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Material’s Expressive fast spatial reference uses stiffness 800 and
        ratio 0.6; our expressive version uses the same stiffness with ratio 0.8
        for less bounce. Material’s default spatial reference is 380/0.8; Dixy
        uses 500/0.8 for a firmer response. Effects use ratio 1. These
        deliberate web adjustments avoid pretending that one native platform’s
        numbers define every web context.{" "}
        <a
          href="https://raw.githubusercontent.com/material-components/material-components-android/master/lib/java/com/google/android/material/motion/res/values/tokens.xml"
          target="_blank"
          rel="noreferrer"
        >
          Verified Material source values ↗
        </a>
      </p>
    </>
  );
}

function TimingExamples() {
  const [end, setEnd] = useState(false);
  const { reducedMotion } = useMotionPreferences();
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="motion-timing-examples">
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          type="button"
          className="sizing-reset"
          onClick={() => setEnd((value) => !value)}
        >
          {end ? "Return timing comparison" : "Play timing comparison"}
        </Button>
        {Object.entries(motionEasings).map(([name, curve]) => (
          <div className="motion-easing-row" key={name}>
            <div>
              <strong>{name}</strong>
              <code>{curve.join(", ")}</code>
            </div>
            <svg
              viewBox="0 0 100 100"
              aria-label={`${name} easing curve`}
              role="img"
            >
              <path d="M 0 100 L 100 0" className="motion-curve-guide" />
              <path
                d={`M 0 100 C ${curve[0] * 100} ${100 - curve[1] * 100}, ${curve[2] * 100} ${100 - curve[3] * 100}, 100 0`}
              />
            </svg>
            <div className="motion-easing-track">
              <m.span
                key={String(reducedMotion)}
                initial={false}
                animate={{ x: end ? 100 : 0 }}
                transition={{
                  type: "tween",
                  duration: reducedMotion ? 0 : motionDurations.slow / 1000,
                  ease: [...curve] as [number, number, number, number],
                }}
              />
            </div>
          </div>
        ))}
        <p role="status">
          {reducedMotion
            ? "Timing comparison is immediate."
            : "Each curve uses the same 400ms duration."}{" "}
          Target: {end ? "end" : "start"}.
        </p>
      </div>
    </LazyMotion>
  );
}

function LoadingPreview() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(timer);
  }, [loading]);
  return (
    <Button loading={loading} onClick={() => setLoading(true)}>
      {loading ? "Loading preview" : "Preview loading · 4s"}
    </Button>
  );
}
