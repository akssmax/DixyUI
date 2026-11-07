import { useId, type ReactNode } from "react";
import { Toggle, ToggleGroup } from "@dixy-ui/react";

/*
 * Building blocks for the playground inspector. Every tab is a flat list of
 * titled groups, so a person scans headings instead of opening accordions.
 */
export function InspectorGroup({
  title,
  aside,
  children,
}: {
  title: string;
  /** A hint or a small action shown on the heading row. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section className="theme-inspector-group" aria-labelledby={id}>
      <div className="theme-inspector-group-head">
        <h3 id={id}>{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** A visible label for a control that names itself with aria-label. */
export function InspectorField({
  label,
  value,
  children,
}: {
  label: string;
  /** Current value echoed beside the label, e.g. a slider reading. */
  value?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="theme-inspector-field">
      <span className="theme-inspector-label" aria-hidden="true">
        {label}
        {value !== undefined && <em>{value}</em>}
      </span>
      {children}
    </div>
  );
}

/**
 * Small exclusive choices as one segmented control (ToggleGroup `segmented`).
 * ToggleGroup gives a single tab stop with arrow-key movement; an empty change (re-clicking the pressed
 * item) is ignored so a value is always selected.
 */
export function Segmented<Value extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Value;
  options: readonly (readonly [Value, ReactNode])[];
  onChange: (value: Value) => void;
}) {
  return (
    <InspectorField label={label}>
      <ToggleGroup
        aria-label={label}
        segmented
        className="theme-segmented"
        value={[value]}
        onValueChange={(next) => next[0] && onChange(next[0] as Value)}
      >
        {options.map(([option, text]) => (
          <Toggle key={option} value={option} size="sm" color="neutral">
            {text}
          </Toggle>
        ))}
      </ToggleGroup>
    </InspectorField>
  );
}
