import { useEffect, useRef, useState } from "react";
import { nativePart, type NativePartProps } from "../utilities/native-part";
import { CheckGlyph, CopyGlyph } from "../utilities/inline-icons";
import { IconButton } from "./button";

export interface SnippetProps extends Omit<
  NativePartProps<"div", "size" | "variant" | "color" | "radius" | "material">,
  "children" | "onCopy" | "variant"
> {
  /** The command or code to show. Line breaks are preserved. */
  children: string;
  /** Text to copy when it differs from what is shown. @default children */
  copyValue?: string;
  /** A leading prompt such as "$". Shown on every line, never copied or announced. */
  symbol?: string;
  /** Surface emphasis. @default soft */
  variant?: "soft" | "outline" | "solid";
  /** Accessible name of the copy button. @default Copy to clipboard */
  copyLabel?: string;
  /** Status message announced after a successful copy. @default Copied */
  copiedLabel?: string;
  /** Status message announced when the clipboard is unavailable. @default Copy failed */
  failedLabel?: string;
  /** How long the copied state lasts, in milliseconds. @default 2000 */
  timeout?: number;
  /** Hide the copy action, e.g. for read-only output. @default false */
  hideCopyButton?: boolean;
  /** Called with the copied text after the clipboard write succeeds. */
  onCopy?: (value: string) => void;
}

const Frame = /* @__PURE__ */ nativePart("div", "dixy-snippet", [
  "size",
  "variant",
  "color",
  "radius",
  "material",
] as const);

type CopyStatus = "idle" | "copied" | "failed";

/** Code or a command with a copy-to-clipboard action and a polite status message. */
export function Snippet({
  children,
  copyValue,
  symbol,
  variant = "soft",
  color = "neutral",
  size,
  copyLabel = "Copy to clipboard",
  copiedLabel = "Copied",
  failedLabel = "Copy failed",
  timeout = 2000,
  hideCopyButton = false,
  onCopy,
  ...props
}: SnippetProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    const value = copyValue ?? children;
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      onCopy?.(value);
    } catch {
      setStatus("failed");
    }
    timer.current = setTimeout(() => setStatus("idle"), timeout);
  }

  const lines = children.split("\n");
  return (
    <Frame
      {...props}
      size={size}
      variant={variant}
      color={color}
      data-status={status}
    >
      <pre className="dixy-snippet-code">
        <code>
          {lines.map((line, index) => (
            <span className="dixy-snippet-line" key={index}>
              {symbol ? (
                <span className="dixy-snippet-symbol" aria-hidden="true">
                  {symbol}
                </span>
              ) : null}
              {line}
              {index < lines.length - 1 ? "\n" : null}
            </span>
          ))}
        </code>
      </pre>
      {hideCopyButton ? null : (
        <IconButton
          type="button"
          className="dixy-snippet-copy"
          variant="ghost"
          color="neutral"
          size="sm"
          aria-label={copyLabel}
          onClick={copy}
        >
          {status === "copied" ? <CheckGlyph /> : <CopyGlyph />}
        </IconButton>
      )}
      <span className="dixy-visually-hidden" role="status">
        {status === "copied"
          ? copiedLabel
          : status === "failed"
            ? failedLabel
            : ""}
      </span>
    </Frame>
  );
}
