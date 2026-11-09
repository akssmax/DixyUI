import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { IconButton } from "../components/button";
import { CheckGlyph, CopyGlyph } from "../utilities/inline-icons";

export interface CodeBlockProps extends Omit<
  ComponentPropsWithRef<"figure">,
  "children" | "onCopy"
> {
  /** The source text. Copied verbatim. */
  code: string;
  /** Language name shown in the header, e.g. "tsx". */
  language?: string;
  /** Pre-highlighted markup to show instead of plain text, e.g. from Shiki.
   * The copy action still copies `code`. */
  children?: ReactNode;
  /** Accessible name of the copy button. @default Copy code */
  copyLabel?: string;
  /** Announced after a successful copy. @default Copied */
  copiedLabel?: string;
  /** Announced when the clipboard is unavailable. @default Copy failed */
  failedLabel?: string;
  /** Called with the code after the clipboard write succeeds. */
  onCopy?: (code: string) => void;
}

/** A fenced code block with a language label and a copy action. Long lines
 * scroll inside the block, which is keyboard focusable for that reason. */
export function CodeBlock({
  code,
  language,
  children,
  copyLabel = "Copy code",
  copiedLabel = "Copied",
  failedLabel = "Copy failed",
  onCopy,
  className,
  ...props
}: CodeBlockProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      onCopy?.(code);
    } catch {
      setStatus("failed");
    }
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <figure
      {...props}
      data-status={status}
      className={["dixy-code-block", className].filter(Boolean).join(" ")}
    >
      <figcaption className="dixy-code-block-header">
        <span className="dixy-code-block-language">{language ?? "text"}</span>
        <IconButton
          type="button"
          variant="ghost"
          color="neutral"
          size="sm"
          aria-label={copyLabel}
          className="dixy-code-block-copy"
          onClick={copy}
        >
          {status === "copied" ? <CheckGlyph /> : <CopyGlyph />}
        </IconButton>
      </figcaption>
      <pre
        className="dixy-code-block-pre"
        tabIndex={0}
        aria-label={language ? `${language} code` : "Code"}
      >
        {children ?? <code>{code}</code>}
      </pre>
      <span className="dixy-visually-hidden" role="status">
        {status === "copied"
          ? copiedLabel
          : status === "failed"
            ? failedLabel
            : ""}
      </span>
    </figure>
  );
}
