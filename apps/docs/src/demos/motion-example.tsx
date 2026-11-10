import { useState } from "react";
import {
  Button,
  Inline,
  Stack,
  Text,
  Theme as MotionScope,
  useMotionPreferences,
} from "@dixy-ui/react";
import { MotionProvider } from "@dixy-ui/react/motion";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import {
  springTransition,
  tweenTransition,
  type MotionKind,
  type MotionScheme,
  type MotionSpeed,
} from "@dixy-ui/tokens";

type Recipe = "retarget" | "presence" | "sequence";
interface Props {
  recipe?: Recipe;
  scheme?: MotionScheme;
  speed?: MotionSpeed;
  kind?: MotionKind;
  reduceMotion?: boolean;
  rtl?: boolean;
}

export default function MotionExample({
  recipe = "retarget",
  scheme = "standard",
  speed = "default",
  kind = "spatial",
  reduceMotion = false,
  rtl = false,
}: Props) {
  return (
    <MotionScope
      motion={reduceMotion ? "reduced" : "system"}
      dir={rtl ? "rtl" : "ltr"}
    >
      <MotionProvider>
        <LazyMotion features={domAnimation} strict>
          <RecipePreview
            recipe={recipe}
            scheme={scheme}
            speed={speed}
            kind={kind}
            rtl={rtl}
          />
        </LazyMotion>
      </MotionProvider>
    </MotionScope>
  );
}

function RecipePreview({
  recipe,
  scheme,
  speed,
  kind,
  rtl,
}: Required<Pick<Props, "recipe" | "scheme" | "speed" | "kind" | "rtl">>) {
  const [active, setActive] = useState(false);
  const { reducedMotion } = useMotionPreferences();
  const spatial = springTransition(scheme, "spatial", speed, reducedMotion);
  const effects = springTransition(scheme, "effects", speed, reducedMotion);
  const offset = rtl ? -120 : 120;
  const travel = reducedMotion ? 0 : rtl ? -12 : 12;
  const panelStyle = {
    padding: "var(--dixy-spacing-inset-md)",
    border: "var(--dixy-border-default)",
    borderRadius: "var(--dixy-radius-card)",
    background: "var(--dixy-color-background-surface-raised)",
  };
  return (
    <Stack gap="md" className="motion-example" data-reduced={reducedMotion}>
      <Text variant="label.md">
        {recipe === "retarget"
          ? "Change your mind mid-flight"
          : recipe === "presence"
            ? "A clear entrance and exit"
            : "A short, finite sequence"}
      </Text>
      <div
        className="motion-stage"
        style={{
          minHeight: 152,
          display: "grid",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {recipe === "retarget" ? (
          <div
            className="motion-track"
            style={{
              padding: 24,
              borderRadius: "var(--dixy-radius-12)",
              background: "var(--dixy-color-background-surface-sunken)",
            }}
          >
            <m.div
              key={String(reducedMotion)}
              className="motion-marker"
              aria-hidden="true"
              initial={false}
              animate={
                kind === "spatial"
                  ? { x: active ? offset : 0, opacity: 1 }
                  : { x: 0, opacity: active ? 1 : 0.35 }
              }
              transition={kind === "spatial" ? spatial : effects}
              style={{
                width: 40,
                height: 40,
                marginInlineStart: 0,
                borderRadius: "var(--dixy-radius-12)",
                background: "var(--dixy-color-background-action-primary)",
              }}
            />
          </div>
        ) : recipe === "presence" ? (
          <AnimatePresence key={String(reducedMotion)} initial={false}>
            {active && (
              <m.div
                key={`panel-${reducedMotion}`}
                className="motion-presence-panel"
                initial={{ opacity: 0, x: travel }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: travel,
                  transition: tweenTransition("exit", reducedMotion, "effects"),
                }}
                transition={{ x: spatial, opacity: effects }}
                style={panelStyle}
              >
                <Text variant="label.md">Ready when you are</Text>
                <Text tone="muted">
                  This content stays readable without movement.
                </Text>
              </m.div>
            )}
          </AnimatePresence>
        ) : (
          <AnimatePresence key={String(reducedMotion)} initial={false}>
            {active && (
              <m.ul
                key={`list-${reducedMotion}`}
                className="motion-sequence"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: 8,
                }}
              >
                {[
                  "Choose a direction",
                  "Make the change",
                  "Keep the context",
                ].map((label, index) => (
                  <m.li
                    key={label}
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      transition: tweenTransition(
                        "exit",
                        reducedMotion,
                        "effects",
                      ),
                    }}
                    transition={{
                      y: {
                        ...spatial,
                        delay: reducedMotion ? 0 : index * 0.04,
                      },
                      opacity: {
                        ...effects,
                        delay: reducedMotion ? 0 : index * 0.04,
                      },
                    }}
                    style={panelStyle}
                  >
                    <Text>{label}</Text>
                  </m.li>
                ))}
              </m.ul>
            )}
          </AnimatePresence>
        )}
      </div>
      <Inline gap="sm">
        <Button variant="outline" onClick={() => setActive((value) => !value)}>
          {recipe === "retarget"
            ? active
              ? "Return to start"
              : "Move to end"
            : active
              ? "Hide content"
              : "Show content"}
        </Button>
      </Inline>
      <Text role="status" size="sm" tone="muted">
        {reducedMotion
          ? "Reduced motion: short fades, no movement."
          : "Motion follows your system preference."}{" "}
        {recipe === "retarget"
          ? `Target: ${active ? "end" : "start"}.`
          : `Content: ${active ? "shown" : "hidden"}.`}
      </Text>
    </Stack>
  );
}
