import { Collapsible } from "@base-ui/react/collapsible";
import {
  isValidElement,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { Badge } from "../components/content";
import type { VisualColor } from "../utilities/component-visuals";
import { ChevronDownGlyph, WrenchGlyph } from "../utilities/inline-icons";
import type { ToolState } from "./types";

const stateLabels: Record<ToolState, string> = {
  "input-streaming": "Pending",
  "input-available": "Running",
  "approval-requested": "Awaiting approval",
  "approval-responded": "Responded",
  "output-available": "Completed",
  "output-error": "Error",
  "output-denied": "Denied",
};
const stateColors: Record<ToolState, VisualColor> = {
  "input-streaming": "neutral",
  "input-available": "info",
  "approval-requested": "warning",
  "approval-responded": "info",
  "output-available": "success",
  "output-error": "danger",
  "output-denied": "neutral",
};

function Root({
  className,
  ...props
}: ComponentProps<typeof Collapsible.Root>) {
  return (
    <Collapsible.Root
      {...props}
      className={["dixy-tool", className].filter(Boolean).join(" ")}
    />
  );
}

export interface ToolHeaderProps extends Omit<
  ComponentProps<typeof Collapsible.Trigger>,
  "children" | "name"
> {
  /** The tool's name, e.g. "get_weather". */
  name: ReactNode;
  /** Lifecycle state, using the AI SDK's tool part states. */
  state: ToolState;
  /** Override the state badge's text, e.g. for localisation. */
  stateLabels?: Partial<Record<ToolState, string>>;
  /** Replace the leading icon. */
  icon?: ReactNode;
}

/** The trigger row: icon, tool name and a state badge. */
function Header({
  name,
  state,
  stateLabels: labels,
  icon,
  className,
  ...props
}: ToolHeaderProps) {
  return (
    <Collapsible.Trigger
      {...props}
      data-state={state}
      className={["dixy-tool-header", className].filter(Boolean).join(" ")}
    >
      <span className="dixy-tool-icon" aria-hidden="true">
        {icon ?? <WrenchGlyph />}
      </span>
      <span className="dixy-tool-name">{name}</span>
      <Badge size="sm" variant="soft" color={stateColors[state]}>
        {labels?.[state] ?? stateLabels[state]}
      </Badge>
      <span className="dixy-tool-chevron" aria-hidden="true">
        <ChevronDownGlyph />
      </span>
    </Collapsible.Trigger>
  );
}

function Content({
  className,
  ...props
}: ComponentProps<typeof Collapsible.Panel>) {
  return (
    <Collapsible.Panel
      {...props}
      className={["dixy-tool-content", className].filter(Boolean).join(" ")}
    />
  );
}

const format = (value: unknown) =>
  typeof value === "string" ? value : JSON.stringify(value, null, 2);

export interface ToolSectionProps extends Omit<
  ComponentPropsWithRef<"section">,
  "children" | "title"
> {
  /** Shown as formatted JSON unless it is already a string or element. */
  children?: unknown;
  /** Section heading. */
  title?: ReactNode;
}

function Section({
  children,
  title,
  className,
  kind,
  ...props
}: ToolSectionProps & { kind: "input" | "output" | "error" }) {
  const rich = isValidElement(children);
  return (
    <section
      {...props}
      data-kind={kind}
      className={["dixy-tool-section", className].filter(Boolean).join(" ")}
    >
      <h4 className="dixy-tool-section-title">{title}</h4>
      {rich ? (
        (children as ReactNode)
      ) : (
        <pre className="dixy-tool-code" tabIndex={0}>
          <code>{format(children)}</code>
        </pre>
      )}
    </section>
  );
}

const Input = ({ title = "Parameters", ...props }: ToolSectionProps) => (
  <Section {...props} title={title} kind="input" />
);
const Output = ({ title = "Result", ...props }: ToolSectionProps) => (
  <Section {...props} title={title} kind="output" />
);
const ErrorText = ({ title = "Error", ...props }: ToolSectionProps) => (
  // Not an alert: the panel mounts when the reader opens it, and the header's
  // "Error" badge already reports the state.
  <Section {...props} title={title} kind="error" />
);

/** A tool call the model made: what it called, with which input, and what
 * came back. Collapsed by default so tool traffic stays out of the way. */
export const Tool = /* @__PURE__ */ (() => ({
  Root,
  Header,
  Content,
  Input,
  Output,
  Error: ErrorText,
}))();
