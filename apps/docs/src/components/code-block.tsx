import { Button } from "@dixy-ui/react";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, ChevronDown } from "lucide-react";

export function CodeBlock({
  code,
  language = "tsx",
  filename = "example.tsx",
  collapsible = false,
  collapsedLines = 15,
}: {
  code: string;
  language?: string;
  filename?: string;
  collapsible?: boolean;
  collapsedLines?: number;
}) {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const displayed =
    collapsible && !expanded
      ? code.split("\n").slice(0, collapsedLines).join("\n")
      : code;
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setHtml("");
    import("../lib/highlight")
      .then(({ highlight }) => highlight(displayed, language))
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [displayed, language, visible]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <div ref={container} className="code-block">
      <div className="code-toolbar">
        <span>{filename}</span>
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          onClick={copy}
          aria-label="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      {html ? (
        <div
          className="highlighted-code"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre tabIndex={0} aria-label={`${filename} code`}>
          <code>{displayed}</code>
        </pre>
      )}
      {collapsible && code.split("\n").length > collapsedLines && (
        <Button
          variant="ghost"
          color="neutral"
          size="sm"
          className="code-expand"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show complete example"}
          <ChevronDown size={13} />
        </Button>
      )}
      <span className="sr-only" role="status">
        {copied
          ? "Code copied"
          : copyError
            ? "Copy unavailable. Select the code and copy it manually."
            : ""}
      </span>
    </div>
  );
}
