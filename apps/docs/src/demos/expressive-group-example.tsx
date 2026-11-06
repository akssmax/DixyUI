import { useState } from "react";
import { Text, Theme as GroupScope, Toggle, ToggleGroup } from "@dixy-ui/react";

interface ExpressiveGroupExampleProps {
  enabled?: boolean;
  reduceMotion?: boolean;
  rtl?: boolean;
}
/** Docs-only bounded layout experiment. Selection is persistent; press expansion is momentary. */
export default function ExpressiveGroupExample({
  enabled = false,
  reduceMotion = false,
  rtl = false,
}: ExpressiveGroupExampleProps) {
  const [value, setValue] = useState<string[]>(["Explore"]);
  return (
    <GroupScope
      motion={reduceMotion ? "reduced" : "system"}
      dir={rtl ? "rtl" : "ltr"}
    >
      <style>{groupStyles}</style>
      <div className="expressive-group-container">
        <ToggleGroup
          aria-label="Creative mode"
          value={value}
          onValueChange={setValue}
          className="expressive-group-experiment"
          data-expansion={enabled}
        >
          {["Explore", "Build", "Share"].map((label) => (
            <Toggle key={label} value={label}>
              {label}
            </Toggle>
          ))}
        </ToggleGroup>
      </div>
      <Text role="status" variant="body.sm">
        Selected: {value[0] ?? "none"}. Expansion applies only while pressing,
        when at least 352px is available.
      </Text>
    </GroupScope>
  );
}

const groupStyles = `.expressive-group-container { container-type: inline-size; }
.expressive-group-experiment { display: flex; inline-size: 100%; gap: 4px; }
.expressive-group-experiment > .dixy-toggle { flex: 1 1 0; min-inline-size: 4rem; transition: background-color var(--dixy-motion-transition-feedback); }
@container (min-width: 22rem) {
  .expressive-group-experiment[data-expansion="true"] > .dixy-toggle { transition: flex-grow var(--dixy-motion-transition-feedback), background-color var(--dixy-motion-transition-feedback); }
  .expressive-group-experiment[data-expansion="true"] > .dixy-toggle:active:not([data-disabled]) { flex-grow: 1.15; }
  [data-motion="reduced"] .expressive-group-experiment[data-expansion="true"] > .dixy-toggle:active { flex-grow: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .expressive-group-experiment[data-expansion="true"] > .dixy-toggle:active { flex-grow: 1; }
}
`;
